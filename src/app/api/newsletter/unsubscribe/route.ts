import { unsubscribe } from '@/lib/admin/newsletter';

export const dynamic = 'force-dynamic';

/** One-click unsubscribe (RFC 8058): mail apps POST here from the List-Unsubscribe header. */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('t') ?? '';
  await unsubscribe(token).catch((err) => console.error('one-click unsubscribe failed:', err));
  return new Response(null, { status: 204 });
}
