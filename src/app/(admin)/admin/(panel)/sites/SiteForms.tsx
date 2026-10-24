'use client';

import { useActionState, type ReactNode } from 'react';
import { SiteFields } from '@/components/admin/SiteFields';
import type { Site } from '@/lib/admin/types';
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

export function NewSiteForm() {
  const [state, action, pending] = useActionState(createSite, { errors: [] } as SiteFormState);
  return (
    <form action={action} className="card" id="novi">
      <div className="card-header">
        <h2 className="card-title">Dodaj sajt</h2>
      </div>
      <div className="card-body space-y-4">
        <Errors errors={state.errors} />
        {/* A new key remounts the fields with what was typed, after a refused submit. */}
        <SiteFields key={JSON.stringify(state.draft ?? {})} site={state.draft} />
        <button className="btn btn-primary" type="submit" disabled={pending}>
          Dodaj sajt
        </button>
      </div>
    </form>
  );
}

export function EditSiteForm({ site }: { site: Site }) {
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
          Sačuvaj promene
        </button>
      </div>
    </form>
  );
}

export function DeleteSiteForm({ site, children }: { site: Site; children: ReactNode }) {
  const [state, action] = useActionState(deleteSite, { errors: [] } as SiteFormState);
  return (
    <form action={action} className="space-y-3 p-5">
      <input type="hidden" name="id" value={site.id} />
      {children}
      <Errors errors={state.errors} />
      <div className="flex gap-2">
        <input className="form-input" name="confirm" placeholder={site.domain} autoComplete="off" aria-label="Domen za potvrdu brisanja" />
        <button className="btn btn-danger btn-sm" type="submit">
          Obriši sajt
        </button>
      </div>
    </form>
  );
}
