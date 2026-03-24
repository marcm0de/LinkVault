'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store';
import { generateCollectionId, cn } from '@/lib/utils';
import BookmarkCard from '@/components/BookmarkCard';

const ICONS = ['📁', '💻', '🎨', '⚡', '📚', '📰', '🎵', '🎮', '💼', '🏠', '🔬', '🌍', '💡', '🔧', '📌'];
const COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}

function CollectionsContent() {
  const searchParams = useSearchParams();
  const activeId = searchParams.get('id');
  const collections = useBookmarkStore((s) => s.collections);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const addCollection = useBookmarkStore((s) => s.addCollection);
  const deleteCollection = useBookmarkStore((s) => s.deleteCollection);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📁');
  const [newColor, setNewColor] = useState('#2563eb');

  const activeCollection = activeId ? collections.find((c) => c.id === activeId) : null;
  const collectionBookmarks = activeId
    ? bookmarks.filter((b) => b.collectionId === activeId)
    : [];

  const handleCreate = () => {
    if (!newName.trim()) return;
    addCollection({
      id: generateCollectionId(),
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
    });
    setNewName('');
    setShowCreate(false);
  };

  if (activeCollection) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collections
        </button>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{activeCollection.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{activeCollection.name}</h1>
            <p className="text-sm text-gray-500">{collectionBookmarks.length} bookmarks</p>
          </div>
        </div>
        {collectionBookmarks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No bookmarks in this collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {collectionBookmarks.map((b) => (
                <BookmarkCard key={b.id} bookmark={b} viewMode="grid" />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your bookmarks into groups</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Collection
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Create Collection</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Collection name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Icon</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {ICONS.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewIcon(icon)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all',
                          newIcon === icon ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-100'
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Color</label>
                  <div className="flex gap-1.5">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewColor(color)}
                        className={cn(
                          'w-7 h-7 rounded-full transition-all',
                          newColor === color && 'ring-2 ring-offset-2 ring-gray-400'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {collections.map((col) => {
          const count = bookmarks.filter((b) => b.collectionId === col.id).length;
          return (
            <a
              key={col.id}
              href={`/collections?id=${col.id}`}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: col.color + '15' }}
                >
                  {col.icon}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm(`Delete "${col.name}"?`)) deleteCollection(col.id);
                  }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 text-gray-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{col.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{count} bookmark{count !== 1 ? 's' : ''}</p>
            </a>
          );
        })}
      </div>

      {collections.length === 0 && !showCreate && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-500 text-sm">No collections yet</p>
          <p className="text-gray-400 text-xs mt-1">Create one to organize your bookmarks</p>
        </div>
      )}
    </div>
  );
}
