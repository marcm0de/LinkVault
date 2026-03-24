'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBookmarkStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function TagsPage() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const setSelectedTags = useBookmarkStore((s) => s.setSelectedTags);
  const router = useRouter();

  const tags = useMemo(() => {
    const map = new Map<string, number>();
    bookmarks.forEach((b) => {
      b.tags.forEach((t) => {
        map.set(t, (map.get(t) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1]);
  }, [bookmarks]);

  const maxCount = tags.length > 0 ? tags[0][1] : 1;

  const handleTagClick = (tag: string) => {
    setSelectedTags([tag]);
    router.push('/');
  };

  const getSizeClass = (count: number): string => {
    const ratio = count / maxCount;
    if (ratio > 0.75) return 'text-2xl font-bold';
    if (ratio > 0.5) return 'text-xl font-semibold';
    if (ratio > 0.25) return 'text-base font-medium';
    return 'text-sm';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        <p className="text-sm text-gray-500 mt-1">{tags.length} unique tags</p>
      </div>

      {/* Tag cloud */}
      {tags.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {tags.map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={cn(
                  'px-3 py-1.5 rounded-full transition-all hover:bg-blue-50 hover:text-blue-600 text-gray-700',
                  getSizeClass(count)
                )}
              >
                {tag}
                <span className="ml-1.5 text-xs font-normal text-gray-400">{count}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🏷️</div>
          <p className="text-gray-500 text-sm">No tags yet</p>
        </div>
      )}

      {/* Tag list */}
      {tags.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">All Tags</h2>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            {tags.map(([tag, count], i) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors',
                  i < tags.length - 1 && 'border-b border-gray-50'
                )}
              >
                <span className="text-gray-900 font-medium">{tag}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
