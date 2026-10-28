import type { Metadata } from 'next';
import Link from 'next/link';
import { alternates, ogImage } from '@/lib/seo';
import { appSettings } from '@/lib/admin/settings';
import { getI18n } from '@/lib/i18n-site';
import { Bullets, LegalPage, Table, type LegalSection } from '@/components/site/Legal';

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t, lp } = await getI18n();
  return {
    title: t('Privacy notice', 'Obaveštenje o privatnosti'),
    description: t(
      'How WebTano handles personal data: what we collect and why, the legal bases, cookies and your choices, who processes data for us, how long we keep it, and your rights.',
      'Kako WebTano postupa sa podacima o ličnosti: šta prikupljamo i zašto, pravni osnovi, kolačići i vaš izbor, ko obrađuje podatke za nas, koliko ih čuvamo i koja su vaša prava.',
    ),
    alternates: alternates(lang, '/privacy'),
    openGraph: { url: lp('/privacy'), images: [ogImage(lang)] },
  };
}

const UPDATED = { en: '25 October 2026', sr: '25. oktobra 2026.' };

export default async function PrivacyPage() {
  const { lang, t, lp } = await getI18n();
  const { tracking, company } = await appSettings();
  const email = company.email.trim();
  const strong = (text: string) => <strong className="text-ink-950">{text}</strong>;
  const contact = email ? (
    <a href={`mailto:${email}`} className="font-medium text-ink-950 underline underline-offset-2">
      {email}
    </a>
  ) : (
    <Link href={lp('/#hero-form')} className="font-medium text-ink-950 underline underline-offset-2">
      {t('the contact form on this website', 'kontakt formu na ovom sajtu')}
    </Link>
  );
  const consentAsked = tracking.consent;
  const necessary = t('Necessary', 'Neophodno');

  // Third-party cookies are listed only while their tool is switched on in the admin.
  const cookieRows: React.ReactNode[][] = [
    ['wt_consent', 'WebTano', necessary, t('Remembers your cookie choice and when you made it', 'Pamti vaš izbor kolačića i kada ste ga napravili'), t('12 months (local storage)', '12 meseci (lokalno skladište)')],
    [
      'sp_lead_attribution',
      'WebTano',
      necessary,
      t('Links an enquiry you send to the page, referrer and campaign you arrived from', 'Povezuje upit koji pošaljete sa stranicom, izvorom i kampanjom sa koje ste došli'),
      t('30 days (local storage)', '30 dana (lokalno skladište)'),
    ],
    [
      'sp_visit, wt_lead_name',
      'WebTano',
      necessary,
      t('Counts a visit once per session and shows your first name on the thank-you page', 'Broji posetu jednom po sesiji i prikazuje vaše ime na stranici zahvalnosti'),
      t('Until the tab is closed (session storage)', 'Dok se kartica ne zatvori (skladište sesije)'),
    ],
    [
      'wt_newsletter',
      'WebTano',
      necessary,
      t('Remembers that you closed or used the newsletter popup, so it is not shown again', 'Pamti da ste zatvorili ili koristili prozor za newsletter, da se ne bi ponovo prikazivao'),
      t('30 days, or until you subscribe (local storage)', '30 dana, ili dok se ne prijavite (lokalno skladište)'),
    ],
    ['__cf_bm ' + t('and similar', 'i slični'), 'Cloudflare', necessary, t('Protects the site against bots and attacks', 'Štiti sajt od botova i napada'), t('Up to 30 minutes', 'Do 30 minuta')],
  ];
  if (tracking.ga4_id)
    cookieRows.push([
      '_ga, _ga_*',
      'Google',
      t('Analytics', 'Analitika'),
      t('Distinguishes visitors and sessions for Google Analytics 4', 'Razlikuje posetioce i sesije za Google Analytics 4'),
      t('Up to 2 years', 'Do 2 godine'),
    ]);
  if (tracking.google_ads_id)
    cookieRows.push([
      '_gcl_au, _gcl_aw',
      'Google',
      t('Advertising', 'Oglašavanje'),
      t('Connects an ad click with a later enquiry (conversion measurement)', 'Povezuje klik na oglas sa kasnijim upitom (merenje konverzija)'),
      t('Up to 90 days', 'Do 90 dana'),
    ]);
  if (tracking.meta_pixel_id)
    cookieRows.push([
      '_fbp, _fbc',
      'Meta',
      t('Advertising', 'Oglašavanje'),
      t('Measures which Facebook and Instagram ads bring enquiries', 'Meri koji Facebook i Instagram oglasi donose upite'),
      t('Up to 90 days', 'Do 90 dana'),
    ]);
  if (tracking.gtm_id)
    cookieRows.push([
      t('Set by tags it loads', 'Postavljaju ih tagovi koje učitava'),
      'Google Tag Manager',
      t('Analytics / Advertising', 'Analitika / Oglašavanje'),
      t('Loads the tags above; sets no cookie of its own', 'Učitava gore navedene tagove; ne postavlja sopstveni kolačić'),
      t('As listed above', 'Kao što je navedeno gore'),
    ]);

  const thirdParty = Boolean(tracking.ga4_id || tracking.google_ads_id || tracking.meta_pixel_id || tracking.gtm_id);

  const sections: LegalSection[] = [
    {
      id: 'who',
      title: t('Who is responsible', 'Ko je odgovoran'),
      body: (
        <>
          <p>
            {t(
              'WebTano (“WebTano”, “we”, “us”) operates webtano.com and is the controller of the personal data described in this notice. For any privacy question or request, contact us at',
              'WebTano („WebTano”, „mi”) upravlja sajtom webtano.com i rukovalac je podacima o ličnosti opisanim u ovom obaveštenju. Za svako pitanje ili zahtev u vezi sa privatnošću pišite nam na',
            )}{' '}
            {contact}.{' '}
            {t('We reply within one month at the latest, and usually much sooner.', 'Odgovaramo najkasnije u roku od mesec dana, a obično mnogo brže.')}
          </p>
          <p>
            {t(
              'This notice covers webtano.com. When we build or run a website for a client, the client is the controller of the data its visitors submit, and we act only as its processor (see section 6).',
              'Ovo obaveštenje se odnosi na webtano.com. Kada pravimo ili vodimo sajt za klijenta, klijent je rukovalac podacima koje šalju njegovi posetioci, a mi smo samo obrađivač (vidi odeljak 6).',
            )}
          </p>
        </>
      ),
    },
    {
      id: 'collect',
      title: t('What we collect', 'Šta prikupljamo'),
      body: (
        <>
          <p>
            {strong(t('What you give us.', 'Ono što nam date.'))}{' '}
            {t(
              'When you use the website check form or write to us: your name, email, phone number, website, business name, the answers you choose and your message. Do not send us sensitive data such as health or financial information; the form is not meant for it.',
              'Kada koristite formu za proveru sajta ili nam pišete: ime, email, broj telefona, sajt, naziv firme, odgovore koje izaberete i vašu poruku. Ne šaljite nam osetljive podatke, kao što su zdravstveni ili finansijski; forma nije namenjena za to.',
            )}
          </p>
          <p>
            {strong(t('What is recorded with an enquiry.', 'Šta se beleži uz upit.'))}{' '}
            {t(
              'The page you sent it from, the referring website and campaign tags (for example utm_source), your browser type, and a one-way hash of your IP address used only to stop spam. We do not store your IP address itself.',
              'Stranica sa koje ste ga poslali, sajt sa kog ste došli i oznake kampanje (na primer utm_source), vrsta pregledača i jednosmerni heš vaše IP adrese koji služi samo za zaustavljanje spama. Samu IP adresu ne čuvamo.',
            )}
          </p>
          <p>
            {strong(t('Visit statistics without cookies.', 'Statistika poseta bez kolačića.'))}{' '}
            {t(
              'We count page views and taps on contact links with our own tool. It stores the page path, device type, country and a visitor code that is a one-way hash which changes every day, so a visitor cannot be recognised from one day to the next. It sets no cookie and stores no IP address.',
              'Preglede stranica i dodire na kontakt linkove brojimo sopstvenim alatom. On čuva putanju stranice, vrstu uređaja, zemlju i kod posetioca, jednosmerni heš koji se menja svakog dana, pa se posetilac ne može prepoznati iz dana u dan. Ne postavlja kolačić i ne čuva IP adresu.',
            )}
          </p>
          {thirdParty && (
            <p>
              {strong(t('Cookies, only with your consent.', 'Kolačići, samo uz vašu saglasnost.'))}{' '}
              {t(
                'Analytics and advertising tools that set cookies and receive your IP address and device details. See section 7.',
                'Alati za analitiku i oglašavanje koji postavljaju kolačiće i primaju vašu IP adresu i podatke o uređaju. Vidi odeljak 7.',
              )}
            </p>
          )}
        </>
      ),
    },
    {
      id: 'why',
      title: t('Why we use it and on what legal basis', 'Zašto ih koristimo i na kom pravnom osnovu'),
      body: (
        <Table
          head={[t('Purpose', 'Svrha'), t('Legal basis (GDPR and Serbian law)', 'Pravni osnov (GDPR i zakon Srbije)')]}
          rows={[
            [
              t('Replying to your enquiry, preparing the free audit and a proposal', 'Odgovor na vaš upit, priprema besplatne analize i ponude'),
              t('Steps you asked for before a contract, Art. 6(1)(b)', 'Radnje koje ste tražili pre zaključenja ugovora, čl. 6(1)(b)'),
            ],
            [
              t('Sending the newsletter you subscribed to, and keeping proof of your consent', 'Slanje newslettera na koji ste se prijavili i čuvanje dokaza o saglasnosti'),
              t('Your consent, Art. 6(1)(a), which you can withdraw with the unsubscribe link', 'Vaša saglasnost, čl. 6(1)(a), koju možete opozvati linkom za odjavu'),
            ],
            [
              t('Following up on that enquiry by email or phone', 'Dalja komunikacija o tom upitu emailom ili telefonom'),
              t('Our legitimate interest in answering requests, Art. 6(1)(f)', 'Naš legitimni interes da odgovaramo na zahteve, čl. 6(1)(f)'),
            ],
            [
              t('Keeping the site secure, preventing spam and abuse, cookie-free statistics', 'Bezbednost sajta, sprečavanje spama i zloupotrebe, statistika bez kolačića'),
              t('Legitimate interest in a safe, working website, Art. 6(1)(f)', 'Legitimni interes za bezbedan sajt koji radi, čl. 6(1)(f)'),
            ],
            [
              t('Analytics and advertising cookies', 'Kolačići za analitiku i oglašavanje'),
              t('Your consent, Art. 6(1)(a), which you can withdraw at any time', 'Vaša saglasnost, čl. 6(1)(a), koju možete opozvati bilo kada'),
            ],
            [
              t('Keeping records for tax, accounting and legal claims', 'Čuvanje evidencije za poreze, računovodstvo i pravne zahteve'),
              t('Legal obligation, Art. 6(1)(c), and legitimate interest, Art. 6(1)(f)', 'Zakonska obaveza, čl. 6(1)(c), i legitimni interes, čl. 6(1)(f)'),
            ],
          ]}
        />
      ),
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      body: (
        <>
          <p>
            {t(
              'If you sign up for our newsletter in the popup or the footer, we store your email address, the date, where you signed up, the wording you agreed to and a one-way hash of your IP address. We then send you one email asking you to confirm (double opt-in); you are added to the list only after you click the link in it. Sign-ups that are never confirmed are deleted after 30 days.',
              'Ako se prijavite na naš newsletter u iskačućem prozoru ili u podnožju, čuvamo vašu email adresu, datum, mesto prijave, tekst sa kojim ste se složili i jednosmerni heš IP adrese. Zatim vam šaljemo jedan email sa molbom da potvrdite prijavu (dvostruka potvrda); na listu ste dodati tek kad kliknete na link u njemu. Prijave koje nikad nisu potvrđene brišu se posle 30 dana.',
            )}
          </p>
          <p>
            {t(
              'The newsletter comes about once a month. Every email has a link to unsubscribe in one click, and you can also ask us to delete your address completely. After you unsubscribe we keep only a record that you did, so you are not added again by mistake, unless you ask for deletion.',
              'Newsletter stiže otprilike jednom mesečno. Svaki email ima link za odjavu jednim klikom, a možete i tražiti da vašu adresu potpuno obrišemo. Posle odjave čuvamo samo zapis da ste se odjavili, da vas greškom ne bismo ponovo dodali, osim ako ne tražite brisanje.',
            )}
          </p>
        </>
      ),
    },
    {
      id: 'never',
      title: t('What we never do', 'Šta nikad ne radimo'),
      body: (
        <Bullets
          items={[
            t('We do not sell your personal data, and we do not share it for money.', 'Ne prodajemo vaše podatke o ličnosti i ne delimo ih za novac.'),
            t(
              'We do not add you to our newsletter or any mailing list unless you sign up and confirm it yourself.',
              'Ne dodajemo vas na newsletter ni na bilo koju listu ako se sami ne prijavite i to ne potvrdite.',
            ),
            t(
              'We do not make decisions about you by automated means that have legal or similarly significant effects.',
              'Ne donosimo odluke o vama automatizovanim putem koje imaju pravne ili slično značajne posledice.',
            ),
          ]}
        />
      ),
    },
    {
      id: 'clients',
      title: t('Websites we run for clients', 'Sajtovi koje vodimo za klijente'),
      body: (
        <p>
          {t(
            'For client websites, our lead tracking stores the enquiries that visitors send through those sites and forwards them to the client. We process that data only on the client’s documented instructions, under a data processing agreement, and the client’s own privacy notice applies. Visitors of those websites should send privacy requests to the business that runs the site; we will help the client answer them.',
            'Za sajtove klijenata, naše praćenje upita čuva upite koje posetioci šalju preko tih sajtova i prosleđuje ih klijentu. Te podatke obrađujemo samo po dokumentovanim uputstvima klijenta, na osnovu ugovora o obradi podataka, a važi klijentovo obaveštenje o privatnosti. Posetioci tih sajtova treba da zahteve u vezi sa privatnošću šalju firmi koja vodi sajt; mi ćemo pomoći klijentu da odgovori.',
          )}
        </p>
      ),
    },
    {
      id: 'cookies',
      title: t('Cookies and similar technologies', 'Kolačići i slične tehnologije'),
      body: (
        <>
          <p>
            {t(
              'Necessary storage runs without consent because the site cannot work properly without it.',
              'Neophodno skladištenje radi bez saglasnosti jer sajt bez njega ne može ispravno da radi.',
            )}{' '}
            {thirdParty
              ? consentAsked
                ? t(
                    'Analytics and advertising cookies are loaded only after you allow them in the cookie banner. If you reject them, they are not loaded at all. We use Google Consent Mode, so Google receives your choice with every tag.',
                    'Kolačići za analitiku i oglašavanje učitavaju se tek kad ih dozvolite u obaveštenju o kolačićima. Ako ih odbijete, uopšte se ne učitavaju. Koristimo Google Consent Mode, pa Google uz svaki tag dobija vaš izbor.',
                  )
                : t('Analytics and advertising tools are currently loaded on every visit.', 'Alati za analitiku i oglašavanje trenutno se učitavaju pri svakoj poseti.')
              : t('We do not currently use any analytics or advertising cookies.', 'Trenutno ne koristimo kolačiće za analitiku ni oglašavanje.')}
          </p>
          <Table
            head={[t('Name', 'Naziv'), t('Provider', 'Dobavljač'), t('Type', 'Vrsta'), t('Purpose', 'Svrha'), t('Lifetime', 'Trajanje')]}
            rows={cookieRows}
          />
          {thirdParty && consentAsked && (
            <p>
              {t('You can change or withdraw your consent at any time with', 'Saglasnost možete promeniti ili opozvati bilo kada preko')}{' '}
              {strong(t('Cookie settings', 'Podešavanja kolačića'))}{' '}
              {t(
                'at the bottom of every page. Withdrawing does not affect what happened before. We also honour the Global Privacy Control signal from your browser as a refusal of advertising cookies. You can also block or delete cookies in your browser settings.',
                'na dnu svake stranice. Opoziv ne utiče na ono što se desilo ranije. Global Privacy Control signal iz vašeg pregledača takođe poštujemo kao odbijanje kolačića za oglašavanje. Kolačiće možete blokirati ili obrisati i u podešavanjima pregledača.',
              )}
            </p>
          )}
        </>
      ),
    },
    {
      id: 'processors',
      title: t('Who processes data for us', 'Ko obrađuje podatke za nas'),
      body: (
        <>
          <p>
            {t(
              'We use a small number of service providers, each bound by a data processing agreement and allowed to use the data only for us:',
              'Koristimo mali broj dobavljača usluga, od kojih je svaki vezan ugovorom o obradi podataka i sme da koristi podatke samo za nas:',
            )}
          </p>
          <Bullets
            items={[
              t('Railway (hosting of this website and its server)', 'Railway (hosting ovog sajta i njegovog servera)'),
              t('Supabase (database where enquiries are stored)', 'Supabase (baza u kojoj se čuvaju upiti)'),
              t('Resend (sending email notifications and replies)', 'Resend (slanje email obaveštenja i odgovora)'),
              t('Cloudflare (network, DNS and security)', 'Cloudflare (mreža, DNS i bezbednost)'),
              ...(thirdParty
                ? [
                    t(
                      'Google and Meta, only for the cookies you allow (see section 7); they act partly as independent controllers under their own privacy policies',
                      'Google i Meta, samo za kolačiće koje dozvolite (vidi odeljak 7); oni delom deluju kao samostalni rukovaoci po sopstvenim pravilima privatnosti',
                    ),
                  ]
                : []),
            ]}
          />
          <p>
            {t(
              'We may also disclose data when the law requires it, to protect our rights in a dispute, or to a successor if the business is sold.',
              'Podatke možemo otkriti i kada to zakon zahteva, radi zaštite naših prava u sporu, ili nasledniku ako se posao proda.',
            )}
          </p>
        </>
      ),
    },
    {
      id: 'transfers',
      title: t('International transfers', 'Prenos podataka u druge zemlje'),
      body: (
        <p>
          {t(
            'Some providers above store or access data outside your country, including in the United States and the European Union. Where data leaves the European Economic Area, the United Kingdom or Serbia, we rely on adequacy decisions (including the EU–U.S. Data Privacy Framework where the provider is certified) or on the European Commission’s Standard Contractual Clauses, with additional safeguards where needed. You can ask us for a copy of the relevant safeguards.',
            'Neki od navedenih dobavljača čuvaju podatke ili im pristupaju van vaše zemlje, uključujući SAD i Evropsku uniju. Kada podaci napuštaju Evropski ekonomski prostor, Ujedinjeno Kraljevstvo ili Srbiju, oslanjamo se na odluke o primerenosti (uključujući EU–U.S. Data Privacy Framework kada je dobavljač sertifikovan) ili na standardne ugovorne klauzule Evropske komisije, uz dodatne mere zaštite kada je potrebno. Možete tražiti kopiju odgovarajućih mera zaštite.',
          )}
        </p>
      ),
    },
    {
      id: 'retention',
      title: t('How long we keep it', 'Koliko dugo čuvamo podatke'),
      body: (
        <Bullets
          items={[
            t(
              'Enquiries that do not lead to work: up to 24 months after our last contact, then deleted or anonymised.',
              'Upiti koji ne dovedu do posla: do 24 meseca od poslednjeg kontakta, zatim se brišu ili anonimizuju.',
            ),
            t(
              'Client records: for the duration of the work and afterwards as long as tax, accounting and limitation periods require.',
              'Evidencija o klijentima: dok traje saradnja i posle toga onoliko koliko zahtevaju poreski, računovodstveni i rokovi zastarelosti.',
            ),
            t(
              'Newsletter: until you unsubscribe or ask for deletion; unconfirmed sign-ups for 30 days.',
              'Newsletter: dok se ne odjavite ili ne zatražite brisanje; nepotvrđene prijave 30 dana.',
            ),
            t('Cookie-free visit statistics: kept only in aggregated or daily-hashed form.', 'Statistika poseta bez kolačića: čuva se samo zbirno ili u obliku dnevnog heša.'),
            t('Cookies: for the lifetimes listed in section 7, or until you delete them.', 'Kolačići: koliko je navedeno u odeljku 7, ili dok ih ne obrišete.'),
          ]}
        />
      ),
    },
    {
      id: 'rights',
      title: t('Your rights', 'Vaša prava'),
      body: (
        <>
          <p>{t('Depending on where you live, you have the right to:', 'U zavisnosti od toga gde živite, imate pravo da:')}</p>
          <Bullets
            items={[
              t('know whether we process your data and get a copy of it;', 'znate da li obrađujemo vaše podatke i dobijete njihovu kopiju;'),
              t('have inaccurate data corrected and incomplete data completed;', 'netačni podaci budu ispravljeni, a nepotpuni dopunjeni;'),
              t('have your data deleted, or its use restricted;', 'vaši podaci budu obrisani ili njihova upotreba ograničena;'),
              t('object to processing based on our legitimate interest, including any direct marketing;', 'uložite prigovor na obradu zasnovanu na našem legitimnom interesu, uključujući direktni marketing;'),
              t('receive data you gave us in a portable format;', 'dobijete podatke koje ste nam dali u prenosivom formatu;'),
              t('withdraw consent at any time, without affecting earlier processing;', 'opozovete saglasnost bilo kada, bez uticaja na raniju obradu;'),
              t('not be discriminated against for using these rights.', 'ne budete diskriminisani zbog korišćenja ovih prava.'),
            ]}
          />
          <p>
            {t('To use any of these rights, contact us at', 'Da biste iskoristili neko od ovih prava, pišite nam na')} {contact}.{' '}
            {t(
              'We may ask you to confirm your identity before we act on a request, and you may use an authorised agent where the law allows it.',
              'Možemo tražiti da potvrdite identitet pre nego što postupimo po zahtevu, a možete koristiti i ovlašćenog zastupnika kada zakon to dozvoljava.',
            )}
          </p>
          <p>
            {strong(t('Complaints.', 'Pritužbe.'))}{' '}
            {t(
              'You can complain to a data protection authority: in Serbia the Commissioner for Information of Public Importance and Personal Data Protection (Poverenik), in the EU or UK the authority where you live or work. We would appreciate the chance to resolve your concern first.',
              'Pritužbu možete podneti nadzornom organu: u Srbiji Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti, u EU ili UK organu u zemlji u kojoj živite ili radite. Bilo bi nam drago da nam prvo date priliku da rešimo problem.',
            )}
          </p>
          <p>
            {strong(t('California and other U.S. states.', 'Kalifornija i druge američke savezne države.'))}{' '}
            {t(
              'Residents of California and other states with privacy laws have the rights above to know, delete and correct personal information and to opt out of its sale, sharing for cross-context behavioural advertising, or use for targeted advertising. We do not sell personal information. Advertising cookies, where used, run only with your consent, and you can opt out at any time with Cookie settings or a Global Privacy Control signal. We do not knowingly collect sensitive personal information.',
              'Stanovnici Kalifornije i drugih država sa zakonima o privatnosti imaju gore navedena prava da saznaju, obrišu i isprave lične podatke i da odbiju njihovu prodaju, deljenje za bihevioralno oglašavanje ili upotrebu za ciljano oglašavanje. Lične podatke ne prodajemo. Kolačići za oglašavanje, kada se koriste, rade samo uz vašu saglasnost, a možete ih isključiti bilo kada preko Podešavanja kolačića ili Global Privacy Control signala. Svesno ne prikupljamo osetljive lične podatke.',
            )}
          </p>
        </>
      ),
    },
    {
      id: 'security',
      title: t('Security', 'Bezbednost'),
      body: (
        <p>
          {t(
            'Data travels over encrypted connections (HTTPS), the database is accessible only to authorised staff with individual sign-in, and our providers apply industry-standard security. No system is completely secure; if a breach affects your data, we will inform you and the authorities as the law requires.',
            'Podaci putuju šifrovanim vezama (HTTPS), bazi pristupaju samo ovlašćena lica sa ličnom prijavom, a naši dobavljači primenjuju standardne mere bezbednosti. Nijedan sistem nije potpuno bezbedan; ako povreda bezbednosti zahvati vaše podatke, obavestićemo vas i nadležne organe kako zakon nalaže.',
          )}
        </p>
      ),
    },
    {
      id: 'children',
      title: t('Children', 'Deca'),
      body: (
        <p>
          {t(
            'Our services are for businesses. We do not knowingly collect data from anyone under 16. If you believe a child has sent us data, contact us and we will delete it.',
            'Naše usluge su namenjene firmama. Svesno ne prikupljamo podatke od osoba mlađih od 16 godina. Ako mislite da nam je dete poslalo podatke, javite nam se i obrisaćemo ih.',
          )}
        </p>
      ),
    },
    {
      id: 'changes',
      title: t('Changes to this notice', 'Izmene ovog obaveštenja'),
      body: (
        <p>
          {t(
            'We may update this notice when our services or the law change. The date at the top shows the latest version. If a change is significant, we will show it on the site, and where consent is needed we will ask again.',
            'Obaveštenje možemo izmeniti kada se promene naše usluge ili zakon. Datum na vrhu pokazuje poslednju verziju. Ako je izmena značajna, prikazaćemo je na sajtu, a kada je potrebna saglasnost, tražićemo je ponovo.',
          )}
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title={t('Privacy notice', 'Obaveštenje o privatnosti')}
      updated={UPDATED[lang]}
      intro={
        <p>
          {t(
            'This notice explains what personal data WebTano collects through webtano.com, why, and what choices and rights you have. It is written to meet the EU and UK GDPR, the Serbian Law on Personal Data Protection and U.S. state privacy laws such as the CCPA/CPRA. See also our',
            'Ovo obaveštenje objašnjava koje podatke o ličnosti WebTano prikuplja preko sajta webtano.com, zašto, i koje izbore i prava imate. Napisano je u skladu sa GDPR-om EU i UK, Zakonom o zaštiti podataka o ličnosti Republike Srbije i zakonima o privatnosti američkih saveznih država kao što je CCPA/CPRA. Pogledajte i naše',
          )}{' '}
          <Link href={lp('/terms')} className="font-medium text-ink-950 underline underline-offset-2">
            {t('terms of use', 'uslove korišćenja')}
          </Link>
          .
        </p>
      }
      sections={sections}
    />
  );
}
