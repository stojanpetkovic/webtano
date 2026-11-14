/**
 * Where a visit or a lead came from, as one of a fixed set of channels a
 * client can read. Page views and leads go through the same function, so the
 * admin can divide one by the other per channel.
 */
export const CHANNELS = [
  "AI pretraga",
  "Google pretraga",
  "Google oglasi",
  "Facebook/Instagram oglasi",
  "Facebook/Instagram",
  "Druge društvene mreže",
  "Google Business profil",
  "Bing pretraga",
  "Drugi sajtovi",
  "Email",
  "Kampanja (ostalo)",
  "Direktno",
] as const;
export type Channel = (typeof CHANNELS)[number];

/**
 * AI assistants that send visitors to a site, recognised by the referring
 * host or by utm_source (ChatGPT adds utm_source=chatgpt.com to its links).
 * Google's AI Overviews and AI Mode cannot be told apart from a normal
 * Google search: they send the same google.com referrer and no tag.
 */
export const AI_SOURCES = [
  { name: "ChatGPT", host: /(^|\.)(chatgpt\.com|openai\.com)$/, utm: /chatgpt|openai/ },
  { name: "Perplexity", host: /(^|\.)perplexity\.ai$/, utm: /perplexity/ },
  { name: "Gemini", host: /^(gemini|bard)\.google\.com$/, utm: /gemini|bard/ },
  { name: "Claude", host: /(^|\.)claude\.ai$/, utm: /claude|anthropic/ },
  {
    name: "Microsoft Copilot",
    host: /^copilot\.(microsoft\.com|cloud\.microsoft)$|(^|\.)m365copilot\.com$/,
    utm: /copilot/,
  },
  { name: "DeepSeek", host: /(^|\.)deepseek\.com$/, utm: /deepseek/ },
  { name: "Grok", host: /(^|\.)grok\.com$/, utm: /grok/ },
  { name: "Meta AI", host: /(^|\.)meta\.ai$/, utm: /meta\.ai/ },
  { name: "Mistral Le Chat", host: /^chat\.mistral\.ai$/, utm: /mistral/ },
  { name: "You.com", host: /(^|\.)you\.com$/, utm: /^you\.com$/ },
  { name: "Phind", host: /(^|\.)phind\.com$/, utm: /phind/ },
] as const;
export type AiSource = (typeof AI_SOURCES)[number]["name"];

/** Which AI assistant a visit or lead came from, or null when it did not come from one. */
export function aiSourceOf(input: {
  utm_source?: string | null;
  referrerHost?: string | null;
}): AiSource | null {
  const source = input.utm_source?.toLowerCase().trim() ?? "";
  const host = input.referrerHost?.toLowerCase() ?? "";
  for (const ai of AI_SOURCES) {
    if ((source && ai.utm.test(source)) || (host && ai.host.test(host)))
      return ai.name;
  }
  return null;
}

/** What AI numbers cannot show, said under every AI table. */
export const AI_FOOTNOTE = {
  sr: 'Google AI Overviews i AI Mode šalju posetioce kao običnu Google pretragu, pa se vode pod „Google pretraga”. Neke AI aplikacije ne šalju izvor i vode se kao „Direktno”.',
  en: 'Google AI Overviews and AI Mode send visitors like a normal Google search, so they count under "Google Search". Some AI apps send no source and count as "Direct".',
} as const;

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|yandex|ecosia|brave)\./;
const META =
  /(^|\.)(facebook|instagram|fb|messenger|threads)\.|^l\.facebook|^lm\.facebook/;
const OTHER_SOCIAL =
  /(^|\.)(tiktok|youtube|youtu|linkedin|lnkd|pinterest|x|twitter|reddit|snapchat|nextdoor)\.|^t\.co$/;
const PAID = /cpc|ppc|paid|ads?$|display|cpm/;

export function referrerHost(
  referrer: string | null | undefined,
): string | null {
  if (!referrer) return null;
  try {
    return (
      new URL(referrer).hostname.replace(/^www\./, "").toLowerCase() || null
    );
  } catch {
    return null;
  }
}

/**
 * The social app whose built-in browser opened the page, read from the user
 * agent. These browsers often send no referrer, so without this check a click
 * from an Instagram bio or a TikTok profile counts as a direct visit.
 */
export function inAppBrowser(
  ua: string | null | undefined,
): "facebook" | "instagram" | "tiktok" | null {
  if (!ua) return null;
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS|Messenger/i.test(ua)) return "facebook";
  if (/musical_ly|Bytedance|TikTok|trill_/i.test(ua)) return "tiktok";
  return null;
}

export function channelOf(input: {
  utm_source?: string | null;
  utm_medium?: string | null;
  referrerHost?: string | null;
  /** User agent of the visit, to recognise social apps' built-in browsers. */
  userAgent?: string | null;
}): Channel {
  const source = input.utm_source?.toLowerCase().trim() ?? "";
  const medium = input.utm_medium?.toLowerCase().trim() ?? "";
  const host = input.referrerHost ?? "";

  // First, since gemini.google.com would otherwise count as a Google search.
  if (aiSourceOf(input)) return "AI pretraga";

  if (source) {
    // Google Business Profile links are tagged by many agencies as
    // utm_source=…gbp / gmb, or utm_medium=organic with source=google-business.
    if (
      /gbp|gmb|google.?business|google.?maps|googlemaps/.test(source) ||
      /gbp|gmb/.test(medium)
    ) {
      return "Google Business profil";
    }
    if (/facebook|^fb$|instagram|^ig$|meta/.test(source)) {
      return PAID.test(medium)
        ? "Facebook/Instagram oglasi"
        : "Facebook/Instagram";
    }
    if (
      /tiktok|youtube|^yt$|linkedin|pinterest|twitter|^x$|reddit|snapchat|nextdoor/.test(
        source,
      )
    ) {
      return "Druge društvene mreže";
    }
    if (source.includes("google"))
      return PAID.test(medium) ? "Google oglasi" : "Google pretraga";
    if (source.includes("bing")) return "Bing pretraga";
    if (medium === "email" || source.includes("mail")) return "Email";
    return "Kampanja (ostalo)";
  }
  if (host) {
    if (/(^|\.)bing\./.test(host)) return "Bing pretraga";
    if (SEARCH.test(host)) return "Google pretraga";
    if (META.test(host)) return "Facebook/Instagram";
    if (OTHER_SOCIAL.test(host)) return "Druge društvene mreže";
    if (/mail\./.test(host)) return "Email";
    return "Drugi sajtovi";
  }
  const app = inAppBrowser(input.userAgent);
  if (app === "facebook" || app === "instagram") return "Facebook/Instagram";
  if (app === "tiktok") return "Druge društvene mreže";
  return "Direktno";
}

const CHANNEL_EN: Record<Channel, string> = {
  'AI pretraga': 'AI search',
  'Google pretraga': 'Google Search',
  'Google oglasi': 'Google Ads',
  'Facebook/Instagram oglasi': 'Facebook/Instagram Ads',
  'Facebook/Instagram': 'Facebook/Instagram',
  'Druge društvene mreže': 'Other social networks',
  'Google Business profil': 'Google Business Profile',
  'Bing pretraga': 'Bing Search',
  'Drugi sajtovi': 'Other websites',
  Email: 'Email',
  'Kampanja (ostalo)': 'Other campaigns',
  Direktno: 'Direct',
};

export function channelLabel(channel: string, locale: 'en' | 'sr'): string {
  return locale === 'en' ? (CHANNEL_EN[channel as Channel] ?? channel) : channel;
}
