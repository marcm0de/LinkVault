import type { Metadata } from 'next';
import './globals.css';
import Shell from '@/components/Shell';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

export const metadata: Metadata = {
  title: 'LinkVault — Self-hosted Bookmark Manager',
  description: 'A clean, fast bookmark manager with tagging, search, and link previews.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Shell>{children}</Shell>
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
