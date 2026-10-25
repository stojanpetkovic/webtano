import { shareCard } from '@/lib/shareCard';

export const dynamic = 'force-static';

/** The Serbian share card, for pages under /sr. */
export function GET() {
  return shareCard('sr');
}
