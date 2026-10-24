import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { env } from '@/lib/admin/env';
import { isSameOrigin } from '@/lib/admin/csrf';

// The endpoints client sites post to. Each checks the caller's origin against
// the submitting site's own domain instead (src/app/api/leads, hit, event).
const CROSS_SITE_ENDPOINTS = ['/api/leads', '/api/hit', '/api/event'];

/**
 * Same-origin check for every state-changing request, then the login guard
 * for the private lead admin under /admin. Only the one configured admin
 * account gets in, so a stray Supabase sign-up can never see client data.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const changesState = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  const crossSiteAllowed = CROSS_SITE_ENDPOINTS.some((p) => pathname === p || pathname === `${p}/`);
  if (changesState && !crossSiteAllowed && !isSameOrigin(request)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLogin = pathname === '/admin/login' || pathname === '/admin/login/';
  if (!isAdmin) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-admin-email');
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list) {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options } of list) {
          response.cookies.set(name, value, {
            ...options,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }
      },
    },
  });

  if (isLogin) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase() ?? null;

  if (!email || !env.adminEmail || email !== env.adminEmail) {
    if (data.user) await supabase.auth.signOut();
    const redirect = NextResponse.redirect(new URL('/admin/login', request.url));
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  // Pages read the signed-in email from this header; the client cannot set it.
  requestHeaders.set('x-admin-email', email);
  const next = NextResponse.next({ request: { headers: requestHeaders } });
  for (const cookie of response.cookies.getAll()) next.cookies.set(cookie);
  next.headers.set('X-Robots-Tag', 'noindex, nofollow');
  next.headers.set('Cache-Control', 'no-store');
  return next;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
