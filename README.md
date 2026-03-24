# 🔗 LinkVault

A clean, fast, self-hosted bookmark manager with tagging, search, and link previews. No account required — runs entirely in your browser.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **📌 Save & Organize** — Save links with tags, notes, and collections
- **🔍 Full-text Search** — Search across titles, URLs, descriptions, tags, and notes
- **🏷️ Tag System** — Tag-based filtering with a visual tag cloud
- **📁 Collections** — Group bookmarks into custom collections with icons and colors
- **📥 Import/Export** — Import from any browser (HTML format) and export your data
- **🔗 Metadata Extraction** — Auto-fetches page titles and descriptions from URLs
- **📱 Responsive** — Works on desktop, tablet, and mobile
- **💾 Local Storage** — All data stored in your browser — no server, no account
- **⚡ Fast** — Built with Next.js, Tailwind CSS, Zustand, and Framer Motion

## Screenshots

| Grid View | List View | Tags |
|-----------|-----------|------|
| Card-based layout with favicons | Compact list with inline tags | Visual tag cloud with counts |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/yourusername/LinkVault.git
cd LinkVault
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 15](https://nextjs.org) | React framework with App Router |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Zustand](https://github.com/pmndrs/zustand) | State management with localStorage persistence |
| [Framer Motion](https://framer.com/motion) | Animations |
| [Lucide React](https://lucide.dev) | Icons |
| [Zod](https://zod.dev) | Schema validation |

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # All Bookmarks (home)
│   ├── collections/       # Collections page
│   ├── tags/              # Tag cloud
│   ├── add/               # Add bookmark form
│   ├── import/            # Import from HTML
│   ├── settings/          # Export, clear data
│   └── api/metadata/      # URL metadata extraction
├── components/
│   ├── Shell.tsx           # App shell layout
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── BookmarkCard.tsx    # Bookmark card/list item
│   ├── SearchBar.tsx       # Search input
│   ├── TagFilter.tsx       # Tag filter pills
│   └── EditBookmarkModal.tsx
└── lib/
    ├── types.ts            # TypeScript interfaces
    ├── store.ts            # Zustand store
    ├── utils.ts            # Helpers
    └── seed-data.ts        # 20 seed bookmarks
```

## Data Model

```typescript
Bookmark {
  id, url, title, description, favicon,
  tags[], collectionId, notes, createdAt
}

Collection {
  id, name, icon, color
}
```

## Roadmap

- [ ] Dark mode
- [ ] Supabase backend (optional sync)
- [ ] Browser extension for quick save
- [ ] Keyboard shortcuts
- [ ] Bulk operations
- [ ] Link health checker (detect broken links)
- [ ] Thumbnail/screenshot previews

## License

[MIT](LICENSE)

---

Built with ❤️ and open source.
