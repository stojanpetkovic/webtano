/** Every automation the cron runs, with how it starts out before it is changed in the admin. */
export const AUTOMATIONS = {
  'morning-digest': {
    label: 'Jutarnji pregled',
    description:
      'Radnim danom ujutru (vreme menjaš u Podešavanjima): novi lidovi, rokovi za sledeći korak i zadaci za danas ili koji kasne. Ne šalje se kad nema ničega.',
    audience: 'owner',
    defaultMode: 'auto',
  },
  'unanswered-lead': {
    label: 'Lid bez odgovora',
    description: 'Lid sa forme stoji u fazi Novi (24 sata, menja se u Podešavanjima), a na njemu nema nijedne tvoje beleške, poziva ni emaila.',
    audience: 'owner',
    defaultMode: 'auto',
  },
} as const;

export type AutomationKey = keyof typeof AUTOMATIONS;
export type Mode = 'auto' | 'approve';

export interface AutomationSetting {
  key: string;
  enabled: boolean;
  mode: Mode;
  last_run_at: string | null;
}

export interface OutboxRow {
  id: string;
  kind: string;
  dedupe_key: string;
  to_email: string;
  subject: string;
  html: string;
  text: string;
  reply_to: string | null;
  status: 'pending' | 'sending' | 'sent' | 'skipped' | 'failed';
  error: string | null;
  provider_id: string | null;
  customer_id: string | null;
  deal_id: string | null;
  created_at: string;
  sent_at: string | null;
}

export const isAutomation = (key: string): key is AutomationKey => key in AUTOMATIONS;
