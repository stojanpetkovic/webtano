import { db } from '../supabase';
import { syncDeals } from '../crm/data';
import { appSettings, type AppSettings } from '../settings';
import { morningDigest, unansweredLeads } from './jobs';
import type { QueueResult } from './outbox';
import { AUTOMATIONS, type AutomationKey, type AutomationSetting, type Mode } from './registry';

const JOBS: Record<AutomationKey, (now: Date, mode: Mode, settings: AppSettings) => Promise<QueueResult[]>> = {
  'morning-digest': morningDigest,
  'unanswered-lead': unansweredLeads,
};

export type RunSummary =
  | { paused: true }
  | { paused: false; jobs: Record<string, { sent: number; pending: number; failed: number } | { error: string } | { off: true }> };

/** Each automation's switch and mode, with the defaults for any row not saved yet. */
export async function automationSettings(): Promise<Record<string, AutomationSetting>> {
  const { data } = await db().from('crm_automations').select('key, enabled, mode, last_run_at');
  const saved = new Map(((data ?? []) as AutomationSetting[]).map((r) => [r.key, r]));
  const all: Record<string, AutomationSetting> = { all: saved.get('all') ?? { key: 'all', enabled: true, mode: 'auto', last_run_at: null } };
  for (const [key, a] of Object.entries(AUTOMATIONS)) all[key] = saved.get(key) ?? { key, enabled: true, mode: a.defaultMode, last_run_at: null };
  return all;
}

/**
 * One pass of every automation, as the hourly cron calls it. Each job decides for
 * itself whether it is due, and one failing job never stops the others.
 */
export async function runAutomations(now = new Date()): Promise<RunSummary> {
  const [settings, app] = await Promise.all([automationSettings(), appSettings()]);
  if (!settings.all.enabled) return { paused: true };
  // New form leads first, so the jobs see them.
  await syncDeals().catch((err) => console.error('syncDeals before automations failed:', err));

  const jobs: Extract<RunSummary, { paused: false }>['jobs'] = {};
  for (const key of Object.keys(JOBS) as AutomationKey[]) {
    const s = settings[key];
    if (!s.enabled) {
      jobs[key] = { off: true };
      continue;
    }
    try {
      const results = await JOBS[key](now, s.mode, app);
      jobs[key] = {
        sent: results.filter((r) => r === 'sent').length,
        pending: results.filter((r) => r === 'pending').length,
        failed: results.filter((r) => r === 'failed').length,
      };
    } catch (err) {
      console.error(`automation ${key} failed:`, err);
      jobs[key] = { error: err instanceof Error ? err.message : String(err) };
    }
    await db().from('crm_automations').upsert({ key, enabled: s.enabled, mode: s.mode, last_run_at: now.toISOString() }, { onConflict: 'key' });
  }
  return { paused: false, jobs };
}
