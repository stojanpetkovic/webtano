import type { Metadata } from 'next';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/seo';
import { appSettings } from '@/lib/admin/settings';
import { Bullets, LegalPage, Table, type LegalSection } from '@/components/site/Legal';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description:
    'How WebTano handles personal data: what we collect and why, the legal bases, cookies and your choices, who processes data for us, how long we keep it, and your rights.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: '/privacy', images: [OG_IMAGE] },
};

const UPDATED = '25 October 2026';

export default async function PrivacyPage() {
  const { tracking: t, company } = await appSettings();
  const email = company.email.trim();
  const contact = email ? (
    <a href={`mailto:${email}`} className="font-medium text-ink-950 underline underline-offset-2">
      {email}
    </a>
  ) : (
    <Link href="/#hero-form" className="font-medium text-ink-950 underline underline-offset-2">
      the contact form on this website
    </Link>
  );
  const consentAsked = t.consent;

  // Third-party cookies are listed only while their tool is switched on in the admin.
  const cookieRows: React.ReactNode[][] = [
    ['wt_consent', 'WebTano', 'Necessary', 'Remembers your cookie choice and when you made it', '12 months (local storage)'],
    ['sp_lead_attribution', 'WebTano', 'Necessary', 'Links an enquiry you send to the page, referrer and campaign you arrived from', '30 days (local storage)'],
    ['sp_visit, wt_lead_name', 'WebTano', 'Necessary', 'Counts a visit once per session and shows your first name on the thank-you page', 'Until the tab is closed (session storage)'],
    ['wt_newsletter', 'WebTano', 'Necessary', 'Remembers that you closed or used the newsletter popup, so it is not shown again', '30 days, or until you subscribe (local storage)'],
    ['__cf_bm and similar', 'Cloudflare', 'Necessary', 'Protects the site against bots and attacks', 'Up to 30 minutes'],
  ];
  if (t.ga4_id) cookieRows.push(['_ga, _ga_*', 'Google', 'Analytics', 'Distinguishes visitors and sessions for Google Analytics 4', 'Up to 2 years']);
  if (t.google_ads_id) cookieRows.push(['_gcl_au, _gcl_aw', 'Google', 'Advertising', 'Connects an ad click with a later enquiry (conversion measurement)', 'Up to 90 days']);
  if (t.meta_pixel_id) cookieRows.push(['_fbp, _fbc', 'Meta', 'Advertising', 'Measures which Facebook and Instagram ads bring enquiries', 'Up to 90 days']);
  if (t.gtm_id) cookieRows.push(['Set by tags it loads', 'Google Tag Manager', 'Analytics / Advertising', 'Loads the tags above; sets no cookie of its own', 'As listed above']);

  const thirdParty = Boolean(t.ga4_id || t.google_ads_id || t.meta_pixel_id || t.gtm_id);

  const sections: LegalSection[] = [
    {
      id: 'who',
      title: 'Who is responsible',
      body: (
        <>
          <p>
            WebTano (“WebTano”, “we”, “us”) operates webtano.com and is the controller of the personal data described in this notice. For any
            privacy question or request, contact us at {contact}. We reply within one month at the latest, and usually much sooner.
          </p>
          <p>
            This notice covers webtano.com. When we build or run a website for a client, the client is the controller of the data its visitors
            submit, and we act only as its processor (see section 6).
          </p>
        </>
      ),
    },
    {
      id: 'collect',
      title: 'What we collect',
      body: (
        <>
          <p>
            <strong className="text-ink-950">What you give us.</strong> When you use the website check form or write to us: your name, email,
            phone number, website, business name, the answers you choose and your message. Do not send us sensitive data such as health or
            financial information; the form is not meant for it.
          </p>
          <p>
            <strong className="text-ink-950">What is recorded with an enquiry.</strong> The page you sent it from, the referring website and
            campaign tags (for example utm_source), your browser type, and a one-way hash of your IP address used only to stop spam. We do not
            store your IP address itself.
          </p>
          <p>
            <strong className="text-ink-950">Visit statistics without cookies.</strong> We count page views and taps on contact links with our
            own tool. It stores the page path, device type, country and a visitor code that is a one-way hash which changes every day, so a
            visitor cannot be recognised from one day to the next. It sets no cookie and stores no IP address.
          </p>
          {thirdParty && (
            <p>
              <strong className="text-ink-950">Cookies, only with your consent.</strong> Analytics and advertising tools that set cookies and
              receive your IP address and device details. See section 7.
            </p>
          )}
        </>
      ),
    },
    {
      id: 'why',
      title: 'Why we use it and on what legal basis',
      body: (
        <Table
          head={['Purpose', 'Legal basis (GDPR and Serbian law)']}
          rows={[
            ['Replying to your enquiry, preparing the free check and a proposal', 'Steps you asked for before a contract, Art. 6(1)(b)'],
            ['Sending the newsletter you subscribed to, and keeping proof of your consent', 'Your consent, Art. 6(1)(a), which you can withdraw with the unsubscribe link'],
            ['Following up on that enquiry by email or phone', 'Our legitimate interest in answering requests, Art. 6(1)(f)'],
            ['Keeping the site secure, preventing spam and abuse, cookie-free statistics', 'Legitimate interest in a safe, working website, Art. 6(1)(f)'],
            ['Analytics and advertising cookies', 'Your consent, Art. 6(1)(a), which you can withdraw at any time'],
            ['Keeping records for tax, accounting and legal claims', 'Legal obligation, Art. 6(1)(c), and legitimate interest, Art. 6(1)(f)'],
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
            If you sign up for our newsletter in the popup or the footer, we store your email address, the date, where you signed up, the wording
            you agreed to and a one-way hash of your IP address. We then send you one email asking you to confirm (double opt-in); you are added
            to the list only after you click the link in it. Sign-ups that are never confirmed are deleted after 30 days.
          </p>
          <p>
            The newsletter comes about once a month. Every email has a link to unsubscribe in one click, and you can also ask us to delete your
            address completely. After you unsubscribe we keep only a record that you did, so you are not added again by mistake, unless you ask
            for deletion.
          </p>
        </>
      ),
    },
    {
      id: 'never',
      title: 'What we never do',
      body: (
        <Bullets
          items={[
            'We do not sell your personal data, and we do not share it for money.',
            'We do not add you to our newsletter or any mailing list unless you sign up and confirm it yourself.',
            'We do not make decisions about you by automated means that have legal or similarly significant effects.',
          ]}
        />
      ),
    },
    {
      id: 'clients',
      title: 'Websites we run for clients',
      body: (
        <p>
          For client websites, our lead tracking stores the enquiries that visitors send through those sites and forwards them to the client.
          We process that data only on the client’s documented instructions, under a data processing agreement, and the client’s own privacy
          notice applies. Visitors of those websites should send privacy requests to the business that runs the site; we will help the client
          answer them.
        </p>
      ),
    },
    {
      id: 'cookies',
      title: 'Cookies and similar technologies',
      body: (
        <>
          <p>
            Necessary storage runs without consent because the site cannot work properly without it.{' '}
            {thirdParty
              ? consentAsked
                ? 'Analytics and advertising cookies are loaded only after you allow them in the cookie banner. If you reject them, they are not loaded at all. We use Google Consent Mode, so Google receives your choice with every tag.'
                : 'Analytics and advertising tools are currently loaded on every visit.'
              : 'We do not currently use any analytics or advertising cookies.'}
          </p>
          <Table head={['Name', 'Provider', 'Type', 'Purpose', 'Lifetime']} rows={cookieRows} />
          {thirdParty && consentAsked && (
            <p>
              You can change or withdraw your consent at any time with <strong className="text-ink-950">Cookie settings</strong> at the bottom
              of every page. Withdrawing does not affect what happened before. We also honour the Global Privacy Control signal from your
              browser as a refusal of advertising cookies. You can also block or delete cookies in your browser settings.
            </p>
          )}
        </>
      ),
    },
    {
      id: 'processors',
      title: 'Who processes data for us',
      body: (
        <>
          <p>We use a small number of service providers, each bound by a data processing agreement and allowed to use the data only for us:</p>
          <Bullets
            items={[
              'Railway (hosting of this website and its server)',
              'Supabase (database where enquiries are stored)',
              'Resend (sending email notifications and replies)',
              'Cloudflare (network, DNS and security)',
              ...(thirdParty ? ['Google and Meta, only for the cookies you allow (see section 7); they act partly as independent controllers under their own privacy policies'] : []),
            ]}
          />
          <p>We may also disclose data when the law requires it, to protect our rights in a dispute, or to a successor if the business is sold.</p>
        </>
      ),
    },
    {
      id: 'transfers',
      title: 'International transfers',
      body: (
        <p>
          Some providers above store or access data outside your country, including in the United States and the European Union. Where data
          leaves the European Economic Area, the United Kingdom or Serbia, we rely on adequacy decisions (including the EU–U.S. Data Privacy
          Framework where the provider is certified) or on the European Commission’s Standard Contractual Clauses, with additional safeguards
          where needed. You can ask us for a copy of the relevant safeguards.
        </p>
      ),
    },
    {
      id: 'retention',
      title: 'How long we keep it',
      body: (
        <Bullets
          items={[
            'Enquiries that do not lead to work: up to 24 months after our last contact, then deleted or anonymised.',
            'Client records: for the duration of the work and afterwards as long as tax, accounting and limitation periods require.',
            'Newsletter: until you unsubscribe or ask for deletion; unconfirmed sign-ups for 30 days.',
            'Cookie-free visit statistics: kept only in aggregated or daily-hashed form.',
            'Cookies: for the lifetimes listed in section 7, or until you delete them.',
          ]}
        />
      ),
    },
    {
      id: 'rights',
      title: 'Your rights',
      body: (
        <>
          <p>Depending on where you live, you have the right to:</p>
          <Bullets
            items={[
              'know whether we process your data and get a copy of it;',
              'have inaccurate data corrected and incomplete data completed;',
              'have your data deleted, or its use restricted;',
              'object to processing based on our legitimate interest, including any direct marketing;',
              'receive data you gave us in a portable format;',
              'withdraw consent at any time, without affecting earlier processing;',
              'not be discriminated against for using these rights.',
            ]}
          />
          <p>
            To use any of these rights, contact us at {contact}. We may ask you to confirm your identity before we act on a request, and you may
            use an authorised agent where the law allows it.
          </p>
          <p>
            <strong className="text-ink-950">Complaints.</strong> You can complain to a data protection authority: in Serbia the Commissioner
            for Information of Public Importance and Personal Data Protection (Poverenik), in the EU or UK the authority where you live or work.
            We would appreciate the chance to resolve your concern first.
          </p>
          <p>
            <strong className="text-ink-950">California and other U.S. states.</strong> Residents of California and other states with privacy
            laws have the rights above to know, delete and correct personal information and to opt out of its sale, sharing for cross-context
            behavioural advertising, or use for targeted advertising. We do not sell personal information. Advertising cookies, where used, run
            only with your consent, and you can opt out at any time with Cookie settings or a Global Privacy Control signal. We do not knowingly
            collect sensitive personal information.
          </p>
        </>
      ),
    },
    {
      id: 'security',
      title: 'Security',
      body: (
        <p>
          Data travels over encrypted connections (HTTPS), the database is accessible only to authorised staff with individual sign-in, and our
          providers apply industry-standard security. No system is completely secure; if a breach affects your data, we will inform you and the
          authorities as the law requires.
        </p>
      ),
    },
    {
      id: 'children',
      title: 'Children',
      body: <p>Our services are for businesses. We do not knowingly collect data from anyone under 16. If you believe a child has sent us data, contact us and we will delete it.</p>,
    },
    {
      id: 'changes',
      title: 'Changes to this notice',
      body: (
        <p>
          We may update this notice when our services or the law change. The date at the top shows the latest version. If a change is
          significant, we will show it on the site, and where consent is needed we will ask again.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Privacy notice"
      updated={UPDATED}
      intro={
        <p>
          This notice explains what personal data WebTano collects through webtano.com, why, and what choices and rights you have. It is
          written to meet the EU and UK GDPR, the Serbian Law on Personal Data Protection and U.S. state privacy laws such as the CCPA/CPRA.
          See also our{' '}
          <Link href="/terms" className="font-medium text-ink-950 underline underline-offset-2">
            terms of use
          </Link>
          .
        </p>
      }
      sections={sections}
    />
  );
}
