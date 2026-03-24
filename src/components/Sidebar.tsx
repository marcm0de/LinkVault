'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bookmark,
  FolderOpen,
  Tags,
  PlusCircle,
  Upload,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBookmarkStore } from '@/lib/store';

const navItems = [
  { href: '/', label: 'All Bookmarks', icon: Bookmark },
  { href: '/collections', label: 'Collections', icon: FolderOpen },
  { href: '/tags', label: 'Tags', icon: Tags },
  { href: '/add', label: 'Add Bookmark', icon: PlusCircle },
  { href: '/import', label: 'Import', icon: Upload },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const collections = useBookmarkStore((s) => s.collections);

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
          !open && '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">LinkVault</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex gap-4 text-xs text-gray-500">
            <span>{bookmarks.length} bookmarks</span>
            <span>{collections.length} collections</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Collections quick list */}
          {collections.length > 0 && (
            <div className="mt-6">
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Collections
              </h3>
              <div className="space-y-0.5">
                {collections.map((col) => {
                  const count = bookmarks.filter(
                    (b) => b.collectionId === col.id
                  ).length;
                  return (
                    <Link
                      key={col.id}
                      href={`/collections?id=${col.id}`}
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{col.icon}</span>
                        {col.name}
                      </span>
                      <span className="text-xs text-gray-400">{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
