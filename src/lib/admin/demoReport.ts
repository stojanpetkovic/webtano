import type { ClickKind, ReportLocale, SiteAnalytics, Totals } from './analytics';
import type { Channel } from './channels';
import type { ReportLead } from '@/components/admin/ReportView';
import type { Site } from './types';

/*
 * Made-up data for the public demo report (/demo/report). Every number comes
 * from a random generator seeded by the date, so a period shows the same
 * figures on every visit and the change figures stay believable.
 */

export const DEMO_SITE: Site = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Demo Tree Service',
  domain: 'demotreeservice.com',
  site_key: 'demo',
  client_name: 'Demo Tree Service LLC',
  client_emails: [],
  email_language: 'en',
  timezone: 'America/New_York',
  notify_owner: false,
  active: true,
  created_at: '2025-01-01T00:00:00Z',
};

/** What the demo shows when the visitor has not entered spend yet. */
export const DEMO_SPEND = {
  spendGoogle: '1450',
  currency: 'USD',
  jobValue: '850',
};

// Where visits come from, as shares of the day's traffic, and how well each converts.
const CHANNEL_MIX: {
  channel: Channel;
  share: number;
  formRate: number;
  callRate: number;
  utm?: [string, string];
  referrer?: string;
}[] = [
  {
    channel: 'Google oglasi',
    share: 0.38,
    formRate: 0.04,
    callRate: 0.07,
    utm: ['google', 'cpc'],
  },
  {
    channel: 'Google pretraga',
    share: 0.3,
    formRate: 0.03,
    callRate: 0.045,
    referrer: 'https://www.google.com/',
  },
  {
    channel: 'Google Business profil',
    share: 0.14,
    formRate: 0.02,
    callRate: 0.08,
    utm: ['google', 'organic'],
    referrer: 'https://www.google.com/',
  },
  { channel: 'Direktno', share: 0.11, formRate: 0.02, callRate: 0.03 },
  {
    channel: 'Facebook/Instagram',
    share: 0.05,
    formRate: 0.01,
    callRate: 0.01,
    referrer: 'https://m.facebook.com/',
  },
  {
    channel: 'Drugi sajtovi',
    share: 0.02,
    formRate: 0.01,
    callRate: 0.01,
    referrer: 'https://www.yelp.com/',
  },
];

const PAGES = [
  ['/', 0.34],
  ['/tree-removal', 0.18],
  ['/emergency-tree-service', 0.12],
  ['/tree-trimming', 0.1],
  ['/stump-grinding', 0.08],
  ['/service-areas/fort-lauderdale', 0.07],
  ['/contact', 0.06],
  ['/blog/when-to-remove-a-tree', 0.05],
] as const;

const NAMES = [
  'Michael R.',
  'Jennifer L.',
  'David K.',
  'Sarah M.',
  'Robert T.',
  'Lisa G.',
  'James W.',
  'Maria S.',
  'Kevin P.',
  'Ashley B.',
  'Daniel H.',
  'Nicole C.',
];
const FORMS = ['Free estimate', 'Emergency request', 'Contact form'];

