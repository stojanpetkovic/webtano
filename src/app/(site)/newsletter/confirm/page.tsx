import type { Metadata } from 'next';
import { findByToken } from '@/lib/admin/newsletter';
import { confirmSubscription } from '../actions';
import { NewsletterCard, primary } from '../NewsletterCard';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Confirm your subscription', robots: { index: false, follow: false } };

// A button rather than confirming on load: mail scanners open links on their own, and only a person should confirm.
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ t?: string; r?: string }> }) {
  const { t = '', r } = await searchParams;
  if (r === 'ok')
    return (
      <NewsletterCard tone="ok" title="You are subscribed">
        Thanks for confirming. About once a month you will get one short, practical email from us. Every email has a one-click unsubscribe link.
      </NewsletterCard>
    );
  const row = r === 'invalid' ? null : await findByToken(t).catch(() => null);
  if (!row || row.status === 'unsubscribed')
    return (
      <NewsletterCard tone="error" title="This link is no longer valid">
        It may have expired or been replaced by a newer one. You can sign up again at the bottom of any page.
      </NewsletterCard>
    );
  if (row.status === 'confirmed')
    return (
      <NewsletterCard tone="ok" title="Already confirmed">
        {row.email} is already on the list. Nothing else to do.
      </NewsletterCard>
    );
  return (
    <NewsletterCard tone="ask" title="Confirm your subscription">
      <p>
        Subscribe <strong className="text-ink-950">{row.email}</strong> to the WebTano newsletter, about one email a month?
      </p>
      <form action={confirmSubscription}>
        <input type="hidden" name="t" value={t} />
        <button type="submit" className={primary}>
          Yes, subscribe me
        </button>
      </form>
    </NewsletterCard>
  );
}
