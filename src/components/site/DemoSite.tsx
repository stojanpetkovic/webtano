'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock,
  Fan,
  Flame,
  Gauge,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Snowflake,
  Star,
  Tag,
  Thermometer,
  Volume2,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';
import { useLang, useT } from '@/components/i18n/LangProvider';

export type Block = 'hero' | 'trust' | 'services' | 'form' | 'callbar';

// The made-up business's own colours, so the demo reads as a client's site, not as WebTano.
const NAVY = 'bg-[#0d2340]';
const ORANGE = 'bg-[#f26b1d] text-white hover:bg-[#d95c12]';

/**
 * The made-up local business's full homepage, built the way we build a real
 * client's: offer and form on the first screen, proof, services, offers,
 * process, reviews, areas, FAQ. The tour highlights one block at a time.
 */
export function DemoSite({
  block,
  phone,
  bare,
  path,
  onPath,
  onCall,
  onSend,
}: {
  block?: Block;
  phone: boolean;
  /** No device frame or browser chrome: the visitor's own phone is the frame. */
  bare: boolean;
  path: string;
  onPath: (path: string, label: string) => void;
  onCall: () => void;
  onSend: (name: string, service: string) => void;
}) {
  const t = useT();
  const sr = useLang() === 'sr';
  const scroller = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [need, setNeed] = useState(0);
  const [sent, setSent] = useState(false);
  const [tab, setTab] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);

  const brand = t('Summit Heating & Air', 'Summit klima i grejanje');
  const phoneNo = t('(555) 010-2040', '021 555 0100');
  const cityIn = t('Springfield', 'Novom Sadu');
  const needs = [t('AC not cooling', 'Klima ne hladi'), t('Heating repair', 'Popravka grejanja'), t('New install', 'Ugradnja'), t('Maintenance', 'Redovan servis')];

  const tabs = [
    {
      label: t('Cooling', 'Hlađenje'),
      icon: Snowflake,
      items: [
        { slug: ['ac-repair', 'servis-klima'], name: t('AC repair', 'Popravka klima'), text: t('Same-day diagnosis, fixed price before we start.', 'Dijagnoza isti dan, fiksna cena pre početka.'), icon: Wrench },
        { slug: ['ac-installation', 'ugradnja-klima'], name: t('AC installation', 'Ugradnja klima'), text: t('Sized for your home, installed in one day.', 'Snaga prema prostoru, ugradnja za jedan dan.'), icon: Snowflake },
        { slug: ['ductless', 'inverter-klime'], name: t('Ductless mini-splits', 'Inverter klime'), text: t('Quiet, efficient cooling room by room.', 'Tiho i štedljivo hlađenje, prostorija po prostorija.'), icon: Fan },
      ],
    },
    {
      label: t('Heating', 'Grejanje'),
      icon: Flame,
      items: [
        { slug: ['furnace-repair', 'servis-kotlova'], name: t('Furnace repair', 'Servis kotlova'), text: t('Back to warm the same day in most cases.', 'U većini slučajeva toplo već istog dana.'), icon: Flame },
        { slug: ['heat-pumps', 'toplotne-pumpe'], name: t('Heat pumps', 'Toplotne pumpe'), text: t('Lower bills, one system for summer and winter.', 'Manji računi, jedan sistem za leto i zimu.'), icon: Thermometer },
        { slug: ['radiant-floor', 'podno-grejanje'], name: t('Radiant floor heating', 'Podno grejanje'), text: t('Even, silent warmth under every room.', 'Ravnomerna, tiha toplota u svakoj prostoriji.'), icon: Gauge },
      ],
    },
    {
      label: t('Air quality', 'Kvalitet vazduha'),
      icon: Wind,
      items: [
        { slug: ['duct-cleaning', 'ciscenje-kanala'], name: t('Duct cleaning', 'Čišćenje kanala'), text: t('Less dust, fewer allergies, better airflow.', 'Manje prašine i alergija, bolji protok vazduha.'), icon: Wind },
        { slug: ['air-purifiers', 'preciscivaci'], name: t('Air purifiers', 'Prečišćivači vazduha'), text: t('Whole-home filtration that works quietly.', 'Filtracija za ceo stan, tiho i stalno.'), icon: Fan },
        { slug: ['thermostats', 'pametni-termostati'], name: t('Smart thermostats', 'Pametni termostati'), text: t('Control and save from your phone.', 'Upravljanje i ušteda sa telefona.'), icon: Zap },
      ],
    },
  ];

  // Bring the block this step talks about into view inside the frame, below the sticky header.
  useEffect(() => {
    const box = scroller.current;
    const el = block && block !== 'callbar' ? box?.querySelector<HTMLElement>(`[data-block="${block}"]`) : null;
    if (!box) return;
    box.scrollTo({ top: el ? Math.max(0, el.offsetTop - (phone ? 70 : 120)) : 0, behavior: 'smooth' });
  }, [block, phone]);

  const mark = (b: Block) => ({
    'data-block': b,
    className: `relative transition-opacity duration-300 ${block === b ? 'z-[1] rounded-2xl ring-[3px] ring-accent ring-offset-4 ring-offset-white' : ''}`,
  });
  const dim = (b?: Block) => (block && block !== b ? 'opacity-30' : '');
  const tag = (b: Block, label: string) =>
    block === b && (
      <span className="absolute -top-3 left-4 z-[2] rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-ink-950 uppercase shadow-glow">
        {label}
      </span>
    );
  const addr = `summit${sr ? 'klima.rs' : 'heatingair.com'}${path === '/' ? '' : path}`;
  const wide = !phone;
  const shell = wide ? 'mx-auto max-w-5xl px-10' : 'px-4';
  const h2 = `font-display tracking-tight text-[#0d2340] ${wide ? 'text-[30px] leading-[1.1]' : 'text-[23px] leading-tight'}`;
  const eyebrow = 'text-[11px] font-bold tracking-[0.18em] text-[#f26b1d] uppercase';
  const photo = (name: string, overlay: string, position = 'center') => ({
    backgroundImage: `${overlay}, url(/demo/${name}.webp), linear-gradient(135deg, #1e4a7a, #0d2340)`,
    backgroundSize: 'cover',
    backgroundPosition: position,
  });

  const form = (
    <div {...mark('form')}>
      {tag('form', t('Enquiry form', 'Forma za upit'))}
      <div className={`overflow-hidden rounded-2xl bg-white text-ink-950 shadow-[0_30px_70px_-25px_rgb(0_0_0/0.6)] ${block && block !== 'form' && block !== 'hero' ? 'opacity-30' : ''}`}>
        <div className="flex items-center justify-between bg-[#f26b1d] px-5 py-2.5 text-white">
          <p className="text-[12px] font-bold tracking-wide uppercase">{t('Free estimate', 'Besplatna procena')}</p>
          <p className="flex items-center gap-1 text-[11px] font-medium text-white/90">
            <Clock className="h-3 w-3" aria-hidden />
            {t('Reply in 15 min', 'Odgovor za 15 min')}
          </p>
        </div>
        <div className="p-5">
          <p className="font-display text-[19px] leading-tight">{t('Tell us what’s wrong. We’ll call you back.', 'Recite nam šta nije u redu. Mi vas zovemo.')}</p>
          {sent ? (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-[13px] text-emerald-900 ring-1 ring-emerald-100">
              <Check className="h-4 w-4 text-emerald-600" aria-hidden />
              {t('Thanks! A technician will call you shortly.', 'Hvala! Serviser vas uskoro zove.')}
            </p>
          ) : (
            <form
              className="mt-4 space-y-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                onSend(name.trim(), needs[need]);
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('Your name', 'Vaše ime')}
                  aria-label={t('Your name', 'Vaše ime')}
                  className="h-11 w-full rounded-lg bg-zinc-50 px-3 text-[13px] ring-1 ring-zinc-200 outline-none focus:bg-white focus:ring-2 focus:ring-[#f26b1d]"
                />
                <input
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  placeholder={t('Phone', 'Telefon')}
                  aria-label={t('Phone', 'Telefon')}
                  inputMode="tel"
                  className="h-11 w-full rounded-lg bg-zinc-50 px-3 text-[13px] ring-1 ring-zinc-200 outline-none focus:bg-white focus:ring-2 focus:ring-[#f26b1d]"
                />
              </div>
              <p className="pt-1 text-[11px] font-semibold text-zinc-500">{t('What do you need?', 'Šta vam treba?')}</p>
              <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={t('What do you need?', 'Šta vam treba?')}>
                {needs.map((n, i) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={need === i}
                    onClick={() => setNeed(i)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-left text-[11.5px] font-semibold ring-1 transition ${need === i ? 'bg-[#0d2340] text-white ring-[#0d2340]' : 'text-zinc-600 ring-zinc-200 hover:ring-zinc-300'}`}
                  >
                    <span className={`h-3 w-3 shrink-0 rounded-full ring-2 ${need === i ? 'bg-[#f26b1d] ring-white/40' : 'ring-zinc-300'}`} />
                    {n}
                  </button>
                ))}
              </div>
              <button type="submit" className={`mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-[14px] font-bold transition ${ORANGE}`}>
                {t('Get my free estimate', 'Pošaljite upit')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <p className="flex items-center justify-center gap-1 text-[10.5px] text-zinc-400">
                <Lock className="h-3 w-3" aria-hidden />
                {t('No spam. We only call about your request.', 'Bez spama. Zovemo samo zbog vašeg upita.')}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  const stats = [
    ['22+', t('years in business', 'godine iskustva')],
    ['4.9★', t('from 312 Google reviews', 'iz 312 Google ocena')],
    [t('9,800+', '9.800+'), t('jobs completed', 'završenih servisa')],
    [t('Same day', 'Isti dan'), t('on most calls', 'na većinu poziva')],
  ];

  return (
    <div
      className={`mx-auto flex h-full flex-col overflow-hidden ${
        bare
          ? 'bg-white'
          : phone
            ? 'max-h-[780px] max-w-[380px] rounded-[2.4rem] bg-ink-950 p-2 shadow-float ring-1 ring-white/10'
            : 'max-w-6xl rounded-2xl bg-white shadow-lift ring-1 ring-zinc-200'
      }`}
    >
      <div className={`flex min-h-0 flex-1 flex-col ${phone && !bare ? 'overflow-hidden rounded-[2rem] bg-white' : ''}`}>
        {/* Browser bar */}
        <div className={`flex shrink-0 items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 ${bare ? 'hidden' : ''}`}>
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

        <div className="relative min-h-0 flex-1">
          <div ref={scroller} className="h-full overflow-y-auto overscroll-contain bg-white font-sans text-zinc-700">
            {/* Utility bar and header */}
            <div className="sticky top-0 z-[3] shadow-[0_1px_0_rgb(0_0_0/0.06)]">
              {wide && (
                <div className="bg-[#0a1b31] text-[11px] text-white/80">
                  <div className={`${shell} flex items-center justify-between py-2`}>
                    <span className="flex items-center gap-5">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        {t('Technicians available today', 'Serviseri slobodni danas')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-[#f26b1d]" aria-hidden /> {t('24/7 emergency service', 'Hitne intervencije 0–24')}
                      </span>
                    </span>
                    <span className="flex items-center gap-5">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden /> 4.9 · {t('312 reviews', '312 ocena')}
                      </span>
                      <span>{t('Lic. #HV-20418', 'PIB 112345678')}</span>
                    </span>
                  </div>
                </div>
              )}
              <div className="bg-white">
                <div className={`${shell} flex items-center justify-between gap-4 ${wide ? 'py-3.5' : 'py-3'}`}>
                  <span className="flex items-center gap-2.5">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${NAVY} text-[#f26b1d] shadow-[inset_0_-3px_0_#f26b1d]`}>
                      <Snowflake className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="leading-none">
                      <span className="block font-display text-[19px] tracking-tight text-[#0d2340]">Summit</span>
                      <span className="mt-1 block text-[9px] font-bold tracking-[0.22em] text-[#f26b1d] uppercase">{t('Heating & Air', 'Klima i grejanje')}</span>
                    </span>
                  </span>
                  {wide && (
                    <span className="flex items-center gap-5 text-[13px] font-semibold whitespace-nowrap text-[#0d2340]">
                      {[t('Cooling', 'Hlađenje'), t('Heating', 'Grejanje'), t('Air quality', 'Kvalitet vazduha'), t('Offers', 'Akcije'), t('About', 'O nama')].map((l, i) => (
                        <span key={l} className="flex items-center gap-0.5">
                          {l}
                          {i < 3 && <ChevronDown className="h-3 w-3 text-zinc-400" aria-hidden />}
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="flex items-center gap-3">
                    {wide && (
                      <button type="button" onClick={onCall} className="flex items-center gap-2 text-left whitespace-nowrap">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#f26b1d] ring-1 ring-orange-100">
                          <Phone className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="leading-tight">
                          <span className="block text-[10px] font-medium text-zinc-400">{t('Call us 24/7', 'Pozovite 0–24')}</span>
                          <span className="block text-[14px] font-bold text-[#0d2340]">{phoneNo}</span>
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={phone ? onCall : undefined}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-bold whitespace-nowrap shadow-[0_8px_20px_-8px_#f26b1d] transition ${ORANGE}`}
                    >
                      {phone && <Phone className="h-3.5 w-3.5" aria-hidden />}
                      {phone ? t('Call', 'Pozovite') : t('Book service', 'Zakažite servis')}
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <section {...mark('hero')}>
              {tag('hero', t('First screen', 'Prvi ekran'))}
              <div
                className={`relative overflow-hidden text-white ${block === 'hero' ? 'rounded-2xl' : ''}`}
                style={photo('hero', 'linear-gradient(100deg, rgb(10 27 49 / 0.97) 0%, rgb(13 35 64 / 0.9) 45%, rgb(13 35 64 / 0.55) 100%)', 'right center')}
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#f26b1d]/25 blur-3xl" aria-hidden />
                <div className={`relative ${shell} grid items-center gap-8 ${wide ? 'grid-cols-[1.1fr_0.9fr] py-16' : 'py-8'}`}>
                  <div className={`transition-opacity duration-300 ${dim('hero')}`}>
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3 pl-1 text-[11.5px] font-medium ring-1 ring-white/15 backdrop-blur">
                      <span className="flex -space-x-1.5">
                        {['AM', 'MP', 'JS'].map((i, n) => (
                          <span
                            key={i}
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] font-bold ring-2 ring-[#0d2340] ${['bg-amber-300 text-amber-900', 'bg-sky-300 text-sky-900', 'bg-rose-300 text-rose-900'][n]}`}
                          >
                            {i}
                          </span>
                        ))}
                      </span>
                      <span className="text-amber-400">★★★★★</span> 4.9 · {t('312 Google reviews', '312 Google ocena')}
                    </p>
                    <h3 className={`mt-4 font-display tracking-tight ${wide ? 'text-[44px] leading-[1.02]' : 'text-[28px] leading-[1.08]'}`}>
                      {t('AC & heating repair in', 'Servis klima i grejanja u')} <span className="text-[#f26b1d]">{cityIn}</span>
                      {t(', done today.', ', isti dan.')}
                    </h3>
                    <p className={`mt-4 leading-relaxed text-white/75 ${wide ? 'max-w-md text-[15px]' : 'text-[13.5px]'}`}>
                      {t(
                        'Licensed technicians, a fixed price before we start and a 2-year guarantee on every repair.',
                        'Licencirani serviseri, fiksna cena pre početka rada i 2 godine garancije na svaku popravku.',
                      )}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      <span className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[14px] font-bold shadow-[0_10px_25px_-10px_#f26b1d] ${ORANGE}`}>
                        {t('Book service', 'Zakažite servis')}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                      <button
                        type="button"
                        onClick={onCall}
                        className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-[14px] font-bold ring-1 ring-white/25 backdrop-blur transition hover:bg-white/15"
                      >
                        <Phone className="h-4 w-4" aria-hidden />
                        {phoneNo}
                      </button>
                    </div>
                    <ul className={`mt-7 grid gap-3 border-t border-white/10 pt-5 text-[12px] text-white/85 ${wide ? 'grid-cols-3' : 'grid-cols-1'}`}>
                      {[
                        [ShieldCheck, t('2-year guarantee', 'Garancija 2 godine')],
                        [Tag, t('Fixed upfront price', 'Fiksna cena unapred')],
                        [BadgeCheck, t('Licensed & insured', 'Registrovani i osigurani')],
                      ].map(([Icon, label]) => {
                        const I = Icon as typeof Star;
                        return (
                          <li key={label as string} className="flex items-center gap-2 font-semibold">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                              <I className="h-3.5 w-3.5 text-[#f26b1d]" aria-hidden />
                            </span>
                            {label as string}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {form}
                </div>
              </div>
            </section>

            {/* Stats */}
            <div className={`${shell} relative z-[2] ${wide ? '-mt-8' : 'mt-6'} ${dim()}`}>
              <dl className={`grid rounded-2xl bg-white shadow-[0_20px_50px_-25px_rgb(13_35_64/0.45)] ring-1 ring-zinc-100 ${wide ? 'grid-cols-4 divide-x divide-zinc-100' : 'grid-cols-2'}`}>
                {stats.map(([value, label]) => (
                  <div key={label} className="flex flex-col-reverse px-5 py-4 text-center">
                    <dt className="text-[11px] text-zinc-500">{label}</dt>
                    <dd className="font-display text-[24px] tracking-tight text-[#0d2340]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={`space-y-16 pb-24 ${wide ? 'pt-16' : 'pt-10'}`}>
              {/* Problems */}
              <div className={`${shell} ${dim()}`}>
                <div className="text-center">
                  <p className={eyebrow}>{t('Common problems', 'Česti problemi')}</p>
                  <h4 className={`mt-2 ${h2}`}>{t('Sound familiar?', 'Da li vam se ovo dešava?')}</h4>
                </div>
                <div className={`mt-7 grid gap-3 ${wide ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  {[
                    [Thermometer, t('AC runs but won’t cool', 'Klima radi, a ne hladi'), t('Often low gas or a dirty coil.', 'Često fali gas ili je prljav izmenjivač.')],
                    [Zap, t('Bills keep climbing', 'Računi za struju rastu'), t('An unserviced unit works twice as hard.', 'Neservisiran uređaj radi duplo jače.')],
                    [Volume2, t('Noises or smells', 'Čudni zvuci ili mirisi'), t('A sign something is wearing out.', 'Znak da se nešto troši.')],
                    [Flame, t('Rooms never warm up', 'Sobe se ne zagreju'), t('Usually balancing or a failing part.', 'Obično balans sistema ili deo pred kvarom.')],
                  ].map(([Icon, label, text]) => {
                    const I = Icon as typeof Star;
                    return (
                      <div key={label as string} className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-100 transition hover:bg-white hover:shadow-[0_15px_35px_-20px_rgb(13_35_64/0.4)]">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#f26b1d] shadow-sm ring-1 ring-zinc-100">
                          <I className="h-5 w-5" aria-hidden />
                        </span>
                        <p className="mt-3 text-[14px] font-bold text-[#0d2340]">{label as string}</p>
                        {wide && <p className="mt-1 text-[12px] leading-snug text-zinc-500">{text as string}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services */}
              <section {...mark('services')}>
                {tag('services', t('Service pages', 'Stranice usluga'))}
                <div className={`${shell} py-2 ${dim('services')}`}>
                  <div className={`flex gap-4 ${wide ? 'items-end justify-between' : 'flex-col items-center text-center'}`}>
                    <div>
                      <p className={eyebrow}>{t('Our services', 'Naše usluge')}</p>
                      <h4 className={`mt-2 ${h2}`}>{t('How can we help?', 'Kako možemo da pomognemo?')}</h4>
                    </div>
                    <div className="flex w-fit gap-1 rounded-xl bg-zinc-100 p-1">
                      {tabs.map((tb, i) => (
                        <button
                          key={tb.label}
                          type="button"
                          onClick={() => setTab(i)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold transition ${tab === i ? 'bg-[#0d2340] text-white shadow-sm' : 'text-zinc-500 hover:text-[#0d2340]'}`}
                        >
                          <tb.icon className="h-3.5 w-3.5" aria-hidden />
                          {tb.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={`mt-6 grid gap-4 ${wide ? 'grid-cols-3' : ''}`}>
                    {tabs[tab].items.map((sv, i) => {
                      const href = `/${sr ? 'usluge' : 'services'}/${sv.slug[sr ? 1 : 0]}`;
                      const on = path === href;
                      return (
                        <button
                          key={sv.name}
                          type="button"
                          onClick={() => onPath(href, sv.name)}
                          className={`group overflow-hidden rounded-2xl bg-white text-left ring-1 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgb(13_35_64/0.45)] ${on ? 'ring-2 ring-[#f26b1d]' : 'ring-zinc-200'}`}
                        >
                          <span
                            className={`relative block ${wide ? 'h-36' : 'h-28'}`}
                            style={photo(['cooling', 'heating', 'air'][tab], 'linear-gradient(180deg, rgb(13 35 64 / 0.1), rgb(13 35 64 / 0.75))', ['left center', 'center', 'right center'][i])}
                          >
                            <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#f26b1d] shadow-lg">
                              <sv.icon className="h-5 w-5" aria-hidden />
                            </span>
                          </span>
                          <span className="block p-4">
                            <span className="block text-[15px] font-bold text-[#0d2340]">{sv.name}</span>
                            <span className="mt-1 block text-[12.5px] leading-snug text-zinc-500">{sv.text}</span>
                            <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-[#f26b1d]">
                              {t('Learn more', 'Saznajte više')}
                              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* About */}
              <div className={`${shell} ${dim()}`}>
                <div className={`grid items-center gap-8 ${wide ? 'grid-cols-2' : ''}`}>
                  <div className="relative">
                    <div
                      className={`rounded-3xl ${wide ? 'h-80' : 'h-56'}`}
                      style={photo('about', 'linear-gradient(180deg, rgb(13 35 64 / 0), rgb(13 35 64 / 0.35))')}
                    />
                    <div className="absolute -right-3 -bottom-5 rounded-2xl bg-[#f26b1d] px-5 py-4 text-white shadow-xl">
                      <p className="font-display text-[30px] leading-none">2</p>
                      <p className="mt-1 text-[11px] font-semibold">{t('year guarantee', 'godine garancije')}</p>
                    </div>
                  </div>
                  <div>
                    <p className={eyebrow}>{t('Why Summit', 'Zašto Summit')}</p>
                    <h4 className={`mt-2 ${h2}`}>{t('Family-run, on time and honest about price', 'Porodična firma, tačni i pošteni oko cene')}</h4>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-zinc-600">
                      {t(
                        'Since 2003 we have kept homes in Springfield comfortable. You always know the price before we start, and we text you before we arrive.',
                        'Od 2003. održavamo domove u Novom Sadu udobnim. Cenu uvek znate pre početka rada, a pre dolaska vam javimo porukom.',
                      )}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {[t('No subcontractors, our own team', 'Bez podizvođača, naš tim'), t('Text before we arrive', 'Poruka pre dolaska'), t('Clean work, shoe covers on', 'Uredan rad, navlake za obuću')].map((b) => (
                        <li key={b} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-[#0d2340]">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f26b1d]">
                            <Check className="h-3 w-3 text-white" aria-hidden />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Offers */}
              <div className={`${dim()} bg-zinc-50 py-14`}>
                <div className={shell}>
                  <div className="text-center">
                    <p className={eyebrow}>{t('Save on your next visit', 'Uštedite na sledećem servisu')}</p>
                    <h4 className={`mt-2 ${h2}`}>{t('Current offers', 'Aktuelne akcije')}</h4>
                  </div>
                  <div className={`mt-7 grid gap-4 ${wide ? 'grid-cols-3' : ''}`}>
                    {[
                      [t('20% off', '−20%'), t('your first AC tune-up', 'na prvi servis klime'), t('Limited time', 'Ograničeno')],
                      [t('Free', 'Besplatna'), t('estimate on a new system', 'procena za novi sistem'), t('Always', 'Uvek')],
                      [t('Free', 'Besplatno'), t('second opinion on any quote', 'drugo mišljenje na tuđu ponudu'), t('New', 'Novo')],
                    ].map(([big, small, badge]) => (
                      <div key={small} className="relative overflow-hidden rounded-2xl bg-white p-6 text-center shadow-[0_15px_40px_-25px_rgb(13_35_64/0.5)] ring-1 ring-zinc-100">
                        <span className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-50" aria-hidden />
                        <span className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-zinc-50" aria-hidden />
                        <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#f26b1d] uppercase">{badge}</span>
                        <p className="mt-3 font-display text-[34px] leading-none tracking-tight text-[#0d2340]">{big}</p>
                        <p className="mt-2 text-[13px] text-zinc-600">{small}</p>
                        <span className="mt-5 block border-t border-dashed border-zinc-200 pt-4">
                          <span className={`inline-block rounded-lg px-4 py-2 text-[12px] font-bold ${ORANGE}`}>{t('Claim offer', 'Iskoristite')}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Process */}
              <div className={`${shell} ${dim()}`}>
                <div className="text-center">
                  <p className={eyebrow}>{t('How it works', 'Kako radimo')}</p>
                  <h4 className={`mt-2 ${h2}`}>{t('Three simple steps', 'Tri jednostavna koraka')}</h4>
                </div>
                <ol className={`relative mt-8 grid gap-6 ${wide ? 'grid-cols-3' : ''}`}>
                  {wide && <span className="absolute top-6 right-[16%] left-[16%] h-0.5 bg-gradient-to-r from-[#f26b1d] to-[#0d2340]" aria-hidden />}
                  {[
                    [t('Book online or call', 'Zakažite ili pozovite'), t('Pick a time that suits you, even today.', 'Izaberite termin, može i danas.')],
                    [t('Fixed price first', 'Prvo fiksna cena'), t('We diagnose and quote before any work.', 'Dijagnoza i cena pre bilo kakvog rada.')],
                    [t('Fixed and guaranteed', 'Popravljeno, uz garanciju'), t('Two years on parts and labour.', 'Dve godine na delove i rad.')],
                  ].map(([title, text], i) => (
                    <li key={title} className="relative text-center">
                      <span className={`relative mx-auto flex h-12 w-12 items-center justify-center rounded-full ${NAVY} font-display text-[17px] text-white ring-8 ring-white`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="mt-4 text-[15px] font-bold text-[#0d2340]">{title}</p>
                      <p className="mt-1 text-[12.5px] text-zinc-500">{text}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Reviews */}
              <section {...mark('trust')}>
                {tag('trust', t('Proof', 'Dokaz'))}
                <div className={`${shell} py-2 ${dim('trust')}`}>
                  <div className={`grid gap-4 ${wide ? 'grid-cols-[0.8fr_2fr] items-stretch' : ''}`}>
                    <div className={`flex flex-col justify-center rounded-2xl ${NAVY} p-6 text-white`}>
                      <p className={eyebrow}>{t('Reviews', 'Utisci')}</p>
                      <p className="mt-3 font-display text-[52px] leading-none">4.9</p>
                      <p className="mt-1 text-[18px] text-amber-400">★★★★★</p>
                      <p className="mt-2 text-[12.5px] text-white/70">{t('312 reviews on Google', '312 ocena na Google-u')}</p>
                      <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[12px] font-bold text-[#0d2340]">
                        <span className="font-display text-[14px] text-[#4285f4]">G</span>
                        {t('Read all reviews', 'Sve recenzije')}
                      </span>
                    </div>
                    <div className={`grid gap-3 ${wide ? 'grid-cols-3' : ''}`}>
                      {[
                        [t('“Came the same afternoon, told me the price upfront and the AC was running in an hour.”', '„Došli su isto popodne, rekli cenu unapred i klima je radila za sat vremena.”'), 'Ana M.', t('AC repair', 'Popravka klima'), 'bg-amber-200 text-amber-900'],
                        [t('“Honest advice. They fixed it instead of selling me a new unit.”', '„Pošteni. Popravili su staru, umesto da mi prodaju novu.”'), 'Marko P.', t('Heating repair', 'Popravka grejanja'), 'bg-sky-200 text-sky-900'],
                        [t('“Clean, on time, and they texted before arriving.”', '„Uredni, tačni i javili su porukom pre dolaska.”'), 'Jelena S.', t('Installation', 'Ugradnja'), 'bg-rose-200 text-rose-900'],
                      ].map(([quote, who, job, avatar]) => (
                        <figure key={who} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
                          <div className="flex items-center justify-between">
                            <p className="text-[14px] text-amber-400" aria-hidden>
                              ★★★★★
                            </p>
                            <span className="font-display text-[15px] text-[#4285f4]" aria-hidden>
                              G
                            </span>
                          </div>
                          <blockquote className="mt-2 flex-1 text-[13px] leading-relaxed text-zinc-700">{quote}</blockquote>
                          <figcaption className="mt-4 flex items-center gap-2.5">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${avatar}`}>
                              {who
                                .split(' ')
                                .map((w) => w[0])
                                .join('')}
                            </span>
                            <span className="leading-tight">
                              <span className="block text-[12.5px] font-bold text-[#0d2340]">{who}</span>
                              <span className="block text-[11px] text-zinc-400">{job}</span>
                            </span>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Areas */}
              <div className={`${shell} ${dim()}`}>
                <div className={`grid items-center gap-8 ${wide ? 'grid-cols-2' : ''}`}>
                  <div>
                    <p className={eyebrow}>{t('Service area', 'Gde radimo')}</p>
                    <h4 className={`mt-2 ${h2}`}>{t('Proudly serving Springfield and nearby', 'Novi Sad i okolina')}</h4>
                    <ul className="mt-5 grid grid-cols-2 gap-2">
                      {(sr
                        ? ['Novi Sad', 'Petrovaradin', 'Sremska Kamenica', 'Veternik', 'Futog', 'Temerin', 'Kać', 'Rumenka']
                        : ['Springfield', 'Riverside', 'Oak Park', 'Fairview', 'Lakewood', 'Cedar Hills', 'Maple Grove', 'Westbrook']
                      ).map((c) => (
                        <li key={c} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0d2340]">
                          <MapPin className="h-3.5 w-3.5 text-[#f26b1d]" aria-hidden />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <svg viewBox="0 0 320 200" className="w-full rounded-2xl bg-[#eef3f8] ring-1 ring-zinc-200" aria-hidden>
                    <g stroke="#d6e0ea" strokeWidth="1">
                      {Array.from({ length: 9 }, (_, i) => (
                        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="200" />
                      ))}
                      {Array.from({ length: 6 }, (_, i) => (
                        <line key={`h${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} />
                      ))}
                    </g>
                    <path d="M0 140 C 60 120, 100 160, 160 130 S 260 90, 320 110" stroke="#9cc3e6" strokeWidth="10" fill="none" opacity="0.7" />
                    <path d="M40 0 L 120 200 M 0 60 L 320 70 M 210 0 L 250 200" stroke="#fff" strokeWidth="5" fill="none" />
                    <circle cx="160" cy="95" r="58" fill="#f26b1d" opacity="0.12" stroke="#f26b1d" strokeOpacity="0.4" strokeDasharray="4 4" />
                    {[
                      [160, 95],
                      [110, 70],
                      [205, 120],
                      [130, 135],
                      [195, 62],
                    ].map(([x, y], i) => (
                      <g key={i} transform={`translate(${x} ${y})`}>
                        <path d="M0 0 C -7 -9, -7 -16, 0 -18 C 7 -16, 7 -9, 0 0 Z" fill={i === 0 ? '#f26b1d' : '#0d2340'} />
                        <circle cx="0" cy="-12" r="2.5" fill="#fff" />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* FAQ */}
              <div className={`${shell} ${dim()}`}>
                <div className="text-center">
                  <p className={eyebrow}>{t('FAQ', 'Pitanja')}</p>
                  <h4 className={`mt-2 ${h2}`}>{t('Questions we hear every day', 'Pitanja koja čujemo svaki dan')}</h4>
                </div>
                <div className="mx-auto mt-6 max-w-2xl space-y-2">
                  {[
                    [t('How fast can you come?', 'Koliko brzo dolazite?'), t('Most calls get a technician the same day.', 'Na većinu poziva serviser dolazi isti dan.')],
                    [t('Will the price change on site?', 'Da li se cena menja na licu mesta?'), t('No. You approve a fixed price before we start.', 'Ne. Cenu odobravate pre početka rada.')],
                    [t('Do you guarantee your work?', 'Da li dajete garanciju?'), t('Two years on parts and labour.', 'Dve godine na delove i rad.')],
                  ].map(([q, a], i) => (
                    <div key={q} className={`rounded-xl px-5 ring-1 transition ${faq === i ? 'bg-white shadow-[0_10px_30px_-20px_rgb(13_35_64/0.5)] ring-zinc-200' : 'bg-zinc-50 ring-zinc-100'}`}>
                      <button type="button" onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between py-4 text-left text-[14px] font-bold text-[#0d2340]">
                        {q}
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full transition ${faq === i ? 'rotate-180 bg-[#f26b1d] text-white' : 'bg-white text-zinc-400 ring-1 ring-zinc-200'}`}>
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                        </span>
                      </button>
                      {faq === i && <p className="pb-4 text-[13px] text-zinc-500">{a}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Closing call to action and footer */}
              <div className={dim()}>
                <div className={shell}>
                  <div
                    className={`relative overflow-hidden rounded-3xl text-white ${wide ? 'p-10' : 'p-6 text-center'}`}
                    style={photo('cta', 'linear-gradient(100deg, rgb(242 107 29 / 0.97), rgb(217 92 18 / 0.85))')}
                  >
                    <div className={`flex gap-5 ${wide ? 'items-center justify-between' : 'flex-col items-center'}`}>
                      <div>
                        <p className="font-display text-[26px] leading-tight">{t('Too hot or too cold?', 'Prevruće ili prehladno?')}</p>
                        <p className="mt-1 text-[13.5px] text-white/85">{t('A technician can be at your door today.', 'Serviser može biti kod vas već danas.')}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-[14px] font-bold text-[#0d2340] shadow-lg">
                        <Phone className="h-4 w-4 text-[#f26b1d]" aria-hidden />
                        {phoneNo}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-14 bg-[#0a1b31] text-[12px] text-white/60">
                  <div className={`${shell} grid gap-6 py-10 ${wide ? 'grid-cols-4' : 'grid-cols-2'}`}>
                    <div className={wide ? '' : 'col-span-2'}>
                      <span className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#f26b1d]">
                          <Snowflake className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="font-display text-[16px] text-white">Summit</span>
                      </span>
                      <p className="mt-3 leading-relaxed">{t('Heating, cooling and air quality for Springfield homes since 2003.', 'Grejanje, hlađenje i kvalitet vazduha za domove u Novom Sadu od 2003.')}</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">{t('Services', 'Usluge')}</p>
                      <ul className="mt-3 space-y-1.5">
                        {[t('AC repair', 'Popravka klima'), t('Installation', 'Ugradnja'), t('Heat pumps', 'Toplotne pumpe'), t('Duct cleaning', 'Čišćenje kanala')].map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-white">{t('Hours', 'Radno vreme')}</p>
                      <p className="mt-3 leading-relaxed">
                        {t('Mon–Fri 7–19', 'Pon–pet 7–19')}
                        <br />
                        {t('Sat 8–14', 'Sub 8–14')}
                        <br />
                        <span className="text-[#f26b1d]">{t('24/7 emergencies', 'Hitno 0–24')}</span>
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-white">{t('Contact', 'Kontakt')}</p>
                      <p className="mt-3 leading-relaxed">
                        {phoneNo}
                        <br />
                        {t('info@summitheatingair.com', 'info@summitklima.rs')}
                        <br />
                        {t('14 Oak Street, Springfield', 'Bulevar oslobođenja 14, Novi Sad')}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/10">
                    <p className={`${shell} py-4 text-[11px] text-white/40`}>© 2026 {brand}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The call bar phones keep on screen. */}
          {phone && (
            <div className={`absolute inset-x-2 bottom-2 z-[4] ${block === 'callbar' ? 'rounded-2xl ring-2 ring-accent ring-offset-2' : ''}`}>
              {block === 'callbar' && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap text-ink-950 uppercase shadow-glow">
                  {t('Always on screen', 'Uvek na ekranu')}
                </span>
              )}
              <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-white/95 p-1.5 shadow-lift ring-1 ring-zinc-200 backdrop-blur">
                <button type="button" onClick={onCall} className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold ${ORANGE}`}>
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {t('Call', 'Pozovite')}
                </button>
                <span className={`inline-flex h-11 items-center justify-center rounded-xl text-[13px] font-bold text-white ${NAVY}`}>{t('Book', 'Zakažite')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
