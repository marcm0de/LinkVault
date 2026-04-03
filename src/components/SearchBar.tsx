'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store';
import { extractDomain } from '@/lib/utils';

export default function SearchBar() {
  const searchQuery = useBookmarkStore((s) => s.searchQuery);
  const setSearchQuery = useBookmarkStore((s) => s.setSearchQuery);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show instant suggestions while typing
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return bookmarks
      .filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchQuery, bookmarks]);

  const showSuggestions = focused && suggestions.length > 0;

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
      <input
        ref={inputRef}
        type="text"
        data-search-input
        placeholder="Search bookmarks by title, URL, tag… (Ctrl+K)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      )}

      {/* Instant suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          {suggestions.map((b) => (
            <a
              key={b.id}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
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
        </div>
      )}
    </div>
  );
}
