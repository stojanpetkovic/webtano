import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { postImage, readingTime, type Post } from '@/content/blog';
import { formatDate } from './date';

/** A post in a grid: photo, category, title, excerpt and date. */
export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const img = postImage(post);
  return (
    <article
      className={`press group relative flex h-full overflow-hidden rounded-3xl bg-white ring-1 ring-zinc-200/80 shadow-[0_1px_2px_rgb(10_14_30/0.04),0_8px_24px_-14px_rgb(10_14_30/0.10)] transition duration-300 hover:-translate-y-0.5 hover:ring-zinc-300 hover:shadow-[0_1px_2px_rgb(10_14_30/0.05),0_16px_32px_-16px_rgb(10_14_30/0.18)] ${
        featured ? 'flex-col lg:grid lg:grid-cols-[1.15fr_1fr]' : 'flex-col'
      }`}
    >
      <div className={`relative overflow-hidden bg-zinc-100 ${featured ? 'aspect-[16/9] lg:aspect-auto lg:min-h-[23rem]' : 'aspect-[16/9]'}`}>
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority={featured}
          sizes={featured ? '(min-width: 1024px) 38rem, 100vw' : '(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw'}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-9 lg:justify-center' : 'p-6'}`}>
        <p className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-azure-50 px-2.5 py-1 font-medium text-azure-700 ring-1 ring-azure-100">{post.category}</span>
          <span className="text-zinc-500">{readingTime(post)} min read</span>
        </p>
        <h2 className={`mt-4 font-display font-bold tracking-tight text-balance text-ink-950 ${featured ? 'text-2xl sm:text-[2rem] sm:leading-tight' : 'text-xl leading-snug'}`}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        <p className={`mt-3 text-zinc-600 ${featured ? 'text-base leading-relaxed sm:text-lg' : 'line-clamp-3 text-[0.9375rem] leading-relaxed'}`}>{post.description}</p>
        <div className="mt-auto flex items-center justify-between pt-6">
          <time dateTime={post.published} className="text-sm text-zinc-500">
            {formatDate(post.published)}
          </time>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-ink-950 ring-1 ring-zinc-200 transition duration-300 group-hover:bg-ink-950 group-hover:text-accent group-hover:ring-ink-950" aria-hidden>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
