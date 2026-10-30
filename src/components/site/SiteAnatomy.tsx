'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, BarChart3, Check, Code2, LayoutTemplate, PlayCircle, Search } from 'lucide-react';
import { useLocalePath, useT } from '@/components/i18n/LangProvider';
import type { T } from '@/lib/i18n';

type Item = { title: string; text: string; risk: string };
type Layer = { key: 'blocks' | 'code' | 'seo' | 'tracking'; icon: typeof Code2; tab: string; title: string; items: Item[] };

// What every site we build carries, layer by layer, and what it costs when a site lacks it.
const layers = (t: T): Layer[] => [
  {
    key: 'blocks',
    icon: LayoutTemplate,
    tab: t('What visitors see', 'Šta posetilac vidi'),
    title: t('Blocks built to turn a visit into a call', 'Blokovi koji posetu pretvaraju u poziv'),
    items: [
      {
        title: t('A first screen that answers three questions', 'Prvi ekran koji odgovara na tri pitanja'),
        text: t(
          'What you do, where you do it and how to reach you: your offer, your area, your phone number and one clear button, before anyone scrolls.',
          'Šta radite, gde radite i kako da vas dobiju: ponuda, grad, broj telefona i jedno jasno dugme, pre nego što iko skroluje.',
        ),
        risk: t(
          'Without it, visitors have to dig to find out whether you are the right business. On a phone, most just go back to Google.',
          'Bez toga posetilac mora da traži da li ste prava firma. Na telefonu se većina samo vrati na Google.',
        ),
      },
      {
        title: t('Proof that you are trustworthy', 'Dokaz da ste pouzdani'),
        text: t(
          'Real reviews, photos of your own work, years in business and the guarantees you give, placed right where people decide.',
          'Prave recenzije, slike vašeg rada, godine iskustva i garancije koje dajete, tačno tamo gde ljudi odlučuju.',
        ),
        risk: t(
          'A stranger has no reason to pick you over the next result, so they pick the one with the stars.',
          'Neko ko vas ne zna nema razlog da izabere baš vas, pa izabere onoga ko ima zvezdice.',
        ),
      },
      {
        title: t('A page for every service', 'Posebna stranica za svaku uslugu'),
        text: t(
          'Each service gets its own page with prices or a starting point, the questions people ask and a way to book.',
          'Svaka usluga ima svoju stranicu, sa cenom ili okvirom cene, odgovorima na česta pitanja i načinom da se zakaže.',
        ),
        risk: t(
          'Someone searching for one exact service lands on a general page, or more often on a competitor’s page that matches.',
          'Ko traži tačno jednu uslugu, završi na opštoj stranici, ili češće na stranici konkurenta koja baš to opisuje.',
        ),
      },
      {
        title: t('A short form and a call button that follows you', 'Kratka forma i dugme za poziv uvek pri ruci'),
        text: t(
          'Three or four fields with tap-to-pick options, and on phones a call button that stays on screen.',
          'Tri ili četiri polja sa izborom na dodir, a na telefonu dugme za poziv koje stalno stoji na ekranu.',
        ),
        risk: t(
          'Long forms get abandoned halfway, and a plain email link opens an app most people never use.',
          'Duge forme ljudi napuste na pola, a običan email link otvara aplikaciju koju većina ne koristi.',
        ),
      },
    ],
  },
  {
    key: 'code',
    icon: Code2,
    tab: t('Code and speed', 'Kod i brzina'),
    title: t('Clean code you never have to think about', 'Čist kod o kom ne morate da brinete'),
    items: [
      {
        title: t('Hand-built, not a theme with dozens of plugins', 'Pisano ručno, ne tema sa desetinama dodataka'),
        text: t(
          'We write the site in modern code (Next.js), so a page carries only what it needs and nothing waits on an update.',
          'Sajt pišemo u modernom kodu (Next.js), pa stranica nosi samo ono što joj treba i ništa ne čeka ažuriranje.',
        ),
        risk: t(
          'Every plugin adds weight and needs updates. One outdated plugin can break the site or leave a door open to hackers.',
          'Svaki dodatak usporava sajt i traži ažuriranje. Jedan zastareli dodatak može da obori sajt ili ostavi otvorena vrata hakerima.',
        ),
      },
      {
        title: t('Images sized for every screen', 'Slike prilagođene svakom ekranu'),
        text: t(
          'Photos are compressed and served at the size of the screen looking at them, so phones never download a desktop image.',
          'Slike su kompresovane i šalju se u veličini ekrana koji ih gleda, pa telefon nikad ne skida sliku namenjenu računaru.',
        ),
        risk: t(
          'One heavy photo at the top of the page and the visitor stares at a blank screen while your ad budget ticks.',
          'Jedna teška slika na vrhu stranice i posetilac gleda u prazan ekran, dok vam budžet za oglase curi.',
        ),
      },
      {
        title: t('Secure by default', 'Bezbedno od starta'),
        text: t(
          'HTTPS, spam filtering on every form and no public admin login for bots to guess at.',
          'HTTPS, filter za spam na svakoj formi i nema javne admin prijave koju botovi mogu da pogađaju.',
        ),
        risk: t(
          'Browsers flag the site as “not secure”, and spam buries the real enquiries.',
          'Pregledač označi sajt kao „nebezbedan”, a spam zatrpa prave upite.',
        ),
      },
      {
        title: t('Yours, in your name', 'Vaše, na vaše ime'),
        text: t(
          'The domain, the code and every account are in your name. If you ever leave, everything leaves with you.',
          'Domen, kod i svi nalozi su na vaše ime. Ako jednog dana odete, sve ide sa vama.',
        ),
        risk: t(
          'Many owners find out their site belongs to the agency only on the day they want to switch.',
          'Mnogi vlasnici saznaju da sajt pripada agenciji tek onog dana kad požele da promene agenciju.',
        ),
      },
    ],
  },
  {
    key: 'seo',
    icon: Search,
    tab: t('Google and AI', 'Google i AI'),
    title: t('Everything Google and AI need to recommend you', 'Sve što Google i AI traže da bi vas preporučili'),
    items: [
      {
        title: t('A title and description for every page', 'Naslov i opis za svaku stranicu'),
        text: t(
          'The exact text Google shows in its results, written to make someone click on you instead of the next link.',
          'Tačan tekst koji Google prikazuje u rezultatima, napisan tako da ljudi kliknu na vas, a ne na sledeći link.',
        ),
        risk: t(
          'Google writes its own, often from the wrong part of the page, and the result looks like nobody cared.',
          'Google ga napiše sam, često iz pogrešnog dela stranice, i rezultat izgleda zapušteno.',
        ),
      },
      {
        title: t('Structured data in the code', 'Strukturirani podaci u kodu'),
        text: t(
          'A hidden label that tells Google, Maps and ChatGPT your name, address, hours, services and reviews in their own language.',
          'Skrivena oznaka koja Google-u, Mapama i ChatGPT-u na njihovom jeziku kaže ime, adresu, radno vreme, usluge i ocene.',
        ),
        risk: t(
          'They have to guess what you do and where, and they recommend the business they understand better.',
          'Moraju da nagađaju šta radite i gde, pa preporuče firmu koju bolje razumeju.',
        ),
      },
      {
        title: t('Pages for every town you serve', 'Stranice za svaki grad u kom radite'),
        text: t(
          'Real, useful pages for the places you work, so you show up when someone searches “near me” or names their town.',
          'Prave, korisne stranice za mesta u kojima radite, da se pojavite kad neko traži „u blizini” ili upiše svoj grad.',
        ),
        risk: t(
          'You only rank where your office is, and the next town over goes to whoever has a page for it.',
          'Pojavljujete se samo tamo gde vam je kancelarija, a susedni grad uzme onaj ko ima stranicu za njega.',
        ),
      },
      {
        title: t('Google Business Profile tied to the site', 'Google Business profil povezan sa sajtom'),
        text: t(
          'The same name, address and phone everywhere, with the site and the map listing backing each other up.',
          'Isto ime, adresa i telefon svuda, a sajt i profil na mapi jedno drugo potvrđuju.',
        ),
        risk: t(
          'Mismatched details make Google less sure about you, and you slip down the map.',
          'Kad se podaci ne poklapaju, Google je manje siguran u vas i padate niže na mapi.',
        ),
      },
    ],
  },
  {
    key: 'tracking',
    icon: BarChart3,
    tab: t('Tracking', 'Praćenje'),
    title: t('Every enquiry counted, every source named', 'Svaki upit prebrojan, svaki izvor poznat'),
    items: [
      {
        title: t('Enquiries on your phone in seconds', 'Upiti na telefonu za par sekundi'),
        text: t(
          'Every form is saved in your own dashboard and sent to your phone and email the moment it comes in.',
          'Svaka poruka se čuva u vašem panelu i stiže vam na telefon i email istog trenutka.',
        ),
        risk: t(
          'Messages sit in an inbox or a spam folder for days, and the customer has already booked someone else.',
          'Poruke danima stoje u inboxu ili spamu, a kupac je već zakazao kod nekog drugog.',
        ),
      },
      {
        title: t('Calls tracked, not just forms', 'Praćeni i pozivi, ne samo forme'),
        text: t(
          'Every tap on your phone number is recorded with the page it came from, so calls count too.',
          'Svaki dodir na vaš broj telefona se beleži zajedno sa stranicom sa koje je došao, pa se i pozivi broje.',
        ),
        risk: t(
          'Most local customers call, so without this you are blind to the biggest part of what the site brings in.',
          'Većina lokalnih kupaca zove telefonom, pa bez ovoga ne vidite najveći deo onoga što sajt donosi.',
        ),
      },
      {
        title: t('The source of every enquiry', 'Izvor svakog upita'),
        text: t(
          'Google search, Maps, ads, Facebook or a link from another site: each enquiry carries where it came from.',
          'Google pretraga, Mape, oglasi, Facebook ili link sa drugog sajta: uz svaki upit piše odakle je došao.',
        ),
        risk: t(
          'You keep paying for what does not work, because nothing tells you it does not work.',
          'Plaćate i ono što ne radi, jer vam ništa ne govori da ne radi.',
        ),
      },
      {
        title: t('A monthly report in plain language', 'Mesečni izveštaj, razumljivim jezikom'),
        text: t(
          'Enquiries, calls and cost per enquiry, by source, on one page. No jargon, no 40-page PDF.',
          'Upiti, pozivi i cena po upitu, po izvoru, na jednoj stranici. Bez žargona i bez PDF-a od 40 strana.',
        ),
        risk: t(
          'You get clicks and impressions, but no answer to the only question that matters: did it bring customers?',
          'Dobijate klikove i prikaze, ali ne i odgovor na jedino važno pitanje: da li je doneo kupce?',
        ),
      },
    ],
  },
];

