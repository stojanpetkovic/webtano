'use server';

import { redirect } from 'next/navigation';
import { authClient } from '@/lib/admin/supabase';
import { env } from '@/lib/admin/env';

export interface SignInState {
  error: string;
  email: string;
}

export async function signIn(_prev: SignInState, form: FormData): Promise<SignInState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');

  // Checked before Supabase is asked, so no other account can even start a session.
  if (!env.adminEmail || email !== env.adminEmail) return { error: 'Pogrešan email ili lozinka.', email };

  const { error } = await (await authClient()).auth.signInWithPassword({ email, password });
  if (error) return { error: 'Pogrešan email ili lozinka.', email };
  redirect('/admin');
}
