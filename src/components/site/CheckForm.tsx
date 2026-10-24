'use client';

import { useActionState, useRef } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { submitCheck, type CheckState } from '@/app/(site)/actions';

const SERVICES = [
  { value: 'new-website', label: 'A new website' },
  { value: 'redesign', label: 'A redesign' },
  { value: 'seo', label: 'Local SEO' },
  { value: 'ads', label: 'Google Ads' },
  { value: 'other', label: 'Something else' },
];

const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'In 1 to 3 months' },
  { value: 'exploring', label: 'Just exploring' },
];

const input =
  'mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/20 focus:outline-none';
const label = 'text-sm font-medium text-zinc-800';

export function CheckForm() {
  const [state, action, pending] = useActionState<CheckState, FormData>(submitCheck, { ok: false });
  const utmRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);

  // leads.js keeps the first campaign and referrer the visitor came with; send them along.
  function attachAttribution() {
    try {
      const saved = JSON.parse(localStorage.getItem('sp_lead_attribution') || 'null');
      if (saved && utmRef.current && referrerRef.current) {
        utmRef.current.value = JSON.stringify(saved.utm || {});
        referrerRef.current.value = saved.referrer || '';
      }
    } catch {
      // Storage blocked: send the form without attribution.
    }
  }

  if (state.ok) {
    return (
      <div className="rounded-3xl border border-forest-100 bg-white p-8 text-center shadow-xl sm:p-10" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forest-700" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-bold text-forest-950">Thank you, your request is in</h3>
        <p className="mt-3 text-zinc-600">
          We will review your website and your local competitors and reply within one business day with concrete next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={attachAttribution}
      data-lead-ignore
      className="rounded-3xl border border-forest-100 bg-white p-6 shadow-xl sm:p-8"
    >
      <fieldset>
        <legend className={label}>What do you need?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICES.map((s, i) => (
            <label key={s.value} className="cursor-pointer">
              <input type="radio" name="service" value={s.value} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-block rounded-full border border-zinc-300 px-3.5 py-1.5 text-sm text-zinc-700 transition peer-checked:border-forest-700 peer-checked:bg-forest-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-forest-700/40">
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="website" className={label}>
            Current website
          </label>
          <input id="website" name="website" placeholder="yourbusiness.com" className={input} autoComplete="url" />
        </div>
        <div>
          <label htmlFor="business" className={label}>
            Business and city
          </label>
          <input id="business" name="business" placeholder="Tree service in Tampa" className={input} />
        </div>
        <div>
          <label htmlFor="name" className={label}>
            Your name
          </label>
          <input id="name" name="name" required minLength={2} className={input} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={input} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone <span className="font-normal text-zinc-500">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" className={input} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="timeline" className={label}>
            When would you like to start?
          </label>
          <select id="timeline" name="timeline" className={input} defaultValue="asap">
            {TIMELINES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className={label}>
          Anything else we should know? <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={3} className={input} />
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div className="hidden" aria-hidden>
        <label>
          Company URL
          <input name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={utmRef} type="hidden" name="utm" />
      <input ref={referrerRef} type="hidden" name="referrer" />

      {state.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 font-semibold text-white transition hover:bg-forest-800 disabled:opacity-70"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {pending ? 'Sending…' : 'Get my free website check'}
      </button>
      <p className="mt-3 text-center text-xs text-zinc-500">
        We use your details only to reply to you. See our{' '}
        <a href="/privacy" className="underline">
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}
