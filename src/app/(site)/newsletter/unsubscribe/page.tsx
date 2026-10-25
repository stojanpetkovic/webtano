import type { Metadata } from 'next';
import { findByToken } from '@/lib/admin/newsletter';
import { unsubscribeEmail } from '../actions';
import { NewsletterCard, primary } from '../NewsletterCard';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Unsubscribe', robots: { index: false, follow: false } };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ t?: string; r?: string }> }) {
  const { t = '', r } = await searchParams;
  if (r === 'ok')
    return (
      <NewsletterCard tone="ok" title="You are unsubscribed">
        You will not get any more newsletter emails from us. Changed your mind? You can sign up again at the bottom of any page.
      </NewsletterCard>
    );
  const row = r === 'invalid' ? null : await findByToken(t).catch(() => null);
  if (!row)
    return (
      <NewsletterCard tone="error" title="This link is not valid">
        We could not find a subscription for it. If you still get emails from us, reply to one and we will remove you by hand.
      </NewsletterCard>
    );
  if (row.status === 'unsubscribed')
    return (
      <NewsletterCard tone="ok" title="Already unsubscribed">
        {row.email} is not on the list any more.
      </NewsletterCard>
    );
  return (
    <NewsletterCard tone="ask" title="Unsubscribe?">
      <p>
        Stop sending the WebTano newsletter to <strong className="text-ink-950">{row.email}</strong>.
      </p>
      <form action={unsubscribeEmail}>
        <input type="hidden" name="t" value={t} />
        <button type="submit" className={primary}>
          Unsubscribe
        </button>
      </form>
    </NewsletterCard>
  );
}
