'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, CheckCircle2, Gauge, KeyRound, Loader2, Lock, Star } from 'lucide-react';
import { submitCheck, type CheckState } from '@/app/(site)/actions';
import { NAME_KEY } from '@/components/site/ThankYouName';

const SERVICES = [
  { value: 'new-website', label: 'A new website', short: 'New site' },
  { value: 'redesign', label: 'A redesign', short: 'Redesign' },
  { value: 'seo', label: 'Local SEO' },
  { value: 'ads', label: 'Google Ads' },
  { value: 'other', label: 'Something else' },
];

const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'In 1 to 3 months' },
  { value: 'exploring', label: 'Just exploring' },
];

// On phones the fields turn into iOS style filled fields: 17px text (so iOS never zooms in),
// 52px tall, grey fill and no border until focused.
const input =
  'mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-zinc-900 placeholder:text-zinc-400 shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] transition hover:border-zinc-400 focus:border-azure-700 focus:ring-4 focus:ring-azure-700/15 focus:outline-none max-md:min-h-[52px] max-md:rounded-[14px] max-md:border-transparent max-md:bg-[#f2f2f7] max-md:px-4 max-md:py-3 max-md:text-[17px] max-md:shadow-none max-md:focus:border-accent max-md:focus:bg-white max-md:focus:ring-accent/15';
const label = 'text-sm font-medium text-zinc-800 max-md:text-[15px]';
// Service chips: 44px touch targets on phones.
const chip =
  'inline-block rounded-full border border-zinc-300 px-3.5 py-1.5 text-sm text-zinc-700 transition hover:border-azure-600 hover:text-ink-800 peer-checked:border-azure-700 peer-checked:bg-azure-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-azure-700/40 max-md:flex max-md:min-h-11 max-md:items-center max-md:border-transparent max-md:bg-[#f2f2f7] max-md:px-4 max-md:text-[15px] max-md:font-medium max-md:peer-checked:bg-azure-700';
// The compact form's chips fill four equal columns, so they always sit on one line.
const chipRow =
  "flex! h-full min-h-10 w-full items-center justify-center px-1! text-center tracking-[-0.01em] text-[clamp(10.5px,3.25vw,13px)]! leading-tight whitespace-nowrap max-md:min-h-11 max-md:font-medium";
// The send button: a full width, 54px app button on phones.
const submit = 'max-md:min-h-[54px] max-md:rounded-2xl max-md:text-[17px] max-md:shadow-none max-md:hover:translate-y-0';

