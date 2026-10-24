import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './admin.css';

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: { template: '%s · WebTano Admin', default: 'WebTano Admin' },
  robots: { index: false, follow: false },
  icons: { icon: '/admin-favicon.svg' },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
