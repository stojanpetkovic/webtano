import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PageHeading } from '@/components/admin/PageHeading';
import { SiteHeader } from '@/components/admin/SiteHeader';
import { CopyButton } from '@/components/admin/CopyButton';
import { db } from '@/lib/admin/supabase';
import { env } from '@/lib/admin/env';
import type { Site } from '@/lib/admin/types';
import { rotateKey } from '../../actions';
import { DeleteSiteForm, EditSiteForm } from '../../SiteForms';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Podešavanja' };

const NOTICES: Record<string, string> = {
  created: 'Sajt je dodat. Ugradi kod ispod na sve stranice sajta.',
  saved: 'Podešavanja su sačuvana.',
  rotated: 'Novi ključ je napravljen. Zameni kod na sajtu — stari ključ više ne radi.',
};

export default async function SiteSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { id } = await params;
  const notice = NOTICES[(await searchParams).notice ?? ''] ?? '';
  const { data: site } = /^[0-9a-f-]{36}$/.test(id)
    ? await db().from('sites').select('*').eq('id', id).maybeSingle<Site>()
    : { data: null };
  if (!site) redirect('/admin/sites');

  const snippet = `<script src="${env.siteUrl}/leads.js" data-site-key="${site.site_key}" defer></script>`;

  return (
    <>
      <PageHeading
        title="Podešavanja"
        crumbs={[
          { label: 'Sajtovi', href: '/admin/sites' },
          { label: site.name, href: `/admin/sites/${site.id}` },
        ]}
      />
      <SiteHeader site={site} current="settings" />

      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}

      {/* Each section: what it is on the left, the controls on the right. */}
      <section id="kod" className="grid gap-5 lg:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold">Kod za ugradnju</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Jedna linija na svim stranicama sajta hvata forme i broji posete. Najlakše je staviti je u zajednički layout ili futer, pre{' '}
            <code>&lt;/body&gt;</code>.
          </p>
        </div>
        <div className="card lg:col-span-2">
          <div className="card-body space-y-4">
            <div className="flex gap-2">
              <input className="form-input font-mono text-xs" readOnly value={snippet} aria-label="Kod za ugradnju" />
              <CopyButton value={snippet} />
            </div>
            <ul className="list-inside list-disc space-y-1.5 text-[13px] text-zinc-600">
              <li>
                Formu koju ne treba pratiti označi sa <code>data-lead-ignore</code>. Forme sa lozinkom i pretraga se preskaču same.
              </li>
              <li>
                Ime forme u izveštajima: <code>data-lead-form=&quot;rezervacija&quot;</code>, inače se koristi id forme.
              </li>
              <li>
                Čitljivo ime polja u lidu: <code>data-lead-name=&quot;phone&quot;</code> (za forme sa poljima tipa text_1).
              </li>
              <li>
                Zaštita od botova: skriveno polje <code>&lt;input name=&quot;website_hp&quot; tabindex=&quot;-1&quot; autocomplete=&quot;off&quot; hidden&gt;</code>.
              </li>
              <li>
                Brojanje poseta se isključuje sa <code>data-pageviews=&quot;off&quot;</code> na tagu.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <hr className="border-zinc-200" />

      <section className="grid gap-5 lg:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold">Podešavanja sajta</h2>
          <p className="mt-1 text-sm text-zinc-500">Domen sa kog se primaju forme, kome stižu emailovi, na kom jeziku i po kom vremenu.</p>
        </div>
        <EditSiteForm key={JSON.stringify(site)} site={site} />
      </section>

      <hr className="border-zinc-200" />

      <section className="grid gap-5 lg:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold text-red-600">Opasna zona</h2>
          <p className="mt-1 text-sm text-zinc-500">Radnje koje se ne mogu poništiti.</p>
        </div>
        <div className="card divide-y divide-red-200 border border-red-200 lg:col-span-2">
          <form action={rotateKey} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <input type="hidden" name="id" value={site.id} />
            <div className="max-w-md">
              <p className="text-sm font-semibold text-zinc-800">Napravi novi ključ</p>
              <p className="text-[13px] text-zinc-500">Ako je stari ključ zloupotrebljen. Kod na sajtu mora da se zameni, stari prestaje da radi odmah.</p>
            </div>
            <button className="btn btn-outline btn-sm" type="submit">
              Novi ključ
            </button>
          </form>
          <DeleteSiteForm site={site}>
            <div>
              <p className="text-sm font-semibold text-zinc-800">Obriši sajt</p>
              <p className="text-[13px] text-zinc-500">
                Trajno briše sajt, <strong>sve njegove lidove i statistiku poseta</strong>. Upiši <code>{site.domain}</code> za potvrdu.
              </p>
            </div>
          </DeleteSiteForm>
        </div>
      </section>
    </>
  );
}
