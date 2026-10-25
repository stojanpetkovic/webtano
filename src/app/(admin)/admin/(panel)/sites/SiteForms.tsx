'use client';

import { useActionState, type ReactNode } from 'react';
import { SiteFields } from '@/components/admin/SiteFields';
import type { Site } from '@/lib/admin/types';
import { useT } from '@/components/i18n/LangProvider';
import { createSite, deleteSite, saveSite, type SiteFormState } from './actions';

function Errors({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <ul className="alert alert-danger list-disc list-inside" role="alert">
      {errors.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul>
  );
}

/** Adds a site for one customer, inside the pop-up on the customer's page. */
export function NewSiteForm({ customerId, clientName }: { customerId: string; clientName: string }) {
  const t = useT();
  const [state, action, pending] = useActionState(createSite, { errors: [] } as SiteFormState);
  return (
    // The pop-up stays open, so a refused domain shows its error; a saved site opens its settings.
    <form action={action} className="space-y-4" onSubmit={(e) => e.stopPropagation()}>
      <input type="hidden" name="customer_id" value={customerId} />
      <Errors errors={state.errors} />
      {/* A new key remounts the fields with what was typed, after a refused submit. */}
      <SiteFields key={JSON.stringify(state.draft ?? {})} site={state.draft ?? { client_name: clientName }} idPrefix="site-" />
      <div className="flex justify-end border-t border-line pt-4">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? t('Adding…', 'Dodajem…') : t('Add site', 'Dodaj sajt')}
        </button>
      </div>
    </form>
  );
}

export function EditSiteForm({ site }: { site: Site }) {
  const t = useT();
  const [state, action, pending] = useActionState(saveSite, { errors: [] } as SiteFormState);
  return (
    <form action={action} className="card lg:col-span-2">
      <input type="hidden" name="id" value={site.id} />
      <div className="card-body space-y-4">
        <Errors errors={state.errors} />
        <SiteFields site={site} showActive />
      </div>
      <div className="flex justify-end border-t border-zinc-200 px-5 py-3">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {t('Save changes', 'Sačuvaj promene')}
        </button>
      </div>
    </form>
  );
}

export function DeleteSiteForm({ site, children }: { site: Site; children: ReactNode }) {
  const t = useT();
  const [state, action] = useActionState(deleteSite, { errors: [] } as SiteFormState);
  return (
    <form action={action} className="space-y-3 p-5">
      <input type="hidden" name="id" value={site.id} />
      {children}
      <Errors errors={state.errors} />
      <div className="flex gap-2">
        <input className="form-input" name="confirm" placeholder={site.domain} autoComplete="off" aria-label={t('Domain to confirm deletion', 'Domen za potvrdu brisanja')} />
        <button className="btn btn-danger btn-sm" type="submit">
          {t('Delete site', 'Obriši sajt')}
        </button>
      </div>
    </form>
  );
}
