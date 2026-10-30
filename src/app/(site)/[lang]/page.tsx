import type { Metadata } from 'next';
import { alternates, ogImage } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Check,
  FileText,
  Hourglass,
  KeyRound,
  LayoutTemplate,
  MailX,
  MapPin,
  Phone,
  SearchX,
  ShieldCheck,
  Star,
  Target,
  Wallet,
  Zap,
} from 'lucide-react';
import { CheckForm } from '@/components/site/CheckForm';
import { CountUp } from '@/components/site/CountUp';
import { FaqList } from '@/components/site/FaqList';
import { HeroBackdrop } from '@/components/site/HeroBackdrop';
import { Reveal } from '@/components/site/Reveal';
import { SectionHeading } from '@/components/site/Section';
import { SiteAnatomy } from '@/components/site/SiteAnatomy';
import { AdsVisual, LeadsVisual, SearchVisual, SpeedVisual } from '@/components/site/ServiceVisuals';
import { caseStudiesIn } from '@/content/work';
import { usd, type Lang, type T } from '@/lib/i18n';
import { getI18n } from '@/lib/i18n-site';
import { livePricing, type Pricing } from '@/lib/pricing';
import { AreaVisual, NumbersVisual, OwnershipVisual, RingingPhone } from '@/components/site/PromiseVisuals';

const heroStats = (t: T) => [
  { value: t('1,010', '1.010'), label: t('tracked enquiries for a single client', 'praćenih upita za jednog klijenta') },
  { value: t('11.2%', '11,2%'), label: t('of visitors picked up the phone', 'posetilaca je pozvalo telefonom') },
  { value: t('< 1 day', '< 1 dan'), label: t('to answer every enquiry', 'do odgovora na svaki upit') },
];

// The customer's path from a search to a booked job, and where each step leaks.
const problems = (t: T) => [
  {
    stage: t('Search', 'Pretraga'),
    icon: SearchX,
    title: t('Customers can’t find you', 'Kupci vas ne nalaze'),
    text: t(
      'Thin pages with nothing local on them keep you off page one, and when people ask ChatGPT or Google’s AI, it recommends someone else.',
      'Sajt sa malo sadržaja Google ne prikazuje na prvoj strani, a kad ljudi pitaju ChatGPT ili Google AI, preporuči im se neko drugi.',
    ),
    fix: t('A page for every service and location, written the way your customers search.', 'Posebna stranica za svaku uslugu i lokaciju, napisana rečima kojima kupci pretražuju.'),
  },
  {
    stage: t('Visit', 'Poseta'),
    icon: Hourglass,
    title: t('They leave before it loads', 'Odu pre nego što se sajt učita'),
    text: t(
      'Every extra second on a phone costs you visitors before they see your number, and the ones you paid for with ads leave first.',
      'Svaka sekunda čekanja na telefonu odnosi posetioce pre nego što vide vaš broj. Prvi odlaze oni koje ste platili kroz oglase.',
    ),
    fix: t('Pages that load in under two seconds, with your number on the first screen.', 'Stranice koje se učitaju za manje od dve sekunde, sa brojem telefona odmah na vrhu.'),
  },
  {
    stage: t('Enquiry', 'Upit'),
    icon: MailX,
    title: t('The enquiry goes cold', 'Upit ostane bez odgovora'),
    text: t(
      'Forms land in an inbox nobody checks. By the time you reply, the customer has already gone to a competitor.',
      'Poruke sa sajta završe u inboxu koji niko ne gleda. Dok odgovorite, kupac je već otišao kod konkurencije.',
    ),
    fix: t('Every call and enquiry reaches your phone the moment it comes in.', 'Svaki poziv i upit stiže vam na telefon istog trenutka.'),
  },
  {
    stage: t('Budget', 'Budžet'),
    icon: Wallet,
    title: t('You can’t tell what pays off', 'Ne znate šta se isplati'),
    text: t(
      'Clicks, impressions and agency reports, but no answer to the only question that matters: which money brought in customers?',
      'Klikovi, prikazi i izveštaji agencije, a odgovora nema na jedino važno pitanje: koji uloženi novac je doveo kupce?',
    ),
    fix: t('One monthly report: enquiries, calls and cost per enquiry, by source.', 'Jedan mesečni izveštaj: upiti, pozivi i cena po upitu, po izvoru.'),
  },
];

// Bento layout on desktop: the lead feed runs down the right, Google Ads spans two columns.
const services = (t: T) => [
  {
    icon: LayoutTemplate,
    visual: SpeedVisual,
    area: 'lg:col-start-1 lg:row-start-1',
    title: t('Websites that sell', 'Sajtovi koji prodaju'),
    text: t(
      'Custom-designed, lightning-fast on any phone, with your offer, reviews and a clear call to action right on the first screen.',
      'Dizajn po meri, munjevito brz na svakom telefonu, sa ponudom, recenzijama i jasnim pozivom na akciju odmah na prvom ekranu.',
    ),
    points: [t('Mobile-first design', 'Prilagođeno telefonima'), t('Google speed scores of 90+', 'Google ocena brzine 90+')],
  },
  {
    icon: MapPin,
    visual: SearchVisual,
    area: 'lg:col-start-2 lg:row-start-1',
    title: t('SEO and AI search', 'SEO i AI pretraga'),
    text: t(
      'Be the business Google, Maps and ChatGPT recommend, with a page for every service and location written the way customers actually search.',
      'Budite firma koju preporučuju Google, Mape i ChatGPT, uz stranicu za svaku uslugu i lokaciju napisanu onako kako kupci zaista pretražuju.',
    ),
    points: [t('Service and location pages', 'Stranice za usluge i lokacije'), t('Technical SEO built in', 'Tehnički SEO ugrađen')],
  },
  {
    icon: Target,
    visual: AdsVisual,
    area: 'lg:col-span-2 lg:col-start-1 lg:row-start-2',
    title: 'Google Ads',
    text: t(
      'Ads shown to people who are ready to buy, in the areas you serve, with every call and enquiry traced back to the search that brought it.',
      'Oglasi koji se prikazuju ljudima spremnim za kupovinu, tamo gde radite, a svaki poziv i upit vezan je za pretragu koja ga je donela.',
    ),
    points: [t('Call and enquiry tracking', 'Praćenje poziva i upita'), t('Budget goes where it pays off', 'Budžet ide tamo gde se isplati')],
  },
  {
    icon: BellRing,
    visual: LeadsVisual,
    area: 'lg:col-start-3 lg:row-span-2 lg:row-start-1',
    title: t('Enquiry tracking and reports', 'Praćenje upita i izveštaji'),
    text: t(
      'Every enquiry and call reaches you the moment it happens, and a monthly report shows visitors, enquiries and what each one cost.',
      'Svaki upit i poziv stiže vam istog trenutka, a mesečni izveštaj pokazuje posete, upite i koliko vas je koštao svaki od njih.',
    ),
    points: [t('Instant enquiry alerts', 'Obaveštenje o upitu odmah'), t('One report in plain language', 'Izveštaj bez stručnih izraza')],
  },
];

