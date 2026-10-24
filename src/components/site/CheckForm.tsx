'use client';

import { useActionState, useRef } from 'react';
import { CheckCircle2, Loader2, Lock } from 'lucide-react';
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
  'mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-zinc-900 placeholder:text-zinc-400 shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] transition hover:border-zinc-400 focus:border-forest-700 focus:ring-4 focus:ring-forest-700/15 focus:outline-none';
const label = 'text-sm font-medium text-zinc-800';

export function CheckForm({ compact = false }: { compact?: boolean }) {
  // Two copies of the form can sit on one page, so field ids get a prefix.
  const id = (name: string) => (compact ? `hero-${name}` : name);
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
      <div className="rounded-3xl border border-forest-100 bg-white p-8 text-center text-zinc-700 shadow-float sm:p-10" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 ring-8 ring-forest-50/50">
          <CheckCircle2 className="h-9 w-9 text-forest-700" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-forest-950">Thank you, your request is in</h3>
        <p className="mt-3 text-zinc-600">
          We will review your website and your local competitors and reply within one business day with concrete next steps.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <form
        id="hero-form"
        action={action}
        onSubmit={attachAttribution}
        data-lead-ignore
        className="scroll-mt-24 rounded-3xl border border-white/10 bg-white p-6 text-zinc-700 shadow-float shadow-black/40 sm:p-7"
      >
        <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-forest-700 uppercase">Free website check</p>
        <p className="mt-2 font-display text-2xl text-forest-950">See what your site is costing you</p>
        <p className="mt-1.5 text-sm text-zinc-500">A real review of your site and your top competitors, within one business day.</p>
        <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor={id('name')} className={label}>
              Your name
            </label>
            <input id={id('name')} name="name" required minLength={2} className={input} autoComplete="name" />
          </div>
          <div>
            <label htmlFor={id('email')} className={label}>
              Email
            </label>
            <input id={id('email')} name="email" type="email" required className={input} autoComplete="email" />
          </div>
          <div>
            <label htmlFor={id('website')} className={label}>
              Current website
            </label>
            <input id={id('website')} name="website" placeholder="yourbusiness.com" className={input} autoComplete="url" />
          </div>
          <div>
            <label htmlFor={id('business')} className={label}>
              Business and city
            </label>
            <input id={id('business')} name="business" placeholder="Tree service in Tampa" className={input} />
          </div>
        </div>
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
          className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-semibold text-forest-950 shadow-glow transition hover:-translate-y-px hover:bg-lime-dark disabled:translate-y-0 disabled:opacity-70"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {pending ? 'Sending…' : 'Get my free website check'}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-500">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          No obligation. We use your details only to reply.
        </p>
      </form>
    );
  }

  return (
    <form
      action={action}
      onSubmit={attachAttribution}
      data-lead-ignore
      className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-float sm:p-8"
    >
      <fieldset>
        <legend className={label}>What do you need?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICES.map((s, i) => (
            <label key={s.value} className="cursor-pointer">
              <input type="radio" name="service" value={s.value} defaultChecked={i === 0} className="peer sr-only" />
              <span className="inline-block rounded-full border border-zinc-300 px-3.5 py-1.5 text-sm text-zinc-700 transition hover:border-forest-600 hover:text-forest-800 peer-checked:border-forest-700 peer-checked:bg-forest-700 peer-checked:shadow-soft peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-forest-700/40">
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id('website')} className={label}>
            Current website
          </label>
          <input id={id('website')} name="website" placeholder="yourbusiness.com" className={input} autoComplete="url" />
        </div>
        <div>
          <label htmlFor={id('business')} className={label}>
            Business and city
          </label>
          <input id={id('business')} name="business" placeholder="Tree service in Tampa" className={input} />
        </div>
        <div>
          <label htmlFor={id('name')} className={label}>
            Your name
          </label>
          <input id={id('name')} name="name" required minLength={2} className={input} autoComplete="name" />
        </div>
        <div>
          <label htmlFor={id('email')} className={label}>
            Email
          </label>
          <input id={id('email')} name="email" type="email" required className={input} autoComplete="email" />
        </div>
        <div>
          <label htmlFor={id('phone')} className={label}>
            Phone <span className="font-normal text-zinc-500">(optional)</span>
          </label>
          <input id={id('phone')} name="phone" type="tel" className={input} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor={id('timeline')} className={label}>
            When would you like to start?
          </label>
          <select id={id('timeline')} name="timeline" className={input} defaultValue="asap">
            {TIMELINES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={id('message')} className={label}>
          Anything else we should know? <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea id={id('message')} name="message" rows={3} className={input} />
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
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 font-semibold text-white shadow-[0_10px_24px_-10px_rgb(31_117_82/0.7)] transition hover:-translate-y-px hover:bg-forest-800 hover:shadow-[0_14px_28px_-10px_rgb(31_117_82/0.8)] disabled:translate-y-0 disabled:opacity-70"
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
