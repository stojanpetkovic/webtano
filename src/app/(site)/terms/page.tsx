import type { Metadata } from 'next';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/seo';
import { appSettings } from '@/lib/admin/settings';
import { Bullets, LegalPage, type LegalSection } from '@/components/site/Legal';

export const metadata: Metadata = {
  title: 'Terms of use',
  description:
    'The terms for using webtano.com and the free website check: no guarantee of results, how case studies should be read, intellectual property, limits of liability and governing law.',
  alternates: { canonical: '/terms' },
  openGraph: { url: '/terms', images: [OG_IMAGE] },
};

const UPDATED = '25 October 2026';

export default async function TermsPage() {
  const { company } = await appSettings();
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

  const sections: LegalSection[] = [
    {
      id: 'scope',
      title: 'About these terms',
      body: (
        <>
          <p>
            These terms apply to your use of webtano.com and everything on it, including the free website check, the demo report, the blog and
            the case studies (together, the “site”). The site is operated by WebTano (“WebTano”, “we”, “us”). By using the site you accept these
            terms. If you do not agree, please do not use it.
          </p>
          <p>
            Paid services are provided only under a separate written proposal or agreement that both sides accept. If that agreement differs
            from these terms, the agreement prevails.
          </p>
        </>
      ),
    },
    {
      id: 'information',
      title: 'Information only, not an offer',
      body: (
        <p>
          The site describes our services in general terms. Prices, packages and timelines shown are indicative, may change without notice and
          become binding only in an accepted proposal. Nothing on the site is a binding offer, and blog articles and checklists are general
          information, not professional, legal, tax or financial advice for your particular situation.
        </p>
      ),
    },
    {
      id: 'check',
      title: 'The free website check',
      body: (
        <Bullets
          items={[
            'The check is free and creates no obligation for you or for us. We may decline a request, for example when a business falls outside what we work with.',
            'It is an expert opinion based on what is publicly visible about your website, Google Business Profile and ads at the time of the check. It is not an audit of your systems and may not find every issue.',
            'Any estimates of lost calls, leads or revenue are illustrations based on assumptions and averages, not forecasts or promises.',
            'You confirm that the details you send are accurate and that you are allowed to share them, including any website or business you name.',
          ]}
        />
      ),
    },
    {
      id: 'results',
      title: 'No guarantee of results',
      body: (
        <>
          <p>
            Search rankings, ad performance, calls and sales depend on many factors outside our control, including search engine and ad
            platform algorithms and policies, competition, your market, your prices, how quickly you answer enquiries and your reviews.
            Therefore we do not guarantee any specific ranking, traffic, number of leads, cost per lead or revenue, unless a signed agreement
            expressly says so.
          </p>
          <p>
            Google, Google Ads, Google Business Profile, Meta, Facebook and Instagram are trademarks of their owners. We are not affiliated with,
            endorsed by or acting for them, and we cannot control their decisions, such as suspensions, ad disapprovals or ranking changes.
          </p>
        </>
      ),
    },
    {
      id: 'case-studies',
      title: 'Case studies, figures and examples',
      body: (
        <p>
          Case studies show results achieved for specific clients in specific markets and periods. Past results do not predict or guarantee
          future results, and your results may be lower or higher. Figures are rounded and measured with the tools described on the site.
          Dashboards, reports and screenshots marked as a demo or example use sample data. Client names and logos are shown with permission and
          remain the property of their owners.
        </p>
      ),
    },
    {
      id: 'use',
      title: 'Acceptable use',
      body: (
        <>
          <p>You agree not to:</p>
          <Bullets
            items={[
              'send false, misleading or someone else’s details through our forms, or use them to send spam or advertising;',
              'try to break into, overload, scan or disrupt the site, or get around its security;',
              'scrape, copy or reuse substantial parts of the site, by automated means or otherwise, without our written permission;',
              'use the site in any way that breaks the law or the rights of others.',
            ]}
          />
          <p>We may block access to anyone who breaks these rules.</p>
        </>
      ),
    },
    {
      id: 'ip',
      title: 'Intellectual property',
      body: (
        <p>
          The site, including its text, design, code, graphics, the WebTano name and logo, reports and the demo, belongs to WebTano or its
          licensors and is protected by copyright and trademark law. You may view and print pages for your own, non-commercial use and share
          links to them. Any other use, including copying, adapting or republishing, needs our prior written permission. Ownership of work we
          deliver to clients is set out in their agreement.
        </p>
      ),
    },
    {
      id: 'links',
      title: 'Links to other websites',
      body: (
        <p>
          The site links to client websites and third-party services. We do not control them and are not responsible for their content,
          availability or privacy practices. A link does not mean we endorse a site.
        </p>
      ),
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      body: (
        <p>
          We take care to keep the site accurate and available, but it is provided “as is” and “as available”. To the extent the law allows, we
          make no warranties of any kind, express or implied, including that the site or its content is accurate, complete, current,
          uninterrupted, free of errors or viruses, or fit for a particular purpose.
        </p>
      ),
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      body: (
        <>
          <p>
            To the extent the law allows, WebTano is not liable for any indirect, incidental, special or consequential loss, or for loss of
            profit, revenue, business, goodwill or data, arising from your use of the site, from relying on its content or from being unable to
            use it, even if we were told such loss was possible. Our total liability arising from the site, which is free to use, is limited to
            100 U.S. dollars.
          </p>
          <p>
            Nothing in these terms limits liability that cannot be limited by law, such as liability for intent, gross negligence, or death or
            personal injury caused by negligence, or your statutory rights as a consumer.
          </p>
        </>
      ),
    },
    {
      id: 'indemnity',
      title: 'Indemnity',
      body: (
        <p>
          If you break these terms or the law when using the site, you agree to cover the reasonable costs, losses and claims that this causes
          us, including reasonable legal fees, to the extent the law allows.
        </p>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy',
      body: (
        <p>
          How we handle personal data is described in our{' '}
          <Link href="/privacy" className="font-medium text-ink-950 underline underline-offset-2">
            privacy notice
          </Link>
          , which forms part of these terms.
        </p>
      ),
    },
    {
      id: 'law',
      title: 'Governing law and disputes',
      body: (
        <p>
          These terms are governed by the laws of the Republic of Serbia, without regard to conflict-of-law rules. We will first try to resolve
          any dispute amicably; otherwise the competent court in Belgrade has jurisdiction. If you are a consumer, you keep the protection of the
          mandatory laws of the country where you live and may bring proceedings there.
        </p>
      ),
    },
    {
      id: 'general',
      title: 'Changes and general terms',
      body: (
        <>
          <p>
            We may change the site or these terms at any time. The date at the top shows the current version, and changes apply from the moment
            they are published. If any part of these terms is found invalid, the rest stays in force. Our failure to enforce a right does not
            waive it. You may not transfer your rights under these terms without our consent.
          </p>
          <p>Questions about these terms: {contact}.</p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      title="Terms of use"
      updated={UPDATED}
      intro={<p>Please read these terms before using webtano.com or asking for a free website check. They are short, and they are written to be clear.</p>}
      sections={sections}
    />
  );
}