const promises = (t: T) => [
  {
    icon: MapPin,
    title: t('One business per industry, per area', 'Jedna firma po delatnosti u gradu'),
    visual: AreaVisual,
    text: t(
      'We never work for two competitors in the same area. Everything we build for you works only for you.',
      'Ne radimo za dve konkurentske firme u istom mestu. Sve što napravimo za vas radi samo za vas.',
    ),
  },
  {
    icon: KeyRound,
    title: t('Everything in your name', 'Sve je na vaše ime'),
    visual: OwnershipVisual,
    text: t(
      'Domain, code, hosting and ad account belong to you from day one. No lock-in and no hidden strings.',
      'Domen, kod, hosting i nalog za oglase su vaši od prvog dana. Bez vezivanja i bez skrivenih uslova.',
    ),
  },
  {
    icon: FileText,
    title: t('Numbers, not excuses', 'Brojke, a ne izgovori'),
    visual: NumbersVisual,
    text: t(
      'You see every enquiry as it arrives and get one clear report a month. If something isn’t paying off, you hear it from us first.',
      'Svaki upit vidite čim stigne, a jednom mesečno dobijate jasan izveštaj. Ako nešto ne donosi rezultat, prvi ćemo vam to reći.',
    ),
  },
];

const reportPoints = (t: T) => [
  {
    icon: BellRing,
    title: t('Every enquiry, instantly', 'Svaki upit, odmah'),
    text: t(
      'The full message, the page it came from and the ad or search behind it, in your inbox the moment it is sent.',
      'Cela poruka, stranica sa koje je poslata i oglas ili pretraga koja ju je dovela, u vašem inboxu čim je poslata.',
    ),
  },
  {
    icon: Phone,
    title: t('Every call counted', 'Svaki poziv se računa'),
    text: t(
      'Taps on your phone number, WhatsApp and SMS links count as enquiries, right next to the forms.',
      'Klikovi na broj telefona, WhatsApp i SMS računaju se kao upiti, zajedno sa porukama sa sajta.',
    ),
  },
  {
    icon: Wallet,
    title: t('Cost per enquiry and ROAS', 'Cena po upitu i povrat ulaganja'),
    text: t(
      'Add your ad spend and the report shows what each enquiry really cost and what it earned you.',
      'Unesite koliko ste potrošili na oglase i izveštaj pokazuje koliko je zaista koštao svaki upit i koliko vam je doneo.',
    ),
  },
  {
    icon: ShieldCheck,
    title: t('Privacy built in', 'Privatnost na prvom mestu'),
    text: t(
      'Visitors are counted without cookies and without tracking them across other websites.',
      'Posete se broje bez kolačića i bez praćenja ljudi po drugim sajtovima.',
    ),
  },
];

const steps = (t: T) => [
  {
    title: t('Free website audit', 'Besplatna analiza sajta'),
    when: t('Within 1 business day', 'Za jedan radni dan'),
    get: t('An honest review of your site and your top competitors', 'Iskrena analiza vašeg sajta i najjače konkurencije'),
    text: t(
      'Send the form. Within one business day we review your site and your top competitors and tell you honestly what is holding you back.',
      'Popunite formu. Za jedan radni dan pregledamo vaš sajt i najjaču konkurenciju i iskreno vam kažemo šta vas koči.',
    ),
  },
  {
    title: t('One clear proposal', 'Jasna ponuda'),
    when: t('One short call', 'Jedan kratak razgovor'),
    get: t('Scope, timeline and one fixed price, in writing', 'Šta radimo, do kada i po kojoj ceni, napismeno'),
    text: t(
      'A short call, then one document: what we build or manage, when it is ready, and one fixed price.',
      'Kratak razgovor, a zatim jedan dokument: šta radimo, kada je gotovo i koliko košta. Cena je fiksna.',
    ),
  },
  {
    title: t('Design and launch', 'Izrada i pokretanje'),
    when: t('Your old site stays live', 'Stari sajt radi do kraja'),
    get: t('A preview link to follow every step', 'Link na kom pratite svaki korak'),
    text: t(
      'You follow progress on a preview link. Your current site stays live until the new one is ready, and old pages are redirected so you keep your rankings.',
      'Napredak pratite preko linka. Postojeći sajt radi sve dok novi ne bude spreman, a stare adrese preusmeravamo da ne izgubite pozicije na Google-u.',
    ),
  },
  {
    title: t('Measure and grow', 'Merenje i rast'),
    when: t('Every month', 'Svakog meseca'),
    get: t('Every enquiry as it arrives, and one clear report', 'Svaki upit čim stigne i jasan izveštaj'),
    text: t(
      'Tracking runs from day one. Each month you see what came in, and we move the budget to whatever brings customers.',
      'Praćenje radi od prvog dana. Svakog meseca vidite šta je stiglo, a budžet usmeravamo na ono što donosi kupce.',
    ),
  },
];

