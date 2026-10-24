import type { Metadata } from 'next';
import { ChartColumn, FileText, Inbox } from 'lucide-react';
import { Logo } from '@/components/admin/Logo';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Prijava' };

const background =
  'radial-gradient(circle at 15% 20%, #c7d2fe 0, transparent 40%), radial-gradient(circle at 85% 15%, #fbcfe8 0, transparent 38%), radial-gradient(circle at 80% 85%, #bae6fd 0, transparent 40%), radial-gradient(circle at 20% 85%, #ddd6fe 0, transparent 40%), #f4f4f5';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background }}>
      <div className="w-full max-w-4xl rounded-[0.3rem] bg-white/60 p-3 shadow-sm backdrop-blur-xl">
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
            <div className="mb-8 text-center">
              <h1 className="text-lg font-semibold text-primary">Dobro došao nazad!</h1>
              <p className="mt-2 text-sm text-zinc-600">Prijavi se u WebTano Admin.</p>
            </div>
            <LoginForm />
            <p className="mt-8 text-center text-xs text-zinc-500">Pristup ima samo vlasnik naloga.</p>
          </div>

          <div className="hidden flex-col justify-between rounded-[0.3rem] bg-white/70 p-8 lg:flex">
            <div className="flex items-center gap-2.5">
              <Logo />
            </div>
            <ul className="my-10 space-y-5">
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded bg-success/15 text-success">
                  <Inbox className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-zinc-800">Lidovi sa svih sajtova</span>
                  <span className="text-xs text-zinc-600">Svaka forma stiže ovde i na email klijentu.</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded bg-info/15 text-info">
                  <ChartColumn className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-zinc-800">Posete bez kolačića</span>
                  <span className="text-xs text-zinc-600">Odakle dolaze posetioci i koliko ih postane upit.</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded bg-secondary/15 text-secondary">
                  <FileText className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-zinc-800">Izveštaji za klijente</span>
                  <span className="text-xs text-zinc-600">Jasne brojke koje klijent razume.</span>
                </span>
              </li>
            </ul>
            <p className="text-xs text-zinc-500">© {new Date().getFullYear()} WebTano</p>
          </div>
        </div>
      </div>
    </div>
  );
}
