'use server';

import { cookies } from 'next/headers';
import { SEEN_COOKIE, type SeenScope } from '@/lib/admin/seen';

/** Called when a lead list or a lead is opened: clears that list's count on the bell and in the menu. */
export async function markLeadsSeen(scope: SeenScope) {
  if (!(scope in SEEN_COOKIE)) return;
  (await cookies()).set(SEEN_COOKIE[scope], new Date().toISOString(), {
    path: '/admin',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });
}
