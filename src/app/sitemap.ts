import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { posts } from '@/content/blog';
import { caseStudies } from '@/content/work';
import { HTML_LANG, LANGS, localePath } from '@/lib/i18n';

type Entry = { path: string; priority: number; lastModified?: string };

/** Every page in both languages, each pointing at its twin so Google pairs them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Entry[] = [
    { path: '/', priority: 1 },
    { path: '/work', priority: 0.8 },
    ...caseStudies.map((c) => ({ path: `/work/${c.slug}`, priority: 0.7 })),
    { path: '/pricing', priority: 0.8 },
    { path: '/demo', priority: 0.7 },
    { path: '/blog', priority: 0.8, lastModified: posts[0].updated ?? posts[0].published },
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, priority: 0.7, lastModified: p.updated ?? p.published })),
    { path: '/privacy', priority: 0.2 },
    { path: '/terms', priority: 0.2 },
  ];
  const url = (lang: (typeof LANGS)[number], path: string) => `${site.url}${localePath(lang, path) === '/' ? '' : localePath(lang, path)}`;
  return pages.flatMap(({ path, priority, lastModified }) =>
    LANGS.map((lang) => ({
      url: url(lang, path),
      priority: lang === 'en' ? priority : Math.round(priority * 0.9 * 10) / 10,
      ...(lastModified && { lastModified }),
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [HTML_LANG[l], url(l, path)])) },
    })),
  );
}
