import { Bookmark } from './types';

export function generateId(): string {
  return `bm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateCollectionId(): string {
  return `col-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function exportBookmarksToHTML(bookmarks: Bookmark[]): string {
  const lines = [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<!-- This is an automatically generated file. -->',
    '<!-- It will be overwritten when the bookmark file is changed. -->',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    '<TITLE>LinkVault Bookmarks</TITLE>',
    '<H1>LinkVault Bookmarks</H1>',
    '<DL><p>',
  ];

  bookmarks.forEach((bm) => {
    const addDate = Math.floor(new Date(bm.createdAt).getTime() / 1000);
    const tags = bm.tags.length > 0 ? ` TAGS="${bm.tags.join(',')}"` : '';
    lines.push(`    <DT><A HREF="${bm.url}" ADD_DATE="${addDate}"${tags}>${bm.title}</A>`);
    if (bm.description) {
      lines.push(`    <DD>${bm.description}`);
    }
  });

  lines.push('</DL><p>');
  return lines.join('\n');
}

export function parseBookmarksHTML(html: string): Partial<Bookmark>[] {
  const bookmarks: Partial<Bookmark>[] = [];
  const linkRegex = /<A[^>]*HREF="([^"]*)"[^>]*>([^<]*)<\/A>/gi;
  const tagsRegex = /TAGS="([^"]*)"/i;

  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const url = match[1];
    const title = match[2];
    const tagsMatch = fullTag.match(tagsRegex);
    const tags = tagsMatch ? tagsMatch[1].split(',').filter(Boolean) : [];

    bookmarks.push({
      id: generateId(),
      url,
      title: title || url,
      description: '',
      favicon: getFaviconUrl(url),
      tags,
      collectionId: null,
      notes: '',
      createdAt: new Date().toISOString(),
    });
  }

  return bookmarks;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