export function CheckForm({ compact = false }: { compact?: boolean }) {
  // Two copies of the form can sit on one page, so field ids get a prefix.
  const id = (name: string) => (compact ? `hero-${name}` : name);
  const [state, action, pending] = useActionState<CheckState, FormData>(submitCheck, { ok: false });
  const utmRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef('');
  const router = useRouter();

  // leads.js keeps the first campaign and referrer the visitor came with; send them along.
  function attachAttribution(e: React.FormEvent<HTMLFormElement>) {
    nameRef.current = String(new FormData(e.currentTarget).get('name') ?? '').trim().split(/\s+/)[0].slice(0, 40);
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

  // A sent form is the conversion Google Ads and the Meta Pixel count (when they are set up and allowed),
  // then the visitor goes on to the thank-you page. The message below shows for the moment that takes.
  useEffect(() => {
    if (!state.ok) return;
    window.wtTrack?.lead();
    try {
      sessionStorage.setItem(NAME_KEY, nameRef.current);
    } catch {
      // Storage blocked: the thank-you page greets without the name.
    }
    router.push('/thank-you');
  }, [state.ok, router]);

  if (state.ok) {
    return (
      <div
        id={compact ? 'hero-form' : undefined}
        className="scroll-mt-24 rounded-3xl border border-azure-100 bg-white p-8 text-center text-zinc-700 shadow-float sm:p-10"
        role="status"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-azure-50 ring-8 ring-azure-50/50">
          <CheckCircle2 className="h-9 w-9 text-azure-700" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink-950">Thank you, your request is in</h3>
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
        className="scroll-mt-24 rounded-3xl border border-white/10 bg-white p-6 text-zinc-700 shadow-float shadow-black/40 max-md:rounded-[24px] max-md:border-0 max-md:p-5 sm:p-7"
      >
        <div className="flex items-center justify-between gap-3 max-md:hidden">
          <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-azure-700 uppercase">Free website check</p>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-azure-50 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-ink-800 ring-1 ring-azure-100">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-azure-600" aria-hidden />
            Reply in 1 day
          </span>
        </div>
        <p className="mt-3 font-display text-2xl text-ink-950 max-md:mt-0 max-md:text-[1.35rem] max-md:leading-tight sm:text-[1.7rem] sm:leading-tight">See what your site is costing you</p>
        <p className="mt-1 text-[13px] text-zinc-500 md:hidden">Free check, reply within one business day.</p>
        <p className="mt-1.5 text-sm text-zinc-500 max-md:hidden">A real review of your site and your top competitors, within one business day.</p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200/70 max-md:hidden">
          <span className="flex shrink-0 gap-0.5 text-amber-400" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </span>
          <p className="text-xs leading-snug text-zinc-600">
            Our clients on Google: <span className="font-semibold text-zinc-900">Tree Jaws 4.9</span> from 427 reviews,{' '}
            <span className="font-semibold text-zinc-900">Mahalo 5.0</span>
          </p>
        </div>

        <fieldset className="mt-5 max-md:mt-4">
          <legend className={label}>
          What do you need? <span className="font-normal text-zinc-500">Pick all that apply.</span>
        </legend>
          {/* Four chips in one row at every width: equal columns, shorter labels, smaller text. */}
          <div className="mt-2 grid grid-cols-4 gap-1 min-[375px]:gap-1.5 sm:gap-2">
            {SERVICES.slice(0, 4).map((s, i) => (
              <label key={s.value} className="min-w-0 cursor-pointer">
                <input type="checkbox" name="service" value={s.value} defaultChecked={i === 0} className="peer sr-only" />
                <span className={`${chip} ${chipRow}`}>
                  {'short' in s ? s.short : s.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 grid gap-3.5 max-md:gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={id('name')} className={label}>
              Your name
            </label>
            <input id={id('name')} name="name" required minLength={2} className={input} autoComplete="name" autoCapitalize="words" enterKeyHint="next" />
          </div>
          <div>
            <label htmlFor={id('email')} className={label}>
              Email
            </label>
            <input id={id('email')} name="email" type="email" required className={input} autoComplete="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" />
          </div>
          <div>
            <label htmlFor={id('website')} className={label}>
              Current website
            </label>
            <input id={id('website')} name="website" placeholder="yourbusiness.com" className={input} autoComplete="url" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" />
          </div>
          <div>
            <label htmlFor={id('business')} className={label}>
              Business and city
            </label>
            <input id={id('business')} name="business" placeholder="Tree service in Tampa" className={input} autoCapitalize="sentences" enterKeyHint="next" />
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
          className={`group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-ink-950 shadow-glow transition hover:-translate-y-px hover:bg-accent-dark disabled:translate-y-0 disabled:opacity-70 ${submit}`}
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {pending ? 'Sending…' : 'Get my free website check'}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-500">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          No obligation. We use your details only to reply.
        </p>
        <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-zinc-100 pt-5 text-center max-md:hidden">
          {[
            { icon: BadgeCheck, title: 'Google Ads', text: 'managed in-house' },
            { icon: Gauge, title: '90+ speed', text: 'Lighthouse score' },
            { icon: KeyRound, title: 'No lock-in', text: 'you own it all' },
          ].map((b) => (
            <li key={b.title} className="flex flex-col items-center gap-1 rounded-xl px-1 py-1">
              <b.icon className="h-5 w-5 text-azure-700" aria-hidden />
              <span className="text-xs font-semibold text-zinc-900">{b.title}</span>
              <span className="text-[11px] leading-tight text-zinc-500">{b.text}</span>
            </li>
          ))}
        </ul>
      </form>
    );
  }

  return (
    <form
      action={action}
      onSubmit={attachAttribution}
      data-lead-ignore
      className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-float max-md:rounded-[24px] max-md:border-0 max-md:p-5 sm:p-8"
    >
      <fieldset>
        <legend className={label}>
          What do you need? <span className="font-normal text-zinc-500">Pick all that apply.</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICES.map((s, i) => (
            <label key={s.value} className="cursor-pointer">
              <input type="checkbox" name="service" value={s.value} defaultChecked={i === 0} className="peer sr-only" />
              <span className={chip}>
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
          <input id={id('website')} name="website" placeholder="yourbusiness.com" className={input} autoComplete="url" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" />
        </div>
        <div>
          <label htmlFor={id('business')} className={label}>
            Business and city
          </label>
          <input id={id('business')} name="business" placeholder="Tree service in Tampa" className={input} autoCapitalize="sentences" enterKeyHint="next" />
        </div>
        <div>
          <label htmlFor={id('name')} className={label}>
            Your name
          </label>
          <input id={id('name')} name="name" required minLength={2} className={input} autoComplete="name" autoCapitalize="words" enterKeyHint="next" />
        </div>
        <div>
          <label htmlFor={id('email')} className={label}>
            Email
          </label>
          <input id={id('email')} name="email" type="email" required className={input} autoComplete="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" />
        </div>
        <div>
          <label htmlFor={id('phone')} className={label}>
            Phone <span className="font-normal text-zinc-500">(optional)</span>
          </label>
          <input id={id('phone')} name="phone" type="tel" className={input} autoComplete="tel" inputMode="tel" enterKeyHint="next" />
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
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-azure-700 px-6 py-3.5 font-semibold text-white shadow-[0_10px_24px_-10px_rgb(37_99_235/0.7)] transition hover:-translate-y-px hover:bg-ink-800 hover:shadow-[0_14px_28px_-10px_rgb(37_99_235/0.8)] disabled:translate-y-0 disabled:opacity-70 ${submit}`}
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {pending ? 'Sending…' : 'Get my free website check'}
      </button>
      <p className="mt-3 text-center text-xs text-zinc-500">
        We use your details only to reply to you. By sending, you agree to our{' '}
        <a href="/terms" className="underline">
          terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline">
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}
