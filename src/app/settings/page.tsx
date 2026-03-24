'use client';

import { useState } from 'react';
import { Download, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store';
import { exportBookmarksToHTML } from '@/lib/utils';

export default function SettingsPage() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const clearAllData = useBookmarkStore((s) => s.clearAllData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const html = exportBookmarksToHTML(bookmarks);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkvault-export-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkvault-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearAllData();
    setShowConfirm(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your LinkVault data</p>
      </div>

      <div className="space-y-4">
        {/* Export */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Export Bookmarks</h3>
          <p className="text-xs text-gray-500 mb-4">
            Download your bookmarks as HTML (browser-compatible) or JSON
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {exported ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Exported!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export HTML
                </>
              )}
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Data info */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Storage</h3>
          <p className="text-xs text-gray-500 mb-3">
            All data is stored locally in your browser's localStorage
          </p>
          <div className="text-sm text-gray-700">
            <p>{bookmarks.length} bookmarks stored</p>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white border border-red-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-red-600 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            This will permanently delete all bookmarks and collections
          </p>
          {showConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600 font-medium">Are you sure?</span>
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Yes, delete everything
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
          )}
        </div>

        {/* About */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">About LinkVault</h3>
          <p className="text-xs text-gray-500">
            A self-hosted bookmark manager with tagging, search, and link previews.
            <br />
            Open source · MIT License · Built with Next.js, Tailwind CSS, and Zustand.
          </p>
        </div>
      </div>
    </div>
  );
}
