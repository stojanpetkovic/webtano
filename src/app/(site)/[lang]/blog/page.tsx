import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Rss } from 'lucide-react';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { PostCard } from '@/components/blog/PostCard';
import { Reveal } from '@/components/site/Reveal';
import { categories, categoryLabel, postImage, postsIn } from '@/content/blog';
import { site } from '@/content/site';
import { HTML_LANG, type T } from '@/lib/i18n';
import { getI18n } from '@/lib/i18n-site';
import { alternates } from '@/lib/seo';

const description = (t: T) =>
  t(
    'Practical guides on Google Ads, local SEO, AI search, websites and lead tracking for tree services and other local companies, from the accounts we run.',
    'Praktični vodiči za Google Ads, lokalni SEO, AI pretragu, sajtove i praćenje upita za firme za drveće i druge lokalne firme, iz naloga koje vodimo.',
  );

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t, lp } = await getI18n();
  return {
    title: t('Blog: local SEO, Google Ads and websites', 'Blog: lokalni SEO, Google Ads i sajtovi'),
    description: description(t),
    alternates: { ...alternates(lang, '/blog'), types: { 'application/rss+xml': lp('/blog/rss.xml') } },
    openGraph: { type: 'website', url: lp('/blog'), images: [postImage(postsIn(lang)[0]).src] },
  };
}

export default async function BlogPage() {
  const { lang, t, lp } = await getI18n();
  const posts = postsIn(lang);
  const [featured, ...rest] = posts;
  const counts = categories.map((name) => ({ name, count: rest.filter((p) => p.category === name).length })).filter((c) => c.count > 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${site.url}${lp('/blog')}#blog`,
        name: 'WebTano blog',
        description: description(t),
        url: `${site.url}${lp('/blog')}`,
        inLanguage: HTML_LANG[lang],
        publisher: { '@type': 'Organization', name: site.name, url: site.url, logo: `${site.url}/brand/webtano-mark-512.png` },
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `${site.url}${lp(`/blog/${p.slug}`)}`,
          datePublished: p.published,
          image: `${site.url}${postImage(p).src}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('Home', 'Početna'), item: `${site.url}${lp('/')}` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}${lp('/blog')}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-spotlight edge-glow relative overflow-hidden pt-16 pb-36 text-white sm:pt-24 sm:pb-44">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-accent uppercase ring-1 ring-white/12">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {t('The WebTano blog', 'WebTano blog')}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]">
              {t('Marketing that brings calls,', 'Marketing koji donosi pozive,')} <span className="text-gradient">{t('explained plainly', 'objašnjen jednostavno')}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-2xl text-lg text-white/75">
              {t(
                'Practical guides on Google Ads, local SEO, AI search and websites for tree services and other local companies. Written from the accounts and sites we run every day.',
                'Praktični vodiči za Google Ads, lokalni SEO, AI pretragu i sajtove za firme za drveće i druge lokalne firme. Pisani iz naloga i sajtova koje vodimo svaki dan.',
              )}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
              <span>
                <span className="font-semibold text-white">{posts.length}</span> {t('guides', 'vodiča')}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />
              <span>{categories.map((c) => categoryLabel(lang, c)).join(' · ')}</span>
              <a href={lp('/blog/rss.xml')} className="inline-flex items-center gap-1.5 transition hover:text-accent">
                <Rss className="h-4 w-4" aria-hidden />
                RSS
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper relative flow-root pb-20 sm:pb-28">
        <div className="relative mx-auto -mt-24 max-w-6xl px-4 sm:-mt-28 sm:px-6">
          <Reveal variant="scale">
            <p className="sr-only">{t('Latest post', 'Najnoviji tekst')}</p>
            <PostCard post={featured} featured />
          </Reveal>

          <div className="mt-16 sm:mt-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">{t('More guides', 'Još vodiča')}</h2>
            </div>
            <BlogGrid categories={counts} cards={rest.map((p) => ({ category: p.category, node: <PostCard post={p} /> }))} />
          </div>
        </div>
      </section>

      <section className="bg-final edge-glow relative overflow-hidden bg-ink-975 py-20 text-white sm:py-24">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {t('Rather have it done for you?', 'Radije biste da to uradimo umesto vas?')}
            </h2>
            <p className="mt-3 text-lg text-white/70">
              {t(
                'We will look at your website, Google profile and ads, and send you a short list of what is costing you calls. Free, no obligation.',
                'Pogledaćemo vaš sajt, Google profil i oglase i poslati vam kratak spisak onoga što vas košta poziva. Besplatno, bez obaveze.',
              )}
            </p>
          </div>
          <Link
            href={lp('/#hero-form')}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-ink-950 shadow-glow transition hover:-translate-y-px hover:bg-accent-dark"
          >
            {t('Get a free website check', 'Zatražite besplatnu proveru')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
