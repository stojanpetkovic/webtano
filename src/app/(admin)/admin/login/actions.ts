'use server';

import { redirect } from 'next/navigation';
import { authClient } from '@/lib/admin/supabase';
import { env } from '@/lib/admin/env';
import { translator } from '@/lib/i18n';

export interface SignInState {
  error: string;
  email: string;
}

export async function signIn(_prev: SignInState, form: FormData): Promise<SignInState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const t = translator(form.get('lang') === 'sr' ? 'sr' : 'en');
  const wrong = t('Wrong email or password.', 'Pogrešan email ili lozinka.');

  // Checked before Supabase is asked, so no other account can even start a session.
  if (!env.adminEmail || email !== env.adminEmail) return { error: wrong, email };

  const { error } = await (await authClient()).auth.signInWithPassword({ email, password });
  if (error) return { error: wrong, email };
  redirect('/admin');
}
