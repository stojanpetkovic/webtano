import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}: websites, local SEO and Google Ads`,
    short_name: site.name,
    description: site.tagline.en,
    start_url: '/',
    display: 'standalone',
    background_color: '#05060a',
    theme_color: '#05060a',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/brand/webtano-mark-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
