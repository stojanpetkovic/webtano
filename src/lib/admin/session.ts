import { headers } from 'next/headers';

/** The signed-in admin's email, set by src/proxy.ts after it checked the session. */
export async function adminEmail(): Promise<string> {
  return (await headers()).get('x-admin-email') ?? '';
}
