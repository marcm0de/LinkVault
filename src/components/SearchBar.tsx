'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store';
import { extractDomain } from '@/lib/utils';

export default function SearchBar() {
  const searchQuery = useBookmarkStore((s) => s.searchQuery);
  const setSearchQuery = useBookmarkStore((s) => s.setSearchQuery);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const [focused, setFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external changes back
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounced store update for snappier typing
  const handleChange = useCallback((value: string) => {
    setLocalQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 80);
  }, [setSearchQuery]);

  const handleClear = useCallback(() => {
    setLocalQuery('');
    setSearchQuery('');
    inputRef.current?.focus();
  }, [setSearchQuery]);

  // Show instant suggestions while typing
  const suggestions = useMemo(() => {
    if (!localQuery || localQuery.length < 2) return [];
    const q = localQuery.toLowerCase();
    return bookmarks
      .filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [localQuery, bookmarks]);

  const showSuggestions = focused && suggestions.length > 0;

  return (
    <div className="relative">
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors duration-150"
        style={{ color: focused ? '#3b82f6' : '#9ca3af' }}
      />
      <input
        ref={inputRef}
        type="text"
        data-search-input
        placeholder="Search bookmarks by title, URL, tag… (Ctrl+K)"
        value={localQuery}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all duration-150 shadow-sm focus:shadow-md focus:shadow-blue-500/5"
      />
      <AnimatePresence>
        {localQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Instant suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {suggestions.map((b, i) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors duration-100"
              >
                <img
                  src={b.favicon || `https://www.google.com/s2/favicons?domain=${extractDomain(b.url)}&sz=32`}
                  alt=""
                  className="w-4 h-4 rounded flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.title}</p>
                  <p className="text-xs text-gray-400 truncate">{extractDomain(b.url)}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
