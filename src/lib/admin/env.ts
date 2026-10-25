// Secrets are read from the host's variables when they are used, not when this
// module loads, so nothing is baked into the build. The names match the old
// backend on stojanpetkovic.com, so both can run from the same variables.
const read = (value: string | undefined) => value?.trim() ?? '';

export const env = {
  get supabaseUrl() {
    return read(process.env.PUBLIC_SUPABASE_URL);
  },
  get supabasePublishableKey() {
    return read(process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  },
  get supabaseSecretKey() {
    return read(process.env.SUPABASE_SECRET_KEY);
  },
  get adminEmail() {
    return read(process.env.ADMIN_EMAIL).toLowerCase();
  },
  get resendApiKey() {
    return read(process.env.RESEND_API_KEY);
  },
  get leadsFromEmail() {
    return read(process.env.LEADS_FROM_EMAIL);
  },
  /** Sender of newsletter emails; falls back to LEADS_FROM_EMAIL. */
  get newsletterFromEmail() {
    return read(process.env.NEWSLETTER_FROM_EMAIL) || read(process.env.LEADS_FROM_EMAIL);
  },
  /** Sender of invoice emails; falls back to LEADS_FROM_EMAIL. */
  get invoicesFromEmail() {
    return read(process.env.INVOICES_FROM_EMAIL) || read(process.env.LEADS_FROM_EMAIL);
  },
  get ownerEmail() {
    return read(process.env.OWNER_EMAIL);
  },
  get ipHashSalt() {
    return read(process.env.IP_HASH_SALT);
  },
  /** The bearer token the Railway cron sends to /api/cron. */
  get cronSecret() {
    return read(process.env.CRON_SECRET);
  },
  get siteUrl() {
    return read(process.env.SITE_URL).replace(/\/$/, '') || 'https://webtano.com';
  },
};
