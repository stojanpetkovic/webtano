import type { Metadata } from 'next';
import { findByToken } from '@/lib/admin/newsletter';
import { getI18n } from '@/lib/i18n-site';
import { unsubscribeEmail } from '../actions';
import { NewsletterCard, primary } from '../NewsletterCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t('Unsubscribe', 'Odjava'), robots: { index: false, follow: false } };
}

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ t?: string; r?: string }> }) {
  const { lang, t: tr } = await getI18n();
  const { t = '', r } = await searchParams;
  if (r === 'ok')
    return (
      <NewsletterCard tone="ok" title={tr('You are unsubscribed', 'Odjavljeni ste')}>
        {tr(
          'You will not get any more newsletter emails from us. Changed your mind? You can sign up again at the bottom of any page.',
          'Više vam nećemo slati newsletter. Predomislili ste se? Ponovo se možete prijaviti na dnu bilo koje stranice.',
        )}
      </NewsletterCard>
    );
  const row = r === 'invalid' ? null : await findByToken(t).catch(() => null);
  if (!row)
    return (
      <NewsletterCard tone="error" title={tr('This link is not valid', 'Ovaj link nije ispravan')}>
        {tr(
          'We could not find a subscription for it. If you still get emails from us, reply to one and we will remove you by hand.',
          'Za njega nismo pronašli prijavu. Ako vam i dalje stižu naši emailovi, odgovorite na jedan i ručno ćemo vas ukloniti.',
        )}
      </NewsletterCard>
    );
  if (row.status === 'unsubscribed')
    return (
      <NewsletterCard tone="ok" title={tr('Already unsubscribed', 'Već odjavljeno')}>
        {tr(`${row.email} is not on the list any more.`, `${row.email} više nije na listi.`)}
      </NewsletterCard>
    );
  return (
    <NewsletterCard tone="ask" title={tr('Unsubscribe?', 'Odjaviti se?')}>
      <p>
        {tr('Stop sending the WebTano newsletter to', 'Prestati sa slanjem WebTano newslettera na')}{' '}
        <strong className="text-ink-950">{row.email}</strong>.
      </p>
      <form action={unsubscribeEmail}>
        <input type="hidden" name="t" value={t} />
        <input type="hidden" name="lang" value={lang} />
        <button type="submit" className={primary}>
          {tr('Unsubscribe', 'Odjavi me')}
        </button>
      </form>
    </NewsletterCard>
  );
}
