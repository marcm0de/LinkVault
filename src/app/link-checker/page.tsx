'use client';

import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store';

type LinkStatus = 'pending' | 'checking' | 'alive' | 'dead' | 'unknown';

interface LinkResult {
  id: string;
  url: string;
  title: string;
  status: LinkStatus;
}

export default function LinkCheckerPage() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const deleteBookmark = useBookmarkStore((s) => s.deleteBookmark);
  const [results, setResults] = useState<LinkResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  const startCheck = async () => {
    setIsChecking(true);
    setChecked(false);

    const initial: LinkResult[] = bookmarks.map((b) => ({
      id: b.id,
      url: b.url,
      title: b.title,
      status: 'pending' as LinkStatus,
    }));
    setResults(initial);

    // Check links in batches of 3
    const batchSize = 3;
    for (let i = 0; i < initial.length; i += batchSize) {
      const batch = initial.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (link) => {
          setResults((prev) =>
            prev.map((r) => (r.id === link.id ? { ...r, status: 'checking' } : r))
          );

          try {
            // Use a HEAD request via our proxy to check if a link is alive
            // For now, simulate a check with a timeout (real implementation would use a server route)
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);

            try {
              const response = await fetch(`/api/metadata?url=${encodeURIComponent(link.url)}`, {
                signal: controller.signal,
              });
              clearTimeout(timeout);

              const status: LinkStatus = response.ok ? 'alive' : 'dead';
              setResults((prev) =>
                prev.map((r) => (r.id === link.id ? { ...r, status } : r))
              );
            } catch {
              clearTimeout(timeout);
              // If our metadata route fails or times out, mark as unknown
              setResults((prev) =>
                prev.map((r) => (r.id === link.id ? { ...r, status: 'unknown' } : r))
              );
            }
          } catch {
            setResults((prev) =>
              prev.map((r) => (r.id === link.id ? { ...r, status: 'unknown' } : r))
            );
          }
        })
      );
    }

    setIsChecking(false);
    setChecked(true);
  };

  const aliveCount = results.filter((r) => r.status === 'alive').length;
  const deadCount = results.filter((r) => r.status === 'dead').length;
  const unknownCount = results.filter((r) => r.status === 'unknown').length;

  const statusIcon = (status: LinkStatus) => {
    switch (status) {
      case 'alive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'dead':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'checking':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'unknown':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-200" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Broken Link Checker
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Check if your bookmarked links are still alive
        </p>
      </div>

      {/* Start button */}
      <div className="mb-6">
        <button
          onClick={startCheck}
          disabled={isChecking || bookmarks.length === 0}
          className="w-full py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking {bookmarks.length} links...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Check All {bookmarks.length} Bookmarks
            </>
          )}
        </button>
      </div>

      {/* Summary */}
      {checked && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{aliveCount}</p>
            <p className="text-xs text-green-600">Alive</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{deadCount}</p>
            <p className="text-xs text-red-600">Broken</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{unknownCount}</p>
            <p className="text-xs text-amber-600">Unknown</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100">
          {results
            .sort((a, b) => {
              const order: Record<LinkStatus, number> = { dead: 0, unknown: 1, checking: 2, pending: 3, alive: 4 };
              return order[a.status] - order[b.status];
            })
            .map((result) => (
              <div key={result.id} className="flex items-center gap-3 px-4 py-3">
                {statusIcon(result.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                  <p className="text-xs text-gray-400 truncate">{result.url}</p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {result.status === 'dead' && (
                    <button
                      onClick={() => {
                        deleteBookmark(result.id);
                        setResults((prev) => prev.filter((r) => r.id !== result.id));
                      }}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {!checked && !isChecking && (
        <div className="text-center py-12 text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Click the button above to check all your bookmarks</p>
          <p className="text-xs mt-1">This will test each URL to see if it&apos;s still accessible</p>
        </div>
      )}
    </div>
  );
}
