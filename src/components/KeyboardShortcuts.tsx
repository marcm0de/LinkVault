'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookmarkStore } from '@/lib/store';

export default function KeyboardShortcuts() {
  const router = useRouter();
  const setSearchQuery = useBookmarkStore((s) => s.setSearchQuery);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire if typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      // Ctrl+K / Cmd+K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/');
        // Focus the search input after navigation
        setTimeout(() => {
          const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }, 100);
        return;
      }

      // Ctrl+N / Cmd+N: Add new bookmark
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        router.push('/add');
        return;
      }

      // Escape: Clear search and blur
      if (e.key === 'Escape' && isInput) {
        (e.target as HTMLElement).blur();
        setSearchQuery('');
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router, setSearchQuery]);

  return null;
}
