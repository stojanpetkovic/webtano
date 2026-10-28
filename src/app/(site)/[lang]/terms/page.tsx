import type { Metadata } from 'next';
import Link from 'next/link';
import { alternates, ogImage } from '@/lib/seo';
import { appSettings } from '@/lib/admin/settings';
import { getI18n } from '@/lib/i18n-site';
import { Bullets, LegalPage, type LegalSection } from '@/components/site/Legal';

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t, lp } = await getI18n();
  return {
    title: t('Terms of use', 'Uslovi korišćenja'),
    description: t(
      'The terms for using webtano.com and the free website audit: no guarantee of results, how case studies should be read, intellectual property, limits of liability and governing law.',
      'Uslovi korišćenja sajta webtano.com i besplatne analize sajta: bez garancije rezultata, kako čitati studije slučaja, intelektualna svojina, ograničenje odgovornosti i merodavno pravo.',
    ),
    alternates: alternates(lang, '/terms'),
    openGraph: { url: lp('/terms'), images: [ogImage(lang)] },
  };
}

const UPDATED = { en: '25 October 2026', sr: '25. oktobra 2026.' };

export default async function TermsPage() {
  const { lang, t, lp } = await getI18n();
  const { company } = await appSettings();
  const email = company.email.trim();
  const contact = email ? (
    <a href={`mailto:${email}`} className="font-medium text-ink-950 underline underline-offset-2">
      {email}
    </a>
  ) : (
    <Link href={lp('/#hero-form')} className="font-medium text-ink-950 underline underline-offset-2">
      {t('the contact form on this website', 'kontakt forma na ovom sajtu')}
    </Link>
  );

  const sections: LegalSection[] = [
    {
      id: 'scope',
      title: t('About these terms', 'O ovim uslovima'),
      body: (
        <>
          <p>
            {t(
              'These terms apply to your use of webtano.com and everything on it, including the free website audit, the demo report, the blog and the case studies (together, the “site”). The site is operated by WebTano (“WebTano”, “we”, “us”). By using the site you accept these terms. If you do not agree, please do not use it.',
              'Ovi uslovi važe za korišćenje sajta webtano.com i svega na njemu, uključujući besplatnu analizu sajta, primer izveštaja, blog i studije slučaja (zajedno: „sajt”). Sajtom upravlja WebTano („WebTano”, „mi”). Korišćenjem sajta prihvatate ove uslove. Ako se ne slažete, molimo vas da ga ne koristite.',
            )}
          </p>
          <p>
            {t(
              'Paid services are provided only under a separate written proposal or agreement that both sides accept. If that agreement differs from these terms, the agreement prevails.',
              'Plaćene usluge pružaju se samo na osnovu posebne pisane ponude ili ugovora koji obe strane prihvate. Ako se taj ugovor razlikuje od ovih uslova, važi ugovor.',
            )}
          </p>
        </>
      ),
    },
    {
      id: 'information',
      title: t('Information only, not an offer', 'Samo informacije, ne ponuda'),
      body: (
        <p>
          {t(
            'The site describes our services in general terms. Prices, packages and timelines shown are indicative, may change without notice and become binding only in an accepted proposal. Nothing on the site is a binding offer, and blog articles and checklists are general information, not professional, legal, tax or financial advice for your particular situation.',
            'Sajt opisuje naše usluge uopšteno. Prikazane cene, paketi i rokovi su okvirni, mogu se promeniti bez najave i obavezujući su tek u prihvaćenoj ponudi. Ništa na sajtu nije obavezujuća ponuda, a blog tekstovi i kontrolne liste su opšte informacije, a ne stručni, pravni, poreski ili finansijski savet za vašu konkretnu situaciju.',
          )}
        </p>
      ),
    },
    {
      id: 'check',
      title: t('The free website audit', 'Besplatna analiza sajta'),
      body: (
        <Bullets
          items={[
            t(
              'The check is free and creates no obligation for you or for us. We may decline a request, for example when a business falls outside what we work with.',
              'Provera je besplatna i ne stvara obavezu ni za vas ni za nas. Zahtev možemo odbiti, na primer kada je delatnost van onoga čime se bavimo.',
            ),
            t(
              'It is an expert opinion based on what is publicly visible about your website, Google Business Profile and ads at the time of the check. It is not an audit of your systems and may not find every issue.',
              'To je stručno mišljenje zasnovano na onome što je javno vidljivo o vašem sajtu, Google Business profilu i oglasima u trenutku provere. Nije revizija vaših sistema i ne mora da pronađe svaki problem.',
            ),
            t(
              'Any estimates of lost calls, leads or revenue are illustrations based on assumptions and averages, not forecasts or promises.',
              'Sve procene izgubljenih poziva, upita ili prihoda su ilustracije zasnovane na pretpostavkama i prosecima, a ne prognoze ili obećanja.',
            ),
            t(
              'You confirm that the details you send are accurate and that you are allowed to share them, including any website or business you name.',
              'Potvrđujete da su podaci koje šaljete tačni i da imate pravo da ih podelite, uključujući sajt ili firmu koju navedete.',
            ),
          ]}
        />
      ),
    },
    {
      id: 'results',
      title: t('No guarantee of results', 'Bez garancije rezultata'),
      body: (
        <>
          <p>
            {t(
              'Search rankings, ad performance, calls and sales depend on many factors outside our control, including search engine and ad platform algorithms and policies, competition, your market, your prices, how quickly you answer enquiries and your reviews. Therefore we do not guarantee any specific ranking, traffic, number of leads, cost per lead or revenue, unless a signed agreement expressly says so.',
              'Pozicije u pretrazi, učinak oglasa, pozivi i prodaja zavise od mnogo faktora van naše kontrole, uključujući algoritme i pravila pretraživača i oglasnih platformi, konkurenciju, vaše tržište, vaše cene, brzinu odgovora na upite i vaše recenzije. Zato ne garantujemo određenu poziciju, posećenost, broj upita, cenu po upitu ili prihod, osim ako potpisani ugovor to izričito ne navodi.',
            )}
          </p>
          <p>
            {t(
              'Google, Google Ads, Google Business Profile, Meta, Facebook and Instagram are trademarks of their owners. We are not affiliated with, endorsed by or acting for them, and we cannot control their decisions, such as suspensions, ad disapprovals or ranking changes.',
              'Google, Google Ads, Google Business Profile, Meta, Facebook i Instagram su žigovi njihovih vlasnika. Nismo povezani sa njima, ne zastupamo ih i nemamo njihovu podršku, i ne možemo da utičemo na njihove odluke, kao što su suspenzije, odbijanje oglasa ili promene pozicija.',
            )}
          </p>
        </>
      ),
    },
    {
      id: 'case-studies',
      title: t('Case studies, figures and examples', 'Studije slučaja, brojevi i primeri'),
      body: (
        <p>
          {t(
            'Case studies show results achieved for specific clients in specific markets and periods. Past results do not predict or guarantee future results, and your results may be lower or higher. Figures are rounded and measured with the tools described on the site. Dashboards, reports and screenshots marked as a demo or example use sample data. Client names and logos are shown with permission and remain the property of their owners.',
            'Studije slučaja prikazuju rezultate postignute za određene klijente na određenim tržištima i u određenim periodima. Raniji rezultati ne predviđaju i ne garantuju buduće, a vaši rezultati mogu biti manji ili veći. Brojevi su zaokruženi i mereni alatima opisanim na sajtu. Kontrolne table, izveštaji i snimci ekrana označeni kao primer koriste primer podatke. Imena i logotipi klijenata prikazani su uz dozvolu i ostaju vlasništvo njihovih vlasnika.',
          )}
        </p>
      ),
    },
    {
      id: 'use',
      title: t('Acceptable use', 'Dozvoljeno korišćenje'),
      body: (
        <>
          <p>{t('You agree not to:', 'Slažete se da nećete:')}</p>
          <Bullets
            items={[
              t(
                'send false, misleading or someone else’s details through our forms, or use them to send spam or advertising;',
                'slati lažne, obmanjujuće ili tuđe podatke preko naših formi, niti ih koristiti za slanje spama ili reklama;',
              ),
              t('try to break into, overload, scan or disrupt the site, or get around its security;', 'pokušavati da provalite, preopteretite, skenirate ili ometate sajt, niti da zaobiđete njegovu zaštitu;'),
              t(
                'scrape, copy or reuse substantial parts of the site, by automated means or otherwise, without our written permission;',
                'preuzimati, kopirati ili ponovo koristiti značajne delove sajta, automatski ili na drugi način, bez naše pisane dozvole;',
              ),
              t('use the site in any way that breaks the law or the rights of others.', 'koristiti sajt na bilo koji način koji krši zakon ili prava drugih.'),
            ]}
          />
          <p>{t('We may block access to anyone who breaks these rules.', 'Možemo blokirati pristup svakome ko prekrši ova pravila.')}</p>
        </>
      ),
    },
    {
      id: 'ip',
      title: t('Intellectual property', 'Intelektualna svojina'),
      body: (
        <p>
          {t(
            'The site, including its text, design, code, graphics, the WebTano name and logo, reports and the demo, belongs to WebTano or its licensors and is protected by copyright and trademark law. You may view and print pages for your own, non-commercial use and share links to them. Any other use, including copying, adapting or republishing, needs our prior written permission. Ownership of work we deliver to clients is set out in their agreement.',
            'Sajt, uključujući tekstove, dizajn, kod, grafiku, ime i logo WebTano, izveštaje i primer, pripada WebTano-u ili davaocima licence i zaštićen je autorskim pravom i pravom žiga. Stranice možete pregledati i štampati za ličnu, nekomercijalnu upotrebu i deliti linkove ka njima. Svaka druga upotreba, uključujući kopiranje, prilagođavanje ili ponovno objavljivanje, zahteva našu prethodnu pisanu dozvolu. Vlasništvo nad radom koji isporučujemo klijentima uređuje se njihovim ugovorom.',
          )}
        </p>
      ),
    },
    {
      id: 'links',
      title: t('Links to other websites', 'Linkovi ka drugim sajtovima'),
      body: (
        <p>
          {t(
            'The site links to client websites and third-party services. We do not control them and are not responsible for their content, availability or privacy practices. A link does not mean we endorse a site.',
            'Sajt sadrži linkove ka sajtovima klijenata i uslugama trećih strana. Ne kontrolišemo ih i nismo odgovorni za njihov sadržaj, dostupnost ili postupanje sa privatnošću. Link ne znači da preporučujemo taj sajt.',
          )}
        </p>
      ),
    },
    {
      id: 'disclaimer',
      title: t('Disclaimer', 'Odricanje od odgovornosti'),
      body: (
        <p>
          {t(
            'We take care to keep the site accurate and available, but it is provided “as is” and “as available”. To the extent the law allows, we make no warranties of any kind, express or implied, including that the site or its content is accurate, complete, current, uninterrupted, free of errors or viruses, or fit for a particular purpose.',
            'Trudimo se da sajt bude tačan i dostupan, ali se pruža „takav kakav jeste” i „kada je dostupan”. U meri u kojoj zakon dozvoljava, ne dajemo nikakve garancije, izričite ili prećutne, uključujući da su sajt ili njegov sadržaj tačni, potpuni, ažurni, neprekidno dostupni, bez grešaka ili virusa, ili pogodni za određenu svrhu.',
          )}
        </p>
      ),
    },
    {
      id: 'liability',
      title: t('Limitation of liability', 'Ograničenje odgovornosti'),
      body: (
        <>
          <p>
            {t(
              'To the extent the law allows, WebTano is not liable for any indirect, incidental, special or consequential loss, or for loss of profit, revenue, business, goodwill or data, arising from your use of the site, from relying on its content or from being unable to use it, even if we were told such loss was possible. Our total liability arising from the site, which is free to use, is limited to 100 U.S. dollars.',
              'U meri u kojoj zakon dozvoljava, WebTano ne odgovara za posrednu, slučajnu, posebnu ili posledičnu štetu, niti za gubitak dobiti, prihoda, posla, ugleda ili podataka, nastale korišćenjem sajta, oslanjanjem na njegov sadržaj ili nemogućnošću da se koristi, čak i ako smo bili upozoreni da je takva šteta moguća. Naša ukupna odgovornost u vezi sa sajtom, čije je korišćenje besplatno, ograničena je na 100 američkih dolara.',
            )}
          </p>
          <p>
            {t(
              'Nothing in these terms limits liability that cannot be limited by law, such as liability for intent, gross negligence, or death or personal injury caused by negligence, or your statutory rights as a consumer.',
              'Ništa u ovim uslovima ne ograničava odgovornost koja se po zakonu ne može ograničiti, kao što je odgovornost za namerno postupanje, krajnju nepažnju ili smrt ili telesnu povredu prouzrokovanu nepažnjom, niti vaša zakonska prava potrošača.',
            )}
          </p>
        </>
      ),
    },
    {
      id: 'indemnity',
      title: t('Indemnity', 'Naknada štete'),
      body: (
        <p>
          {t(
            'If you break these terms or the law when using the site, you agree to cover the reasonable costs, losses and claims that this causes us, including reasonable legal fees, to the extent the law allows.',
            'Ako prilikom korišćenja sajta prekršite ove uslove ili zakon, saglasni ste da nam nadoknadite razumne troškove, gubitke i zahteve koji zbog toga nastanu, uključujući razumne troškove pravnog zastupanja, u meri u kojoj zakon dozvoljava.',
          )}
        </p>
      ),
    },
    {
      id: 'privacy',
      title: t('Privacy', 'Privatnost'),
      body: (
        <p>
          {t('How we handle personal data is described in our', 'Kako postupamo sa podacima o ličnosti opisano je u našem')}{' '}
          <Link href={lp('/privacy')} className="font-medium text-ink-950 underline underline-offset-2">
            {t('privacy notice', 'obaveštenju o privatnosti')}
          </Link>
          {t(', which forms part of these terms.', ', koje je deo ovih uslova.')}
        </p>
      ),
    },
    {
      id: 'law',
      title: t('Governing law and disputes', 'Merodavno pravo i sporovi'),
      body: (
        <p>
          {t(
            'These terms are governed by the laws of the Republic of Serbia, without regard to conflict-of-law rules. We will first try to resolve any dispute amicably; otherwise the competent court in Belgrade has jurisdiction. If you are a consumer, you keep the protection of the mandatory laws of the country where you live and may bring proceedings there.',
            'Na ove uslove primenjuje se pravo Republike Srbije, bez primene kolizionih pravila. Svaki spor prvo ćemo pokušati da rešimo sporazumno; u suprotnom je nadležan stvarno nadležni sud u Beogradu. Ako ste potrošač, zadržavate zaštitu prinudnih propisa zemlje u kojoj živite i možete pokrenuti postupak tamo.',
          )}
        </p>
      ),
    },
    {
      id: 'general',
      title: t('Changes and general terms', 'Izmene i opšte odredbe'),
      body: (
        <>
          <p>
            {t(
              'We may change the site or these terms at any time. The date at the top shows the current version, and changes apply from the moment they are published. If any part of these terms is found invalid, the rest stays in force. Our failure to enforce a right does not waive it. You may not transfer your rights under these terms without our consent.',
              'Sajt i ove uslove možemo promeniti bilo kada. Datum na vrhu pokazuje važeću verziju, a izmene važe od trenutka objavljivanja. Ako se neki deo ovih uslova pokaže nevažećim, ostatak ostaje na snazi. To što ne koristimo neko pravo ne znači da ga se odričemo. Svoja prava iz ovih uslova ne možete preneti bez naše saglasnosti.',
            )}
          </p>
          <p>
            {t('Questions about these terms:', 'Pitanja o ovim uslovima:')} {contact}.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title={t('Terms of use', 'Uslovi korišćenja')}
      updated={UPDATED[lang]}
      intro={
        <p>
          {t(
            'Please read these terms before using webtano.com or asking for a free website audit. They are short, and they are written to be clear.',
            'Molimo vas da pročitate ove uslove pre korišćenja sajta webtano.com ili traženja besplatne analize sajta. Kratki su i napisani da budu jasni.',
          )}
        </p>
      }
      sections={sections}
    />
  );
}
