'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, BarChart3, Check, Code2, LayoutTemplate, PlayCircle, Search, X } from 'lucide-react';
import { useLocalePath, useT } from '@/components/i18n/LangProvider';
import type { T } from '@/lib/i18n';

type Row = { what: string; typical: string; ours: string };
type Group = { icon: typeof Code2; title: string; rows: Row[] };

// What every site we build carries, layer by layer, next to what we usually find on a typical small-business site.
const groups = (t: T): Group[] => [
  {
    icon: LayoutTemplate,
    title: t('What visitors see', 'Šta posetilac vidi'),
    rows: [
      {
        what: t('First screen', 'Prvi ekran'),
        typical: t('“Welcome” and a big photo, phone number in the footer', '„Dobro došli” i velika slika, telefon u dnu stranice'),
        ours: t('Offer, area, rating, phone and one clear button', 'Ponuda, grad, ocena, telefon i jedno jasno dugme'),
      },
      {
        what: t('Trust', 'Poverenje'),
        typical: t('Reviews only on Google, nothing on the site', 'Recenzije samo na Google-u, na sajtu ništa'),
        ours: t('Real reviews, photos of your work and guarantees', 'Prave ocene, slike vaših radova i garancije'),
      },
      {
        what: t('Enquiries', 'Upiti'),
        typical: t('A long form or just an email address', 'Duga forma ili samo email adresa'),
        ours: t('A three-field form and a call button always on screen', 'Forma od tri polja i dugme za poziv uvek na ekranu'),
      },
    ],
  },
  {
    icon: Code2,
    title: t('Code and speed', 'Kod i brzina'),
    rows: [
      {
        what: t('Technology', 'Tehnologija'),
        typical: t('A theme with dozens of plugins that need updating', 'Tema sa desetinama dodataka koje treba ažurirati'),
        ours: t('Hand-written modern code, nothing to maintain', 'Ručno pisan moderan kod, ništa za održavanje'),
      },
      {
        what: t('Speed', 'Brzina'),
        typical: t('Heavy images, a blank screen on mobile data', 'Teške slike, prazan ekran na mobilnom internetu'),
        ours: t('Opens in under two seconds, Google score 90+', 'Otvara se za manje od dve sekunde, Google ocena 90+'),
      },
      {
        what: t('Ownership', 'Vlasništvo'),
        typical: t('Site and domain in the agency’s name', 'Sajt i domen na ime agencije'),
        ours: t('Code, domain and every account in your name', 'Kod, domen i svi nalozi na vaše ime'),
      },
    ],
  },
  {
    icon: Search,
    title: t('Google and AI', 'Google i AI'),
    rows: [
      {
        what: t('Services and towns', 'Usluge i gradovi'),
        typical: t('One “Services” page with a bullet list', 'Jedna stranica „Usluge” sa spiskom'),
        ours: t('A page for every service and every town you serve', 'Posebna stranica za svaku uslugu i svaki grad'),
      },
      {
        what: t('Search result', 'Rezultat pretrage'),
        typical: t('Google picks a random title and snippet', 'Google sam bira naslov i opis, često pogrešno'),
        ours: t('Titles and descriptions written to win the click', 'Naslov i opis napisani da privuku klik'),
      },
      {
        what: t('Maps and AI answers', 'Mape i AI odgovori'),
        typical: t('Google and ChatGPT have to guess who you are', 'Google i ChatGPT moraju da nagađaju ko ste'),
        ours: t('Structured data: who you are, where, when you are open', 'Strukturirani podaci: ko ste, gde i kada radite'),
      },
    ],
  },
  {
    icon: BarChart3,
    title: t('Tracking', 'Praćenje'),
    rows: [
      {
        what: t('Response', 'Odgovor'),
        typical: t('Messages wait in an inbox for days', 'Poruke danima čekaju u inboxu'),
        ours: t('Every enquiry on your phone within seconds', 'Svaki upit na vašem telefonu za par sekundi'),
      },
      {
        what: t('Sources', 'Izvori'),
        typical: t('No idea which calls came from where', 'Ne zna se ko je odakle došao'),
        ours: t('Every call and enquiry tagged with its source', 'Svaki poziv i upit sa izvorom: Google, Mape, oglasi'),
      },
      {
        what: t('Report', 'Izveštaj'),
        typical: t('Clicks and impressions, no answers', 'Klikovi i prikazi, bez pravog odgovora'),
        ours: t('Enquiries and cost per enquiry, every month', 'Upiti i cena po upitu, svakog meseca'),
      },
    ],
  },
];

const questions = (t: T) => [
  t('Is your phone number on the first screen on a phone?', 'Vidi li se broj telefona na prvom ekranu na telefonu?'),
  t('Does the site open in under three seconds on mobile data?', 'Otvara li se sajt za manje od tri sekunde na mobilnom internetu?'),
  t('Does every service have its own page?', 'Ima li svaka usluga svoju stranicu?'),
  t('Does Google show your correct hours, address and reviews?', 'Prikazuje li Google tačno radno vreme, adresu i ocene?'),
  t('Do enquiries reach your phone within a minute?', 'Stižu li vam upiti na telefon za manje od minut?'),
  t('Do you know how many enquiries the site brought last month?', 'Znate li koliko upita vam je sajt doneo prošlog meseca?'),
];

type Answer = 'yes' | 'no' | 'unsure';

/**
 * Homepage section on what a WebTano site carries: a typical small-business
 * site next to ours, layer by layer, then a six-question self-check.
 */
