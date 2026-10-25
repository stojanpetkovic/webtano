import type { AddOn, Plan } from './pricing';

// The Serbian text of the pricing page. Prices and ids stay in pricing.ts and the admin price list.

export const plansSr: Record<string, Pick<Plan, 'name' | 'tagline' | 'bestFor' | 'features' | 'note'>> = {
  'local-seo': {
    name: 'Lokalni SEO',
    tagline: 'Budite na mapi i u AI odgovorima u mestima koja pokrivate.',
    bestFor: 'Firme sa dobrim sajtom koje žele više poziva bez plaćanja po kliku.',
    features: [
      'Vođenje Google Business profila',
      'Dve nove stranice za usluge ili mesta mesečno',
      'Tehnički SEO i ubrzanje',
      'Traženje recenzija i odgovori na njih',
      'Citati i lokalna pominjanja',
      'Praćenje poziva i formi',
      'Mesečni izveštaj i razgovor',
    ],
  },
  growth: {
    name: 'Rast',
    tagline: 'Lokalni SEO i Google Ads zajedno, mereni u jednom izveštaju.',
    bestFor: 'Firme koje žele da telefon zvoni odmah i više besplatnih upita svakog meseca.',
    features: [
      'Sve iz paketa Lokalni SEO',
      'Sve iz paketa Google Ads',
      'Vođenje Local Services Ads oglasa',
      'Odredišne stranice pravljene za vaše oglase',
      'Cena po upitu po kanalu',
      'Prioritetna podrška, odgovor u roku od jednog radnog dana',
    ],
    note: 'Budžet za oglase plaća se direktno Google-u.',
  },
  'google-ads': {
    name: 'Google Ads',
    tagline: 'Plaćena pretraga koja se meri zakazanim poslovima, ne klikovima.',
    bestFor: 'Firme kojima trebaju pozivi brzo ili imaju sezonu koju treba popuniti.',
    features: [
      'Postavka naloga ili kompletna revizija',
      'Ključne reči, negativne reči i oglasi po usluzi',
      'Ponude i budžeti pregledani dva puta mesečno',
      'Praćenje poziva i konverzija',
      'Plan budžeta za sezonu oluja',
      'Mesečni izveštaj i razgovor',
    ],
    note: 'Budžet za oglase plaća se direktno Google-u. Preporučujemo najmanje $1.500 mesečno.',
  },
  'starter-site': {
    name: 'Osnovni sajt',
    tagline: 'Brz, profesionalan sajt koji posetioce pretvara u pozive.',
    bestFor: 'Nove firme, ili sajt koji je spor i zastareo.',
    features: [
      'Do 8 stranica',
      'Stranica za svaku glavnu uslugu',
      'Pisanje tekstova uključeno',
      'Pravljen prvo za telefon, učitava se za oko sekundu',
      'Praćenje poziva i formi',
      'Postavka Google Business profila',
      'Gotov za 2 do 3 nedelje',
    ],
  },
  'growth-site': {
    name: 'Sajt za rast',
    tagline: 'Napravljen da se rangira u svakom mestu koje pokrivate.',
    bestFor: 'Ustaljene firme koje žele da rastu u celom regionu.',
    features: [
      'Do 25 stranica',
      'Stranice za usluge i lokacije',
      'Blog sa 4 teksta za početak',
      'Strukturirani podaci za usluge i pitanja',
      'Preusmerenja sa starog sajta',
      'Praćenje poziva i formi',
      'Gotov za 4 do 6 nedelja',
    ],
  },
  'authority-site': {
    name: 'Autoritet sajt',
    tagline: 'Veliki sajt koji drži lokalne rezultate pretrage.',
    bestFor: 'Lideri na tržištu koji žele da drže rezultate u svojoj oblasti.',
    features: [
      '50 stranica ili više',
      'Lokalni vodiči za svaku oblast koju pokrivate',
      'Dizajn po meri i smernice za fotografije',
      'Plan sadržaja za prvu godinu',
      'Praćenje poziva i formi',
      'Cena se dogovara posle besplatne provere',
    ],
    note: 'Kao sajt od 176 stranica koji smo napravili za Tree Jaws.',
  },
};

