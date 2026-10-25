import Link from 'next/link';
import type { ReactNode } from 'react';
import { CheckCircle2, CircleAlert, Mail } from 'lucide-react';

/** The one card the confirm and unsubscribe pages show. */
export function NewsletterCard({ tone, title, children }: { tone: 'ask' | 'ok' | 'error'; title: string; children: ReactNode }) {
  const Icon = tone === 'ok' ? CheckCircle2 : tone === 'error' ? CircleAlert : Mail;
  return (
    <section className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="rounded-3xl bg-white p-7 text-center ring-1 ring-zinc-200 sm:p-9">
          <span
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
              tone === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-accent/10 text-accent-dark'
            }`}
            aria-hidden
          >
            <Icon className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink-950">{title}</h1>
          <div className="mt-3 text-[15px] leading-relaxed text-zinc-600">{children}</div>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-zinc-500 underline-offset-2 hover:text-ink-950 hover:underline">
            Back to webtano.com
          </Link>
        </div>
      </div>
    </section>
  );
}

export const primary =
  'mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-ink-950 px-6 text-[15px] font-semibold text-white transition hover:bg-ink-800';
