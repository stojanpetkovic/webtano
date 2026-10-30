import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { env } from '@/lib/admin/env';
import { isSameOrigin } from '@/lib/admin/csrf';

// The endpoints client sites post to. Each checks the caller's origin against
// the submitting site's own domain instead (src/app/api/leads, hit, event).
// Mail apps post the one-click unsubscribe, which carries its own token.
const CROSS_SITE_ENDPOINTS = ['/api/leads', '/api/hit', '/api/event', '/api/newsletter/unsubscribe'];

/**
 * Same-origin check for every state-changing request, then the login guard
 * for the private lead admin under /admin. Only the one configured admin
 * account gets in, so a stray Supabase sign-up can never see client data.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) return routeLanguage(request);

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

// Paths outside the two languages: the admin's public demo report and files served as they are.
// The demo site itself, /demo and /sr/demo, is a normal page in both languages.
const UNLOCALIZED = ['/demo/report'];
const FILE = /\.[a-z0-9]+$/i;

/**
 * English is the site's default and lives at the root, Serbian under /sr. Both
 * are one route tree, app/(site)/[lang], so English addresses are rewritten to
 * /en without changing the URL, and /en itself redirects to the plain address.
 */
function routeLanguage(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (UNLOCALIZED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();
  if (FILE.test(pathname) && !pathname.endsWith('/rss.xml')) return NextResponse.next();
  if (pathname === '/sr' || pathname.startsWith('/sr/')) return NextResponse.next();
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.redirect(new URL(`${pathname.slice(3) || '/'}${search}`, request.url), 308);
  }
  return NextResponse.rewrite(new URL(`/en${pathname === '/' ? '' : pathname}${search}`, request.url));
}

export const config = {
  // Everything but Next's own files; routeLanguage lets other static files through.
  matcher: ['/((?!_next/).*)'],
};
