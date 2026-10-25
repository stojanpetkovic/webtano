import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PageHeading } from '@/components/admin/PageHeading';
import { SiteHeader } from '@/components/admin/SiteHeader';
import { siteCustomer } from '@/lib/admin/crm/data';
import { CopyButton } from '@/components/admin/CopyButton';
import { db } from '@/lib/admin/supabase';
import { env } from '@/lib/admin/env';
import type { Site } from '@/lib/admin/types';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { T } from '@/lib/i18n';
import { rotateKey } from '../../actions';
import { DeleteSiteForm, EditSiteForm } from '../../SiteForms';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getAdminI18n();
  return { title: t('Settings', 'Podešavanja') };
}

const notices = (t: T): Record<string, string> => ({
  created: t('The site was added. Put the code below on every page of the site.', 'Sajt je dodat. Ugradi kod ispod na sve stranice sajta.'),
  saved: t('Settings saved.', 'Podešavanja su sačuvana.'),
  rotated: t('A new key was made. Replace the code on the site — the old key stops working.', 'Novi ključ je napravljen. Zameni kod na sajtu — stari ključ više ne radi.'),
});

export default async function SiteSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { lang, t } = await getAdminI18n();
  const { id } = await params;
  const notice = notices(t)[(await searchParams).notice ?? ''] ?? '';
  const { data: site } = /^[0-9a-f-]{36}$/.test(id)
    ? await db().from('sites').select('*').eq('id', id).maybeSingle<Site>()
    : { data: null };
  if (!site) redirect('/admin/sites');

  const snippet = `<script src="${env.siteUrl}/leads.js" data-site-key="${site.site_key}" defer></script>`;

  return (
    <>
      <PageHeading
        title={t('Settings', 'Podešavanja')}
        crumbs={[
          { label: t('Sites', 'Sajtovi'), href: '/admin/sites' },
          { label: site.name, href: `/admin/sites/${site.id}` },
        ]}
      />
      <SiteHeader site={site} customer={await siteCustomer(site.id, lang)} current="settings" />

      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}

      {/* Each section: what it is on the left, the controls on the right. */}
      <section id="kod" className="grid gap-5 lg:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold">{t('Embed code', 'Kod za ugradnju')}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {t(
              'One line on every page of the site captures forms and counts visits. The easiest place is the shared layout or footer, before',
              'Jedna linija na svim stranicama sajta hvata forme i broji posete. Najlakše je staviti je u zajednički layout ili futer, pre',
            )}{' '}
            <code>&lt;/body&gt;</code>.
          </p>
        </div>
        <div className="card lg:col-span-2">
          <div className="card-body space-y-4">
            <div className="flex gap-2">
              <input className="form-input font-mono text-xs" readOnly value={snippet} aria-label={t('Embed code', 'Kod za ugradnju')} />
              <CopyButton value={snippet} />
            </div>
            <ul className="list-inside list-disc space-y-1.5 text-[13px] text-zinc-600">
              <li>
                {t('Mark a form that should not be tracked with', 'Formu koju ne treba pratiti označi sa')} <code>data-lead-ignore</code>.{' '}
                {t('Password forms and search are skipped on their own.', 'Forme sa lozinkom i pretraga se preskaču same.')}
              </li>
              <li>
                {t('Form name in reports:', 'Ime forme u izveštajima:')} <code>data-lead-form=&quot;{t('booking', 'rezervacija')}&quot;</code>
                {t(', otherwise the form id is used.', ', inače se koristi id forme.')}
              </li>
              <li>
                {t('Readable field name in the lead:', 'Čitljivo ime polja u lidu:')} <code>data-lead-name=&quot;phone&quot;</code>{' '}
                {t('(for forms with fields like text_1).', '(za forme sa poljima tipa text_1).')}
              </li>
              <li>
                {t('Bot protection: a hidden field', 'Zaštita od botova: skriveno polje')}{' '}
                <code>&lt;input name=&quot;website_hp&quot; tabindex=&quot;-1&quot; autocomplete=&quot;off&quot; hidden&gt;</code>.
              </li>
              <li>
                {t('Visit counting is turned off with', 'Brojanje poseta se isključuje sa')} <code>data-pageviews=&quot;off&quot;</code>{' '}
                {t('on the tag.', 'na tagu.')}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="border-zinc-200" />

      <section className="grid gap-5 lg:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold">{t('Site settings', 'Podešavanja sajta')}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {t(
              'The domain forms are accepted from, who gets the emails, in which language and time zone.',
              'Domen sa kog se primaju forme, kome stižu emailovi, na kom jeziku i po kom vremenu.',
            )}
          </p>
        </div>
        <EditSiteForm key={JSON.stringify(site)} site={site} />
      </section>

      <hr className="border-zinc-200" />

      <section className="grid gap-5 lg:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold text-red-600">{t('Danger zone', 'Opasna zona')}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t('Actions that cannot be undone.', 'Radnje koje se ne mogu poništiti.')}</p>
        </div>
        <div className="card divide-y divide-red-200 border border-red-200 lg:col-span-2">
          <form action={rotateKey} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <input type="hidden" name="id" value={site.id} />
            <div className="max-w-md">
              <p className="text-sm font-semibold text-zinc-800">{t('Make a new key', 'Napravi novi ključ')}</p>
              <p className="text-[13px] text-zinc-500">
                {t(
                  'If the old key was misused. The code on the site has to be replaced; the old one stops working at once.',
                  'Ako je stari ključ zloupotrebljen. Kod na sajtu mora da se zameni, stari prestaje da radi odmah.',
                )}
              </p>
            </div>
            <button className="btn btn-outline btn-sm" type="submit">
              {t('New key', 'Novi ključ')}
            </button>
          </form>
          <DeleteSiteForm site={site}>
            <div>
              <p className="text-sm font-semibold text-zinc-800">{t('Delete site', 'Obriši sajt')}</p>
              <p className="text-[13px] text-zinc-500">
                {t('Permanently deletes the site,', 'Trajno briše sajt,')}{' '}
                <strong>{t('all its leads and visit stats', 'sve njegove lidove i statistiku poseta')}</strong>. {t('Type', 'Upiši')}{' '}
                <code>{site.domain}</code> {t('to confirm.', 'za potvrdu.')}
              </p>
            </div>
          </DeleteSiteForm>
        </div>
      </section>
    </>
  );
}