// The FAQ quotes today's prices from the admin price list.
const faqList = (lang: Lang, t: T, { monthlyPlans, websitePlans }: Pricing) => {
  const planPrice = (id: string) => usd(lang, monthlyPlans.find((p) => p.id === id)?.price ?? 0);
  const site = usd(lang, websitePlans[0].price);
  return [
    {
      q: t('How much does it cost?', 'Koliko košta?'),
      a: t(
        `Websites start at ${site} as one fixed price. Google Ads management starts at ${planPrice('google-ads')} a month and local SEO at ${planPrice('local-seo')}, with no setup fee and no long contract. All plans are on the pricing page.`,
        `Sajtovi počinju od ${site} kao jedna fiksna cena. Vođenje Google Ads-a počinje od ${planPrice('google-ads')} mesečno, a lokalni SEO od ${planPrice('local-seo')}, bez naknade za postavku i bez dugog ugovora. Svi paketi su na stranici sa cenama.`,
      ),
    },
    {
      q: t('Do you work with my competitors?', 'Da li radite i za moju konkurenciju?'),
      a: t(
        'No. We take one business per industry in each area, so what we build for you never competes with another client of ours.',
        'Ne. U jednom mestu radimo samo sa jednom firmom iz iste delatnosti, pa se ono što napravimo za vas nikad ne takmiči sa drugim našim klijentom.',
      ),
    },
    {
      q: t('What happens to my current site and Google rankings?', 'Šta biva sa mojim sadašnjim sajtom i pozicijama na Google-u?'),
      a: t(
        'Your current site stays live until the new one is ready. Content moves over and old pages are redirected, so nothing that ranks today gets lost.',
        'Postojeći sajt radi dok novi ne bude spreman. Sadržaj prenosimo, a stare adrese preusmeravamo, pa ne gubite ništa što se danas dobro rangira.',
      ),
    },
    {
      q: t('Who owns the website?', 'Čiji je sajt?'),
      a: t(
        'You do. The domain, the code and the hosting are in your name from day one. If you ever leave, you take everything with you.',
        'Vaš. Domen, kod i hosting su na vaše ime od prvog dana. Ako jednog dana odete, sve nosite sa sobom.',
      ),
    },
    {
      q: t('What kinds of businesses do you work with?', 'Sa kakvim firmama radite?'),
      a: t(
        'Any small or local business that gets customers through calls, enquiries and bookings: dental and medical practices, trades and home services, transport, retail, restaurants and professional services.',
        'Sa svakom malom ili lokalnom firmom koja dobija klijente preko poziva, upita i rezervacija: stomatološke i medicinske ordinacije, zanatske i kućne usluge, prevoz, prodavnice, ugostiteljstvo i stručne usluge.',
      ),
    },
    {
      q: t('How fast do you reply?', 'Koliko brzo odgovarate?'),
      a: t('Within one business day, to every enquiry.', 'U roku od jednog radnog dana, na svaki upit.'),
    },
  ];
};

// Short proof lines for the client cards under the hero.
const clientHighlight = (t: T): Record<string, { value: string; label: string }> => ({
  'tree-jaws': { value: t('1,010', '1.010'), label: t('tracked enquiries from Google Ads', 'praćenih upita iz Google oglasa') },
  'mahalo-tree-service': { value: '100', label: t('Google SEO score, $0 on ads', 'Google SEO ocena, $0 za oglase') },
  'care-trans': { value: t('11.2%', '11,2%'), label: t('of visitors picked up the phone', 'posetilaca je pozvalo telefonom') },
  'eric-dental-centar': { value: '60', label: t('pages in three languages', 'stranica na tri jezika') },
});

const clientProof = (t: T) => [
  { value: t('1,000+', '1.000+'), label: t('Tracked enquiries', 'Praćenih upita') },
  { value: t('4.9–5.0★', '4,9–5,0★'), label: t('Client Google ratings', 'Ocene klijenata na Google-u') },
  { value: '2', label: t('Countries', 'Zemlje') },
];

const primaryButton =
  'group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-ink-950 shadow-glow transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark';

// Prices come from the admin price list; saving it refreshes this page at once.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { lang, lp } = await getI18n();
  return { alternates: alternates(lang, '/'), openGraph: { url: lp('/'), images: [ogImage(lang)] } };
}

