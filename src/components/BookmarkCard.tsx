'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  MoreHorizontal,
  Trash2,
  Edit3,
  Copy,
  FolderPlus,
} from 'lucide-react';
import { Bookmark } from '@/lib/types';
import { extractDomain, formatDate, cn } from '@/lib/utils';
import { useBookmarkStore } from '@/lib/store';

interface BookmarkCardProps {
  bookmark: Bookmark;
  viewMode: 'grid' | 'list';
  onEdit?: (bookmark: Bookmark) => void;
}

export default function BookmarkCard({ bookmark, viewMode, onEdit }: BookmarkCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const deleteBookmark = useBookmarkStore((s) => s.deleteBookmark);
  const toggleTag = useBookmarkStore((s) => s.toggleTag);

  const copyUrl = () => {
    navigator.clipboard.writeText(bookmark.url);
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteBookmark(bookmark.id);
    setShowMenu(false);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-4 px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
      whileHover={{ x: 2 }}
      >
        <img
          src={bookmark.favicon || `https://www.google.com/s2/favicons?domain=${extractDomain(bookmark.url)}&sz=32`}
          alt=""
          className="w-5 h-5 rounded flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232563eb"><rect width="24" height="24" rx="4"/><text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif">L</text></svg>';
          }}
        />
        <div className="flex-1 min-w-0">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
          >
            {bookmark.title}
          </a>
          <span className="text-xs text-gray-400">{extractDomain(bookmark.url)}</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          {bookmark.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
          {formatDate(bookmark.createdAt)}
        </span>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          {showMenu && (
            <DropdownMenu
              onClose={() => setShowMenu(false)}
              onCopy={copyUrl}
              onDelete={handleDelete}
              onEdit={() => { onEdit?.(bookmark); setShowMenu(false); }}
            />
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 transition-all duration-200 group"
      whileHover={{ y: -3, boxShadow: '0 8px 25px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* Preview thumbnail */}
      {bookmark.previewImage && (
        <div className="w-full h-32 bg-gray-100 overflow-hidden">
          <img
            src={bookmark.previewImage}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Card header with favicon and domain */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={bookmark.favicon || `https://www.google.com/s2/favicons?domain=${extractDomain(bookmark.url)}&sz=32`}
            alt=""
            className="w-6 h-6 rounded flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232563eb"><rect width="24" height="24" rx="4"/><text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif">L</text></svg>';
            }}
          />
          <span className="text-xs text-gray-400 truncate">{extractDomain(bookmark.url)}</span>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          {showMenu && (
            <DropdownMenu
              onClose={() => setShowMenu(false)}
              onCopy={copyUrl}
              onDelete={handleDelete}
              onEdit={() => { onEdit?.(bookmark); setShowMenu(false); }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 flex items-center gap-1.5"
        >
          {bookmark.title}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 flex-shrink-0" />
        </a>
        {bookmark.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{bookmark.description}</p>
        )}
      </div>

      {/* Tags & date */}
      <div className="px-4 pb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
          {bookmark.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="px-2 py-0.5 text-[11px] bg-gray-50 text-gray-500 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 hover:shadow-sm"
            >
              {tag}
            </button>
          ))}
          {bookmark.tags.length > 3 && (
            <span className="text-[11px] text-gray-400">+{bookmark.tags.length - 3}</span>
          )}
        </div>
        <span className="text-[11px] text-gray-400 flex-shrink-0">
          {formatDate(bookmark.createdAt)}
        </span>
      </div>
    </motion.div>
  );
}

function DropdownMenu({
  onClose,
  onCopy,
  onDelete,
  onEdit,
}: {
  onClose: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-8 z-20 w-40 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 animate-[fadeIn_0.15s_ease-out]">
        <button
          onClick={onEdit}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={onCopy}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy URL
        </button>
        <hr className="my-1 border-gray-100" />
        <button
          onClick={onDelete}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </>
  );
}
