import { db } from '@/lib/admin/supabase';
import { parseUtm, str } from '@/lib/admin/leads';
import { channelOf, referrerHost } from '@/lib/admin/channels';
import { cleanPath, country, device, noContent, readBeacon, visitorHash } from '@/lib/admin/collector';

/*
 * Contact-click collector: leads.js reports a click on a call, WhatsApp, SMS
 * or email link, with the campaign the visitor first arrived from, so calls
 * count as conversions next to form inquiries.
 */

const KINDS = ['call', 'whatsapp', 'sms', 'email'] as const;

export function OPTIONS(request: Request) {
  return noContent(request.headers.get('origin'));
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const beacon = await readBeacon(request);
  if (!beacon) return noContent(origin);
  const { site, body, ua } = beacon;

  const kind = KINDS.find((k) => k === body.kind);
  if (!kind) return noContent(origin);

  const utm = parseUtm(body.utm);
  const host = referrerHost(str(body.referrer, 1000));

  const { error } = await db()
    .from('site_events')
    .insert({
      site_id: site.id,
      kind,
      target: str(body.target, 200),
      path: cleanPath(body.path),
      channel: channelOf({ utm_source: utm.utm_source, utm_medium: utm.utm_medium, referrerHost: host, userAgent: ua }),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      referrer_host: host,
      device: device(ua),
      country: country(request),
      visitor_hash: visitorHash(request, request.headers.get('x-real-ip') ?? undefined, site, ua),
    });
  if (error) console.error('site event insert failed', error.message);

  return noContent(origin);
}