export default async function HomePage() {
  const { lang, t, lp } = await getI18n();
  const caseStudies = caseStudiesIn(lang);
  const highlight = clientHighlight(t);
  const faqs = faqList(lang, t, await livePricing(lang));
  return (
    <>
      {/* Hero */}
      <section className="bg-spotlight relative overflow-hidden pt-14 pb-24 text-white max-md:pt-8 max-md:pb-4 sm:pt-20 lg:pb-32">
        <HeroBackdrop />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 max-md:gap-6 max-md:px-3 sm:px-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="text-center max-md:px-1 lg:text-left">
            <Reveal className="max-md:hidden">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs tracking-wide text-white/75 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur">
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" aria-hidden />
                {t('Taking on one business per industry in each area', 'Primamo jednu firmu po delatnosti u svakom gradu')}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[2.6rem] leading-[1.02] text-balance max-md:mt-0 max-md:text-[1.95rem] max-md:leading-[1.08] sm:text-6xl lg:text-[4.4rem]">
                {t('Websites and ads that turn visitors into', 'Sajtovi i oglasi koji posetioce pretvaraju u')}{' '}
                <span className="text-gradient">{t('paying customers', 'kupce')}</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              {/* Phones: one short line, so the form is on the first screen. */}
              <p className="mx-auto mt-3 max-w-xs text-[15px] leading-snug text-white/70 md:hidden">
                {t('Web design, SEO and Google Ads. Every call and enquiry tracked.', 'Izrada sajtova, SEO i Google oglašavanje. Svaki poziv i upit je zabeležen.')}
              </p>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-white/70 max-md:hidden lg:mx-0">
                {t(
                  'WebTano designs fast, modern websites and runs SEO and Google Ads for small and local businesses. You see every call and enquiry your site brings in, and exactly what each one cost.',
                  'WebTano pravi brze, moderne sajtove i vodi SEO i Google oglašavanje za male i lokalne firme. Vidite svaki poziv i upit koji vam sajt donese i tačno koliko vas je koštao.',
                )}
              </p>
            </Reveal>
            <Reveal delay={240} className="max-md:hidden">
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="#hero-form" className={`${primaryButton} w-full sm:w-auto`}>
                  {t('Get a free website audit', 'Zatražite besplatnu analizu')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
                <Link
                  href={lp('/demo')}
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10 sm:w-auto"
                >
                  {t('Try the demo site', 'Pogledajte demo sajt')}
                </Link>
              </div>
              <p className="mt-5 flex items-center justify-center gap-2 text-sm text-white/55 lg:justify-start">
                <Check className="h-4 w-4 text-accent" aria-hidden />
                {t('Free, no obligation. We reply within one business day.', 'Besplatno i bez obaveze. Odgovaramo za jedan radni dan.')}
              </p>
            </Reveal>
            <dl className="mt-12 grid grid-cols-3 gap-3 max-md:hidden sm:gap-4">
              {heroStats(t).map((s, i) => (
                <Reveal key={s.label} delay={320 + i * 90}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur transition duration-300 hover:border-white/20 hover:bg-white/[0.06] sm:p-4 lg:text-left">
                    <dd className="font-display text-2xl text-white sm:text-3xl">
                      <CountUp value={s.value} />
                    </dd>
                    <dt className="mt-1.5 font-mono text-[10px] leading-snug tracking-wide text-white/50 uppercase sm:text-[11px]">{s.label}</dt>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal variant="scale" delay={200} className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="pointer-events-none absolute -inset-12 rounded-full bg-azure-600/30 blur-3xl max-md:hidden" aria-hidden />
            <div className="relative">
              <CheckForm compact />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Clients */}
      <section className="bg-clients relative overflow-hidden py-16 max-md:py-8 sm:py-20">
        <div className="grid-lines-light pointer-events-none absolute inset-0" aria-hidden />
        {/* The hero's dark edge melts into this section instead of stopping at a hard line. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-975/[0.07] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" aria-hidden />
        <div className="hero-aurora pointer-events-none top-1/2 left-1/2 h-72 w-[46rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(1_175_233/0.3),transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:items-end lg:text-left">
            <Reveal>
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-azure-700 uppercase">
                {t('Growing alongside businesses like', 'Rastemo zajedno sa firmama kao što su')}
              </p>
              <h2 className="mt-3 max-w-xl font-display text-2xl text-balance text-ink-950 sm:text-3xl">
                {t('Real businesses, real numbers, measured by our own tracking', 'Prave firme i pravi rezultati, izmereni našim praćenjem')}
              </h2>
            </Reveal>
            <Reveal delay={100} className="max-md:hidden">
              <dl className="flex divide-x divide-zinc-200 rounded-2xl border border-zinc-200/80 bg-white/80 shadow-soft backdrop-blur">
                {clientProof(t).map((p) => (
                  <div key={p.label} className="flex flex-col-reverse px-4 py-3 sm:px-6">
                    <dt className="font-mono text-[10px] tracking-wide text-zinc-500 uppercase">{p.label}</dt>
                    <dd className="font-display text-xl text-ink-950 sm:text-2xl">{p.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 max-md:mt-5 sm:gap-5 lg:grid-cols-4">
            {caseStudies.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 90}>
                <Link
                  href={lp(`/work/${c.slug}`)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-azure-200 hover:shadow-lift"
                >
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="relative flex h-28 items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-5 max-md:h-20 sm:h-36">
                    <Image
                      src={`/clients/${c.slug}.webp`}
                      alt={c.client}
                      width={332}
                      height={160}
                      className="h-14 w-auto max-w-full object-contain transition duration-500 ease-out group-hover:scale-110 sm:h-20"
                    />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-zinc-100 p-4 sm:p-5">
                    <p className="font-mono text-[10px] tracking-wide text-zinc-500 uppercase">
                      {c.sector} · {c.location.split(',')[0]}
                    </p>
                    <p className="mt-2 font-display text-2xl text-azure-700 sm:text-3xl">
                      <CountUp value={highlight[c.slug].value} />
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-zinc-600 sm:text-sm">{highlight[c.slug].label}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ink-800 sm:text-sm">
                      {t('Case study', 'Studija slučaja')}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
          <Link
            href={lp('/work')}
            className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#f2f2f7] text-[15px] font-semibold text-ink-950 md:hidden"
          >
            {t('All case studies', 'Sve studije slučaja')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-leaks relative overflow-hidden py-24 max-md:py-8 sm:py-32">
        <div className="grid-lines-light pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_55%,#000_20%,transparent_75%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-red-700 uppercase shadow-soft ring-1 ring-red-100">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
                {t('What it costs you', 'Koliko vas to košta')}
              </p>
              <h2 className="mt-4 font-display text-3xl text-balance text-ink-950 md:text-[2.75rem] md:leading-[1.08]">
                {t('Your website may be sending customers to your competitors', 'Vaš sajt možda šalje kupce vašoj konkurenciji')}
              </h2>
            </Reveal>
            <Reveal delay={100} className="max-md:hidden">
              <p className="text-lg leading-relaxed text-pretty text-zinc-600">
                {t(
                  'Nothing warns you. No error and no alert, just calls that never come. Here is where customers slip away between finding you and buying from you.',
                  'Ništa vas ne upozorava. Nema greške ni obaveštenja, samo poziva koji ne stižu. Evo gde kupci odlaze negde između pretrage i kupovine.',
                )}
              </p>
            </Reveal>
          </div>

          <ol className="relative mt-16 grid gap-6 max-md:mt-5 max-md:gap-2.5 lg:grid-cols-4 lg:gap-5">
            {/* The path itself: a line that runs through all four stages. */}
            <span className="pipeline pointer-events-none absolute top-[1.15rem] right-[12.5%] left-[12.5%] hidden h-0.5 rounded-full lg:block" aria-hidden />
            <span className="pipeline-v pointer-events-none absolute top-4 bottom-4 left-[1.15rem] w-0.5 rounded-full max-md:hidden lg:hidden" aria-hidden />
            {problems(t).map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 120} className="relative flex flex-col pl-14 max-md:pl-0 lg:pl-0">
                <div className="absolute top-0 left-0 max-md:hidden lg:static lg:flex lg:justify-center">
                  <span className="relative z-10 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full bg-ink-950 font-mono text-xs font-medium text-accent shadow-lift ring-4 ring-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-2.5 mb-3 font-mono text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase max-md:hidden lg:mt-3 lg:mb-4 lg:text-center">
                  {p.stage}
                </p>
                <article className="group flex flex-1 flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex-1 p-5 max-md:flex max-md:items-center max-md:gap-3 max-md:p-4 sm:p-6">
                    <div className="flex items-center justify-between max-md:shrink-0">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100 transition duration-300 group-hover:scale-105">
                        <p.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="rounded-full bg-red-50 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-red-700 uppercase ring-1 ring-red-100 max-md:hidden">
                        {t('Leak', 'Gubitak')}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg text-ink-950 max-md:mt-0 max-md:text-[17px]">{p.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 max-md:hidden">{p.text}</p>
                  </div>
                  <div className="flex gap-3 border-t border-azure-100 bg-azure-50/70 px-5 py-4 max-md:px-4 max-md:py-3 sm:px-6">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-azure-700 text-accent">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    <p className="text-sm leading-snug text-ink-900">
                      <span className="font-semibold">{t('We fix it: ', 'Naše rešenje: ')}</span>
                      {p.fix}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={150} className="max-md:hidden">
            <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-3xl bg-ink-975 px-6 py-6 text-center text-white shadow-float ring-1 ring-white/10 sm:px-8 md:flex-row md:text-left">
              <p className="max-w-2xl text-lg text-white/80">
                <span className="font-semibold text-white">{t('Fix all four', 'Rešite sva četiri problema')}</span>{' '}
                {t(
                  'and the same budget brings in more customers. The free audit shows which of them your site has right now.',
                  'i isti budžet donosi više kupaca. Besplatna analiza pokazuje koje od njih vaš sajt trenutno ima.',
                )}
              </p>
              <Link href="#hero-form" className={`${primaryButton} shrink-0`}>
                {t('Check my website', 'Proverite moj sajt')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-spotlight edge-glow relative scroll-mt-16 overflow-hidden py-24 text-white max-md:py-8 sm:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              light
              eyebrow={t('What we do', 'Usluge')}
              title={t('Everything it takes to turn a search into a sale', 'Sve što treba da pretraga postane prodaja')}
              lead={t(
                'One team for your website, Google rankings, ads and tracking, so nothing falls through the cracks between agencies.',
                'Jedan tim za sajt, pozicije na Google-u, oglase i praćenje rezultata, pa ništa ne ostaje između dve agencije.',
              )}
            />
          </Reveal>
          <div className="mt-14 grid gap-5 max-md:mt-5 max-md:gap-2.5 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
            {services(t).map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className={s.area}>
                <article className="group ring-gradient flex h-full flex-col overflow-hidden rounded-3xl bg-white/[0.03] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05]">
                  <div className="relative border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 max-md:hidden sm:p-6">
                    <s.visual />
                  </div>
                  <div className="flex flex-1 flex-col p-6 max-md:p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/25 transition duration-300 group-hover:bg-accent group-hover:text-ink-950">
                        <s.icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <h3 className="font-display text-xl">{s.title}</h3>
                    </div>
                    <p className="mt-3 flex-1 leading-relaxed text-white/65 max-md:mt-2 max-md:text-[15px] max-md:leading-snug">{s.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2 max-md:hidden">
                      {s.points.map((point) => (
                        <li
                          key={point}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10"
                        >
                          <Check className="h-3.5 w-3.5 text-accent" aria-hidden />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center font-mono text-[10px] tracking-wide text-white/35 uppercase max-md:hidden">
            {t('Illustrations use sample data. Real figures are in the case studies below.', 'Ilustracije su sa primer podacima. Pravi brojevi su u studijama slučaja ispod.')}
          </p>
        </div>
      </section>

      {/* Under the hood: what a WebTano site carries, and what a site without it loses. */}
      <section id="site" className="bg-results relative scroll-mt-16 overflow-hidden py-24 max-md:py-8 sm:py-32">
        <div className="grid-lines-light pointer-events-none absolute inset-x-0 top-0 h-[36rem] [mask-image:linear-gradient(#000,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow={t('Under the hood', 'Ispod haube')}
              title={t('What your website should be doing, and probably isn’t', 'Šta vaš sajt treba da radi, a verovatno ne radi')}
              lead={t(
                'Most small-business websites look fine and still lose enquiries in places the owner never sees. Here is a typical site next to the one we build.',
                'Većina sajtova malih firmi izgleda u redu, a ipak gubi upite na mestima koja vlasnik ne vidi. Ovako izgleda tipičan sajt pored sajta koji mi pravimo.',
              )}
            />
          </Reveal>
          <Reveal className="mt-10 max-md:mt-5">
            <SiteAnatomy />
          </Reveal>
        </div>
      </section>

      {/* Promises */}
      <section className="bg-promises edge-glow relative overflow-hidden py-24 text-white max-md:py-8 sm:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_30%_40%,#000,transparent)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 max-md:gap-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <Reveal className="max-md:text-center lg:sticky lg:top-28 lg:self-start">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-accent uppercase ring-1 ring-white/12">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {t('How we work', 'Kako radimo')}
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance md:text-[2.75rem] md:leading-[1.08]">
              {t('We only win when', 'Uspeh merimo')} <span className="text-gradient">{t('your phone rings', 'pozivima koje dobijete')}</span>
            </h2>
            <p className="mt-4 text-lg text-pretty text-white/70 max-md:hidden">
              {t(
                'Most agencies get paid for activity. We judge our work by one number, the enquiries you can count, and these three rules are in every agreement.',
                'Većina agencija naplaćuje uloženo vreme. Mi svoj rad merimo jednim brojem, upitima koje možete da prebrojite, a ova tri pravila su deo svakog ugovora.',
              )}
            </p>
            <div className="ring-gradient mt-8 flex items-center gap-5 rounded-3xl bg-white/[0.03] p-5 max-md:hidden sm:p-6">
              <RingingPhone />
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-white/45 uppercase">{t('What we answer to', 'Za šta odgovaramo')}</p>
                <p className="mt-1 font-display text-xl sm:text-2xl">{t('Calls and enquiries, counted', 'Pozivi i upiti, prebrojani')}</p>
                <p className="mt-1 text-sm text-white/60">{t('Not clicks, impressions or rankings on their own.', 'Ne klikovi, prikazi ni pozicije sami po sebi.')}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 max-md:hidden">
              <Link
                href={lp('/#hero-form')}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:-translate-y-0.5 hover:bg-accent-dark"
              >
                {t('Get a free website audit', 'Zatražite besplatnu analizu')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link href={lp('/work')} className="rounded-full px-4 py-3 text-sm font-semibold text-white/75 transition hover:text-white">
                {t('See the case studies', 'Pogledajte studije slučaja')}
              </Link>
            </div>
          </Reveal>

          <ol className="space-y-4 max-md:space-y-2.5">
            {promises(t).map((p, i) => (
              <Reveal key={p.title} as="li" delay={i * 110}>
                <div className="ring-gradient group grid items-center gap-6 rounded-3xl bg-white/[0.03] p-6 transition duration-300 hover:bg-white/[0.05] max-md:p-4 sm:grid-cols-[1fr_13.5rem] sm:p-7">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/25 transition group-hover:bg-accent/15">
                        <p.icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.14em] text-white/45 uppercase">
                        {t('Rule', 'Pravilo')} {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl max-md:mt-3 max-md:text-xl">{p.title}</h3>
                    <p className="mt-2 leading-relaxed text-white/65 max-md:text-[15px] max-md:leading-snug">{p.text}</p>
                  </div>
                  <div className="rounded-2xl bg-ink-975/70 p-3.5 ring-1 ring-white/[0.08] max-md:hidden">
                    <p.visual />
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Report */}
      <section id="report" className="bg-report relative scroll-mt-16 overflow-hidden py-24 max-md:py-8 sm:py-32">
        <div className="grid-lines-light pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_75%_45%,#000,transparent)]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="max-md:text-center">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-azure-700 uppercase shadow-soft ring-1 ring-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-azure-600" aria-hidden />
                {t('Tracking and monthly report', 'Praćenje i mesečni izveštaj')}
              </p>
              <h2 className="mt-4 font-display text-3xl text-balance text-ink-950 md:text-[2.75rem] md:leading-[1.08]">
                {t('Without numbers you are guessing, and that is how budgets disappear', 'Bez brojki samo nagađate, a tako se troši novac')}
              </h2>
              <p className="mt-4 text-lg text-pretty text-zinc-600 max-md:hidden">
                {t(
                  'Every site we build or manage comes with our own enquiry tracking: every enquiry, every call and every dollar, in one report written in plain language.',
                  'Uz svaki sajt koji pravimo ili vodimo ide i naše praćenje upita: svaki upit, svaki poziv i svaki uloženi dinar, u jednom razumljivom izveštaju.',
                )}
              </p>
            </Reveal>
            <ul className="mt-9 grid gap-x-8 gap-y-6 max-md:mt-5 max-md:gap-y-4 max-md:text-left sm:grid-cols-2">
              {reportPoints(t).map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 80} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-accent">
                    <p.icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-[17px] text-ink-950">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600 max-md:hidden">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={200} className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 max-md:mt-6 max-md:justify-center">
              <Link
                href="/demo/report"
                className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-ink-800"
              >
                {t('Open the live demo report', 'Otvorite primer izveštaja')}
                <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
              <span className="text-sm text-zinc-500 max-md:hidden">{t('Sample data, every button works.', 'Primer podaci, sve radi.')}</span>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={150} className="relative max-md:hidden">
            <div className="pointer-events-none absolute -inset-4 rounded-full bg-[radial-gradient(closest-side,rgb(1_175_233/0.22),transparent)] blur-2xl sm:-inset-10" aria-hidden />
            <Link
              href="/demo/report"
              aria-label={t('Open the demo report', 'Otvorite primer izveštaja')}
              className="group relative block overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(10_14_30/0.05),0_24px_48px_-24px_rgb(10_14_30/0.28)] ring-1 ring-zinc-200/80"
            >
              <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3.5 py-2" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                <span className="ml-2 flex items-center gap-1 rounded-md bg-white px-2.5 py-0.5 text-[10px] text-zinc-500 ring-1 ring-zinc-200">
                  <ShieldCheck className="h-3 w-3 text-azure-600" />
                  webtano.com/demo/report
                </span>
              </div>
              <div className="relative aspect-[5/5.2] overflow-hidden">
                <Image
                  src="/work/report-example.webp"
                  alt={t(
                    'The demo monthly report: visitors, enquiries, calls, cost per enquiry and a daily chart, with sample data.',
                    'Primer mesečnog izveštaja: posete, upiti, pozivi, cena po upitu i dnevni grafikon, sa primer podacima.',
                  )}
                  width={1586}
                  height={2226}
                  sizes="(min-width: 1024px) 34rem, 92vw"
                  className="h-auto w-full transition duration-[1.4s] ease-out group-hover:-translate-y-[6%]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" aria-hidden />
                <span className="absolute inset-x-0 bottom-5 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-950 px-4 py-2 text-xs font-semibold text-white opacity-0 shadow-lift transition duration-300 group-hover:opacity-100">
                    {t('Try it yourself', 'Isprobajte')}
                    <ArrowUpRight className="h-3.5 w-3.5 text-accent" aria-hidden />
                  </span>
                </span>
              </div>
            </Link>

            <div className="absolute top-14 -left-3 hidden w-60 rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-zinc-200/80 sm:block lg:-left-10">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-azure-700 text-accent">
                  <BellRing className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-ink-950">{t('New enquiry: Request a quote', 'Nov upit: zahtev za ponudu')}</p>
                  <p className="text-[11px] text-zinc-500">{t('From Google Ads · just now', 'Iz Google oglasa · upravo')}</p>
                </div>
                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" aria-hidden />
              </div>
            </div>
            <div className="absolute -right-3 bottom-16 hidden rounded-2xl bg-ink-950 px-4 py-3 text-white shadow-soft sm:block lg:-right-8">
              <p className="font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">{t('Cost per contact', 'Cena po kontaktu')}</p>
              <p className="mt-0.5 font-display text-2xl text-accent">{t('$12.50', '$12,50')}</p>
              <p className="text-[11px] text-white/60">{t('Return on ad spend 5.3×', 'Povraćaj ulaganja 5,3×')}</p>
            </div>
            <span className="absolute -bottom-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink-950 shadow-glow">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              {t('Included with every site', 'Uz svaki sajt')}
            </span>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-process edge-glow relative scroll-mt-16 overflow-hidden py-24 text-white max-md:py-8 sm:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              light
              eyebrow={t('How it works', 'Kako izgleda saradnja')}
              title={t('Four steps from a site that loses customers to one that wins them', 'Četiri koraka do sajta koji donosi kupce')}
              lead={t('No long meetings and no surprises. You always know what happens next.', 'Bez dugih sastanaka i bez iznenađenja. Uvek znate šta sledi.')}
            />
          </Reveal>

          <Reveal as="ol" className="relative mt-16 grid gap-5 max-md:mt-5 max-md:gap-2.5 lg:grid-cols-4 lg:gap-6">
            {/* The progress line fills from step one to step four as the section comes into view. */}
            <span className="pointer-events-none absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-white/10 lg:block" aria-hidden>
              <span className="proc-fill-x absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-accent to-azure-600" />
            </span>
            <span className="pointer-events-none absolute top-6 bottom-6 left-6 w-px bg-white/10 lg:hidden" aria-hidden>
              <span className="proc-fill-y absolute inset-x-0 top-0 bg-gradient-to-b from-accent to-azure-600" />
            </span>
            {steps(t).map((s, i) => (
              <li key={s.title} className="relative flex flex-col pl-16 max-md:pl-14 lg:pl-0" style={{ '--step': i } as React.CSSProperties}>
                <span className="proc-node absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-full bg-ink-975 font-mono text-sm font-medium lg:relative lg:mx-auto">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="proc-card group flex-1 rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 transition duration-300 hover:bg-white/[0.06] max-md:p-4 lg:mt-6">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-accent uppercase ring-1 ring-accent/20">
                    {s.when}
                  </p>
                  <h3 className="mt-4 font-display text-xl max-md:mt-2.5 max-md:text-lg">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65 max-md:mt-1 max-md:leading-snug">{s.text}</p>
                  <div className="mt-5 border-t border-white/10 pt-4 max-md:hidden">
                    <p className="font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">{t('You get', 'Dobijate')}</p>
                    <p className="mt-1.5 flex gap-2 text-sm text-white/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      {s.get}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </Reveal>

          <Reveal delay={150} className="max-md:hidden">
            <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-full bg-white/[0.04] p-2 pl-6 ring-1 ring-white/10 sm:flex-row max-sm:rounded-3xl max-sm:p-5 max-sm:text-center">
              <p className="text-sm text-white/75">
                <span className="font-semibold text-white">{t('Step one is free', 'Prvi korak je besplatan')}</span>{' '}
                {t('and you are under no obligation after it.', 'i posle njega ništa ne morate.')}
              </p>
              <Link
                href={lp('/#hero-form')}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold whitespace-nowrap text-ink-950 shadow-glow transition hover:bg-accent-dark"
              >
                {t('Start with the free audit', 'Počnite besplatnom analizom')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-faq relative scroll-mt-16 overflow-hidden py-24 max-md:py-8 sm:py-32">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_50%_60%_at_15%_40%,#000,transparent)]" aria-hidden />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            }).replace(/</g, '\\u003c'),
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 max-md:gap-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="max-md:text-center lg:sticky lg:top-28 lg:self-start">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-azure-700 uppercase shadow-soft ring-1 ring-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-azure-600" aria-hidden />
              {t('Questions', 'Pitanja')}
            </p>
            <h2 className="mt-4 font-display text-3xl text-balance text-ink-950 md:text-[2.75rem] md:leading-[1.08]">{t('Before you ask', 'Najčešća pitanja')}</h2>
            <p className="mt-4 text-lg text-pretty text-zinc-600 max-md:hidden">
              {t('What business owners ask us most, answered straight. No fine print.', 'Ono što nas vlasnici firmi najčešće pitaju, sa direktnim odgovorima. Bez sitnih slova.')}
            </p>

            <div className="mt-8 overflow-hidden rounded-3xl bg-ink-975 text-white ring-1 ring-ink-900 max-md:hidden">
              <div className="relative p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_100%_0%,rgb(1_175_233/0.16),transparent_60%)]" aria-hidden />
                <p className="relative flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-accent uppercase">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden />
                  {t('Reply within one business day', 'Odgovor za jedan radni dan')}
                </p>
                <p className="relative mt-3 font-display text-2xl">{t('Still have a question?', 'Imate još neko pitanje?')}</p>
                <p className="relative mt-2 text-sm leading-relaxed text-white/65">
                  {t(
                    'Ask it in the free audit form. A real person who has looked at your site writes back.',
                    'Napišite ga u formi za besplatnu analizu. Odgovara vam osoba koja je zaista pogledala vaš sajt.',
                  )}
                </p>
                <Link
                  href="#hero-form"
                  className="group relative mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-accent-dark"
                >
                  {t('Ask in the free audit', 'Pitajte nas')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
              <ul className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 text-center">
                {[
                  ['1', t('fixed price', 'fiksna cena')],
                  ['0', t('lock-in', 'vezivanja')],
                  ['1', t('client per industry and area', 'klijent po delatnosti u gradu')],
                ].map(([v, k]) => (
                  <li key={k} className="px-2 py-4">
                    <p className="font-display text-2xl text-accent">{v}</p>
                    <p className="font-mono text-[9px] tracking-wide text-white/50 uppercase">{k}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="rounded-3xl bg-white px-5 shadow-[0_1px_2px_rgb(10_14_30/0.04),0_8px_24px_-12px_rgb(10_14_30/0.10)] ring-1 ring-zinc-200/80 max-md:px-4 sm:px-8">
            <FaqList items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* Final CTA: the dark band runs straight into the footer. */}
      <section className="bg-final relative overflow-hidden bg-ink-975 text-white">
        <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_30%,#000,transparent)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" aria-hidden />
        <div className="final-orb pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 max-md:py-10 max-md:text-center sm:px-6 sm:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-accent uppercase ring-1 ring-white/12">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden />
              {t('Taking new clients, one per industry in each area', 'Primamo nove klijente, jednog po delatnosti u gradu')}
            </p>
            <h2 className="mt-5 font-display text-4xl text-balance max-md:text-3xl md:text-[3.5rem] md:leading-[1.02]">
              {t('The business that shows up first gets the customer. Let’s make that', 'Kupca dobija firma koja se prva pojavi. Neka to budete')}{' '}
              <span className="text-gradient">{t('you', 'vi')}</span>.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-white/70 max-md:mx-auto max-md:mt-3 max-md:text-base">
              {t(
                'The check is free. Worst case, you learn exactly what is losing you customers and what to fix first.',
                'Analiza je besplatna. U najgorem slučaju saznaćete šta vam tačno odnosi kupce i šta prvo treba popraviti.',
              )}
            </p>
            <div className="mt-9 flex flex-col gap-3 max-md:mt-6 sm:flex-row">
              <Link href="#hero-form" className={primaryButton}>
                {t('Get my free website audit', 'Zatražite besplatnu analizu')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href={lp('/work')}
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 max-md:hidden"
              >
                {t('See our work', 'Pogledajte naše radove')}
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60 max-md:mt-5 max-md:justify-center">
              {[t('No obligation', 'Bez obaveze'), t('One fixed price', 'Fiksna cena'), t('You own everything', 'Sve je vaše')].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="scale" delay={120} className="max-md:hidden">
            <div className="ring-gradient rounded-3xl bg-white/[0.04] p-6 backdrop-blur sm:p-7">
              <p className="font-mono text-[10px] tracking-[0.14em] text-white/45 uppercase">
                {t('What happens after you send the form', 'Šta sledi kad pošaljete formu')}
              </p>
              <ol className="mt-5 space-y-5">
                {[
                  [t('Today', 'Danas'), t('You send the form', 'Pošaljete formu'), t('Name, email and your website. It takes a minute.', 'Ime, email i adresa sajta. Traje minut.')],
                  [
                    t('Within 1 business day', 'Za jedan radni dan'),
                    t('We review your site', 'Pregledamo vaš sajt'),
                    t('Speed, search visibility and your top competitors, checked by a person.', 'Brzinu, vidljivost na Google-u i najjaču konkurenciju proverava čovek, a ne program.'),
                  ],
                  [
                    t('Then', 'Zatim'),
                    t('You get a clear answer', 'Dobijate jasan odgovor'),
                    t(
                      'What holds you back, what to fix first, and one fixed price if you want our help.',
                      'Šta vas koči, šta prvo da popravite i fiksnu cenu ako želite našu pomoć.',
                    ),
                  ],
                ].map(([when, title, text], i) => (
                  <li key={title} className="relative flex gap-4">
                    {i < 2 && <span className="absolute top-9 bottom-[-1.25rem] left-[0.9rem] w-px bg-white/10" aria-hidden />}
                    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-semibold text-ink-950">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-mono text-[10px] tracking-wide text-accent/80 uppercase">{when}</p>
                      <p className="mt-0.5 font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3.5 ring-1 ring-white/10">
                <span className="flex gap-0.5 text-amber-400" aria-hidden>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <Star key={k} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </span>
                <p className="text-xs text-white/65">
                  {t('Our clients on Google:', 'Naši klijenti na Google-u:')} <span className="font-semibold text-white">Tree Jaws {t('4.9', '4,9')}</span>{' '}
                  {t('from 427 reviews,', 'iz 427 recenzija,')} <span className="font-semibold text-white">Mahalo {t('5.0', '5,0')}</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
