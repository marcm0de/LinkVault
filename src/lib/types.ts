export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  favicon: string;
  tags: string[];
  collectionId: string | null;
  notes: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Tag {
  name: string;
  count: number;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'newest' | 'oldest' | 'title' | 'url';
