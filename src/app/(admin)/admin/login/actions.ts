'use server';

import { redirect } from 'next/navigation';
import { authClient } from '@/lib/admin/supabase';
import { env } from '@/lib/admin/env';

export async function signIn(_prev: string, form: FormData): Promise<string> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');

  // Checked before Supabase is asked, so no other account can even start a session.
  if (!env.adminEmail || email !== env.adminEmail) return 'Pogrešan email ili lozinka.';

  const { error } = await (await authClient()).auth.signInWithPassword({ email, password });
  if (error) return 'Pogrešan email ili lozinka.';
  redirect('/admin');
}