export const addOnsSr: Record<string, Pick<AddOn, 'name' | 'text'>> = {
  hosting: { name: 'Hosting i održavanje', text: 'Hosting na vaše ime, ažuriranja, rezervne kopije, nadzor dostupnosti i sitne izmene.' },
  'local-services-ads': {
    name: 'Local Services Ads',
    text: 'Postavka i vođenje Google oglasa koji se plaćaju po upitu, uz osporavanje loših upita umesto vas.',
  },
  'extra-article': { name: 'Dodatni tekstovi', text: 'Istraženi blog tekstovi pisani za vaše tržište, sa slikama i pitanjima.' },
  'extra-page': { name: 'Dodatne stranice', text: 'Dodatne stranice za usluge ili lokacije, napisane i dizajnirane u skladu sa sajtom.' },
};

export const includedSr = [
  { title: 'Jedan klijent po tržištu', text: 'Radimo sa jednom firmom po delatnosti u svakoj oblasti, nikad sa vašim konkurentom.' },
  { title: 'Sve je vaše', text: 'Domen, kod, hosting i oglasni nalozi su na vaše ime od prvog dana.' },
  { title: 'Bez dugih ugovora', text: 'Mesečni paketi traju iz meseca u mesec. Otkaz uz 30 dana najave.' },
  { title: 'Svaki upit se prati', text: 'Pozivi i forme vezani za izvor, u izveštaju koji pročitate za dva minuta.' },
];

export const comparisonSr: { label: string; values: [boolean | string, boolean | string, boolean | string] }[] = [
  { label: 'Vođenje Google Business profila', values: [true, true, false] },
  { label: 'Nove stranice za usluge ili mesta', values: ['2 mesečno', '2 mesečno', false] },
  { label: 'Tehnički SEO i brzina', values: [true, true, false] },
  { label: 'Recenzije: traženje i odgovori', values: [true, true, false] },
  { label: 'Vođenje Google Ads-a', values: [false, true, true] },
  { label: 'Local Services Ads', values: ['Dodatak', true, 'Dodatak'] },
  { label: 'Odredišne stranice za oglase', values: [false, true, '1 za početak'] },
  { label: 'Praćenje poziva i formi', values: [true, true, true] },
  { label: 'Mesečni izveštaj i razgovor', values: [true, true, true] },
  { label: 'Vreme odgovora podrške', values: ['1 radni dan', 'Prioritet, 1 radni dan', '1 radni dan'] },
];

export const pricingFaqsSr = [
  {
    q: 'Da li je budžet za oglase uključen u cenu?',
    a: 'Nije. Budžet za oglase plaćate direktno Google-u sa svog naloga, pa uvek tačno vidite koliko je potrošeno. Naša naknada pokriva vođenje.',
  },
  {
    q: 'Da li postoji naknada za postavku ili dug ugovor?',
    a: 'Mesečni paketi nemaju naknadu za postavku ni dug ugovor. Traju iz meseca u mesec i možete ih otkazati uz 30 dana najave.',
  },
  {
    q: 'Da li mi treba nov sajt pre nego što počnemo SEO ili oglase?',
    a: 'Ne uvek. Besplatna provera pokazuje da li vaš sadašnji sajt može da pretvori posetioce u upite. Ako može, krećemo na njemu. Ako gubi pozive, kažemo vam šta prvo da popravite.',
  },
  {
    q: 'Mogu li sajt da platim u delovima?',
    a: 'Da. Sajt se plaća pola na početku, a pola pri puštanju u rad.',
  },
  {
    q: 'Šta se dešava ako otkažem?',
    a: 'Sve ostaje vama: sajt, domen, sadržaj, Google Business profil i oglasni nalog sa celom istorijom.',
  },
  {
    q: 'Zašto ne naplaćujete procenat od budžeta za oglase?',
    a: 'Procenat nagrađuje veću potrošnju, a ne više poslova. Fiksna naknada drži naše savete poštenim i kad je pravi odgovor da trošite manje.',
  },
];
