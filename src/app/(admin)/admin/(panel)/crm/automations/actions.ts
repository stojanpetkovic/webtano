'use server';

import { redirect } from 'next/navigation';
import { refresh } from 'next/cache';
import { db } from '@/lib/admin/supabase';
import { deliver } from '@/lib/admin/automation/outbox';
import { isAutomation } from '@/lib/admin/automation/registry';
import { automationSettings, runAutomations } from '@/lib/admin/automation/run';

const PATH = '/admin/crm/automations';

/** Turns one automation on or off, or switches it between sending at once and waiting for approval. */
export async function saveAutomation(form: FormData) {
  const key = String(form.get('key') ?? '');
  if (key !== 'all' && !isAutomation(key)) return;
  const current = (await automationSettings())[key];
  const enabled = form.has('enabled') ? form.get('enabled') === '1' : current.enabled;
  const mode = form.get('mode') === 'approve' ? 'approve' : form.get('mode') === 'auto' ? 'auto' : current.mode;
  await db().from('crm_automations').upsert({ key, enabled, mode, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  refresh();
}

/** The "Pokreni sada" button: the same pass the hourly cron makes. */
export async function runNow() {
  const summary = await runAutomations();
  if (summary.paused) redirect(`${PATH}?notice=paused`);
  const totals = { sent: 0, pending: 0, failed: 0 };
  for (const j of Object.values(summary.jobs)) {
    if ('sent' in j) {
      totals.sent += j.sent;
      totals.pending += j.pending;
      totals.failed += j.failed;
    } else if ('error' in j) totals.failed++;
  }
  redirect(`${PATH}?notice=ran&sent=${totals.sent}&pending=${totals.pending}&failed=${totals.failed}`);
}

const outboxId = (form: FormData) => {
  const id = String(form.get('id') ?? '');
  return /^[0-9a-f-]{36}$/.test(id) ? id : null;
};

/** Sends an email that waited for approval, or one that failed, again. */
export async function sendOutbox(form: FormData) {
  const id = outboxId(form);
  if (id) await deliver(id);
  refresh();
}

export async function skipOutbox(form: FormData) {
  const id = outboxId(form);
  if (id) await db().from('crm_outbox').update({ status: 'skipped' }).eq('id', id).in('status', ['pending', 'failed']);
  refresh();
}
