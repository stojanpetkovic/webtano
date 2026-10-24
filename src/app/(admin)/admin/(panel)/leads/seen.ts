'use server';

import { cookies } from 'next/headers';
import { SEEN_COOKIE } from '@/lib/admin/seen';

/** Called when the lead list or a lead is opened: clears the count on the bell and in the menu. */
export async function markLeadsSeen() {
  (await cookies()).set(SEEN_COOKIE, new Date().toISOString(), {
    path: '/admin',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });
}
