'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bookmark, Collection, ViewMode, SortBy } from './types';
import { seedBookmarks, seedCollections } from './seed-data';

interface BookmarkStore {
  bookmarks: Bookmark[];
  collections: Collection[];
  viewMode: ViewMode;
  sortBy: SortBy;
  searchQuery: string;
  selectedTags: string[];
  selectedCollection: string | null;
  theme: 'light' | 'dark';

  // Bookmark actions
  addBookmark: (bookmark: Bookmark) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  importBookmarks: (bookmarks: Partial<Bookmark>[]) => void;

  // Collection actions
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  // UI actions
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortBy) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setSelectedCollection: (id: string | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  clearAllData: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarks: seedBookmarks,
      collections: seedCollections,
      viewMode: 'grid',
      sortBy: 'newest',
      searchQuery: '',
      selectedTags: [],
      selectedCollection: null,
      theme: 'light',

      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [bookmark, ...state.bookmarks],
        })),

      updateBookmark: (id, updates) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      deleteBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      importBookmarks: (newBookmarks) =>
        set((state) => ({
          bookmarks: [
            ...newBookmarks.map((b) => ({
              id: b.id || `bm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              url: b.url || '',
              title: b.title || '',
              description: b.description || '',
              favicon: b.favicon || '',
              tags: b.tags || [],
              collectionId: b.collectionId || null,
              notes: b.notes || '',
              createdAt: b.createdAt || new Date().toISOString(),
            })),
            ...state.bookmarks,
          ],
        })),

      addCollection: (collection) =>
        set((state) => ({
          collections: [...state.collections, collection],
        })),

      updateCollection: (id, updates) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
          bookmarks: state.bookmarks.map((b) =>
            b.collectionId === id ? { ...b, collectionId: null } : b
          ),
        })),

      setViewMode: (mode) => set({ viewMode: mode }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),
      setSelectedCollection: (id) => set({ selectedCollection: id }),
      setTheme: (theme) => set({ theme }),
      clearAllData: () =>
        set({
          bookmarks: [],
          collections: [],
          searchQuery: '',
          selectedTags: [],
          selectedCollection: null,
        }),
    }),
    {
      name: 'linkvault-storage',
    }
  )
);
