'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, ArrowUpDown } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store';
import { Bookmark } from '@/lib/types';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import BookmarkCard from '@/components/BookmarkCard';
import EditBookmarkModal from '@/components/EditBookmarkModal';

export default function HomePage() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const viewMode = useBookmarkStore((s) => s.viewMode);
  const setViewMode = useBookmarkStore((s) => s.setViewMode);
  const sortBy = useBookmarkStore((s) => s.sortBy);
  const setSortBy = useBookmarkStore((s) => s.setSortBy);
  const searchQuery = useBookmarkStore((s) => s.searchQuery);
  const selectedTags = useBookmarkStore((s) => s.selectedTags);
  const selectedCollection = useBookmarkStore((s) => s.selectedCollection);

  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const filtered = useMemo(() => {
    let results = [...bookmarks];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.notes.toLowerCase().includes(q)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      results = results.filter((b) =>
        selectedTags.every((t) => b.tags.includes(t))
      );
    }

    // Collection filter
    if (selectedCollection) {
      results = results.filter((b) => b.collectionId === selectedCollection);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'url':
        results.sort((a, b) => a.url.localeCompare(b.url));
        break;
    }

    return results;
  }, [bookmarks, searchQuery, selectedTags, selectedCollection, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Bookmarks</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filtered.length} bookmark{filtered.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A-Z</option>
            <option value="url">Domain</option>
          </select>
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="mb-6">
        <TagFilter />
      </div>

      {/* Bookmarks */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 text-sm">No bookmarks found</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((b) => (
              <BookmarkCard
                key={b.id}
                bookmark={b}
                viewMode="grid"
                onEdit={setEditingBookmark}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((b) => (
              <BookmarkCard
                key={b.id}
                bookmark={b}
                viewMode="list"
                onEdit={setEditingBookmark}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <EditBookmarkModal
        bookmark={editingBookmark}
        onClose={() => setEditingBookmark(null)}
      />
    </div>
  );
}
