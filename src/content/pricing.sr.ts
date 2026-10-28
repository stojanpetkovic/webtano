import type { AddOn, Plan } from './pricing';

// The Serbian text of the pricing page. Prices and ids stay in pricing.ts and the admin price list.

export const plansSr: Record<string, Pick<Plan, 'name' | 'tagline' | 'bestFor' | 'features' | 'note'>> = {
  'local-seo': {
    name: 'Lokalni SEO',
    tagline: 'Budite vidljivi na Google mapama i u AI odgovorima, svuda gde vas kupci traže.',
    bestFor: 'Za firme sa dobrim sajtom koje žele više poziva bez plaćanja svakog klika.',
    features: [
      'Vođenje Google Business profila',
      'Dve nove stranice mesečno, za usluge ili lokacije',
      'Tehnička SEO optimizacija i ubrzanje sajta',
      'Više Google recenzija i odgovor na svaku',
      'Upis u lokalne kataloge i mape',
      'Praćenje poziva i upita',
      'Mesečni izveštaj i konsultacije',
    ],
  },
  growth: {
    name: 'Rast',
    tagline: 'SEO i Google oglašavanje zajedno, sa svim rezultatima u jednom izveštaju.',
    bestFor: 'Za firme kojima pozivi trebaju odmah, a žele i sve više upita iz besplatne pretrage.',
    features: [
      'Sve iz paketa Lokalni SEO',
      'Sve iz paketa Google oglašavanje',
      'Vođenje Local Services Ads kampanja',
      'Landing stranice napravljene da oglasi donose upite',
      'Cena po upitu za svaki kanal',
      'Prioritetna podrška, odgovor u roku od jednog radnog dana',
    ],
    note: 'Budžet za oglase plaća se direktno Google-u.',
  },
  'google-ads': {
    name: 'Google Ads',
    tagline: 'Google oglasi koje merimo po novim kupcima, a ne po klikovima.',
    bestFor: 'Za firme kojima pozivi trebaju brzo ili žele da popune sezonu.',
    features: [
      'Podešavanje naloga ili kompletna analiza postojećeg',
      'Ključne reči, isključujuće reči i oglasi za svaku uslugu',
      'Provera ponuda i budžeta dva puta mesečno',
      'Praćenje poziva i konverzija',
      'Plan budžeta po sezonama',
      'Mesečni izveštaj i konsultacije',
    ],
    note: 'Budžet za oglase plaća se direktno Google-u. Preporučujemo najmanje $1.500 mesečno.',
  },
  'starter-site': {
    name: 'Osnovni sajt',
    tagline: 'Brz, profesionalan sajt koji posetioce pretvara u pozive i upite.',
    bestFor: 'Za nove firme ili one čiji je sajt spor i zastareo.',
    features: [
      'Do 8 stranica',
      'Stranica za svaku glavnu uslugu',
      'Pisanje tekstova je uključeno',
      'Prilagođen telefonima, učitava se za oko sekundu',
      'Praćenje poziva i upita',
      'Podešavanje Google Business profila',
      'Gotov za 2 do 3 nedelje',
    ],
  },
  'growth-site': {
    name: 'Sajt za rast',
    tagline: 'Napravljen da bude visoko na Google-u u svakom mestu gde radite.',
    bestFor: 'Za firme sa iskustvom koje žele da se šire na ceo region.',
    features: [
      'Do 25 stranica',
      'Stranice za usluge i lokacije',
      'Blog sa 4 teksta na početku',
      'Strukturirani podaci (schema) za usluge i česta pitanja',
      'Preusmerenja sa starog sajta, bez gubitka pozicija',
      'Praćenje poziva i upita',
      'Gotov za 4 do 6 nedelja',
    ],
  },
  'authority-site': {
    name: 'Sajt za lidere',
    tagline: 'Veliki sajt koji zauzima vrh lokalne pretrage.',
    bestFor: 'Za lidere na tržištu koji žele da budu prvi izbor u svojoj oblasti.',
    features: [
      '50 stranica ili više',
      'Posebna stranica za svaku oblast u kojoj radite',
      'Unikatan dizajn i smernice za fotografisanje',
      'Plan sadržaja za prvu godinu',
      'Praćenje poziva i upita',
      'Cena po dogovoru, posle besplatne analize',
    ],
    note: 'Poput sajta od 176 stranica koji smo uradili za Tree Jaws.',
  },
};

