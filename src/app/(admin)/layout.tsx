import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './admin.css';

const sans = Geist({ variable: '--font-geist', subsets: ['latin', 'latin-ext'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: { template: '%s · WebTano Admin', default: 'WebTano Admin' },
  robots: { index: false, follow: false },
  icons: { icon: '/admin-favicon.svg' },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
