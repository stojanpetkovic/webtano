import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: 'How WebTano handles the details you send through this website.',
  alternates: { canonical: '/privacy' },
};

const items = [
  { title: 'Who', text: 'WebTano, webtano.com. You can reach us through the form on this website.' },
  {
    title: 'What we collect',
    text: 'The details you enter in the website check form: name, email, phone, website, business, your answers and your message. We also count page views and taps on contact links without cookies, using an anonymous, daily-changing visitor code.',
  },
  { title: 'Why', text: 'Only to reply to your request and prepare a proposal. No newsletters, and your data is never sold or shared for marketing.' },
  { title: 'Where', text: 'With the hosting, email and database providers that run this website, under data-processing agreements.' },
  { title: 'How long', text: 'As long as needed to handle your request, and no longer than two years without further contact.' },
  {
    title: 'Your rights',
    text: 'You can ask to see, correct or delete your data, or withdraw consent, at any time. You can also complain to your data protection authority.',
  },
];

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-forest-950">Privacy notice</h1>
        <dl className="mt-10 space-y-8">
          {items.map((i) => (
            <div key={i.title}>
              <dt className="font-display text-xl font-bold text-forest-950">{i.title}</dt>
              <dd className="mt-2 text-lg leading-relaxed text-zinc-700">{i.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
