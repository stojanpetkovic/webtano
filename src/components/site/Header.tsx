import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { site } from '@/content/site';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="WebTano home">
          <Logo light />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-white/80 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#check"
          className="inline-flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-sm font-semibold whitespace-nowrap text-forest-950 transition hover:bg-lime-dark"
        >
          Free website check
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
