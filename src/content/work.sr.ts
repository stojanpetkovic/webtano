import type { CaseStudy } from './work';

/** The Serbian text of each case study; figures, links and photos come from work.ts. */
export type CaseStudyText = Pick<
  CaseStudy,
  'sector' | 'location' | 'summary' | 'headline' | 'stats' | 'services' | 'challenge' | 'work' | 'outcome' | 'source'
> & { shotAlts: string[] };

export const caseStudiesSr: Record<string, CaseStudyText> = {
  'tree-jaws': {
    sector: 'Seča i nega drveća',
    location: 'Južna Florida',
    summary: 'Potpuno nov sajt, lokalni SEO i Google Ads nalog, sve mereno na jednom mestu.',
    headline: { value: '1.010', label: 'praćenih upita iz Google Ads-a, od toga 732 telefonska poziva' },
    stats: [
      { value: '7,9%', label: 'posetilaca postalo je upit u poslednjih 30 dana' },
      { value: '74', label: 'upita za 30 dana: 47 poziva i 27 formi' },
      { value: '4,9★', label: 'iz 427 Google recenzija' },
    ],
    services: ['Sajt', 'Lokalni SEO', 'Google Ads', 'Praćenje upita'],
    challenge: [
      'Tree Jaws uklanja, orezuje i vadi panjeve za kuće i firme širom Južne Floride. U ovom poslu vlasnik kuće sa drvetom koje je oštetila oluja ne upoređuje ponude: zove prvu firmu koja deluje ozbiljno i javi se na telefon.',
      'Stari WordPress sajt bio je spor na telefonima i siromašan sadržajem, pa je gubio posetioce koje su oglasi već platili.',
    ],
    work: [
      { title: 'Nov sajt, pravljen za brzinu', text: 'Sajt je prebačen sa WordPress-a na statične stranice koje se otvaraju odmah, čak i na slaboj 4G vezi.' },
      { title: 'Lokalna pretraga, stranicu po stranicu', text: '176 stranica, od toga 108 lokalnih vodiča, napisanih onako kako vlasnici kuća na Južnoj Floridi zaista pretražuju.' },
      { title: 'Google Ads koji izveštava', text: 'Svaki poziv i forma vezani su za oglas ili pretragu koja je dovela posetioca, pa budžet ide tamo gde nastaju poslovi.' },
    ],
    outcome: [
      'Od početka praćenja Google Ads nalog je doneo 1.010 konverzija, od toga 732 telefonska poziva. U poslednjih 30 dana 891 posetilac pretvorio se u 74 upita.',
      'Vlasnik vidi svaki upit u sekundi kad stigne i dobija jedan mesečni izveštaj jasnim jezikom.',
    ],
    source: 'WebTano praćenje upita i klijentov Google Ads nalog; ocena sa Google-a.',
    shotAlts: [
      'Početna strana Tree Jaws, sa fotografijom sa terena, ocenom i dugmetom za poziv na vrhu.',
      'Sekcija sa recenzijama i ocenom 4,9 iz 427 Google recenzija.',
      'Tree Jaws blog sa vodičima za negu drveća na Južnoj Floridi.',
    ],
  },
  'mahalo-tree-service': {
    sector: 'Seča i nega drveća',
    location: 'Južna Florida',
    summary: 'Sa WordPress-a na brze statične stranice, sa rastom samo iz pretrage.',
    headline: { value: '100', label: 'Lighthouse SEO ocena, sa $0 potrošenih na oglase' },
    stats: [
      { value: '18', label: 'stranica za oblasti koje pokrivaju' },
      { value: '24', label: 'blog teksta pisana za lokalnu pretragu' },
      { value: '5,0★', label: 'ocena na Google-u' },
    ],
    services: ['Sajt', 'Lokalni SEO', 'Sadržaj'],
    challenge: [
      'Mahalo je porodična firma za drveće sa ISA sertifikovanim arboristima i savršenom ocenom na Google-u. Njihov WordPress sajt bio je gomila plugin-ova sa tankim, dupliranim stranicama.',
      'Nije bilo oglasne kampanje za vođenje. Sajt je jednostavno morao da prestane da koči posao.',
    ],
    work: [
      { title: 'Statične stranice umesto plugin-ova', text: 'Lagan nov sajt, bez ičega što treba ažurirati, krpiti ili što može da se pokvari.' },
      { title: 'Stranica za svaku oblast', text: '18 stranica za oblasti i blog od 24 teksta daju Google-u pravi sadržaj za rangiranje.' },
      { title: 'Trenutna obaveštenja o upitima', text: 'Svaki upit stiže vlasniku u inbox u sekundi kad je poslat, bez portala koji treba proveravati.' },
    ],
    outcome: ['Sajt ima ocenu 100 za SEO i Best Practices u Lighthouse-u i raste iz pretrage bez plaćenih oglasa.'],
    source: 'Lighthouse na živom sajtu, broj stranica sa sajta; ocena sa Google-a.',
    shotAlts: [
      'Početna strana Mahalo Tree Service: brzo, efikasno i povoljno uklanjanje drveća, preko fotografije sa terena.',
      'Sekcija usluga sa uklanjanjem i orezivanjem drveća i oznakom ISA sertifikovanog arborista.',
      'Mahalo blog sa lokalnim vodičima za negu drveća.',
    ],
  },
  'care-trans': {
    sector: 'Sanitetski prevoz',
    location: 'Beograd, Srbija',
    summary: 'Firma za prevoz pacijenata 24/7 koja se sada rangira za svaku uslugu koju nudi.',
    headline: { value: '11,2%', label: 'posetilaca pozvalo je u poslednjih 30 dana' },
    stats: [
      { value: '26', label: 'praćenih telefonskih poziva za 30 dana' },
      { value: '33', label: 'stranice, po jedna za svaku uslugu i rutu' },
      { value: '95', label: 'Lighthouse brzina na telefonu' },
    ],
    services: ['Sajt', 'Lokalni SEO', 'Praćenje poziva'],
    challenge: [
      'Care Trans prevozi nepokretne i slabije pokretne pacijente širom Srbije i kući iz Nemačke, Austrije, Švajcarske i Italije, danonoćno.',
      'Stari sajt imao je par običnih stranica i sporo se učitavao na telefonima koje ljudi zgrabe u hitnoj situaciji. Porodice zovu prvu firmu čiji se sajt otvori i odgovori na njihovo pitanje.',
    ],
    work: [
      { title: 'Stranica za svaku uslugu', text: '33 statične stranice i 17 tekstova, svaki odgovara na jednu potrebu: premeštaj između bolnica, odlazak u banju, repatrijacija.' },
      { title: 'Jedan dodir do poziva', text: 'Broj telefona je na svakom ekranu, a svaki dodir na njega broji se kao upit.' },
      { title: 'Praćenje uz partnerovo', text: 'Praćenje poziva radi uz alate marketinškog partnera, bez usporavanja sajta.' },
    ],
    outcome: ['U poslednjih 30 dana 111 posetilaca donelo je 26 poziva, stopa konverzije 11,2%.'],
    source: 'WebTano praćenje upita, poslednjih 30 dana; Lighthouse na živom sajtu.',
    shotAlts: [
      'Početna strana Care Trans sa dostupnošću 24/7 i dugmetom za poziv.',
      'Care Trans stranica za jednu vrstu prevoza pacijenata.',
      'Kontakt stranica sa brojem telefona koji se poziva jednim dodirom.',
    ],
  },
  'eric-dental-centar': {
    sector: 'Stomatološka ordinacija',
    location: 'Pančevo, Srbija',
    summary: 'Od teme pune demo sadržaja do puta do zakazivanja na tri jezika.',
    headline: { value: '100', label: 'Lighthouse pristupačnost, best practices i SEO' },
    stats: [
      { value: '60', label: 'stranica na srpskom, engleskom i nemačkom' },
      { value: '9', label: 'zahteva za termin i poziva za 30 dana' },
      { value: '< 1 min', label: 'od pretrage do zahteva za termin' },
    ],
    services: ['Sajt', 'Lokalni SEO', 'Prevod', 'Praćenje upita'],
    challenge: [
      'WordPress tema ordinacije i dalje je imala demo doktore i prazne sekcije, a ništa nije vodilo posetioca od pretrage do zakazanog termina.',
    ],
    work: [
      { title: 'Jasan put do zakazivanja', text: 'Forma za zakazivanje je na prvom ekranu, a usluga i termin biraju se jednim dodirom.' },
      { title: 'Tri jezika', text: 'Srpska, engleska i nemačka verzija za pacijente iz Beograda i iz inostranstva.' },
      { title: 'Svaki zahtev se broji', text: 'Forme i pozivi se prate, pa ordinacija zna koje stranice dovode pacijente.' },
    ],
    outcome: ['Sajt ima ocenu 96 za brzinu i 100 za pristupačnost, best practices i SEO, sa fotografijama u punoj veličini.'],
    source: 'WebTano praćenje upita, poslednjih 30 dana; Lighthouse na živom sajtu.',
    shotAlts: [
      'Nova početna strana Erić Dental Centra sa fotografijom stomatologa, ocenom 5,0 i dugmetom za zakazivanje.',
      'Stari sajt: tamna fotografija preko celog ekrana i nikakav način za zakazivanje.',
      'Stranica za zakazivanje sa formom na prvom ekranu.',
    ],
  },
};