const questions = (t: T) => [
  t('Is your phone number on the first screen when the site opens on a phone?', 'Da li se broj telefona vidi na prvom ekranu kad se sajt otvori na telefonu?'),
  t('With Wi-Fi off, does your site show up on your phone in under three seconds?', 'Kad isključite Wi-Fi, da li se sajt na telefonu prikaže za manje od tri sekunde?'),
  t('Does every service you offer have its own page?', 'Da li svaka usluga koju nudite ima svoju stranicu?'),
  t('Does Google show your business with the right hours, address and reviews?', 'Da li Google prikazuje vašu firmu sa tačnim radnim vremenom, adresom i ocenama?'),
  t('When someone fills in your form, is it on your phone within a minute?', 'Kad neko popuni formu, da li vam stigne na telefon za manje od minut?'),
  t('Can you say how many enquiries the site brought last month, and from where?', 'Da li znate koliko upita vam je sajt doneo prošlog meseca i odakle?'),
];

type Answer = 'yes' | 'no' | 'unsure';

/** Sample views for each layer, so the abstract part has something to look at. */
function LayerVisual({ layer }: { layer: Layer['key'] }) {
  const t = useT();
  if (layer === 'blocks') {
    const blocks = [
      ['01', t('First screen: offer, area, phone, button', 'Prvi ekran: ponuda, grad, telefon, dugme'), 'h-24 bg-ink-950 text-white'],
      ['02', t('Reviews and proof', 'Recenzije i dokazi'), 'h-12 bg-white'],
      ['03', t('Service pages', 'Stranice usluga'), 'h-16 bg-white'],
      ['04', t('Short enquiry form', 'Kratka forma za upit'), 'h-14 bg-azure-50'],
    ] as const;
    return (
      <div className="space-y-2">
        {blocks.map(([n, label, cls]) => (
          <div key={n} className={`flex items-center gap-3 rounded-xl px-3.5 ring-1 ring-zinc-200 ${cls}`}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-semibold text-ink-950">{n}</span>
            <span className="text-[13px] font-medium">{label}</span>
          </div>
        ))}
      </div>
    );
  }
  if (layer === 'code') {
    return (
      <div className="space-y-3">
        <pre className="overflow-hidden rounded-xl bg-ink-975 p-4 font-mono text-[11.5px] leading-relaxed text-white/80 ring-1 ring-ink-900">
          <span className="text-white/40">{t('// one light page, nothing extra', '// lagana stranica, ništa višak')}</span>
          {'\n'}
          <span className="text-accent">{'<Image'}</span> src=&quot;hero.webp&quot; <span className="text-amber-300">sizes</span>=&quot;100vw&quot; <span className="text-amber-300">priority</span>
          <span className="text-accent">{' />'}</span>
          {'\n'}
          <span className="text-accent">{'<a'}</span> <span className="text-amber-300">href</span>=&quot;tel:+15551234567&quot;<span className="text-accent">{'>'}</span>
          {t('Call now', 'Pozovite')}
          <span className="text-accent">{'</a>'}</span>
          {'\n'}
          <span className="text-white/40">{t('// plugins to update: 0', '// dodataka za ažuriranje: 0')}</span>
        </pre>
        <div className="grid grid-cols-4 gap-2">
          {(
            [
              [t('Speed', 'Brzina'), 98],
              [t('Accessibility', 'Pristupačnost'), 100],
              [t('Best practices', 'Dobra praksa'), 100],
              ['SEO', 100],
            ] as const
          ).map(([label, score]) => (
            <div key={label} className="rounded-xl bg-white p-2.5 text-center ring-1 ring-zinc-200">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-semibold text-emerald-700 ring-[3px] ring-emerald-500">
                {score}
              </span>
              <span className="mt-1.5 block truncate text-[10px] text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (layer === 'seo') {
    return (
      <div className="space-y-3">
        <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-200">
          <p className="text-[11px] text-zinc-500">yourbusiness.com › {t('services', 'usluge')}</p>
          <p className="mt-0.5 text-[15px] leading-snug text-[#1a0dab]">
            {t('Emergency Plumber in Springfield | Same-Day Repairs', 'Hitne intervencije vodoinstalatera u Novom Sadu | Isti dan')}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[12px] text-zinc-500">
            <span className="text-amber-500">★★★★★</span> 4.9 · 212 {t('reviews', 'ocena')}
          </p>
          <p className="mt-1 text-[12px] leading-snug text-zinc-600">
            {t('Licensed plumbers on call 7 days a week. Upfront prices, call or book online.', 'Vodoinstalateri dostupni 7 dana u nedelji. Cena unapred, pozovite ili zakažite.')}
          </p>
        </div>
        <pre className="overflow-hidden rounded-xl bg-ink-975 p-4 font-mono text-[11.5px] leading-relaxed text-white/80 ring-1 ring-ink-900">
          {'{ '}
          <span className="text-amber-300">&quot;@type&quot;</span>: &quot;LocalBusiness&quot;,{'\n  '}
          <span className="text-amber-300">&quot;areaServed&quot;</span>: [&quot;{t('Springfield', 'Novi Sad')}&quot;, …],{'\n  '}
          <span className="text-amber-300">&quot;openingHours&quot;</span>: &quot;Mo-Su 07:00-20:00&quot;,{'\n  '}
          <span className="text-amber-300">&quot;aggregateRating&quot;</span>: {'{ … }'}
          {' }'}
        </pre>
      </div>
    );
  }
  const events = [
    ['09:12', t('Call tapped', 'Klik na poziv'), 'Google Maps'],
    ['10:47', t('Enquiry sent', 'Poslat upit'), 'Google Ads'],
    ['13:05', t('Enquiry sent', 'Poslat upit'), t('Google search', 'Google pretraga')],
    ['16:30', t('Call tapped', 'Klik na poziv'), 'Facebook'],
  ];
  return (
    <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200">
      {events.map(([time, what, source]) => (
        <li key={time} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
          <span className="font-mono text-[11px] text-zinc-400">{time}</span>
          <span className="flex-1 font-medium text-ink-950">{what}</span>
          <span className="rounded-full bg-azure-50 px-2 py-0.5 text-[11px] font-medium text-azure-700 ring-1 ring-azure-100">{source}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Homepage section on what a WebTano site carries, one layer at a time, each
 * point paired with what a site without it loses, then a quick self-check.
 */
export function SiteAnatomy() {
  const t = useT();
  const lp = useLocalePath();
  const base = useId();
  const all = layers(t);
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const qs = questions(t);
  const answered = Object.keys(answers).length;
  const leaks = Object.values(answers).filter((a) => a !== 'yes').length;
  const layer = all[active];

  const select = (i: number) => {
    const next = (i + all.length) % all.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={t('Parts of the site', 'Delovi sajta')} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {all.map((l, i) => {
          const on = i === active;
          return (
            <button
              key={l.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${base}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${base}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') select(i + 1);
                if (e.key === 'ArrowLeft') select(i - 1);
              }}
              className={`relative flex items-center gap-2.5 rounded-2xl p-3 text-left ring-1 transition duration-300 max-md:p-2.5 ${
                on ? 'bg-ink-950 text-white ring-ink-950' : 'bg-white text-ink-950 ring-zinc-200 hover:ring-zinc-300'
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl max-md:h-8 max-md:w-8 ${on ? 'bg-accent text-ink-950' : 'bg-azure-50 text-azure-700'}`}
              >
                <l.icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={`block font-mono text-[10px] tracking-wide uppercase ${on ? 'text-white/50' : 'text-zinc-400'}`}>
                  {t('Layer', 'Sloj')} {String(i + 1).padStart(2, '0')}
                </span>
                <span className="block font-display text-[15px] leading-tight max-md:text-sm">{l.tab}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${active}`}
        className="mt-6 grid gap-6 max-md:mt-4 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10"
      >
        <div className="max-md:hidden">
          <div className="sticky top-28 overflow-hidden rounded-3xl bg-zinc-50/80 p-5 ring-1 ring-zinc-200/80">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg text-ink-950">{layer.title}</p>
              <span className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{t('Example', 'Primer')}</span>
            </div>
            <LayerVisual layer={layer.key} />
          </div>
        </div>

        <ol className="space-y-3 max-md:space-y-2">
          <li className="md:hidden">
            <p className="font-display text-lg text-ink-950">{layer.title}</p>
          </li>
          {layer.items.map((item, i) => (
            <li key={item.title} className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 max-md:p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-azure-700">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[17px] text-ink-950">
                    <span className="sr-only">{i + 1}. </span>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-zinc-600 max-md:hidden">{item.text}</p>
                  <p className="mt-3 flex gap-2 rounded-xl bg-red-50/70 px-3 py-2 text-sm leading-snug text-red-900/80 ring-1 ring-red-100 max-md:mt-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                    <span>
                      <strong className="font-semibold text-red-900">{t('If your site lacks it: ', 'Ako vaš sajt ovo nema: ')}</strong>
                      {item.risk}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Self-check: six honest questions; every "no" or "not sure" is a place enquiries leak. */}
      <div className="mt-14 overflow-hidden rounded-3xl bg-ink-975 text-white ring-1 ring-ink-900 max-md:mt-6">
        <div className="grid gap-8 p-6 max-md:gap-5 max-md:p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-accent uppercase ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {t('60-second check', 'Provera za 60 sekundi')}
            </p>
            <h3 className="mt-4 font-display text-2xl text-balance sm:text-3xl">
              {t('How much is your current site letting slip?', 'Koliko vam sadašnji sajt propušta?')}
            </h3>
            <p className="mt-3 text-pretty text-white/65">
              {t(
                'Answer honestly. Every “no” or “not sure” is a place where enquiries leak out before they ever reach you.',
                'Odgovorite iskreno. Svako „ne” ili „ne znam” je mesto gde upiti cure pre nego što uopšte stignu do vas.',
              )}
            </p>
            <div className="mt-6 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10" aria-live="polite">
              {answered === 0 ? (
                <p className="text-sm text-white/55">{t('Your result shows here as you answer.', 'Rezultat se pojavljuje ovde dok odgovarate.')}</p>
              ) : (
                <>
                  <p className="font-display text-4xl">
                    <span className={leaks === 0 ? 'text-emerald-400' : leaks <= 2 ? 'text-amber-300' : 'text-red-400'}>{leaks}</span>
                    <span className="text-white/35"> / {answered}</span>
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    {leaks === 0
                      ? t('So far so good. The free audit checks the parts you can’t see from the outside.', 'Za sada dobro. Besplatna analiza proverava i ono što se spolja ne vidi.')
                      : leaks <= 2
                        ? t('A few leaks. Each one quietly sends customers to a competitor.', 'Nekoliko rupa. Svaka tiho šalje kupce konkurenciji.')
                        : t('Your site is likely losing enquiries every week. This is exactly what we fix.', 'Vaš sajt verovatno gubi upite svake nedelje. Upravo to mi popravljamo.')}
                  </p>
                </>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
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
          </div>
          <ol className="space-y-2">
            {qs.map((q, i) => (
              <li key={q} className="flex flex-col gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.08] sm:flex-row sm:items-center">
                <p className="flex-1 text-[15px] leading-snug text-white/85">
                  <span className="mr-2 font-mono text-xs text-white/35">{String(i + 1).padStart(2, '0')}</span>
                  {q}
                </p>
                <div role="radiogroup" aria-label={q} className="flex shrink-0 gap-1 rounded-full bg-white/[0.05] p-1 ring-1 ring-white/10">
                  {(
                    [
                      ['yes', t('Yes', 'Da'), 'bg-emerald-400 text-ink-950'],
                      ['no', t('No', 'Ne'), 'bg-red-400 text-ink-950'],
                      ['unsure', t('Not sure', 'Ne znam'), 'bg-amber-300 text-ink-950'],
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
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${on ? onCls : 'text-white/60 hover:text-white'}`}
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
