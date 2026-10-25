import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { posts } from '@/content/blog';
import { caseStudies } from '@/content/work';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/work`, priority: 0.8 },
    ...caseStudies.map((c) => ({ url: `${site.url}/work/${c.slug}`, priority: 0.7 })),
    { url: `${site.url}/pricing`, priority: 0.8 },
    { url: `${site.url}/blog`, priority: 0.8, lastModified: posts[0].updated ?? posts[0].published },
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, priority: 0.7, lastModified: p.updated ?? p.published })),
    { url: `${site.url}/privacy`, priority: 0.2 },
    { url: `${site.url}/terms`, priority: 0.2 },
  ];
}
