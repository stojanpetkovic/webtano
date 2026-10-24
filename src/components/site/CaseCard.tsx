import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/content/work';

export function CaseCard({ item }: { item: CaseStudy }) {
  const shot = item.shots[0];
  return (
    <Link
      href={`/work/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(min-width: 768px) 34rem, 100vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-zinc-500">
          {item.sector} · {item.location}
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold text-forest-950">{item.client}</h3>
        <p className="mt-4 font-display text-4xl font-bold text-forest-700">{item.headline.value}</p>
        <p className="text-sm text-zinc-600">{item.headline.label}</p>
        <p className="mt-4 flex-1 text-zinc-600">{item.summary}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-forest-700">
          Read the case study
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
