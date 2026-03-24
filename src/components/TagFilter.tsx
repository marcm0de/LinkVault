'use client';

import { useBookmarkStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function TagFilter() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const selectedTags = useBookmarkStore((s) => s.selectedTags);
  const toggleTag = useBookmarkStore((s) => s.toggleTag);
  const setSelectedTags = useBookmarkStore((s) => s.setSelectedTags);

  // Compute unique tags with counts
  const tagMap = new Map<string, number>();
  bookmarks.forEach((b) => {
    b.tags.forEach((t) => {
      tagMap.set(t, (tagMap.get(t) || 0) + 1);
    });
  });
  const tags = Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  if (tags.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {selectedTags.length > 0 && (
        <button
          onClick={() => setSelectedTags([])}
          className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
        >
          Clear
        </button>
      )}
      {tags.map(([tag, count]) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-full transition-colors',
              isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {tag}
            <span className={cn('ml-1', isSelected ? 'text-blue-200' : 'text-gray-400')}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
