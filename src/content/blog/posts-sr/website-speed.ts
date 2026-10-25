import type { Post } from '../types';

export const post: Post = {
  slug: 'website-speed-core-web-vitals-local-business',
  title: 'Da li je vaš sajt prespor za kupce na telefonu? Jednostavan vodič kroz Core Web Vitals',
  seoTitle: 'Core Web Vitals za lokalne firme, jednostavno objašnjeno',
  description:
    'Core Web Vitals bez žargona: šta Google meri, zašto spor sajt lokalnu uslužnu firmu košta poziva, kako da svoj sajt proverite za dva minuta i šta ga obično ubrza.',
  category: 'Websites',
  keywords: ['Core Web Vitals', 'brzina sajta', 'PageSpeed Insights', 'sajt za telefon', 'LCP INP CLS', 'sajt za lokalnu firmu'],
  published: '2026-10-24',
  takeaways: [
    'Core Web Vitals su tri merenja: koliko brzo se pojavi glavni sadržaj, koliko brzo stranica reaguje i koliko „skače”.',
    'Zasnovana su na telefonima stvarnih posetilaca, koji su često sporiji od vašeg.',
    'Velike slike, teške teme i previše skripti uzrok su većine problema na sajtovima malih firmi.',
    'Brzina malo pomaže poziciji, a mnogo pomaže konverzijama.',
  ],
  body: [
    {
      p: 'Otvorite svoj sajt na telefonu i izgleda dobro. Verovatno i jeste dobro, na vašem telefonu, na vašem Wi-Fi-ju, sa stranicom već u kešu. Vaši kupci vide nešto drugo: prvu posetu, na telefonu srednje klase, preko mobilne mreže, napolju. Google meri ono što oni vide, a trebalo bi i vi.',
    },
    {
      p: 'Google ta merenja zove Core Web Vitals. Zvuče tehnički, ali svako odgovara na jednostavno pitanje koje bi posetilac postavio.',
    },
    { h2: 'Tri merenja jednostavnim rečima' },
    {
      table: {
        head: ['Merenje', 'Pitanje na koje odgovara', 'Dobar rezultat'],
        rows: [
          ['Largest Contentful Paint (LCP)', 'Koliko treba dok ne vidim glavni sadržaj?', '2,5 sekunde ili manje'],
          ['Interaction to Next Paint (INP)', 'Kad dodirnem nešto, da li odmah reaguje?', '200 milisekundi ili manje'],
          ['Cumulative Layout Shift (CLS)', 'Da li stranica skače dok pokušavam da dodirnem?', '0,1 ili manje'],
        ],
      },
    },
    {
      p: 'Google gleda ove vrednosti za stvarne posetioce tokom prethodnih 28 dana, a stranica prolazi kada bar tri četvrtine poseta dostigne „dobar” nivo. Zato sajt može vama da deluje brzo, a da ipak ne prođe.',
    },
    { h2: 'Zašto je brzina važna lokalnoj uslužnoj firmi' },
    {
      p: 'Core Web Vitals su jedan od mnogih signala u Google-ovim sistemima rangiranja. Neće slabu stranicu podići iznad mnogo bolje, ali između sličnih stranica bolje iskustvo može da pomogne. Veći uticaj je na ljude. Stranica koja se predugo učitava ili skače kada neko pokuša da dodirne „Pozovi” gubi posetioce koje ste već platili da dođu, bilo oglasima ili mesecima SEO rada.',
    },
    {
      p: 'Pomeranje rasporeda zaslužuje posebnu pažnju na sajtovima izvođača. Obaveštenje o kolačićima ili slika koja se kasno učita i gurne dugme za poziv nadole baš kad ga neko dodirne i nervira i skupo košta.',
    },
    { h2: 'Proverite sajt za dva minuta' },
    {
      ol: [
        'Idite na **PageSpeed Insights** (pagespeed.web.dev) i upišite početnu stranicu.',
        'Pogledajte gornji deo, „Discover what your real users are experiencing”. To su podaci stvarnih posetilaca, ako ih Google ima dovoljno.',
        'Prvo proverite karticu **Mobile**. Tu je većina vaših kupaca.',
        'Ponovite za najvažniju stranicu usluge, na primer uklanjanje drveća.',
      ],
    },
    {
      tip: 'Velika ocena brzine ispod podataka stvarnih korisnika dolazi iz jednog simuliranog testa. Korisna je za pronalaženje problema, ali Google koristi deo sa podacima stvarnih korisnika.',
      title: 'Koji broj se računa',
    },
    { h2: 'Šta obično usporava sajtove malih firmi' },
    { h3: 'Prevelike slike' },
    {
      p: 'Fotografija od 5 MB pravo iz fotoaparata, prikazana u širini telefona, najčešći je problem koji viđamo. Slike treba smanjiti na veličinu u kojoj se prikazuju i sačuvati u modernom formatu kao što su WebP ili AVIF. Samo prva slika na stranici treba da se učita odmah; ostale mogu da se učitavaju dok posetilac skroluje.',
    },
    { h3: 'Teške teme i graditelji stranica' },
    {
      p: 'Mnoge „sve u jednom” teme učitavaju kod za slajdere, animacije i funkcije koje sajt nikad ne koristi. Taj kod i dalje mora da se preuzme i izvrši pri svakoj poseti, što šteti i učitavanju i brzini reagovanja na dodir.',
    },
    { h3: 'Previše skripti trećih strana' },
    {
      p: 'Čet prozori, nekoliko alata za praćenje, bedževi recenzija, društvene mreže i iskačući prozori se sabiraju. Svaki može biti mali, ali zajedno mogu da blokiraju stranicu. Zadržite one koje koristite i možete da izmerite, a ostale uklonite.',
    },
    { h3: 'Spor hosting' },
    {
      p: 'Jeftin deljeni hosting može da učini server sporim da odgovori pre nego što se išta pojavi. Dobar hosting ili statičan sajt serviran preko mreže za isporuku sadržaja (CDN) to gotovo potpuno rešava.',
    },
    { h2: 'Šta radimo na sajtovima koje pravimo' },
    {
      p: 'Naši sajtovi su brze, uglavnom statične stranice sa optimizovanim slikama, vrlo malo JavaScript-a i što manje skripti trećih strana. Studije slučaja na ovom sajtu navode žive Lighthouse ocene svakog klijentskog sajta, na primer [Tree Jaws](/work/tree-jaws) i [Care Trans](/work/care-trans), pa ih možete sami proveriti.',
    },
    {
      p: 'Ako su vaši PageSpeed rezultati crveni ili narandžasti i niste sigurni šta prvo da popravite, [zatražite besplatnu proveru sajta](/#hero-form). Reći ćemo vam koji problemi vas zaista koštaju poziva.',
    },
  ],
  faq: [
    {
      q: 'Šta su Core Web Vitals?',
      a: 'To su tri merenja koja Google koristi da oceni iskustvo na stranici: Largest Contentful Paint (učitavanje), Interaction to Next Paint (brzina reagovanja) i Cumulative Layout Shift (vizuelna stabilnost).',
    },
    {
      q: 'Da li Core Web Vitals utiču na pozicije na Google-u?',
      a: 'Da, kao deo Google-ovih signala iskustva na stranici, ali relevantnost i kvalitet sadržaja važniji su. Veći efekat brzog sajta je više posetilaca koji ostanu i pozovu.',
    },
    {
      q: 'Koja je dobra PageSpeed ocena?',
      a: 'Lighthouse ocena brzine od 90 ili više smatra se dobrom. Važnije je da prođete Core Web Vitals u delu sa podacima stvarnih korisnika.',
    },
    {
      q: 'Kako da ubrzam sajt bez pravljenja novog?',
      a: 'Smanjite i kompresujte slike, uklonite nekorišćene plugin-ove i skripte i pređite na bolji hosting. Ovi koraci rešavaju većinu problema na sajtovima malih firmi.',
    },
  ],
  sources: [
    { label: 'Google Search Central: understanding Core Web Vitals and Google search results', url: 'https://developers.google.com/search/docs/appearance/core-web-vitals' },
    { label: 'web.dev: Web Vitals', url: 'https://web.dev/articles/vitals' },
  ],
};
