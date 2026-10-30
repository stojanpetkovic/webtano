'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Ban,
  BarChart3,
  BellRing,
  Check,
  ClipboardList,
  Code2,
  Hourglass,
  LayoutTemplate,
  MapPin,
  MessageSquareOff,
  Phone,
  PhoneOff,
  PlayCircle,
  Search,
  Star,
  Undo2,
  X,
} from 'lucide-react';
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

/** A phone with a status bar and camera island around a sketch of a first screen. */
function PhoneFrame({ children, good }: { children: React.ReactNode; good?: boolean }) {
  return (
    <div
      className={`relative w-[220px] shrink-0 rounded-[2.4rem] p-[7px] max-sm:w-[150px] max-sm:rounded-[1.7rem] max-sm:p-1 ${
        good
          ? 'bg-gradient-to-b from-ink-800 to-ink-950 shadow-[0_40px_80px_-30px_rgb(1_175_233/0.6)] ring-1 ring-white/10'
          : 'bg-gradient-to-b from-zinc-300 to-zinc-400 shadow-[0_30px_60px_-30px_rgb(10_14_30/0.35)]'
      }`}
    >
      <div className="relative h-[440px] overflow-hidden rounded-[2rem] bg-white max-sm:h-[310px] max-sm:rounded-[1.4rem]">
        <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[9px] font-semibold text-ink-950 max-sm:px-3 max-sm:text-[7px]">
          <span>9:41</span>
          <span className="absolute top-1.5 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-ink-950 max-sm:h-3 max-sm:w-11" aria-hidden />
          <span className="flex items-center gap-0.5" aria-hidden>
            <span className="h-1.5 w-0.5 rounded-sm bg-ink-950" />
            <span className="h-2 w-0.5 rounded-sm bg-ink-950" />
            <span className="h-2.5 w-0.5 rounded-sm bg-ink-950" />
            <span className="ml-1 h-2 w-4 rounded-[3px] ring-1 ring-ink-950" />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Numbered marker on a phone sketch, matching a card beside it. */
function Pin({ n, good, className }: { n: number; good?: boolean; className: string }) {
  return (
    <span
      className={`absolute z-10 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md ring-2 ring-white max-sm:h-4 max-sm:w-4 max-sm:text-[8px] ${good ? 'bg-emerald-500' : 'bg-red-500'} ${className}`}
      aria-hidden
    >
      {n}
    </span>
  );
}

/**
 * The first screen of a typical small-business site next to one of ours, as
 * two phones with numbered pins and what each one leads to, so the
 * difference is seen rather than read.
 */
function FirstScreenCompare() {
  const t = useT();
  const bad = [
    [PhoneOff, t('No phone number in sight', 'Broj telefona se ne vidi')],
    [Hourglass, t('A heavy photo still loading', 'Teška slika se još učitava')],
    [MessageSquareOff, t('“Welcome”, no offer, no town', '„Dobro došli”, bez ponude i grada')],
    [Ban, t('A pop-up covering the page', 'Prozor preko pola ekrana')],
  ] as const;
  const good = [
    [Star, t('Rating visible at once', 'Ocena odmah vidljiva')],
    [MapPin, t('What you do and where', 'Šta radite i gde')],
    [Phone, t('One tap to call', 'Poziv jednim dodirom')],
    [ClipboardList, t('A three-field form', 'Forma od tri polja')],
  ] as const;
  const cards = (items: typeof bad | typeof good, ok: boolean) => (
    <ol className="space-y-2.5 max-sm:space-y-1.5">
      {items.map(([Icon, label], i) => (
        <li
          key={label}
          className={`flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 max-sm:gap-2 max-sm:rounded-xl max-sm:p-2 ${ok ? 'ring-emerald-100' : 'ring-red-100'}`}
        >
          <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl max-sm:h-7 max-sm:w-7 ${ok ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            <Icon className="h-[18px] w-[18px] max-sm:h-3.5 max-sm:w-3.5" aria-hidden />
            <span className={`absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-white ${ok ? 'bg-emerald-500' : 'bg-red-500'}`}>
              {i + 1}
            </span>
          </span>
          <span className="text-[14px] leading-snug font-medium text-ink-950 max-sm:text-[12px]">{label}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-50 to-white p-8 ring-1 ring-zinc-200/80 max-md:p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(10_14_30/0.07)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,#000,transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute top-1/2 left-[30%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400/15 blur-3xl max-lg:left-1/4" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 left-[70%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl max-lg:left-3/4" aria-hidden />

      <div className="relative grid items-center gap-8 max-md:gap-5 lg:grid-cols-[1fr_auto_1fr]">
        <div className="max-lg:hidden">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-red-600 uppercase ring-1 ring-red-100">
            <X className="h-3 w-3" aria-hidden />
            {t('Typical site', 'Tipičan sajt')}
          </p>
          {cards(bad, false)}
        </div>

        <div className="relative flex items-start justify-center gap-6 pt-6 max-sm:gap-3 max-sm:pt-8">
          {/* Typical: a photo still loading, a vague welcome, no number, a cookie pop-up. */}
          <div className="relative -rotate-3 text-center max-sm:-rotate-2">
            <span className="absolute -top-7 -left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap text-red-600 shadow-lift ring-1 ring-red-100 max-sm:-top-8 max-sm:-left-1 max-sm:px-2 max-sm:text-[9px]">
              <Undo2 className="h-3.5 w-3.5 max-sm:h-3 max-sm:w-3" aria-hidden />
              {t('Back to Google', 'Nazad na Google')}
            </span>
            <PhoneFrame>
              <div className="h-0.5 w-full bg-zinc-100">
                <div className="h-full w-2/5 bg-red-400" />
              </div>
              <div className="relative flex items-center justify-between px-3 py-2.5">
                <span className="h-2.5 w-14 rounded bg-zinc-300" />
                <span className="space-y-0.5">
                  <span className="block h-0.5 w-4 bg-zinc-400" />
                  <span className="block h-0.5 w-4 bg-zinc-400" />
                  <span className="block h-0.5 w-4 bg-zinc-400" />
                </span>
                <Pin n={1} className="top-1.5 left-1/2 -translate-x-1/2" />
              </div>
              <div className="relative mx-2 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 max-sm:h-24">
                <span className="flex flex-col items-center gap-2">
                  <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-400 border-t-transparent max-sm:h-6 max-sm:w-6" />
                  <span className="text-[10px] font-medium text-zinc-500 max-sm:text-[8px]">{t('Loading…', 'Učitava se…')}</span>
                </span>
                <Pin n={2} className="top-2 right-2" />
              </div>
              <div className="relative px-3 pt-3">
                <p className="text-[14px] font-semibold text-zinc-500 max-sm:text-[10px]">{t('Welcome to our website!', 'Dobro došli na naš sajt!')}</p>
                <span className="mt-2 block h-1.5 w-full rounded bg-zinc-200" />
                <span className="mt-1.5 block h-1.5 w-5/6 rounded bg-zinc-200" />
                <span className="mt-1.5 block h-1.5 w-4/6 rounded bg-zinc-200" />
                <Pin n={3} className="-top-1 right-2" />
              </div>
              <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-zinc-800 p-3.5 text-white max-sm:p-2">
                <p className="text-[10px] font-semibold text-white/80 max-sm:text-[7px]">{t('We use cookies', 'Koristimo kolačiće')}</p>
                <span className="mt-1.5 block h-1.5 w-full rounded bg-white/25" />
                <span className="mt-1.5 block h-1.5 w-4/5 rounded bg-white/25" />
                <span className="mt-2.5 flex gap-1.5">
                  <span className="h-6 flex-1 rounded-md bg-white/80 max-sm:h-4" />
                  <span className="h-6 flex-1 rounded-md bg-white/20 max-sm:h-4" />
                </span>
                <Pin n={4} className="-top-2 right-3" />
              </div>
            </PhoneFrame>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-soft ring-1 ring-red-100 max-sm:mt-3 max-sm:gap-1 max-sm:px-2">
              <svg viewBox="0 0 40 16" className="h-4 w-10 max-sm:h-3 max-sm:w-7" aria-hidden>
                <polyline points="1,3 10,6 18,5 27,11 39,14" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[12px] font-semibold text-red-600 max-sm:text-[9px]">{t('Visitor leaves', 'Posetilac odlazi')}</span>
            </div>
          </div>

          <span className="mt-48 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-950 font-mono text-xs font-bold text-white shadow-lift ring-4 ring-white max-sm:absolute max-sm:top-[11.5rem] max-sm:left-1/2 max-sm:z-30 max-sm:mt-0 max-sm:h-8 max-sm:w-8 max-sm:-translate-x-1/2 max-sm:text-[10px]">
            VS
          </span>

          {/* Ours: a call button in the header, rating, clear offer, call and book, a short form, a call bar. */}
          <div className="relative rotate-3 text-center max-sm:rotate-2">
            <span className="absolute -top-8 -right-8 z-20 flex animate-float items-center gap-2 rounded-2xl bg-white/95 py-2 pr-3 pl-2 text-left shadow-float ring-1 ring-zinc-200 backdrop-blur max-sm:-top-9 max-sm:-right-1 max-sm:gap-1 max-sm:rounded-xl max-sm:py-1 max-sm:pr-2 max-sm:pl-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950 text-accent max-sm:h-5 max-sm:w-5">
                <BellRing className="h-3.5 w-3.5 max-sm:h-3 max-sm:w-3" aria-hidden />
              </span>
              <span>
                <span className="block text-[11px] font-semibold whitespace-nowrap text-ink-950 max-sm:text-[9px]">{t('New enquiry: Ana', 'Novi upit: Ana')}</span>
                <span className="block text-[10px] whitespace-nowrap text-zinc-500 max-sm:hidden">{t('AC not cooling · Google Maps', 'Klima ne hladi · Google Mape')}</span>
              </span>
            </span>
            <PhoneFrame good>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 rounded-md bg-ink-950" />
                  <span className="h-2 w-12 rounded bg-ink-950/80 max-sm:w-8" />
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-accent px-1.5 py-0.5 text-[8px] font-bold text-ink-950 max-sm:text-[6px]">
                  <Phone className="h-2 w-2" aria-hidden />
                  {t('CALL', 'POZIV')}
                </span>
              </div>
              <div className="relative bg-gradient-to-b from-ink-900 to-ink-950 px-3 pt-3.5 pb-4 text-white">
                <span className="relative inline-flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] max-sm:text-[7px]">
                  <span className="text-amber-400">★★★★★</span> 4.9
                  <Pin n={1} good className="-top-2 -right-6" />
                </span>
                <p className="relative mt-2 text-[16px] leading-tight font-semibold max-sm:text-[11px]">
                  {t('Same-day AC repair in', 'Servis klima isti dan u')} <span className="text-accent">{t('Springfield', 'Novom Sadu')}</span>
                  <Pin n={2} good className="-top-3 -left-2" />
                </p>
                <span className="relative mt-3 flex gap-1.5">
                  <span className="relative flex h-7 flex-1 items-center justify-center gap-1 rounded-lg bg-accent text-[10px] font-bold text-ink-950 max-sm:h-5 max-sm:text-[7px]">
                    <span className="ring-wave pointer-events-none absolute -inset-1 rounded-xl ring-2 ring-accent" aria-hidden />
                    <Phone className="h-2.5 w-2.5" aria-hidden />
                    {t('Call now', 'Pozovite')}
                  </span>
                  <span className="flex h-7 flex-1 items-center justify-center rounded-lg bg-white/15 text-[10px] font-semibold max-sm:h-5 max-sm:text-[7px]">{t('Book', 'Zakažite')}</span>
                  <Pin n={3} good className="-top-2.5 -left-2" />
                </span>
              </div>
              <div className="relative space-y-1.5 px-3 pt-3">
                <p className="text-[10px] font-semibold text-ink-950 max-sm:text-[7px]">{t('Free estimate', 'Besplatna procena')}</p>
                <span className="block h-6 rounded-lg bg-zinc-50 ring-1 ring-zinc-200 max-sm:h-4" />
                <span className="block h-6 rounded-lg bg-zinc-50 ring-1 ring-zinc-200 max-sm:h-4" />
                <span className="flex gap-1">
                  <span className="h-5 flex-1 rounded-md bg-ink-950 max-sm:h-3.5" />
                  <span className="h-5 flex-1 rounded-md ring-1 ring-zinc-200 max-sm:h-3.5" />
                </span>
                <span className="block h-7 rounded-lg bg-accent max-sm:h-5" />
                <Pin n={4} good className="-top-1 right-1" />
              </div>
              <div className="absolute inset-x-2 bottom-2 grid grid-cols-2 gap-1 rounded-xl bg-white/95 p-1 shadow-lift ring-1 ring-zinc-200 max-sm:inset-x-1 max-sm:bottom-1">
                <span className="h-6 rounded-lg bg-accent max-sm:h-4" />
                <span className="h-6 rounded-lg bg-ink-950 max-sm:h-4" />
              </div>
            </PhoneFrame>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-soft ring-1 ring-emerald-100 max-sm:mt-3 max-sm:gap-1 max-sm:px-2">
              <svg viewBox="0 0 40 16" className="h-4 w-10 max-sm:h-3 max-sm:w-7" aria-hidden>
                <polyline points="1,14 11,11 19,12 28,6 39,2" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[12px] font-semibold text-emerald-600 max-sm:text-[9px]">{t('Visitor calls', 'Posetilac zove')}</span>
            </div>
          </div>
        </div>

        <div className="max-lg:hidden">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-emerald-700 uppercase ring-1 ring-emerald-100">
            <Check className="h-3 w-3" aria-hidden />
            {t('A WebTano site', 'WebTano sajt')}
          </p>
          {cards(good, true)}
        </div>

        {/* Phones and tablets: both lists under the phones. */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {cards(bad, false)}
          {cards(good, true)}
        </div>
      </div>
      <p className="relative mt-6 text-center font-mono text-[10px] tracking-wide text-zinc-400 uppercase max-md:mt-4">
        {t('Illustration: the first screen a visitor sees on a phone', 'Ilustracija: prvi ekran koji posetilac vidi na telefonu')}
      </p>
    </div>
  );
}

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

  // translate="no": a browser translating the page rewrites text React still updates, which crashes it.
  return (
    <div translate="no">
      <FirstScreenCompare />

      {/* Phones get the picture; the full comparison table is desktop detail. */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-zinc-200/80 max-md:hidden">
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
