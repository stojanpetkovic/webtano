import { shareCard } from '@/lib/shareCard';

// Drawn once at build time and served as a plain file.
export const dynamic = 'force-static';

/** The share card for every page without its own image (home, pricing, work, privacy). */
export function GET() {
  return shareCard('en');
}
