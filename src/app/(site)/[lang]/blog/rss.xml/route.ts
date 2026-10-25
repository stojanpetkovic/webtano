import { postsIn } from '@/content/blog';
import { site } from '@/content/site';
import { isLang, LANGS, localePath, translator } from '@/lib/i18n';

export const dynamic = 'force-static';
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The feed in the page's language: /blog/rss.xml and /sr/blog/rss.xml. */
export async function GET(_request: Request, { params }: RouteContext<'/[lang]/blog/rss.xml'>) {
  const { lang: value } = await params;
  const lang = isLang(value) ? value : 'en';
  const t = translator(lang);
  const lp = (path: string) => `${site.url}${localePath(lang, path)}`;
  const items = postsIn(lang)
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${lp(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${lp(`/blog/${p.slug}`)}</guid>
      <pubDate>${new Date(`${p.published}T12:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.description)}</description>
    </item>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WebTano blog</title>
    <link>${lp('/blog')}</link>
    <atom:link href="${lp('/blog/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>${esc(t('Google Ads, local SEO, AI search and websites for local service companies.', 'Google Ads, lokalni SEO, AI pretraga i sajtovi za lokalne uslužne firme.'))}</description>
    <language>${lang === 'sr' ? 'sr-rs' : 'en-us'}</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
