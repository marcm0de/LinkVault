'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store';
import { parseBookmarksHTML } from '@/lib/utils';

export default function ImportPage() {
  const router = useRouter();
  const importBookmarks = useBookmarkStore((s) => s.importBookmarks);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [count, setCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const processFile = (file: File) => {
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      setStatus('error');
      setErrorMsg('Please upload an HTML bookmarks file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const html = e.target?.result as string;
      const parsed = parseBookmarksHTML(html);
      if (parsed.length === 0) {
        setStatus('error');
        setErrorMsg('No bookmarks found in this file');
        return;
      }
      importBookmarks(parsed);
      setCount(parsed.length);
      setStatus('success');
    };
    reader.onerror = () => {
      setStatus('error');
      setErrorMsg('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import Bookmarks</h1>
        <p className="text-sm text-gray-500 mt-1">
          Import from Chrome, Firefox, Safari, or any browser's HTML export
        </p>
      </div>

      {status === 'success' ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-xl">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-900">
            {count} bookmark{count !== 1 ? 's' : ''} imported!
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            View Bookmarks
          </button>
        </div>
      ) : status === 'error' ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-900">{errorMsg}</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
              ${dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <Upload className={`w-10 h-10 mx-auto mb-3 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium text-gray-900">
              Drop your bookmarks file here
            </p>
            <p className="text-xs text-gray-500 mt-1">or click to browse</p>
            <p className="text-xs text-gray-400 mt-3">Supports .html and .htm files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              How to export bookmarks
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">Chrome</p>
                <p className="text-xs text-gray-500">Bookmarks Manager → ⋮ → Export bookmarks</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Firefox</p>
                <p className="text-xs text-gray-500">Bookmarks → Manage → Import and Backup → Export to HTML</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Safari</p>
                <p className="text-xs text-gray-500">File → Export Bookmarks</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
