'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Check,
  FileText,
  Printer,
  Code2,
  Hand,
  Maximize2,
  Minimize2,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { useLang, useLocalePath, useT } from '@/components/i18n/LangProvider';
import { DemoSite, type Block } from './DemoSite';
import type { T } from '@/lib/i18n';

type Stage = 'site' | 'code' | 'seo' | 'tracking' | 'report' | 'done';
type Step = { stage: Stage; block?: Block; phone?: boolean; title: string; text: string; wrong?: string; gets: string[]; tryIt?: string };

const steps = (t: T): Step[] => [
  {
    stage: 'site',
    block: 'hero',
    title: t('The first screen: three seconds to convince', 'Prvi ekran: tri sekunde da ubedite'),
    text: t(
      'People decide in a moment whether to stay. So the first screen says what you do and where, shows your rating, and gives one button to book and one to call. Nothing else competes for attention.',
      'Ljudi u trenu odluče da li ostaju. Zato prvi ekran kaže šta radite i gde, pokaže ocenu i da jedno dugme za zakazivanje i jedno za poziv. Ništa drugo ne odvlači pažnju.',
    ),
    wrong: t(
      'A typical site opens with a big photo and “Welcome to our website”, and the phone number hides in the footer.',
      'Tipičan sajt počinje velikom slikom i natpisom „Dobro došli na naš sajt”, a broj telefona je sakriven u dnu stranice.',
    ),
    gets: [t('Offer, area and rating above the fold', 'Ponuda, grad i ocena na prvom ekranu'), t('One main button, one call button', 'Jedno glavno dugme i jedno za poziv')],
    tryIt: t('Tap “Call” on the demo site. You will see it again in step 8.', 'Kliknite „Pozovite” na demo sajtu. Videćete ga ponovo u 8. koraku.'),
  },
  {
    stage: 'site',
    block: 'trust',
    title: t('Proof, right where people decide', 'Dokaz, tačno tamo gde ljudi odlučuju'),
    text: t(
      'Your Google rating, real reviews with names and the facts that make you safe to choose: years in business, guarantees, insurance. Pulled from your real profile, never invented.',
      'Vaša ocena sa Google-a, prave recenzije sa imenima i činjenice zbog kojih ste siguran izbor: godine rada, garancije, osiguranje. Iz vašeg pravog profila, nikad izmišljeno.',
    ),
    wrong: t(
      'Reviews live only on Google, so the site itself gives a stranger no reason to trust you.',
      'Recenzije postoje samo na Google-u, pa sam sajt nekome ko vas ne zna ne daje razlog da vam veruje.',
    ),
    gets: [t('Rating and reviews from your profile', 'Ocena i recenzije sa vašeg profila'), t('Guarantees in plain words', 'Garancije jednostavnim rečima')],
  },
  {
    stage: 'site',
    block: 'services',
    title: t('A page for every service', 'Stranica za svaku uslugu'),
    text: t(
      'Each service has its own page, with what it costs, how it works and the questions people ask. That is what lets Google send someone searching for that exact service straight to you.',
      'Svaka usluga ima svoju stranicu, sa cenom, opisom kako izgleda i odgovorima na česta pitanja. Tako Google nekoga ko traži baš tu uslugu šalje pravo kod vas.',
    ),
    wrong: t(
      'One “Services” page with a list of bullet points, which Google cannot match to any specific search.',
      'Jedna stranica „Usluge” sa spiskom stavki, koju Google ne može da poveže ni sa jednom konkretnom pretragom.',
    ),
    gets: [t('Its own address for each service', 'Posebna adresa za svaku uslugu'), t('Prices or a starting point', 'Cena ili okvirna cena')],
    tryIt: t('Click a service and watch the address bar change.', 'Kliknite na uslugu i pogledajte kako se menja adresa gore.'),
  },
  {
    stage: 'site',
    block: 'form',
    title: t('A form people actually finish', 'Forma koju ljudi zaista popune'),
    text: t(
      'A name, a phone number and a tap to pick what they need. The enquiry is saved and lands on your phone in seconds, with the page and the search that brought it.',
      'Ime, broj telefona i jedan dodir da izaberu šta im treba. Upit se čuva i za par sekundi stiže vam na telefon, zajedno sa stranicom i pretragom koja ga je dovela.',
    ),
    wrong: t(
      'A ten-field form, or just an email address, and messages that sit unread in an inbox for days.',
      'Forma sa deset polja ili samo email adresa, i poruke koje danima stoje nepročitane.',
    ),
    gets: [t('Short form, built for thumbs', 'Kratka forma, prilagođena prstu'), t('Instant alert on your phone', 'Obaveštenje na telefon istog trenutka')],
    tryIt: t('Fill in the form and press send. Nothing leaves this page.', 'Popunite formu i pošaljite. Ništa ne napušta ovu stranicu.'),
  },
  {
    stage: 'site',
    block: 'callbar',
    phone: true,
    title: t('Built for the phone first', 'Napravljeno prvo za telefon'),
    text: t(
      'Most local searches happen on a phone. The layout is designed for a small screen first, and a call button stays at the bottom wherever the visitor scrolls.',
      'Većina lokalnih pretraga se radi sa telefona. Raspored je pravljen prvo za mali ekran, a dugme za poziv stoji na dnu ekrana gde god da posetilac skroluje.',
    ),
    wrong: t(
      'A desktop site squeezed onto a phone: tiny text, buttons too small to tap, and pinching to zoom.',
      'Sajt za računar stisnut na telefon: sitna slova, dugmad premala za prst i zumiranje prstima.',
    ),
    gets: [t('Phone-first layout', 'Raspored prvo za telefon'), t('Call button always on screen', 'Dugme za poziv uvek na ekranu')],
    tryIt: t('Scroll the demo site: the call bar stays put.', 'Skrolujte demo sajt: traka za poziv ostaje na mestu.'),
  },
  {
    stage: 'code',
    title: t('Under the hood: light, clean code', 'Ispod haube: lagan i čist kod'),
    text: t(
      'We write the site by hand in modern code instead of stacking a theme with plugins. A page loads only what it uses, images come in the size of the screen, and there is nothing to update every month.',
      'Sajt pišemo ručno u modernom kodu, umesto da slažemo temu i dodatke. Stranica učitava samo ono što koristi, slike dolaze u veličini ekrana i nema ničega što treba ažurirati svakog meseca.',
    ),
    wrong: t(
      'A theme plus a page builder plus a dozen plugins, each loading its own files on every page, and each one a door if it is not updated.',
      'Tema, alat za slaganje stranica i desetak dodataka, od kojih svaki učitava svoje fajlove na svakoj stranici i svaki je otvorena vrata ako se ne ažurira.',
    ),
    gets: [t('Google speed scores of 90+', 'Google ocena brzine 90+'), t('HTTPS and spam filtering', 'HTTPS i filter za spam'), t('Code and domain in your name', 'Kod i domen na vaše ime')],
  },
  {
    stage: 'seo',
    title: t('What Google and AI read', 'Šta čitaju Google i AI'),
    text: t(
      'Every page gets a title and description written for the search results, plus structured data: a hidden label that tells Google, Maps and AI assistants who you are, where you work, when you are open and how people rate you.',
      'Svaka stranica dobija naslov i opis napisan za rezultate pretrage, kao i strukturirane podatke: skrivenu oznaku koja Google-u, Mapama i AI asistentima kaže ko ste, gde radite, kad radite i kako vas ocenjuju.',
    ),
    wrong: t(
      'No titles or descriptions of your own, no structured data, so Google and ChatGPT guess, and recommend whoever they understand better.',
      'Bez sopstvenih naslova i opisa i bez strukturiranih podataka, pa Google i ChatGPT nagađaju i preporuče onoga koga bolje razumeju.',
    ),
    gets: [t('Titles and descriptions for every page', 'Naslov i opis za svaku stranicu'), t('Structured data for Google and AI', 'Strukturirani podaci za Google i AI'), t('Sitemap and Search Console set up', 'Mapa sajta i Search Console podešeni')],
  },
  {
    stage: 'tracking',
    title: t('Every enquiry, with where it came from', 'Svaki upit i odakle je došao'),
    text: t(
      'This is the part most sites skip. Every call tap and every form is recorded with its source, so at the end of the month you know which money brought customers and which did not.',
      'Ovo je deo koji većina sajtova preskoči. Svaki klik na poziv i svaka forma se beleže zajedno sa izvorom, pa na kraju meseca znate koji uloženi novac je doveo kupce, a koji nije.',
    ),
    wrong: t(
      'Forms go to an email, calls are not counted at all, and the only report is “visits went up”.',
      'Forme idu na email, pozivi se uopšte ne broje, a jedini izveštaj je „posete su porasle”.',
    ),
    gets: [t('Call and form tracking', 'Praćenje poziva i formi'), t('Source of every enquiry', 'Izvor svakog upita'), t('Monthly report in plain language', 'Mesečni izveštaj razumljivim jezikom')],
  },
  {
    stage: 'report',
    title: t('A monthly report you can actually read', 'Mesečni izveštaj koji zaista možete da pročitate'),
    text: t(
      'At the start of every month you get a short PDF: how many people called or wrote, where they came from and what one enquiry cost you. No jargon, and the same report is always one click away in your browser.',
      'Početkom svakog meseca dobijate kratak PDF: koliko ljudi je zvalo ili pisalo, odakle su došli i koliko vas je koštao jedan upit. Bez stručnih izraza, a isti izveštaj vam je uvek na jedan klik u pregledaču.',
    ),
    wrong: t(
      'No report at all, or a screenshot of “visitors” every few months that says nothing about customers or money.',
      'Izveštaja nema, ili na par meseci stigne slika „posetilaca” koja ništa ne govori o kupcima i novcu.',
    ),
    gets: [t('PDF report every month', 'PDF izveštaj svakog meseca'), t('Enquiries and cost per enquiry', 'Upiti i cena po upitu'), t('Plan for next month', 'Plan za sledeći mesec')],
    tryIt: t('Open the full sample report: change the month or language and save it as PDF.', 'Otvorite ceo primer izveštaja: promenite mesec ili jezik i sačuvajte ga kao PDF.'),
  },
  {
    stage: 'done',
    title: t('That is what your site gets', 'To je ono što vaš sajt dobija'),
    text: t(
      'All of it comes with every WebTano site, not as extras. Want to know which of these your current site is missing? The audit is free and you get it within one business day.',
      'Sve ovo ide uz svaki WebTano sajt, ne kao doplata. Želite da znate šta od ovoga vašem sadašnjem sajtu fali? Analiza je besplatna i dobijate je za jedan radni dan.',
    ),
    gets: [],
  },
];

