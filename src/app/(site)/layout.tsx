import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://webtano.com'),
  title: 'WebTano | Websites that turn visitors into calls',
  description: 'WebTano builds fast websites with lead tracking, so every form and call is counted and you see which marketing pays.',
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
