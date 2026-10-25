import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { env } from '@/lib/admin/env';
import { runAutomations } from '@/lib/admin/automation/run';
import { purgeUnconfirmed } from '@/lib/admin/newsletter';

export const dynamic = 'force-dynamic';

function authorized(header: string | null): boolean {
  const secret = env.cronSecret;
  if (!secret || !header?.startsWith('Bearer ')) return false;
  const given = Buffer.from(header.slice(7));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * The hourly cron: `curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://webtano.com/api/cron`.
 * Without CRON_SECRET set, the route stays shut.
 */
export async function GET(request: Request) {
  if (!env.cronSecret) return NextResponse.json({ error: 'CRON_SECRET is not set' }, { status: 503 });
  if (!authorized(request.headers.get('authorization'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Housekeeping first, so it runs even while automations are paused.
  await purgeUnconfirmed().catch((err) => console.error('newsletter purge failed:', err));
  const summary = await runAutomations();
  return NextResponse.json(summary);
}
