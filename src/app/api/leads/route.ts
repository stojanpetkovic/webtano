import { cleanFields, originMatches, str, type IncomingLead } from '@/lib/admin/leads';
import { findSite, isRateLimited, recordLead, visitorHash } from '@/lib/admin/ingest';

function cors(origin: string | null): Record<string, string> {
  return origin
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        Vary: 'Origin',
      }
    : {};
}

function reply(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers });
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: cors(request.headers.get('origin')) });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');

  // The snippet posts text/plain so the browser skips the CORS preflight;
  // the body is JSON either way.
  let body: IncomingLead;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return reply(400, { ok: false, error: 'invalid_json' });
  }

  const siteKey = str(body.site_key, 64);
  if (!siteKey) return reply(400, { ok: false, error: 'missing_site_key' });

  const site = await findSite(siteKey);
  if (!site) return reply(404, { ok: false, error: 'unknown_site' });

  // Browsers always send Origin on a cross-site POST. A wrong one means the
  // key was copied onto someone else's page; a missing one is a server-side
  // integration, which the rate limit below still covers.
  if (origin && !originMatches(origin, site.domain)) {
    return reply(403, { ok: false, error: 'origin_not_allowed' });
  }
  const headers = cors(origin);

  const { fields, honeypot } = cleanFields(body.data);
  if (Object.keys(fields).length === 0) return reply(400, { ok: false, error: 'empty_form' }, headers);

  const ipHash = visitorHash(request, request.headers.get('x-real-ip') ?? undefined, site);
  if (await isRateLimited(site, ipHash)) return reply(429, { ok: false, error: 'rate_limited' }, headers);

  const lead = await recordLead({
    site,
    fields,
    spam: honeypot,
    form: body.form,
    pageUrl: body.page_url,
    referrer: body.referrer,
    utm: body.utm,
    userAgent: request.headers.get('user-agent'),
    ipHash,
  });
  // A honeypot hit gets the same success answer, so the bot learns nothing.
  if (!lead) return reply(500, { ok: false, error: 'store_failed' }, headers);

  return reply(200, { ok: true }, headers);
}
