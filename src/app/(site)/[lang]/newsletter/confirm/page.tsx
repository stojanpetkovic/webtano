import type { Metadata } from 'next';
import { findByToken } from '@/lib/admin/newsletter';
import { getI18n } from '@/lib/i18n-site';
import { confirmSubscription } from '../actions';
import { NewsletterCard, primary } from '../NewsletterCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('Confirm your subscription', 'Potvrdite prijavu'), robots: { index: false, follow: false } };
}

// A button rather than confirming on load: mail scanners open links on their own, and only a person should confirm.
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ t?: string; r?: string }> }) {
  const { lang, t: tr } = await getI18n();
  const { t = '', r } = await searchParams;
  if (r === 'ok')
    return (
      <NewsletterCard tone="ok" title={tr('You are subscribed', 'Prijavljeni ste')}>
        {tr(
          'Thanks for confirming. About once a month you will get one short, practical email from us. Every email has a one-click unsubscribe link.',
          'Hvala na potvrdi. Otprilike jednom mesečno stići će vam jedan kratak, praktičan email od nas. Svaki email ima link za odjavu jednim klikom.',
        )}
      </NewsletterCard>
    );
  const row = r === 'invalid' ? null : await findByToken(t).catch(() => null);
  if (!row || row.status === 'unsubscribed')
    return (
      <NewsletterCard tone="error" title={tr('This link is no longer valid', 'Ovaj link više ne važi')}>
        {tr(
          'It may have expired or been replaced by a newer one. You can sign up again at the bottom of any page.',
          'Možda je istekao ili ga je zamenio noviji. Ponovo se možete prijaviti na dnu bilo koje stranice.',
        )}
      </NewsletterCard>
    );
  if (row.status === 'confirmed')
    return (
      <NewsletterCard tone="ok" title={tr('Already confirmed', 'Već potvrđeno')}>
        {tr(`${row.email} is already on the list. Nothing else to do.`, `${row.email} je već na listi. Ne treba ništa više.`)}
      </NewsletterCard>
    );
  return (
    <NewsletterCard tone="ask" title={tr('Confirm your subscription', 'Potvrdite prijavu')}>
      <p>
        {tr('Subscribe', 'Prijaviti')} <strong className="text-ink-950">{row.email}</strong>{' '}
        {tr('to the WebTano newsletter, about one email a month?', 'na WebTano newsletter, otprilike jedan email mesečno?')}
      </p>
      <form action={confirmSubscription}>
        <input type="hidden" name="t" value={t} />
        <input type="hidden" name="lang" value={lang} />
        <button type="submit" className={primary}>
          {tr('Yes, subscribe me', 'Da, prijavi me')}
        </button>
      </form>
    </NewsletterCard>
  );
}