/** A small deterministic random generator (mulberry32) seeded from a string. */
function random(seed: string) {
  let a = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rounds a fractional expectation to a whole count, randomly up or down. */
const count = (expected: number, rnd: () => number) => Math.floor(expected) + (rnd() < expected % 1 ? 1 : 0);

interface Day {
  day: string;
  visitors: number;
  visits: number;
  channels: Map<Channel, { visits: number; forms: number; calls: number }>;
  leads: ReportLead[];
}

function simulateDay(day: string): Day {
  const rnd = random(day);
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
  // Steady growth over the year, quieter weekends, and a storm spike now and then.
  const growth = 1 + ((Date.parse(`${day}T00:00:00Z`) - Date.parse('2026-01-01T00:00:00Z')) / (30 * 86_400_000)) * 0.07;
  const weekend = weekday === 0 || weekday === 6 ? 0.72 : 1;
  const storm = rnd() < 0.03 ? 1.4 : 1;
  const visitors = Math.round((19 + rnd() * 4) * growth * weekend * storm);
  const visits = Math.round(visitors * (1.12 + rnd() * 0.1));

  const channels = new Map<Channel, { visits: number; forms: number; calls: number }>();
  const leads: ReportLead[] = [];
  for (const mix of CHANNEL_MIX) {
    const v = Math.round(visits * mix.share * (0.8 + rnd() * 0.4));
    const forms = count(v * mix.formRate * storm * Math.sqrt(growth), rnd);
    const calls = count(v * mix.callRate * storm * Math.sqrt(growth), rnd);
    channels.set(mix.channel, { visits: v, forms, calls });
    for (let i = 0; i < forms; i++) {
      const hour = 7 + Math.floor(rnd() * 13);
      leads.push({
        created_at: `${day}T${String(hour + 4).padStart(2, '0')}:${String(Math.floor(rnd() * 60)).padStart(2, '0')}:00Z`,
        visitor_name: NAMES[Math.floor(rnd() * NAMES.length)],
        visitor_email: null,
        form_name: FORMS[Math.floor(rnd() * (storm > 1 ? 2 : FORMS.length))],
        utm_source: mix.utm?.[0] ?? null,
        utm_medium: mix.utm?.[1] ?? null,
        referrer: mix.referrer ?? null,
        status: rnd() < 0.32 ? 'won' : 'contacted',
      });
    }
  }
  return { day, visitors, visits, channels, leads };
}

function totalsOf(days: Day[]): Totals {
  let visitors = 0;
  let visits = 0;
  let leads = 0;
  let calls = 0;
  for (const d of days) {
    visitors += d.visitors;
    visits += d.visits;
    leads += d.leads.length;
    for (const c of d.channels.values()) calls += c.calls;
  }
  return {
    visitors,
    visits,
    views: Math.round(visits * 2.3),
    leads,
    calls,
    emailClicks: Math.round(leads * 0.2),
    contacts: leads + calls,
  };
}

const CLICK_LABELS: Record<ReportLocale, Record<ClickKind, string>> = {
  sr: {
    call: 'Poziv (telefon)',
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    email: 'Email',
  },
  en: {
    call: 'Phone call',
    whatsapp: 'WhatsApp',
    sms: 'Text message',
    email: 'Email',
  },
};
const DEVICE_LABELS: Record<ReportLocale, Record<string, string>> = {
  sr: { mobile: 'Telefon', desktop: 'Računar', tablet: 'Tablet' },
  en: { mobile: 'Mobile', desktop: 'Desktop', tablet: 'Tablet' },
};

/** The report's analytics and lead list for the given days, in the same shape the real report uses. */
export function demoReport(current: string[], previous: string[], locale: ReportLocale): { analytics: SiteAnalytics; leads: ReportLead[] } {
  const cur = current.map(simulateDay);
  const prev = previous.map(simulateDay);
  const totals = totalsOf(cur);

  const byChannel = new Map<Channel, { visits: number; leads: number; calls: number }>();
  for (const d of cur) {
    for (const [channel, c] of d.channels) {
      const row = byChannel.get(channel) ?? { visits: 0, leads: 0, calls: 0 };
      row.visits += c.visits;
      row.leads += c.forms;
      row.calls += c.calls;
      byChannel.set(channel, row);
    }
  }
  const channels = [...byChannel.entries()]
    .map(([label, c]) => ({ label, ...c }))
    .filter((c) => c.visits || c.leads || c.calls)
    .sort((a, b) => b.visits - a.visits);

  // Pages share the views, with calls and forms leaning to the service pages.
  const pages = PAGES.map(([label, share], i) => ({
    label,
    views: Math.round(totals.views * share),
    leads: Math.round(totals.leads * [0.22, 0.24, 0.2, 0.1, 0.08, 0.06, 0.1, 0][i]),
    calls: Math.round(totals.calls * [0.3, 0.22, 0.24, 0.08, 0.06, 0.06, 0.04, 0][i]),
  }));

  const sms = Math.round(totals.calls * 0.08);
  const clicks = (
    [
      ['call', totals.calls - sms],
      ['sms', sms],
      ['email', totals.emailClicks],
    ] as const
  ).map(([kind, n]) => ({ kind, label: CLICK_LABELS[locale][kind], count: n }));

  const devices = (
    [
      ['mobile', 0.71],
      ['desktop', 0.25],
      ['tablet', 0.04],
    ] as const
  ).map(([key, share]) => ({
    key,
    label: DEVICE_LABELS[locale][key],
    count: Math.round(totals.visitors * share),
  }));

  const names = new Intl.DisplayNames([locale === 'en' ? 'en' : 'sr-Latn'], {
    type: 'region',
  });
  const countries = (
    [
      ['US', 0.93],
      ['CA', 0.03],
      ['GB', 0.02],
      ['MX', 0.02],
    ] as const
  ).map(([code, share]) => ({
    code,
    label: names.of(code) ?? code,
    count: Math.round(totals.visitors * share),
  }));

  return {
    analytics: {
      days: current.length,
      totals,
      previous: totalsOf(prev),
      daily: cur.map((d) => ({
        day: d.day,
        visitors: d.visitors,
        leads: d.leads.length,
        calls: [...d.channels.values()].reduce((n, c) => n + c.calls, 0),
      })),
      channels,
      pages,
      clicks,
      devices,
      countries,
      hasData: true,
    },
    leads: cur.flatMap((d) => d.leads).sort((a, b) => a.created_at.localeCompare(b.created_at)),
  };
}
