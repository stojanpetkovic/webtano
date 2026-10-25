import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { NotFoundContent } from '@/components/site/NotFoundContent';
import './(site)/site.css';

const sans = Geist({ variable: '--font-geist', subsets: ['latin', 'latin-ext'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = { title: 'Page not found | WebTano', robots: { index: false, follow: true } };

// URLs that match no route: the app has two root layouts, so this page brings its own html and body.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <Header />
        <main>
          <NotFoundContent />
        </main>
        <Footer />
      </body>
    </html>
  );
}