export const addOnsSr: Record<string, Pick<AddOn, 'name' | 'text'>> = {
  hosting: { name: 'Hosting i održavanje', text: 'Hosting na vaše ime, ažuriranja, bekap, nadzor rada sajta i sitne izmene.' },
  'local-services-ads': {
    name: 'Local Services Ads',
    text: 'Podešavanje i vođenje Google oglasa koji se plaćaju po upitu, a loše upite osporavamo umesto vas.',
  },
  'extra-article': { name: 'Dodatni tekstovi', text: 'Blog tekstovi pisani za vaše tržište, sa slikama i odgovorima na česta pitanja.' },
  'extra-page': { name: 'Dodatne stranice', text: 'Dodatne stranice za usluge ili lokacije, uklopljene u dizajn sajta.' },
};

export const includedSr = [
  { title: 'Jedna firma po delatnosti', text: 'U svakom gradu radimo sa samo jednom firmom iz iste delatnosti, nikada sa vašom konkurencijom.' },
  { title: 'Sve je na vaše ime', text: 'Domen, kod, hosting i oglasni nalozi su na vaše ime od prvog dana.' },
  { title: 'Bez dugoročnih ugovora', text: 'Mesečne pakete otkazujete kad god želite, uz otkazni rok od 30 dana.' },
  { title: 'Svaki upit se prati', text: 'Za svaki poziv i upit znate odakle je došao, u izveštaju koji pročitate za dva minuta.' },
];

export const comparisonSr: { label: string; values: [boolean | string, boolean | string, boolean | string] }[] = [
  { label: 'Vođenje Google Business profila', values: [true, true, false] },
  { label: 'Nove stranice za usluge ili lokacije', values: ['2 mesečno', '2 mesečno', false] },
  { label: 'Tehnička SEO optimizacija i brzina', values: [true, true, false] },
  { label: 'Recenzije: prikupljanje i odgovori', values: [true, true, false] },
  { label: 'Vođenje Google oglasa', values: [false, true, true] },
  { label: 'Local Services Ads', values: ['Dodatak', true, 'Dodatak'] },
  { label: 'Landing stranice za oglase', values: [false, true, '1 za početak'] },
  { label: 'Praćenje poziva i upita', values: [true, true, true] },
  { label: 'Mesečni izveštaj i konsultacije', values: [true, true, true] },
  { label: 'Vreme odgovora podrške', values: ['1 radni dan', 'Prioritet, 1 radni dan', '1 radni dan'] },
];

export const pricingFaqsSr = [
  {
    q: 'Da li je budžet za oglase uključen u cenu?',
    a: 'Nije. Budžet za oglase plaćate direktno Google-u sa svog naloga, pa uvek tačno vidite koliko je potrošeno. Naša naknada pokriva samo vođenje kampanja.',
  },
  {
    q: 'Da li plaćam podešavanje i da li je ugovor dugoročan?',
    a: 'Ne. Mesečni paketi nemaju troškove podešavanja ni dugoročni ugovor. Otkazujete kad želite, uz otkazni rok od 30 dana.',
  },
  {
    q: 'Da li mi treba novi sajt pre SEO-a ili oglasa?',
    a: 'Ne uvek. Besplatna analiza pokazuje da li vaš sadašnji sajt dobro pretvara posetioce u upite. Ako da, radimo na njemu. Ako gubi pozive, reći ćemo vam šta prvo da popravite.',
  },
  {
    q: 'Mogu li sajt da platim u ratama?',
    a: 'Da. Pola plaćate na početku, a pola kada sajt bude objavljen.',
  },
  {
    q: 'Šta se dešava ako otkažem?',
    a: 'Sve ostaje vama: sajt, domen, sadržaj, Google Business profil i oglasni nalog sa celom istorijom.',
  },
  {
    q: 'Zašto ne naplaćujete procenat od budžeta za oglase?',
    a: 'Procenat nagrađuje veću potrošnju, a ne više kupaca za vas. Uz fiksnu naknadu možemo iskreno da vam kažemo i kada je bolje da trošite manje.',
  },
];
