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
  const shell = wide ? 'mx-auto max-w-5xl px-8' : 'px-4';

  const form = (
    <div {...mark('form')}>
      {tag('form', t('Enquiry form', 'Forma za upit'))}
      <div className={`rounded-2xl bg-white p-5 text-ink-950 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.5)] ${block && block !== 'form' && block !== 'hero' ? 'opacity-30' : ''}`}>
        <p className="font-display text-lg">{t('Get a free estimate', 'Besplatna procena')}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{t('We reply within 15 minutes during business hours.', 'Odgovaramo za 15 minuta, radnim danima.')}</p>
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
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Your name', 'Vaše ime')}
              aria-label={t('Your name', 'Vaše ime')}
              className="h-10 w-full rounded-lg bg-zinc-50 px-3 text-[13px] ring-1 ring-zinc-200 outline-none focus:ring-[#f26b1d]"
            />
            <input
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder={t('Phone', 'Telefon')}
              aria-label={t('Phone', 'Telefon')}
              inputMode="tel"
              className="h-10 w-full rounded-lg bg-zinc-50 px-3 text-[13px] ring-1 ring-zinc-200 outline-none focus:ring-[#f26b1d]"
            />
            <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={t('What do you need?', 'Šta vam treba?')}>
              {needs.map((n, i) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={need === i}
                  onClick={() => setNeed(i)}
                  className={`rounded-lg px-2 py-2 text-[11.5px] font-medium ring-1 transition ${need === i ? 'bg-[#0d2340] text-white ring-[#0d2340]' : 'text-zinc-600 ring-zinc-200 hover:ring-zinc-300'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button type="submit" className={`h-11 w-full rounded-lg text-[13px] font-semibold transition ${ORANGE}`}>
              {t('Send my request', 'Pošaljite upit')}
            </button>
            <p className="flex items-center justify-center gap-1 text-[10.5px] text-zinc-400">
              <Lock className="h-3 w-3" aria-hidden />
              {t('No spam. We only call about your request.', 'Bez spama. Zovemo samo zbog vašeg upita.')}
            </p>
          </form>
        )}
      </div>
    </div>
  );

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
            <div className="sticky top-0 z-[3]">
              {wide && (
                <div className="bg-[#0a1b31] text-[11px] text-white/75">
                  <div className={`${shell} flex items-center justify-between py-1.5`}>
                    <span className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#f26b1d]" aria-hidden /> {t('24/7 emergency service', 'Hitne intervencije 0–24')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden /> 4.9 · {t('312 Google reviews', '312 Google ocena')}
                      </span>
                    </span>
                    <span>{t('Licensed & insured · Lic. #HV-20418', 'Registrovana firma · PIB 112345678')}</span>
                  </div>
                </div>
              )}
              <div className="border-b border-zinc-100 bg-white/95 backdrop-blur">
                <div className={`${shell} flex items-center justify-between gap-4 py-3`}>
                  <span className="flex items-center gap-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${NAVY} text-[#f26b1d]`}>
                      <Snowflake className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="leading-tight">
                      <span className="block font-display text-[15px] text-[#0d2340]">Summit</span>
                      <span className="block text-[9px] font-semibold tracking-[0.18em] text-zinc-400 uppercase">{t('Heating & Air', 'Klima i grejanje')}</span>
                    </span>
                  </span>
                  {wide && (
                    <span className="flex items-center gap-5 text-[12.5px] font-medium text-[#0d2340]">
                      {[t('Cooling', 'Hlađenje'), t('Heating', 'Grejanje'), t('Air quality', 'Kvalitet vazduha'), t('Offers', 'Akcije'), t('Areas', 'Oblasti'), t('Contact', 'Kontakt')].map((l) => (
                        <span key={l} className="flex items-center gap-0.5">
                          {l}
                          {l === t('Cooling', 'Hlađenje') && <ChevronDown className="h-3 w-3" aria-hidden />}
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    {wide && (
                      <button type="button" onClick={onCall} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0d2340]">
                        <Phone className="h-3.5 w-3.5 text-[#f26b1d]" aria-hidden />
                        {phoneNo}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={phone ? onCall : undefined}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${ORANGE}`}
                    >
                      {phone && <Phone className="h-3 w-3" aria-hidden />}
                      {phone ? t('Call', 'Pozovite') : t('Book service', 'Zakažite servis')}
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Hero */}
            <section {...mark('hero')}>
              {tag('hero', t('First screen', 'Prvi ekran'))}
              <div className={`${NAVY} overflow-hidden text-white ${block === 'hero' ? 'rounded-2xl' : ''}`}>
                <div className={`${shell} grid items-center gap-6 py-8 ${wide ? 'grid-cols-[1.15fr_0.85fr] py-12' : ''}`}>
                  <div className={`transition-opacity duration-300 ${dim('hero')}`}>
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium ring-1 ring-white/15">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden /> 4.9 · {t('312 Google reviews', '312 Google ocena')}
                    </p>
                    <h3 className={`mt-3 font-display leading-[1.08] ${wide ? 'text-[34px]' : 'text-[25px]'}`}>
                      {t('Same-day AC & heating repair in', 'Servis klima i grejanja u')} <span className="text-[#f26b1d]">{cityIn}</span>
                      {t('', ', isti dan')}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-white/75">
                      {t(
                        'Licensed technicians, a fixed price before we start and a 2-year guarantee on every repair.',
                        'Licencirani serviseri, fiksna cena pre početka rada i 2 godine garancije na svaku popravku.',
                      )}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-white/85">
                      {[t('22+ years in business', '22+ godine iskustva'), t('Same-day service', 'Servis isti dan'), t('2-year guarantee', 'Garancija 2 godine')].map((b) => (
                        <li key={b} className="flex items-center gap-1.5">
                          <BadgeCheck className="h-4 w-4 text-[#f26b1d]" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold ${ORANGE}`}>
                        {t('Book service', 'Zakažite servis')}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <button
                        type="button"
                        onClick={onCall}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2.5 text-[13px] font-semibold ring-1 ring-white/25 transition hover:bg-white/15"
                      >
                        <Phone className="h-3.5 w-3.5" aria-hidden />
                        {phoneNo}
                      </button>
                    </div>
                  </div>
                  {form}
                </div>
              </div>
            </section>

            <div className={`space-y-12 pb-24 ${wide ? 'pt-10' : 'pt-8'}`}>
              {/* Trust bar */}
              <div className={`${shell} ${dim('trust')}`}>
                <ul className={`grid gap-3 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100 ${wide ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  {[
                    [Star, t('4.9 on Google', '4,9 na Google-u')],
                    [ShieldCheck, t('Licensed & insured', 'Registrovani i osigurani')],
                    [Tag, t('Fixed upfront prices', 'Fiksna cena unapred')],
                    [BadgeCheck, t('No subcontractors', 'Bez podizvođača')],
                  ].map(([Icon, label]) => {
                    const I = Icon as typeof Star;
                    return (
                      <li key={label as string} className="flex items-center gap-2 text-[12.5px] font-semibold text-[#0d2340]">
                        <I className="h-4 w-4 shrink-0 text-[#f26b1d]" aria-hidden />
                        {label as string}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Problems */}
              <div className={`${shell} ${dim()}`}>
                <h4 className="text-center font-display text-[22px] text-[#0d2340]">{t('Sound familiar?', 'Da li vam se ovo dešava?')}</h4>
                <div className={`mt-5 grid gap-3 ${wide ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  {[
                    [Thermometer, t('AC runs but won’t cool', 'Klima radi, a ne hladi')],
                    [Zap, t('Power bills keep climbing', 'Računi za struju rastu')],
                    [Volume2, t('Strange noises or smells', 'Čudni zvuci ili mirisi')],
                    [Flame, t('Some rooms never warm up', 'Neke sobe se ne zagreju')],
                  ].map(([Icon, label]) => {
                    const I = Icon as typeof Star;
                    return (
                      <div key={label as string} className="rounded-xl p-4 text-center ring-1 ring-zinc-200">
                        <I className="mx-auto h-6 w-6 text-[#f26b1d]" aria-hidden />
                        <p className="mt-2 text-[12.5px] font-semibold text-[#0d2340]">{label as string}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services */}
              <section {...mark('services')}>
                {tag('services', t('Service pages', 'Stranice usluga'))}
                <div className={`${shell} py-1 ${dim('services')}`}>
                  <h4 className="text-center font-display text-[22px] text-[#0d2340]">{t('How can we help?', 'Kako možemo da pomognemo?')}</h4>
                  <div className="mx-auto mt-4 flex w-fit gap-1 rounded-xl bg-zinc-100 p-1">
                    {tabs.map((tb, i) => (
                      <button
                        key={tb.label}
                        type="button"
                        onClick={() => setTab(i)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${tab === i ? 'bg-white text-[#0d2340] shadow-sm' : 'text-zinc-500'}`}
                      >
                        <tb.icon className="h-3.5 w-3.5" aria-hidden />
                        {tb.label}
                      </button>
                    ))}
                  </div>
                  <div className={`mt-4 grid gap-3 ${wide ? 'grid-cols-3' : ''}`}>
                    {tabs[tab].items.map((s) => {
                      const href = `/${sr ? 'usluge' : 'services'}/${s.slug[sr ? 1 : 0]}`;
                      const on = path === href;
                      return (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => onPath(href, s.name)}
                          className={`group overflow-hidden rounded-xl text-left ring-1 transition ${on ? 'ring-2 ring-[#f26b1d]' : 'ring-zinc-200 hover:ring-[#f26b1d]/60'}`}
                        >
                          <span className={`flex h-20 items-center justify-center bg-gradient-to-br from-[#163a63] to-[#0d2340] ${wide ? '' : 'h-14'}`}>
                            <s.icon className="h-8 w-8 text-white/85" aria-hidden />
                          </span>
                          <span className="block p-3.5">
                            <span className="block text-[14px] font-semibold text-[#0d2340]">{s.name}</span>
                            <span className="mt-1 block text-[12px] leading-snug text-zinc-500">{s.text}</span>
                            <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#f26b1d]">
                              {t('Learn more', 'Saznajte više')}
                              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Offers */}
              <div className={`${shell} ${dim()}`}>
                <h4 className="text-center font-display text-[22px] text-[#0d2340]">{t('Current offers', 'Aktuelne akcije')}</h4>
                <div className={`mt-5 grid gap-3 ${wide ? 'grid-cols-3' : ''}`}>
                  {[
                    [t('20% off', '−20%'), t('your first AC tune-up', 'na prvi servis klime')],
                    [t('Free', 'Besplatna'), t('estimate on a new system', 'procena za novi sistem')],
                    [t('Free', 'Besplatno'), t('second opinion on any quote', 'drugo mišljenje na tuđu ponudu')],
                  ].map(([big, small]) => (
                    <div key={small} className="rounded-xl border-2 border-dashed border-[#f26b1d]/40 bg-orange-50/40 p-4 text-center">
                      <p className="font-display text-[26px] text-[#f26b1d]">{big}</p>
                      <p className="text-[12.5px] font-medium text-[#0d2340]">{small}</p>
                      <span className="mt-3 inline-block rounded-md bg-[#0d2340] px-3 py-1.5 text-[11px] font-semibold text-white">{t('Claim offer', 'Iskoristite')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className={`${shell} ${dim()}`}>
                <h4 className="text-center font-display text-[22px] text-[#0d2340]">{t('Three simple steps', 'Tri jednostavna koraka')}</h4>
                <ol className={`mt-5 grid gap-3 ${wide ? 'grid-cols-3' : ''}`}>
                  {[
                    [t('Book online or call', 'Zakažite ili pozovite'), t('Pick a time that suits you, even today.', 'Izaberite termin, može i danas.')],
                    [t('Fixed price first', 'Prvo fiksna cena'), t('We diagnose and quote before any work.', 'Dijagnoza i cena pre bilo kakvog rada.')],
                    [t('Fixed and guaranteed', 'Popravljeno, uz garanciju'), t('Two years on parts and labour.', 'Dve godine na delove i rad.')],
                  ].map(([title, text], i) => (
                    <li key={title} className="flex gap-3 rounded-xl bg-zinc-50 p-4">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${NAVY} text-[13px] font-semibold text-white`}>{i + 1}</span>
                      <span>
                        <span className="block text-[13.5px] font-semibold text-[#0d2340]">{title}</span>
                        <span className="mt-0.5 block text-[12px] text-zinc-500">{text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Reviews */}
              <section {...mark('trust')}>
                {tag('trust', t('Proof', 'Dokaz'))}
                <div className={`${shell} py-1 ${dim('trust')}`}>
                  <div className="flex flex-col items-center text-center">
                    <h4 className="font-display text-[22px] text-[#0d2340]">{t('What our customers say', 'Šta kažu naši klijenti')}</h4>
                    <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-zinc-500">
                      <span className="text-amber-400">★★★★★</span> 4.9 · {t('312 reviews on Google', '312 ocena na Google-u')}
                    </p>
                  </div>
                  <div className={`mt-5 grid gap-3 ${wide ? 'grid-cols-3' : ''}`}>
                    {[
                      [t('“Came the same afternoon, told me the price upfront and the AC was running in an hour.”', '„Došli su isto popodne, rekli cenu unapred i klima je radila za sat vremena.”'), 'Ana M.', t('AC repair', 'Popravka klima')],
                      [t('“Honest advice. They fixed it instead of selling me a new unit.”', '„Pošteni. Popravili su staru, umesto da mi prodaju novu.”'), 'Marko P.', t('Heating repair', 'Popravka grejanja')],
                      [t('“Clean, on time, and they texted before arriving.”', '„Uredni, tačni i javili su porukom pre dolaska.”'), 'Jelena S.', t('Installation', 'Ugradnja')],
                    ].map(([quote, who, job]) => (
                      <figure key={who} className="rounded-xl bg-white p-4 ring-1 ring-zinc-200">
                        <p className="text-amber-400" aria-hidden>
                          ★★★★★
                        </p>
                        <blockquote className="mt-1.5 text-[12.5px] leading-snug text-zinc-700">{quote}</blockquote>
                        <figcaption className="mt-2 text-[11px] text-zinc-400">
                          {who} · {job} · Google
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </section>

              {/* Areas */}
              <div className={`${shell} ${dim()}`}>
                <h4 className="text-center font-display text-[22px] text-[#0d2340]">{t('Areas we serve', 'Gde radimo')}</h4>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {(sr
                    ? ['Novi Sad', 'Petrovaradin', 'Sremska Kamenica', 'Veternik', 'Futog', 'Temerin', 'Kać', 'Rumenka']
                    : ['Springfield', 'Riverside', 'Oak Park', 'Fairview', 'Lakewood', 'Cedar Hills', 'Maple Grove', 'Westbrook']
                  ).map((c) => (
                    <li key={c} className="flex items-center gap-1 rounded-full bg-zinc-50 px-3 py-1.5 text-[12px] font-medium text-[#0d2340] ring-1 ring-zinc-200">
                      <MapPin className="h-3 w-3 text-[#f26b1d]" aria-hidden />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ */}
              <div className={`${shell} ${dim()}`}>
                <h4 className="text-center font-display text-[22px] text-[#0d2340]">{t('Questions', 'Česta pitanja')}</h4>
                <div className="mx-auto mt-4 max-w-2xl divide-y divide-zinc-100 rounded-xl ring-1 ring-zinc-200">
                  {[
                    [t('How fast can you come?', 'Koliko brzo dolazite?'), t('Most calls get a technician the same day.', 'Na većinu poziva serviser dolazi isti dan.')],
                    [t('Will the price change on site?', 'Da li se cena menja na licu mesta?'), t('No. You approve a fixed price before we start.', 'Ne. Cenu odobravate pre početka rada.')],
                    [t('Do you guarantee your work?', 'Da li dajete garanciju?'), t('Two years on parts and labour.', 'Dve godine na delove i rad.')],
                  ].map(([q, a], i) => (
                    <div key={q} className="px-4">
                      <button type="button" onClick={() => setFaq(faq === i ? null : i)} className="flex w-full items-center justify-between py-3 text-left text-[13px] font-semibold text-[#0d2340]">
                        {q}
                        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${faq === i ? 'rotate-180' : ''}`} aria-hidden />
                      </button>
                      {faq === i && <p className="pb-3 text-[12.5px] text-zinc-500">{a}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Closing call to action and footer */}
              <div className={dim()}>
                <div className={`${NAVY} text-white`}>
                  <div className={`${shell} flex items-center justify-between gap-4 py-7 ${wide ? '' : 'flex-col text-center'}`}>
                    <p className="font-display text-[20px]">{t('Too hot or too cold? We can come today.', 'Prevruće ili prehladno? Možemo i danas.')}</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold ${ORANGE}`}>
                      <Phone className="h-3.5 w-3.5" aria-hidden />
                      {phoneNo}
                    </span>
                  </div>
                </div>
                <div className="bg-[#0a1b31] text-[11.5px] text-white/60">
                  <div className={`${shell} grid gap-4 py-6 ${wide ? 'grid-cols-3' : ''}`}>
                    <p>
                      <span className="block font-semibold text-white">{brand}</span>
                      {t('14 Oak Street, Springfield', 'Bulevar oslobođenja 14, Novi Sad')}
                    </p>
                    <p>
                      {t('Mon–Fri 7–19 · Sat 8–14', 'Pon–pet 7–19 · Sub 8–14')}
                      <br />
                      {t('24/7 emergencies', 'Hitno 0–24')}
                    </p>
                    <p>
                      {phoneNo}
                      <br />
                      {t('info@summitheatingair.com', 'info@summitklima.rs')}
                    </p>
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
                <button type="button" onClick={onCall} className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold ${ORANGE}`}>
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {t('Call', 'Pozovite')}
                </button>
                <span className={`inline-flex h-10 items-center justify-center rounded-xl text-[13px] font-semibold text-white ${NAVY}`}>{t('Book', 'Zakažite')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
