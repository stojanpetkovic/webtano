// The shape of a blog post. Text fields accept two bits of inline markup:
// **bold** and [link text](/path or https://...).

export type Block =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { tip: string; title?: string }
  | { table: { head: string[]; rows: string[][] } };

export type Category = 'Google Ads' | 'Local SEO' | 'AI search' | 'Websites' | 'Lead tracking';

export interface Post {
  slug: string;
  title: string;
  /** Shorter title for the browser tab and search results, when the headline is long. */
  seoTitle?: string;
  description: string;
  category: Category;
  keywords: string[];
  /** ISO dates. */
  published: string;
  updated?: string;
  /** Three to five lines shown above the article. */
  takeaways: string[];
  body: Block[];
  faq: { q: string; a: string }[];
  /** Outside sources the article relies on, listed at the end. */
  sources?: { label: string; url: string }[];
}
