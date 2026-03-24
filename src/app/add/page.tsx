'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store';
import { generateId, getFaviconUrl } from '@/lib/utils';

export default function AddBookmarkPage() {
  const router = useRouter();
  const addBookmark = useBookmarkStore((s) => s.addBookmark);
  const collections = useBookmarkStore((s) => s.collections);

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [fetching, setFetching] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchMetadata = async () => {
    if (!url) return;
    setFetching(true);
    try {
      // Try fetching metadata via our API route
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title && !title) setTitle(data.title);
        if (data.description && !description) setDescription(data.description);
      }
    } catch {
      // Fallback: just use the URL as title
      if (!title) {
        try {
          const domain = new URL(url).hostname;
          setTitle(domain);
        } catch {
          // ignore
        }
      }
    }
    setFetching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    const finalUrl = url.startsWith('http') ? url : `https://${url}`;

    addBookmark({
      id: generateId(),
      url: finalUrl,
      title: title || finalUrl,
      description,
      favicon: getFaviconUrl(finalUrl),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      collectionId: collectionId || null,
      notes,
      createdAt: new Date().toISOString(),
    });

    setSaved(true);
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Bookmark</h1>
        <p className="text-sm text-gray-500 mt-1">Save a new link to your vault</p>
      </div>

      {saved ? (
        <div className="text-center py-16">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-900">Bookmark saved!</p>
          <p className="text-sm text-gray-500 mt-1">Redirecting...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="space-y-5">
            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={fetchMetadata}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  required
                />
              </div>
              {fetching && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-blue-600">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Fetching page info...
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Page title (auto-filled from URL)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Brief description (auto-filled from URL)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                placeholder="react, tools, frontend (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>

            {/* Collection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              >
                <option value="">No collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                placeholder="Personal notes about this bookmark..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Save Bookmark
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
