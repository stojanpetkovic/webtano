'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Check,
  Code2,
  Hand,
  Lock,
  Monitor,
  Phone,
  Search,
  Smartphone,
  Sparkles,
  Star,
} from 'lucide-react';
import { useLang, useLocalePath, useT } from '@/components/i18n/LangProvider';
import type { T } from '@/lib/i18n';

type Stage = 'site' | 'code' | 'seo' | 'tracking' | 'done';
type Block = 'hero' | 'trust' | 'services' | 'form' | 'callbar';
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
  const tourRef = useRef<HTMLDivElement>(null);
  const step = all[index];
  const phone = step.phone || device === 'phone';
  const last = all.length - 1;

  const go = (next: number) => {
    setIndex(Math.max(0, Math.min(last, next)));
    setToast(null);
    // On phones the explanation sits under the demo, so bring the tour back to its top.
    if (window.matchMedia('(max-width: 1023px)').matches) tourRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [role="tab"], [role="radio"]')) return;
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const record = (what: string, source = t('This demo', 'Ovaj demo')) => setEvents((list) => [{ time: now(), what, source, you: true }, ...list]);

  const stageLabel: Record<Stage, string> = {
    site: t('Demo site', 'Demo sajt'),
    code: t('The code', 'Kod'),
    seo: t('Google and AI', 'Google i AI'),
    tracking: t('Your dashboard', 'Vaš panel'),
    done: t('Summary', 'Pregled'),
  };

  return (
    <div ref={tourRef} className="scroll-mt-20">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-3 max-md:mb-4">
        <span className="font-mono text-xs text-zinc-500">
          {String(index + 1).padStart(2, '0')} / {String(all.length).padStart(2, '0')}
        </span>
        <div className="flex flex-1 gap-1">
          {all.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => go(i)}
              aria-label={`${t('Step', 'Korak')} ${i + 1}: ${s.title}`}
              aria-current={i === index ? 'step' : undefined}
              className="group flex-1 py-2"
            >
              <span className={`block h-1.5 rounded-full transition-colors duration-300 ${i <= index ? 'bg-accent' : 'bg-zinc-200 group-hover:bg-zinc-300'}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 max-lg:flex max-lg:flex-col-reverse lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        {/* Explanation */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-zinc-200/80 max-md:p-5 sm:p-7" aria-live="polite">
            <p className="font-mono text-[11px] tracking-[0.14em] text-azure-700 uppercase">
              {t('Step', 'Korak')} {index + 1} · {stageLabel[step.stage]}
            </p>
            <h2 className="mt-2 font-display text-2xl text-balance text-ink-950 sm:text-3xl">{step.title}</h2>
            <p className="mt-3 leading-relaxed text-pretty text-zinc-600">{step.text}</p>

            {step.wrong && (
              <p className="mt-5 flex gap-2.5 rounded-2xl bg-red-50/70 px-4 py-3 text-sm leading-snug text-red-900/80 ring-1 ring-red-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                <span>
                  <strong className="font-semibold text-red-900">{t('What we usually find: ', 'Šta najčešće zateknemo: ')}</strong>
                  {step.wrong}
                </span>
              </p>
            )}

            {step.gets.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {step.gets.map((g) => (
                  <li key={g} className="inline-flex items-center gap-1.5 rounded-full bg-azure-50 px-3 py-1 text-xs font-medium text-azure-700 ring-1 ring-azure-100">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    {g}
                  </li>
                ))}
              </ul>
            )}

            {step.tryIt && (
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-ink-950">
                <Hand className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                {step.tryIt}
              </p>
            )}

            {step.stage === 'done' && (
              <div className="mt-6 flex flex-wrap gap-2">
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

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-zinc-100 pt-5">
              <button
                type="button"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-600 ring-1 ring-zinc-200 transition hover:text-ink-950 hover:ring-zinc-300 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                {t('Back', 'Nazad')}
              </button>
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
            <p className="mt-3 text-center text-xs text-zinc-400 max-lg:hidden">{t('Tip: use the ← → keys.', 'Savet: koristite strelice ← →.')}</p>
          </div>
        </div>

        {/* Stage */}
        <div className="relative">
          {step.stage === 'site' && (
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase">
                {t('Made-up business, sample content', 'Izmišljena firma, primer sadržaja')}
              </span>
              <div className="flex rounded-full bg-zinc-100 p-0.5 text-xs font-semibold max-sm:hidden">
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
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${on ? 'bg-white text-ink-950 shadow-sm' : 'text-zinc-500 hover:text-ink-950'}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step.stage === 'site' && (
            <DemoSite
              block={step.block}
              phone={phone}
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
          )}
          {step.stage === 'code' && <CodeStage />}
          {step.stage === 'seo' && <SeoStage />}
          {step.stage === 'tracking' && <TrackingStage events={events} />}
          {step.stage === 'done' && <DoneStage all={all} onPick={go} />}

          {/* The owner's phone alert, as it would pop up for a real enquiry. */}
          <div
            role="status"
            className={`pointer-events-none absolute inset-x-3 top-12 z-20 mx-auto max-w-sm transition duration-500 ${toast ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}
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
      </div>
    </div>
  );
}

/* ---------- The demo business's site ---------- */

function DemoSite({
  block,
  phone,
  path,
  onPath,
  onCall,
  onSend,
}: {
  block?: Block;
  phone: boolean;
  path: string;
  onPath: (path: string, label: string) => void;
  onCall: () => void;
  onSend: (name: string, service: string) => void;
}) {
  const t = useT();
  const scroller = useRef<HTMLDivElement>(null);
  const refs = useRef<Partial<Record<Block, HTMLElement | null>>>({});
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [service, setService] = useState(0);
  const [sent, setSent] = useState(false);

  const services = [
    { slug: 'checkups', sr: 'pregledi', name: t('Check-up and cleaning', 'Pregled i čišćenje'), price: t('from $95', 'od 3.500 din') },
    { slug: 'implants', sr: 'implantati', name: t('Dental implants', 'Implantati'), price: t('from $1,900', 'od 75.000 din') },
    { slug: 'whitening', sr: 'izbeljivanje', name: t('Teeth whitening', 'Izbeljivanje zuba'), price: t('from $290', 'od 12.000 din') },
    { slug: 'emergency', sr: 'hitni-slucajevi', name: t('Same-day emergencies', 'Hitni slučajevi'), price: t('same day', 'isti dan') },
  ];

  // Bring the block this step talks about into view inside the frame, without moving the page.
  useEffect(() => {
    const box = scroller.current;
    const el = block && block !== 'callbar' ? refs.current[block] : null;
    if (!box) return;
    box.scrollTo({ top: el ? Math.max(0, el.offsetTop - 12) : 0, behavior: 'smooth' });
  }, [block, phone]);

  const focus = (b: Block) =>
    block === b ? 'relative z-[1] rounded-2xl ring-2 ring-accent ring-offset-4 ring-offset-white' : block ? 'opacity-35 transition-opacity' : '';
  const tag = (b: Block, label: string) =>
    block === b && (
      <span className="absolute -top-3 left-3 z-[2] rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-ink-950 uppercase shadow-glow">
        {label}
      </span>
    );
  const sr = useLang() === 'sr';
  const addr = `lumendental.${sr ? 'rs' : 'com'}${path === '/' ? '' : path}`;

  return (
    <div
      className={`mx-auto overflow-hidden bg-white ring-1 ring-zinc-200 transition-[max-width] duration-500 ${
        phone ? 'max-w-[360px] rounded-[2.2rem] p-2 shadow-float ring-ink-900/80 [background:var(--color-ink-950)]' : 'max-w-full rounded-2xl shadow-lift'
      }`}
    >
      <div className={phone ? 'overflow-hidden rounded-[1.8rem] bg-white' : ''}>
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2">
          {!phone && (
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            </span>
          )}
          <span className="flex min-w-0 flex-1 items-center justify-center gap-1 truncate rounded-md bg-white px-2.5 py-1 text-[11px] text-zinc-500 ring-1 ring-zinc-200">
            <Lock className="h-3 w-3 shrink-0 text-emerald-600" aria-hidden />
            <span className="truncate">{addr}</span>
          </span>
        </div>

        <div className="relative">
          <div ref={scroller} className={`overflow-y-auto overscroll-contain ${phone ? 'h-[520px]' : 'h-[540px] max-sm:h-[460px]'}`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <span className="flex items-center gap-2 font-display text-[15px] text-ink-950">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-[11px] font-bold text-white">L</span>
                Lumen Dental
              </span>
              {!phone && (
                <span className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>{t('Services', 'Usluge')}</span>
                  <span>{t('Reviews', 'Utisci')}</span>
                  <span>{t('Contact', 'Kontakt')}</span>
                </span>
              )}
              <button type="button" onClick={onCall} className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white">
                <Phone className="h-3 w-3" aria-hidden />
                {phone ? t('Call', 'Pozovite') : t('(555) 010-2040', '021 555 0100')}
              </button>
            </div>

            <div className="space-y-6 p-4 pb-24">
              {/* Hero */}
              <section
                ref={(el) => {
                  refs.current.hero = el;
                }}
                className={`relative ${focus('hero')}`}
              >
                {tag('hero', t('First screen', 'Prvi ekran'))}
                <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-white p-5 ring-1 ring-teal-100">
                  <p className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-teal-700 ring-1 ring-teal-100">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden /> 4.9 · {t('186 Google reviews', '186 Google ocena')}
                  </p>
                  <h3 className={`mt-3 font-display leading-tight text-ink-950 ${phone ? 'text-[22px]' : 'text-[28px]'}`}>
                    {t('A gentle dentist in Springfield, open evenings and Saturdays', 'Stomatolog u Novom Sadu, radimo i uveče i subotom')}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-zinc-600">
                    {t('Check-ups, implants and same-day emergencies. Upfront prices, no surprises.', 'Pregledi, implantati i hitni slučajevi isti dan. Cena unapred, bez iznenađenja.')}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white">{t('Book a visit', 'Zakažite pregled')}</span>
                    <button
                      type="button"
                      onClick={onCall}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-teal-700 ring-1 ring-teal-200 transition hover:ring-teal-400"
                    >
                      <Phone className="h-3 w-3" aria-hidden />
                      {t('Call', 'Pozovite')}
                    </button>
                  </div>
                </div>
              </section>

              {/* Trust */}
              <section
                ref={(el) => {
                  refs.current.trust = el;
                }}
                className={`relative ${focus('trust')}`}
              >
                {tag('trust', t('Proof', 'Dokaz'))}
                <div className={`grid gap-2 ${phone ? '' : 'grid-cols-3'}`}>
                  {[
                    [t('“They fitted me in the same day and explained every step.”', '„Primili su me isti dan i objasnili svaki korak.”'), 'Ana M.'],
                    [t('“First dentist I am not nervous about.”', '„Prvi zubar kod koga nisam nervozan.”'), 'Marko P.'],
                    [t('“Clear price before they started. Exactly what I paid.”', '„Cenu su rekli unapred. Platio sam tačno toliko.”'), 'Jelena S.'],
                  ].map(([quote, who]) => (
                    <figure key={who} className="rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
                      <p className="text-amber-400" aria-hidden>
                        ★★★★★
                      </p>
                      <blockquote className="mt-1 text-[12px] leading-snug text-zinc-700">{quote}</blockquote>
                      <figcaption className="mt-1.5 text-[11px] text-zinc-400">{who} · Google</figcaption>
                    </figure>
                  ))}
                </div>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-500">
                  <span>✓ {t('12 years in Springfield', '12 godina u Novom Sadu')}</span>
                  <span>✓ {t('Price agreed before treatment', 'Cena dogovorena pre tretmana')}</span>
                </p>
              </section>

              {/* Services */}
              <section
                ref={(el) => {
                  refs.current.services = el;
                }}
                className={`relative ${focus('services')}`}
              >
                {tag('services', t('Service pages', 'Stranice usluga'))}
                <h4 className="font-display text-[17px] text-ink-950">{t('What we do', 'Usluge')}</h4>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {services.map((s) => {
                    const href = `/${sr ? 'usluge' : 'services'}/${sr ? s.sr : s.slug}`;
                    const on = path === href;
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => onPath(href, s.name)}
                        className={`rounded-xl p-3 text-left ring-1 transition ${on ? 'bg-teal-50 ring-teal-400' : 'bg-white ring-zinc-200 hover:ring-teal-300'}`}
                      >
                        <span className="block text-[13px] font-semibold text-ink-950">{s.name}</span>
                        <span className="mt-0.5 block text-[11px] text-zinc-500">{s.price}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Form */}
              <section
                ref={(el) => {
                  refs.current.form = el;
                }}
                className={`relative ${focus('form')}`}
              >
                {tag('form', t('Enquiry form', 'Forma za upit'))}
                <div className="rounded-2xl bg-ink-950 p-4 text-white">
                  <h4 className="font-display text-[17px]">{t('Book a visit', 'Zakažite pregled')}</h4>
                  {sent ? (
                    <p className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 p-3 text-[13px]">
                      <Check className="h-4 w-4 text-emerald-400" aria-hidden />
                      {t('Thanks! We will call you within the hour.', 'Hvala! Zovemo vas u roku od sat vremena.')}
                    </p>
                  ) : (
                    <form
                      className="mt-3 space-y-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSent(true);
                        onSend(name.trim(), services[service].name);
                      }}
                    >
                      <div className={`grid gap-2 ${phone ? '' : 'grid-cols-2'}`}>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('Your name', 'Vaše ime')}
                          aria-label={t('Your name', 'Vaše ime')}
                          className="h-10 rounded-lg bg-white/10 px-3 text-[13px] text-white placeholder:text-white/40 ring-1 ring-white/15 outline-none focus:ring-accent"
                        />
                        <input
                          value={tel}
                          onChange={(e) => setTel(e.target.value)}
                          placeholder={t('Phone', 'Telefon')}
                          aria-label={t('Phone', 'Telefon')}
                          inputMode="tel"
                          className="h-10 rounded-lg bg-white/10 px-3 text-[13px] text-white placeholder:text-white/40 ring-1 ring-white/15 outline-none focus:ring-accent"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t('What do you need?', 'Šta vam treba?')}>
                        {services.map((s, i) => (
                          <button
                            key={s.slug}
                            type="button"
                            role="radio"
                            aria-checked={service === i}
                            onClick={() => setService(i)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition ${service === i ? 'bg-accent text-ink-950 ring-accent' : 'text-white/70 ring-white/20'}`}
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                      <button type="submit" className="h-10 w-full rounded-lg bg-accent text-[13px] font-semibold text-ink-950">
                        {t('Send', 'Pošaljite')}
                      </button>
                    </form>
                  )}
                </div>
              </section>

              {/* Footer */}
              <div className={`rounded-xl bg-zinc-50 p-3 text-[11px] leading-relaxed text-zinc-500 ${block ? 'opacity-35' : ''}`}>
                Lumen Dental · {t('14 Oak Street, Springfield', 'Bulevar oslobođenja 14, Novi Sad')}
                <br />
                {t('Mon–Fri 8–20 · Sat 9–14', 'Pon–pet 8–20 · Sub 9–14')}
              </div>
            </div>
          </div>

          {/* The call bar phones keep on screen. */}
          {phone && (
            <div className={`absolute inset-x-2 bottom-2 ${block === 'callbar' ? 'rounded-2xl ring-2 ring-accent ring-offset-2' : ''}`}>
              {block === 'callbar' && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap text-ink-950 uppercase shadow-glow">
                  {t('Always on screen', 'Uvek na ekranu')}
                </span>
              )}
              <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-white/95 p-1.5 shadow-lift ring-1 ring-zinc-200 backdrop-blur">
                <button type="button" onClick={onCall} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-teal-600 text-[13px] font-semibold text-white">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {t('Call', 'Pozovite')}
                </button>
                <span className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-100 text-[13px] font-semibold text-ink-950">{t('Book', 'Zakažite')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
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
            {t('dentist open saturday springfield', 'zubar subotom novi sad')}
          </p>
          <div className="mt-4 rounded-xl p-1">
            <p className="text-[12px] text-zinc-500">lumendental.{sr ? 'rs' : 'com'} › {t('services', 'usluge')}</p>
            <p className="mt-0.5 text-[17px] leading-snug text-[#1a0dab]">
              {t('Dentist in Springfield, Open Saturdays | Lumen Dental', 'Stomatolog Novi Sad, radimo subotom | Lumen Dental')}
            </p>
            <p className="mt-1 text-[12px] text-zinc-500">
              <span className="text-amber-500">★★★★★</span> {t('Rating: 4.9 · 186 reviews', 'Ocena: 4,9 · 186 ocena')}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-zinc-600">
              {t(
                'Check-ups, implants and same-day emergencies. Upfront prices, evening and Saturday appointments. Call or book online.',
                'Pregledi, implantati i hitni slučajevi isti dan. Cena unapred, termini uveče i subotom. Pozovite ili zakažite online.',
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
  "@type": "Dentist",
  "name": "Lumen Dental",
  "telephone": "${sr ? '+381 21 555 0100' : '+1 555 010 2040'}",
  "address": "${sr ? 'Bulevar oslobođenja 14, Novi Sad' : '14 Oak Street, Springfield'}",
  "openingHours": ["Mo-Fr 08:00-20:00", "Sa 09:00-14:00"],
  "areaServed": ${sr ? '["Novi Sad", "Petrovaradin", "Veternik"]' : '["Springfield", "Riverside", "Oak Park"]'},
  "aggregateRating": { "ratingValue": 4.9, "reviewCount": 186 }
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
            {t('Which dentist in Springfield is open on Saturday?', 'Koji zubar u Novom Sadu radi subotom?')}
          </p>
          <div className="mt-3 flex gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-950 text-accent">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            </span>
            <p className="rounded-2xl rounded-tl-md bg-azure-50 px-4 py-2 text-[13px] leading-snug text-ink-950 ring-1 ring-azure-100">
              {t(
                'Lumen Dental on Oak Street is open Saturdays 9–14, has a 4.9 rating from 186 reviews and takes same-day emergencies.',
                'Lumen Dental na Bulevaru oslobođenja radi subotom od 9 do 14, ima ocenu 4,9 iz 186 recenzija i prima hitne slučajeve isti dan.',
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
    { time: '14:10', what: `${t('Enquiry', 'Upit')}: Milan · ${t('Dental implants', 'Implantati')}`, source: 'Google Ads' },
    { time: '11:25', what: t('Call tapped', 'Klik na poziv'), source: t('Google search', 'Google pretraga') },
    { time: '09:03', what: `${t('Enquiry', 'Upit')}: Ivana · ${t('Check-up and cleaning', 'Pregled i čišćenje')}`, source: 'Facebook' },
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