type Event = { time: string; what: string; source: string; you?: boolean };

const noop = () => () => {};

// Browser extensions and page translators move or replace nodes React rendered,
// and React then crashes with "removeChild: not a child of this node" when it
// cleans up. Skip those few cases instead of breaking the page (the usual fix
// from facebook/react#11538).
function guardDom() {
  const proto = Node.prototype as Node & { webtanoGuard?: boolean };
  if (proto.webtanoGuard) return;
  proto.webtanoGuard = true;
  const remove = proto.removeChild;
  proto.removeChild = function <N extends Node>(this: Node, child: N): N {
    if (child.parentNode !== this) return child;
    return remove.call(this, child) as N;
  };
  const insert = proto.insertBefore;
  proto.insertBefore = function <N extends Node>(this: Node, node: N, ref: Node | null): N {
    if (ref && ref.parentNode !== this) return node;
    return insert.call(this, node, ref) as N;
  };
}

const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

/**
 * The /demo walkthrough: a made-up local business's site on the right, and a
 * step on the left explaining each part in plain language, what a typical site
 * gets wrong there, and what the visitor can try. What they click on the demo
 * site shows up in the tracking step.
 */
export function DemoTour() {
  const t = useT();
  const lp = useLocalePath();
  const all = steps(t);
  const [index, setIndex] = useState(0);
  const [device, setDevice] = useState<'desktop' | 'phone'>('desktop');
  const [path, setPath] = useState('/');
  const [events, setEvents] = useState<Event[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [small, setSmall] = useState(false);
  const [full, setFull] = useState(false);
  // False while rendering on the server, true in the browser.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  // The tour's own box at the end of <body>. React manages <body> itself and can
  // clear what it does not know about, so the tour never portals into it directly.
  const [host] = useState(() => (typeof document === 'undefined' ? null : document.createElement('div')));
  const panelRef = useRef<HTMLDivElement>(null);
  const step = all[index];
  // On a phone the demo site already fills a phone screen, so it is shown without a device frame.
  const phone = small || step.phone || device === 'phone';
  const last = all.length - 1;

  const go = (next: number) => {
    setIndex(Math.max(0, Math.min(last, next)));
    setToast(null);
    panelRef.current?.scrollTo({ top: 0 });
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  // The tour covers the whole window: no page scroll behind it, and it follows the screen size and full-screen mode.
  useEffect(() => {
    guardDom();
    if (!host) return;
    document.body.appendChild(host);
    return () => host.remove();
  }, [host]);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const query = window.matchMedia('(max-width: 639px)');
    const onSize = () => setSmall(query.matches);
    const onFull = () => setFull(Boolean(document.fullscreenElement));
    onSize();
    query.addEventListener('change', onSize);
    document.addEventListener('fullscreenchange', onFull);
    return () => {
      document.body.style.overflow = overflow;
      query.removeEventListener('change', onSize);
      document.removeEventListener('fullscreenchange', onFull);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [role="tab"], [role="radio"]')) return;
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const record = (what: string, source = t('This demo', 'Ovaj demo')) => setEvents((list) => [{ time: now(), what, source, you: true }, ...list]);

  const stageLabel: Record<Stage, string> = {
    site: t('Demo site · made-up business', 'Demo sajt · izmišljena firma'),
    code: t('The code', 'Kod'),
    seo: t('Google and AI', 'Google i AI'),
    tracking: t('Your dashboard', 'Vaš panel'),
    report: t('Monthly report', 'Mesečni izveštaj'),
    done: t('Summary', 'Pregled'),
  };

  // Rendered into <body>, so no section's stacking or clipping (the phone layout rounds and isolates them) can hold it.
  if (!mounted || !host) return null;
  // translate="no": a browser translating the page rewrites text React still updates, which crashes it.
  return createPortal(
    <div translate="no" role="dialog" aria-modal="true" aria-label={t('WebTano demo', 'WebTano demo')} className="fixed inset-0 z-[80] flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-3 bg-ink-950 px-4 text-white sm:gap-5 sm:px-5">
        <span className="flex shrink-0 items-center gap-2 font-display text-[15px]">
          WebTano
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-accent uppercase ring-1 ring-accent/30">Demo</span>
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex flex-1 gap-1">
            {all.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`${t('Step', 'Korak')} ${i + 1}: ${s.title}`}
                aria-current={i === index ? 'step' : undefined}
                className="group flex-1 py-3"
              >
                <span className={`block h-1 rounded-full transition-colors duration-300 ${i <= index ? 'bg-accent' : 'bg-white/15 group-hover:bg-white/30'}`} />
              </button>
            ))}
          </div>
          <span className="shrink-0 font-mono text-xs text-white/50">
            {index + 1}/{all.length}
          </span>
        </div>
        {step.stage === 'site' && !small && (
          <div className="flex shrink-0 rounded-full bg-white/[0.06] p-0.5 text-xs font-semibold ring-1 ring-white/10">
            {(
              [
                ['desktop', Monitor, t('Computer', 'Računar')],
                ['phone', Smartphone, t('Phone', 'Telefon')],
              ] as const
            ).map(([value, Icon, label]) => {
              const on = (value === 'phone') === phone;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDevice(value)}
                  disabled={step.phone}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${on ? 'bg-white text-ink-950' : 'text-white/60 hover:text-white'}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  <span className="max-md:hidden">{label}</span>
                </button>
              );
            })}
          </div>
        )}
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={t('Full screen', 'Ceo ekran')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 transition hover:text-white max-sm:hidden"
        >
          {full ? <Minimize2 className="h-4 w-4" aria-hidden /> : <Maximize2 className="h-4 w-4" aria-hidden />}
        </button>
        <Link
          href={lp('/')}
          aria-label={t('Close the demo', 'Zatvori demo')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 transition hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 max-lg:flex-col">
        {/* Stage */}
        <div className={`relative min-h-0 flex-1 ${step.stage === 'site' ? (phone && !small ? 'bg-ink-900' : 'bg-zinc-100') : 'bg-zinc-50'}`}>
          {step.stage === 'site' ? (
            <div className={`h-full ${small ? '' : phone ? 'p-6' : 'p-5'}`}>
              <DemoSite
                block={step.block}
                phone={phone}
                bare={small}
                path={path}
                onPath={(p, label) => {
                  setPath(p);
                  record(`${t('Viewed', 'Pregled')} ${label}`, t('Google search', 'Google pretraga'));
                }}
                onCall={() => {
                  record(t('Call tapped', 'Klik na poziv'), 'Google Maps');
                  setToast(t('Call tapped. It is now in your tracking (step 8).', 'Klik na poziv je zabeležen (vidite ga u 8. koraku).'));
                }}
                onSend={(name, service) => {
                  record(`${t('Enquiry', 'Upit')}: ${name || t('Visitor', 'Posetilac')} · ${service}`, 'Google Ads');
                  setToast(`${t('New enquiry', 'Novi upit')}: ${name || t('Visitor', 'Posetilac')} · ${service}`);
                }}
              />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-4 sm:p-8 lg:p-10">
              <div className="mx-auto max-w-3xl">
                {step.stage === 'code' && <CodeStage />}
                {step.stage === 'seo' && <SeoStage />}
                {step.stage === 'tracking' && <TrackingStage events={events} />}
                {step.stage === 'report' && <ReportStage />}
                {step.stage === 'done' && <DoneStage all={all} onPick={go} />}
              </div>
            </div>
          )}

          {/* The owner's phone alert, as it would pop up for a real enquiry. */}
          <div
            role="status"
            className={`pointer-events-none absolute inset-x-3 top-4 z-20 mx-auto max-w-sm transition duration-500 ${toast ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}
          >
            {toast && (
              <div className="flex items-start gap-3 rounded-2xl bg-white/95 p-3.5 shadow-float ring-1 ring-zinc-200 backdrop-blur">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-accent">
                  <BellRing className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                    WebTano · {t('now', 'upravo')}
                  </p>
                  <p className="text-sm font-medium text-ink-950">{toast}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Explanation: a side panel on computers, a bottom sheet on phones. */}
        <aside className="flex shrink-0 flex-col border-zinc-200 bg-white max-lg:max-h-[46%] max-lg:border-t max-lg:shadow-[0_-8px_24px_-12px_rgb(10_14_30/0.18)] lg:w-[420px] lg:border-l">
          <div ref={panelRef} className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-4 max-lg:px-5 max-lg:pt-4" aria-live="polite">
            <p className="font-mono text-[11px] tracking-[0.14em] text-azure-700 uppercase">
              {t('Step', 'Korak')} {index + 1} · {stageLabel[step.stage]}
            </p>
            <h2 className="mt-2 font-display text-2xl text-balance text-ink-950 max-lg:text-xl">{step.title}</h2>
            <p className="mt-3 leading-relaxed text-pretty text-zinc-600 max-lg:mt-2 max-lg:text-[15px] max-lg:leading-snug">{step.text}</p>

            {step.wrong && (
              <p className="mt-4 flex gap-2.5 rounded-2xl bg-red-50/70 px-4 py-3 text-sm leading-snug text-red-900/80 ring-1 ring-red-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                <span>
                  <strong className="font-semibold text-red-900">{t('What we usually find: ', 'Šta najčešće zateknemo: ')}</strong>
                  {step.wrong}
                </span>
              </p>
            )}

            {step.gets.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {step.gets.map((g) => (
                  <li key={g} className="inline-flex items-center gap-1.5 rounded-full bg-azure-50 px-3 py-1 text-xs font-medium text-azure-700 ring-1 ring-azure-100">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    {g}
                  </li>
                ))}
              </ul>
            )}

            {step.tryIt && (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-950">
                <Hand className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                {step.tryIt}
              </p>
            )}

            {step.stage === 'done' && (
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={lp('/#hero-form')}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-accent-dark"
                >
                  {t('Get a free website audit', 'Zatražite besplatnu analizu')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
                <Link
                  href={lp('/pricing')}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-ink-950 ring-1 ring-zinc-200 transition hover:ring-zinc-300"
                >
                  {t('See pricing', 'Pogledajte cene')}
                </Link>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-100 px-6 py-4 max-lg:px-5 max-lg:py-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-600 ring-1 ring-zinc-200 transition hover:text-ink-950 hover:ring-zinc-300 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t('Back', 'Nazad')}
            </button>
            <span className="text-xs text-zinc-400 max-lg:hidden">{t('or use ← →', 'ili strelice ← →')}</span>
            {index < last ? (
              <button
                type="button"
                onClick={() => go(index + 1)}
                className="group inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
              >
                {t('Next', 'Dalje')}
                <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go(0)}
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-600 ring-1 ring-zinc-200 transition hover:text-ink-950"
              >
                {t('Start over', 'Ispočetka')}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>,
    host,
  );
}

/* ---------- Under the hood ---------- */

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-2.5">
        <p className="text-sm font-semibold text-ink-950">{title}</p>
        {note && <span className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{note}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function CodeStage() {
  const t = useT();
  const ours = [
    ['page.html', '14 KB'],
    ['styles.css', '9 KB'],
    ['font.woff2', '28 KB'],
    ['hero-390w.webp', '36 KB'],
  ];
  const theirs = [
    'theme.css',
    'page-builder.css',
    'page-builder.js',
    'jquery.js',
    'slider-plugin.js',
    'slider-plugin.css',
    'contact-form-plugin.js',
    'chat-widget.js',
    'popup-plugin.js',
    'social-icons.css',
    'google-fonts (4)',
    'hero-photo.jpg',
  ];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title={t('Our page loads', 'Naša stranica učitava')} note={t('Illustration', 'Ilustracija')}>
          <ul className="space-y-1.5 font-mono text-[12px]">
            {ours.map(([f, size]) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                <span className="flex-1 text-ink-950">{f}</span>
                <span className="text-zinc-400">{size}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-zinc-500">{t('Only what this page uses. The photo is cut to the phone’s width.', 'Samo ono što ova stranica koristi. Slika je isečena na širinu telefona.')}</p>
        </Panel>
        <Panel title={t('A typical theme loads', 'Tipična tema učitava')} note={t('Illustration', 'Ilustracija')}>
          <ul className="grid grid-cols-1 gap-1 font-mono text-[12px] text-zinc-500">
            {theirs.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" aria-hidden />
                {f}
              </li>
            ))}
            <li className="text-zinc-400">… {t('and more on every page', 'i još, na svakoj stranici')}</li>
          </ul>
        </Panel>
      </div>
      <Panel title={t('What the call button really is', 'Šta je zapravo dugme za poziv')} note={t('Code', 'Kod')}>
        <pre className="overflow-x-auto rounded-xl bg-ink-975 p-4 font-mono text-[12px] leading-relaxed text-white/80">
          <span className="text-white/40">{t('// a real link, so a tap dials on any phone', '// pravi link, pa dodir zove sa bilo kog telefona')}</span>
          {'\n'}
          <span className="text-accent">{'<a'}</span> <span className="text-amber-300">href</span>=&quot;tel:+15550102040&quot;
          {'\n   '}
          <span className="text-amber-300">onClick</span>={'{'}() =&gt; track(&apos;call&apos;){'}'}
          <span className="text-accent">{'>'}</span>
          {'\n  '}
          {t('Call', 'Pozovite')}
          {'\n'}
          <span className="text-accent">{'</a>'}</span>
        </pre>
      </Panel>
      <div className="grid grid-cols-4 gap-2">
        {(
          [
            [t('Speed', 'Brzina'), 98],
            [t('Accessibility', 'Pristupačnost'), 100],
            [t('Best practices', 'Dobra praksa'), 100],
            ['SEO', 100],
          ] as const
        ).map(([label, score]) => (
          <div key={label} className="rounded-2xl bg-white p-3 text-center ring-1 ring-zinc-200">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full font-mono text-sm font-semibold text-emerald-700 ring-[3px] ring-emerald-500">
              {score}
            </span>
            <span className="mt-2 block truncate text-[11px] text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-[10px] tracking-wide text-zinc-400 uppercase">
        {t('Google Lighthouse scores, sample. You get the real ones for your site.', 'Google Lighthouse ocene, primer. Za vaš sajt dobijate prave.')}
      </p>
    </div>
  );
}

function SeoStage() {
  const t = useT();
  const sr = useLang() === 'sr';
  const [view, setView] = useState<'google' | 'code' | 'ai'>('google');
  const tabs = [
    ['google', Search, t('What customers see', 'Šta vidi kupac')],
    ['code', Code2, t('What Google reads', 'Šta čita Google')],
    ['ai', Sparkles, t('What AI answers', 'Šta odgovori AI')],
  ] as const;
  return (
    <div className="space-y-3">
      <div role="tablist" aria-label={t('Views', 'Prikazi')} className="grid grid-cols-3 gap-1 rounded-2xl bg-zinc-100 p-1">
        {tabs.map(([value, Icon, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={view === value}
            onClick={() => setView(value)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold transition ${view === value ? 'bg-white text-ink-950 shadow-sm' : 'text-zinc-500 hover:text-ink-950'}`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>

      {view === 'google' && (
        <Panel title={t('Google search', 'Google pretraga')} note={t('Illustration', 'Ilustracija')}>
          <p className="flex items-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-sm text-ink-950 ring-1 ring-zinc-200">
            <Search className="h-4 w-4 text-zinc-400" aria-hidden />
            {t('ac repair same day springfield', 'servis klima isti dan novi sad')}
          </p>
          <div className="mt-4 rounded-xl p-1">
            <p className="text-[12px] text-zinc-500">{sr ? 'summitklima.rs › usluge' : 'summitheatingair.com › services'}</p>
            <p className="mt-0.5 text-[17px] leading-snug text-[#1a0dab]">
              {t('AC Repair in Springfield, Same Day | Summit Heating & Air', 'Servis klima Novi Sad, isti dan | Summit klima i grejanje')}
            </p>
            <p className="mt-1 text-[12px] text-zinc-500">
              <span className="text-amber-500">★★★★★</span> {t('Rating: 4.9 · 312 reviews', 'Ocena: 4,9 · 312 ocena')}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-zinc-600">
              {t(
                'Licensed technicians, same-day repairs and a fixed price before we start. 2-year guarantee. Call or book online.',
                'Licencirani serviseri, popravka isti dan i fiksna cena pre početka. Garancija 2 godine. Pozovite ili zakažite online.',
              )}
            </p>
          </div>
          <p className="mt-4 text-[12px] leading-snug text-zinc-500">
            {t(
              'The title, the description and the stars come from the page itself. We write them; Google only displays them.',
              'Naslov, opis i zvezdice dolaze sa same stranice. Mi ih pišemo, Google ih samo prikazuje.',
            )}
          </p>
        </Panel>
      )}

      {view === 'code' && (
        <Panel title={t('Structured data, hidden in the page', 'Strukturirani podaci, skriveni u stranici')} note={t('Code', 'Kod')}>
          <pre className="overflow-x-auto rounded-xl bg-ink-975 p-4 font-mono text-[12px] leading-relaxed text-white/80">
            {`{
  "@type": "HVACBusiness",
  "name": "${sr ? 'Summit klima i grejanje' : 'Summit Heating & Air'}",
  "telephone": "${sr ? '+381 21 555 0100' : '+1 555 010 2040'}",
  "address": "${sr ? 'Bulevar oslobođenja 14, Novi Sad' : '14 Oak Street, Springfield'}",
  "openingHours": ["Mo-Fr 07:00-19:00", "Sa 08:00-14:00"],
  "areaServed": ${sr ? '["Novi Sad", "Petrovaradin", "Veternik", "Futog"]' : '["Springfield", "Riverside", "Oak Park", "Fairview"]'},
  "aggregateRating": { "ratingValue": 4.9, "reviewCount": 312 }
}`}
          </pre>
          <p className="mt-3 text-[12px] leading-snug text-zinc-500">
            {t(
              'Visitors never see this. Google, Maps and AI assistants read it to know exactly who you are, where you work and when you are open.',
              'Posetioci ovo ne vide. Google, Mape i AI asistenti ga čitaju da bi tačno znali ko ste, gde radite i kada radite.',
            )}
          </p>
        </Panel>
      )}

      {view === 'ai' && (
        <Panel title={t('An AI assistant', 'AI asistent')} note={t('Illustration', 'Ilustracija')}>
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-zinc-100 px-4 py-2 text-[13px] text-ink-950">
            {t('Who can fix my AC today in Springfield?', 'Ko može danas da popravi klimu u Novom Sadu?')}
          </p>
          <div className="mt-3 flex gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-950 text-accent">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            </span>
            <p className="rounded-2xl rounded-tl-md bg-azure-50 px-4 py-2 text-[13px] leading-snug text-ink-950 ring-1 ring-azure-100">
              {t(
                'Summit Heating & Air offers same-day AC repair in Springfield, gives a fixed price before starting and has a 4.9 rating from 312 reviews.',
                'Summit klima i grejanje radi servis klima isti dan u Novom Sadu, daje fiksnu cenu pre početka i ima ocenu 4,9 iz 312 recenzija.',
              )}
            </p>
          </div>
          <p className="mt-4 text-[12px] leading-snug text-zinc-500">
            {t(
              'AI can only recommend what it can read and trust. Clear pages and structured data give it the facts; nobody can promise the answer, but without them you are not even in the running.',
              'AI može da preporuči samo ono što može da pročita i čemu veruje. Jasne stranice i strukturirani podaci mu daju činjenice. Odgovor niko ne može da garantuje, ali bez njih niste ni u igri.',
            )}
          </p>
        </Panel>
      )}
    </div>
  );
}

function TrackingStage({ events }: { events: Event[] }) {
  const t = useT();
  const sample: Event[] = [
    { time: '16:42', what: t('Call tapped', 'Klik na poziv'), source: 'Google Maps' },
    { time: '14:10', what: `${t('Enquiry', 'Upit')}: Milan · ${t('New install', 'Ugradnja')}`, source: 'Google Ads' },
    { time: '11:25', what: t('Call tapped', 'Klik na poziv'), source: t('Google search', 'Google pretraga') },
    { time: '09:03', what: `${t('Enquiry', 'Upit')}: Ivana · ${t('AC not cooling', 'Klima ne hladi')}`, source: 'Facebook' },
  ];
  const list = [...events, ...sample];
  const bySource = [
    ['Google Maps', 9, 41],
    [t('Google search', 'Google pretraga'), 7, 32],
    ['Google Ads', 5, 23],
    ['Facebook', 1, 4],
  ] as const;
  return (
    <div className="space-y-4">
      <Panel title={t('Today’s enquiries and calls', 'Današnji upiti i pozivi')} note={events.length ? t('Yours on top', 'Vaši na vrhu') : t('Sample data', 'Primer podaci')}>
        {events.length === 0 && (
          <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-900 ring-1 ring-amber-100">
            {t('Go back and tap Call or send the form: your clicks show up here.', 'Vratite se i kliknite „Pozovite” ili pošaljite formu: vaši klikovi se pojave ovde.')}
          </p>
        )}
        <ul className="divide-y divide-zinc-100">
          {list.slice(0, 7).map((e, i) => (
            <li key={`${e.time}-${i}`} className={`flex items-center gap-3 py-2 text-[13px] ${e.you ? 'font-medium' : ''}`}>
              <span className="w-10 font-mono text-[11px] text-zinc-400">{e.time}</span>
              <span className="min-w-0 flex-1 truncate text-ink-950">
                {e.what}
                {e.you && <span className="ml-2 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-azure-700">{t('you', 'vi')}</span>}
              </span>
              <span className="shrink-0 rounded-full bg-azure-50 px-2 py-0.5 text-[11px] font-medium text-azure-700 ring-1 ring-azure-100">{e.source}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title={t('This month, by source', 'Ovaj mesec, po izvoru')} note={t('Sample data', 'Primer podaci')}>
        <ul className="space-y-2.5">
          {bySource.map(([source, count, pct]) => (
            <li key={source} className="text-[13px]">
              <div className="flex justify-between">
                <span className="text-ink-950">{source}</span>
                <span className="font-mono text-zinc-500">{count}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-gradient-to-r from-accent to-azure-600" style={{ width: `${pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <Link href="/demo/report" className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-azure-700 hover:text-ink-950">
          {t('Open the full sample report', 'Otvorite ceo primer izveštaja')}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </Link>
      </Panel>
    </div>
  );
}

function ReportStage() {
  const t = useT();
  const sr = useLang() === 'sr';
  const kpis = [
    [t('Enquiries', 'Upiti'), '22', '+29%'],
    [t('Calls', 'Pozivi'), '14', '+17%'],
    [t('Forms', 'Forme'), '8', '+60%'],
    [t('Cost per enquiry', 'Cena po upitu'), sr ? '1.360 din' : '$12', '−18%'],
  ] as const;
  const weeks = [3, 5, 6, 8];
  const sources = [
    ['Google Maps', 9],
    [t('Google search', 'Google pretraga'), 7],
    ['Google Ads', 5],
    ['Facebook', 1],
  ] as const;
  const done = [
    t('Added a page for heat pump servicing', 'Dodata stranica za servis toplotnih pumpi'),
    t('Answered 6 new Google reviews', 'Odgovoreno na 6 novih Google recenzija'),
    t('Moved ad budget from Facebook to Google', 'Budžet za oglase prebačen sa Facebook-a na Google'),
  ];
  return (
    <div>
      <div className="relative mx-auto max-w-[560px]">
        {/* A second sheet behind, so it reads as a multi-page PDF. */}
        <div aria-hidden className="absolute inset-x-6 -bottom-3 top-3 rotate-[1.5deg] rounded-md bg-white shadow-[0_20px_50px_-24px_rgba(5,6,10,0.35)] ring-1 ring-zinc-200" />
        <div className="relative rounded-md bg-white p-5 shadow-[0_30px_70px_-30px_rgba(5,6,10,0.45)] ring-1 ring-zinc-200 sm:p-7">
          <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 font-mono text-[10px] font-bold tracking-wider text-white shadow-md">
            <FileText className="h-3 w-3" aria-hidden />
            PDF
          </span>
          <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <p className="font-mono text-[9px] tracking-[0.16em] text-zinc-400 uppercase">{t('Monthly report', 'Mesečni izveštaj')}</p>
              <p className="mt-1 font-display text-lg leading-tight text-ink-950">{t('Summit Heating & Air', 'Summit klima i grejanje')}</p>
              <p className="text-[11px] text-zinc-500">{t('October 2026 · compared with September', 'Oktobar 2026 · u odnosu na septembar')}</p>
            </div>
            <span className="font-display text-[13px] text-ink-950">
              Web<span className="text-azure-600">Tano</span>
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {kpis.map(([label, value, change]) => (
              <div key={label} className="rounded-lg bg-zinc-50 px-3 py-2.5 ring-1 ring-zinc-100">
                <p className="text-[10px] text-zinc-500">{label}</p>
                <p className="mt-0.5 font-display text-[19px] leading-none text-ink-950">{value}</p>
                <p className="mt-1 text-[10px] font-semibold text-emerald-600">{change}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold text-ink-950">{t('Enquiries by week', 'Upiti po nedeljama')}</p>
              <div className="mt-2 flex h-20 items-end gap-2 border-b border-zinc-200">
                {weeks.map((w, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[9px] text-zinc-500">{w}</span>
                    <div className="w-full rounded-t bg-gradient-to-t from-azure-600 to-accent" style={{ height: `${w * 7}px` }} />
                  </div>
                ))}
              </div>
              <div className="mt-1 flex gap-2 text-center text-[9px] text-zinc-400">
                {weeks.map((_, i) => (
                  <span key={i} className="flex-1">{t('Wk', 'Ned')} {i + 1}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-950">{t('Where they came from', 'Odakle su došli')}</p>
              <ul className="mt-2 space-y-1.5">
                {sources.map(([source, n]) => (
                  <li key={source} className="text-[10px]">
                    <div className="flex justify-between text-zinc-600">
                      <span>{source}</span>
                      <span className="font-mono">{n}</span>
                    </div>
                    <div className="mt-0.5 h-1.5 rounded-full bg-zinc-100">
                      <div className="h-full rounded-full bg-azure-600" style={{ width: `${(n / 9) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-azure-50/70 p-3 ring-1 ring-azure-100">
            <p className="text-[11px] font-semibold text-ink-950">{t('What we did this month', 'Šta smo radili ovog meseca')}</p>
            <ul className="mt-1.5 space-y-1">
              {done.map((d) => (
                <li key={d} className="flex items-start gap-1.5 text-[10px] text-zinc-600">
                  <Check className="mt-px h-3 w-3 shrink-0 text-azure-600" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 flex justify-between border-t border-zinc-100 pt-2 font-mono text-[9px] text-zinc-400">
            <span>{t('Sample data', 'Primer podaci')}</span>
            <span>1 / 3</span>
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/demo/report?lang=${sr ? 'sr' : 'en'}`}
          target="_blank"
          className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-900"
        >
          <Printer className="h-4 w-4 text-accent" aria-hidden />
          {t('Open the full sample report', 'Otvorite ceo primer izveštaja')}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function DoneStage({ all, onPick }: { all: Step[]; onPick: (i: number) => void }) {
  const t = useT();
  return (
    <div className="rounded-3xl bg-ink-975 p-6 text-white ring-1 ring-ink-900 sm:p-8">
      <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">{t('Included with every site', 'Uz svaki sajt')}</p>
      <ol className="mt-5 space-y-2">
        {all.slice(0, -1).map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => onPick(i)}
              className="flex w-full items-start gap-3 rounded-2xl bg-white/[0.03] p-3.5 text-left ring-1 ring-white/[0.08] transition hover:bg-white/[0.06]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-ink-950">
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[15px]">{s.title}</span>
                <span className="mt-0.5 block text-[12px] text-white/50">{s.gets.join(' · ')}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
