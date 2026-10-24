import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from './env';

let adminClient: SupabaseClient | null = null;

/** Service-role client. Server only: bypasses RLS, which denies everyone else. */
export function db(): SupabaseClient {
  if (!adminClient) {
    if (!env.supabaseUrl || !env.supabaseSecretKey) {
      throw new Error('PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set');
    }
    adminClient = createClient(env.supabaseUrl, env.supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

/** Auth client bound to the request's cookies, used only for the login session. */
export async function authClient() {
  const store = await cookies();
  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list) {
        try {
          for (const { name, value, options } of list) {
            store.set(name, value, {
              ...options,
              path: '/',
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });
          }
        } catch {
          // Server Components cannot set cookies; the proxy refreshes the session instead.
        }
      },
    },
  });
}
