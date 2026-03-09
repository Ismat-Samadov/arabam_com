import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Othello — Classic Strategy Game',
  description:
    'Play Othello (Reversi) against an AI opponent. Three difficulty levels: Easy, Medium, and Hard.',
  keywords: ['othello', 'reversi', 'board game', 'strategy', 'AI'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#020817',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
