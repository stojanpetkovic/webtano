import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { caseStudies } from '@/content/work';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/work`, priority: 0.8 },
    ...caseStudies.map((c) => ({ url: `${site.url}/work/${c.slug}`, priority: 0.7 })),
    { url: `${site.url}/privacy`, priority: 0.2 },
  ];
}
