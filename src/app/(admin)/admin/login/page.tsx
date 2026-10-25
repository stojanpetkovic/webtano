import type { Metadata } from 'next';
import { ChartColumn, FileText, Inbox, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/admin/Logo';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Prijava' };

// A small, illustrative dashboard for the brand panel. Made-up shapes, no real data.
const bars = [38, 52, 44, 61, 57, 72, 66, 80, 74, 91, 84, 97];

function Preview() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="absolute -inset-10 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">Lidovi, 30 dana</div>
            <div className="mt-1.5 text-3xl font-semibold tracking-tight text-white">
              186 <span className="ms-1 rounded-md bg-emerald-400/15 px-1.5 py-0.5 align-middle text-xs font-medium text-emerald-300">+24%</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {['bg-sky-400', 'bg-violet-400', 'bg-emerald-400'].map((c) => (
              <span key={c} className={`size-7 rounded-full ring-2 ring-ink-975 ${c}`} />
            ))}
          </div>
        </div>
        <div className="mt-6 flex h-28 items-end gap-1.5">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-[4px] bg-gradient-to-t from-accent/30 to-accent animate-rise"
              style={{ height: `${h}%`, animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['Posetioci', '4.812'],
            ['Pozivi', '73'],
            ['Stopa', '5,4%'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/[0.06]">
              <div className="text-[11px] text-white/40">{k}</div>
              <div className="mt-0.5 text-sm font-semibold text-white tabular-nums">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -right-6 -bottom-16 flex items-center gap-3 rounded-xl bg-white p-3 pe-4 shadow-pop ring-1 ring-zinc-900/5 animate-rise [animation-delay:500ms]">
        <span className="grid size-9 place-items-center rounded-lg bg-sky-50 text-primary">
          <Inbox className="size-4" />
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-ink">Novi lid</div>
          <div className="text-[11px] text-zinc-500">Forma za procenu · upravo</div>
        </div>
      </div>
    </div>
  );
}

const features = [
  { icon: Inbox, title: 'Lidovi sa svih sajtova', text: 'Svaka forma stiže ovde i na email klijenta.' },
  { icon: ChartColumn, title: 'Posete bez kolačića', text: 'Odakle dolaze posetioci i koliko ih postane upit.' },
  { icon: FileText, title: 'Izveštaji za klijente', text: 'Jasne brojke koje klijent razume.' },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="relative flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center gap-2.5">
          <Logo tone="light" />
        </div>

        <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-12">
          <h1 className="text-[28px] leading-tight font-semibold tracking-tight">Dobro došao nazad</h1>
          <p className="mt-2 text-[14px] text-zinc-500">Prijavi se da vidiš lidove i analitiku svih sajtova.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
          <p className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="size-4 text-emerald-500" />
            Pristup ima samo vlasnik naloga. Veza je šifrovana.
          </p>
        </div>

        <p className="text-xs text-zinc-400">© {new Date().getFullYear()} WebTano</p>
      </div>

      <div className="relative hidden overflow-hidden bg-ink-975 p-12 lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 80% 0%, rgb(1 175 233 / 0.22), transparent 70%), radial-gradient(50% 40% at 0% 100%, rgb(37 99 235 / 0.18), transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(70% 60% at 50% 40%, #000, transparent)',
          }}
        />
        <div className="relative flex flex-1 items-center">
          <Preview />
        </div>
        <ul className="relative mt-14 grid gap-5 xl:grid-cols-3">
          {features.map((f) => (
            <li key={f.title}>
              <span className="grid size-9 place-items-center rounded-lg bg-white/[0.06] text-accent ring-1 ring-white/10">
                <f.icon className="size-4" />
              </span>
              <div className="mt-3 text-[13.5px] font-semibold text-white">{f.title}</div>
              <div className="mt-1 text-xs leading-relaxed text-white/50">{f.text}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
