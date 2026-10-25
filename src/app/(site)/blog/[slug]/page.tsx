import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Check, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { formatDate } from '@/components/blog/date';
import { PostCard } from '@/components/blog/PostCard';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { FaqList } from '@/components/site/FaqList';
import { Reveal } from '@/components/site/Reveal';
import { SwipeRow } from '@/components/site/SwipeRow';
import { findPost, plainText, postImage, posts, readingTime, relatedPosts, toc } from '@/content/blog';
import { site } from '@/content/site';
import { metaDescription, pageTitle } from '@/lib/seo';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  const img = postImage(post);
  return {
    title: pageTitle(post.seoTitle ?? post.title),
    description: metaDescription(post.description),
    keywords: post.keywords,
    authors: [{ name: 'WebTano team', url: site.url }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: post.title,
      description: metaDescription(post.description, 200),
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      section: post.category,
      tags: post.keywords,
      images: [{ url: img.src, width: img.width, height: img.height, alt: img.alt }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: metaDescription(post.description, 200), images: [img.src] },
  };
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const img = postImage(post);
  const contents = toc(post);
  const related = relatedPosts(post);
  const url = `${site.url}/blog/${post.slug}`;
  const minutes = readingTime(post);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        image: { '@type': 'ImageObject', url: `${site.url}${img.src}`, width: img.width, height: img.height },
        datePublished: post.published,
        dateModified: post.updated ?? post.published,
        author: { '@type': 'Organization', name: 'WebTano team', url: site.url },
        publisher: { '@type': 'Organization', name: site.name, url: site.url, logo: { '@type': 'ImageObject', url: `${site.url}/brand/webtano-mark-512.png` } },
        mainEntityOfPage: url,
        articleSection: post.category,
        keywords: post.keywords.join(', '),
        timeRequired: `PT${minutes}M`,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${site.url}/blog#blog` },
        ...(post.sources && { citation: post.sources.map((s) => s.url) }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: post.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress target="article" />

      <article id="article">
        <header className="bg-spotlight edge-glow relative overflow-hidden pt-10 pb-40 text-white sm:pt-14 sm:pb-52">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                <li>
                  <Link href="/blog" className="transition hover:text-white">
                    Blog
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                <li className="text-white/80">{post.category}</li>
              </ol>
            </nav>
            <Reveal>
              <h1 className="mt-7 font-display text-[1.9rem] leading-[1.12] font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.08]">{post.title}</h1>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/72">{post.description}</p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/60">
                <span className="inline-flex items-center gap-2.5 text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/12">
                    <Image src="/brand/webtano-mark.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
                  </span>
                  WebTano team
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent/80" aria-hidden />
                  <time dateTime={post.published}>{formatDate(post.published)}</time>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent/80" aria-hidden />
                  {minutes} min read
                </span>
              </div>
            </Reveal>
          </div>
        </header>

        <div className="bg-paper relative flow-root">
          <div className="relative mx-auto -mt-32 max-w-6xl px-4 sm:-mt-40 sm:px-6">
            <Reveal as="figure" variant="scale">
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-zinc-200 ring-1 ring-black/5 shadow-[0_2px_4px_rgb(10_14_30/0.05),0_24px_48px_-24px_rgb(10_14_30/0.35)]">
                <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 1152px) 72rem, 100vw" className="object-cover" />
              </div>
              {img.photographer && (
                <figcaption className="mt-3 text-right text-xs text-zinc-500">
                  Photo:{' '}
                  <a href={img.photographerUrl || img.sourceUrl} target="_blank" rel="noopener nofollow" className="underline-offset-2 hover:underline">
                    {img.photographer}
                  </a>{' '}
                  on{' '}
                  <a href={img.sourceUrl} target="_blank" rel="noopener nofollow" className="underline-offset-2 hover:underline">
                    {img.source}
                  </a>
                </figcaption>
              )}
            </Reveal>

            <div className="grid gap-12 pt-12 pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
              <div className="mx-auto w-full max-w-[44rem] min-w-0">
                <section aria-labelledby="takeaways" className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200/80 shadow-[0_1px_2px_rgb(10_14_30/0.04),0_8px_24px_-16px_rgb(10_14_30/0.10)] sm:p-7">
                  <h2 id="takeaways" className="font-mono text-[11px] tracking-[0.14em] text-azure-700 uppercase">
                    Key takeaways
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {post.takeaways.map((t) => (
                      <li key={t} className="flex gap-3 leading-relaxed text-zinc-700">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-950 text-accent" aria-hidden>
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="mt-12">
                  <ArticleBody blocks={post.body} />
                </div>

                <section aria-labelledby="faq" className="mt-16">
                  <h2 id="faq" className="scroll-mt-28 font-display text-[1.65rem] font-bold tracking-tight text-ink-950 sm:text-3xl">
                    Frequently asked questions
                  </h2>
                  <div className="mt-6 rounded-3xl bg-white px-5 ring-1 ring-zinc-200/80 sm:px-7">
                    <FaqList items={post.faq} />
                  </div>
                </section>

                {post.sources && (
                  <section aria-labelledby="sources" className="mt-12 border-t border-zinc-200 pt-8">
                    <h2 id="sources" className="font-mono text-[11px] tracking-[0.14em] text-zinc-500 uppercase">
                      Sources
                    </h2>
                    <ul className="mt-4 space-y-2.5 text-sm">
                      {post.sources.map((s) => (
                        <li key={s.url}>
                          <a href={s.url} target="_blank" rel="noopener" className="group inline-flex items-start gap-2 text-zinc-600 transition hover:text-azure-700">
                            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400 group-hover:text-azure-700" aria-hidden />
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <aside className="mt-12 flex flex-col gap-5 rounded-3xl bg-white p-6 ring-1 ring-zinc-200/80 sm:flex-row sm:items-center sm:p-7">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-950">
                    <Image src="/brand/webtano-mark.svg" alt="" width={30} height={30} className="h-[30px] w-[30px]" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-ink-950">Written by the WebTano team</p>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-zinc-600">
                      We build websites and run local SEO and Google Ads for tree services and other local companies, and track every call and form they bring. See{' '}
                      <Link href="/work" className="font-medium text-azure-700 hover:underline">
                        our work
                      </Link>
                      .
                    </p>
                  </div>
                </aside>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-8">
                  <TableOfContents items={contents} />
                  <div className="relative overflow-hidden rounded-2xl bg-ink-950 p-6 text-white">
                    <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-accent/20 blur-2xl" aria-hidden />
                    <p className="font-display text-lg font-bold leading-snug">Want us to check your site?</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">A free, honest look at your website, Google profile and ads.</p>
                    <Link
                      href="/#hero-form"
                      className="group relative mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-accent-dark"
                    >
                      Free website check
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="related" className="bg-final edge-glow relative overflow-hidden bg-ink-975 py-20 text-white sm:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related" className="font-display text-3xl font-bold tracking-tight">
              Keep reading
            </h2>
            <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-white">
              All guides
              <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
          <SwipeRow as="ul" label="Related guides" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </SwipeRow>
          <div className="mt-14 flex flex-col items-start gap-6 rounded-3xl bg-white/[0.04] p-7 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <p className="font-display text-2xl font-bold">Rather have it done for you?</p>
              <p className="mt-2 text-white/70">Start with a free check of your website. Reply within one business day.</p>
            </div>
            <Link
              href="/#hero-form"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-ink-950 shadow-glow transition hover:-translate-y-px hover:bg-accent-dark"
            >
              Get a free website check
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
