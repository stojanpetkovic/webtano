// The blog: posts live one per file in ./posts, photos in /public/blog and
// their credits in ./images.json.
import type { Block, Category, Post } from './types';
import images from './images.json';
import { post as aiMode } from './posts/ai-mode-local-search';
import { post as callTracking } from './posts/call-tracking-contractors';
import { post as googleAds } from './posts/google-ads-tree-services';
import { post as businessProfile } from './posts/google-business-profile-tree-service';
import { post as localServicesAds } from './posts/local-services-ads-google-ads';
import { post as speedToLead } from './posts/speed-to-lead';
import { post as spamUpdate } from './posts/spam-update-september-2026';
import { post as treeWebsite } from './posts/tree-service-website';
import { post as websiteSpeed } from './posts/website-speed';

export type { Block, Category, Post };

export interface PostImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string;
  source: string;
  sourceUrl: string;
}

/** Newest first; the first one is featured on /blog. */
const all: Post[] = [localServicesAds, aiMode, spamUpdate, callTracking, businessProfile, googleAds, treeWebsite, speedToLead, websiteSpeed];

export const posts = all.toSorted((a, b) => b.published.localeCompare(a.published));

export const categories: Category[] = ['Google Ads', 'Local SEO', 'AI search', 'Websites', 'Lead tracking'];

export function findPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function postImage(post: Post): PostImage {
  // A photo can name its own file; a new name is how a replaced photo gets past image caches.
  const { file, ...meta } = (images as Record<string, Omit<PostImage, 'src' | 'width' | 'height'> & { file?: string }>)[post.slug];
  return { src: `/blog/${file ?? `${post.slug}.webp`}`, width: 1600, height: 900, ...meta };
}

const strip = (s: string) => s.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

function blockText(b: Block): string {
  if ('p' in b) return b.p;
  if ('h2' in b) return b.h2;
  if ('h3' in b) return b.h3;
  if ('tip' in b) return b.tip;
  if ('ul' in b) return b.ul.join(' ');
  if ('ol' in b) return b.ol.join(' ');
  return [...b.table.head, ...b.table.rows.flat()].join(' ');
}

/** Minutes to read at about 230 words a minute. */
export function readingTime(post: Post) {
  const words = [...post.takeaways, ...post.body.map(blockText), ...post.faq.flatMap((f) => [f.q, f.a])]
    .map(strip)
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

/** Heading id used for the table of contents. */
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function toc(post: Post) {
  return post.body.flatMap((b) => ('h2' in b ? [{ id: headingId(b.h2), text: b.h2 }] : []));
}

/** Other posts to read next: same category first, then the newest. */
export function relatedPosts(post: Post, count = 3) {
  const others = posts.filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, count);
}

export function plainText(s: string) {
  return strip(s);
}
