import { NextResponse } from 'next/server';
import { authClient } from '@/lib/admin/supabase';

export async function POST(request: Request) {
  await (await authClient()).auth.signOut();
  return NextResponse.redirect(new URL('/admin/login', request.url), 303);
}
