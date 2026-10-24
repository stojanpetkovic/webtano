# WebTano

webtano.com: the agency site and the lead system behind every client site
(forms, page views, call clicks, client reports). Next.js 16 (App Router),
Supabase for data and login, Resend for email.

The lead system was moved here from stojanpetkovic.com. Both run against the
same Supabase project, so client sites can move over one at a time while the
old backend keeps working.

## What is where

| Path | What it does |
| --- | --- |
| `public/leads.js` | The collector every client site loads (forms, page views, contact clicks). It posts to the host it was loaded from. |
| `src/app/api/{leads,hit,event}` | Endpoints the collector posts to. Each accepts only the site's own domain. |
| `src/app/(admin)/admin` | Private admin: dashboard, leads, sites, settings, printable client report. |
| `src/app/(site)` | The public webtano.com site. |
| `src/lib/admin` | Shared logic: ingest, analytics, channels, email, report text. |
| `src/proxy.ts` | Same-origin check for state-changing requests and the login guard for `/admin`. |

## Setup

1. Copy `.env.example` to `.env.local` and fill it in. Use the **same values as
   the old backend** (Supabase keys, `ADMIN_EMAIL`, `IP_HASH_SALT`), so visitor
   counts stay continuous. Set `SITE_URL=https://webtano.com` and a
   `LEADS_FROM_EMAIL` on a domain verified in Resend (add webtano.com there).
2. `npm install`, then `npm run dev` and open `/admin`.
3. Deploy anywhere that runs Node 20+ (`npm run build && npm start`), with the
   same variables set on the host.

## Moving a client site

On the site, replace

```html
<script src="https://stojanpetkovic.com/leads.js" data-site-key="KEY" defer></script>
```

with

```html
<script src="https://webtano.com/leads.js" data-site-key="KEY" defer></script>
```

The key stays the same. Nothing else on the site changes; leads, visits and
calls land in the same tables, so the history is kept.