export function SiteAnatomy() {
  const t = useT();
  const lp = useLocalePath();
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const qs = questions(t);
  const answered = Object.keys(answers).length;
  const leaks = Object.values(answers).filter((a) => a !== 'yes').length;

  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-zinc-200/80">
        {/* Column heads */}
        <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-zinc-200 max-md:hidden">
          <div className="px-6 py-4 font-mono text-[11px] tracking-[0.14em] text-zinc-400 uppercase">{t('What it covers', 'Šta se gleda')}</div>
          <div className="px-6 py-4 font-mono text-[11px] tracking-[0.14em] text-zinc-500 uppercase">{t('Typical small-business site', 'Tipičan sajt male firme')}</div>
          <div className="flex items-center gap-2 bg-azure-50/70 px-6 py-4 font-mono text-[11px] font-semibold tracking-[0.14em] text-azure-700 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {t('A WebTano site', 'WebTano sajt')}
          </div>
        </div>

        {groups(t).map((g) => (
          <div key={g.title} className="border-b border-zinc-100 last:border-b-0">
            <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] max-md:block">
              <div className="col-span-2 flex items-center gap-2.5 bg-zinc-50/80 px-6 py-2.5 max-md:px-4">
                <g.icon className="h-4 w-4 text-azure-700" aria-hidden />
                <h3 className="font-display text-[15px] text-ink-950">{g.title}</h3>
              </div>
              <div className="bg-azure-50/70 max-md:hidden" />
            </div>
            <ul>
              {g.rows.map((r) => (
                <li
                  key={r.what}
                  className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] border-t border-zinc-100 text-[15px] first:border-t-0 max-md:block max-md:px-4 max-md:py-3"
                >
                  <p className="px-6 py-3.5 font-medium text-ink-950 max-md:p-0 max-md:text-[15px]">{r.what}</p>
                  <p className="flex gap-2.5 px-6 py-3.5 leading-snug text-zinc-500 max-md:mt-1.5 max-md:p-0 max-md:text-sm">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-label={t('Typical site:', 'Tipičan sajt:')} />
                    {r.typical}
                  </p>
                  <p className="flex gap-2.5 bg-azure-50/70 px-6 py-3.5 leading-snug font-medium text-ink-950 max-md:mt-1.5 max-md:bg-transparent max-md:p-0 max-md:text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-azure-700" aria-label={t('WebTano site:', 'WebTano sajt:')} />
                    {r.ours}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Self-check: every "no" or "not sure" is a place enquiries leak. */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-ink-975 text-white ring-1 ring-ink-900">
        <div className="grid gap-6 p-6 max-md:p-5 sm:p-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10">
          <div className="flex flex-col">
            <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">{t('60-second check', 'Provera za 60 sekundi')}</p>
            <h3 className="mt-2 font-display text-2xl text-balance">{t('How does your current site compare?', 'Kako stoji vaš sadašnji sajt?')}</h3>
            <p className="mt-2 text-sm text-pretty text-white/60 max-md:hidden">
              {t(
                'Answer six quick questions. Every “no” or “not sure” is a place where enquiries are leaking to a competitor.',
                'Odgovorite na šest kratkih pitanja. Svako „ne” ili „ne znam” je mesto na kom upiti odlaze konkurenciji.',
              )}
            </p>
            <div className="mt-5 flex items-baseline gap-3 max-md:hidden" aria-live="polite">
              <p className="font-display text-4xl">
                <span className={answered === 0 ? 'text-white/30' : leaks === 0 ? 'text-emerald-400' : leaks <= 2 ? 'text-amber-300' : 'text-red-400'}>{leaks}</span>
                <span className="text-white/30"> / 6</span>
              </p>
              <p className="text-sm text-white/60">
                {answered === 0
                  ? t('weak spots', 'slabih mesta')
                  : leaks === 0
                    ? t('So far so good.', 'Za sada dobro.')
                    : leaks <= 2
                      ? t('A few leaks worth fixing.', 'Nekoliko rupa koje vredi zatvoriti.')
                      : t('Your site is likely losing enquiries.', 'Sajt vam verovatno gubi upite.')}
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              <Link
                href={lp('/#hero-form')}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-accent-dark"
              >
                {t('Get a free website audit', 'Zatražite besplatnu analizu')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href={lp('/demo')}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/15 transition hover:bg-white/[0.06] hover:text-white"
              >
                <PlayCircle className="h-4 w-4 text-accent" aria-hidden />
                {t('Try the demo site', 'Pogledajte demo sajt')}
              </Link>
            </div>
          </div>
          {/* Phones get the call to action only; the questions are desktop detail. */}
          <ol className="grid gap-2 max-md:hidden sm:grid-cols-2">
            {qs.map((q, i) => (
              <li key={q} className="flex flex-col justify-between gap-3 rounded-2xl bg-white/[0.03] p-3.5 ring-1 ring-white/[0.08]">
                <p className="text-sm leading-snug text-white/85">{q}</p>
                <div role="radiogroup" aria-label={q} className="flex gap-1">
                  {(
                    [
                      ['yes', t('Yes', 'Da'), 'bg-emerald-400 text-ink-950 ring-emerald-400'],
                      ['no', t('No', 'Ne'), 'bg-red-400 text-ink-950 ring-red-400'],
                      ['unsure', t('Not sure', 'Ne znam'), 'bg-amber-300 text-ink-950 ring-amber-300'],
                    ] as const
                  ).map(([value, label, onCls]) => {
                    const on = answers[i] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setAnswers((a) => ({ ...a, [i]: value }))}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${on ? onCls : 'text-white/60 ring-white/12 hover:text-white'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
