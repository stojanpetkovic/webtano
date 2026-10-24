import Link from 'next/link';
import { AlignLeft, Bell, LogOut, Search } from 'lucide-react';
import { db } from '@/lib/admin/supabase';
import { adminEmail } from '@/lib/admin/session';
import { Logo } from '@/components/admin/Logo';
import { NavLinks } from '@/components/admin/NavLinks';
import { SearchShortcut } from '@/components/admin/SearchShortcut';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const email = await adminEmail();
  const initial = email.charAt(0).toUpperCase() || 'W';

  // Unhandled leads, shown as a count beside "Lidovi" in the menu.
  const { count } = await db()
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new')
    .eq('is_spam', false);
  const newLeads = count ?? 0;

  return (
    <>
      <input type="checkbox" id="nav-toggle" className="peer hidden" />

      <aside className="fixed inset-y-0 start-0 z-40 flex w-sidenav -translate-x-full flex-col border-e border-zinc-900/10 bg-white transition-transform duration-300 peer-checked:translate-x-0 lg:translate-x-0 print:hidden">
        <Link href="/admin" className="flex h-topbar shrink-0 items-center gap-2.5 px-6">
          <Logo />
        </Link>

        <NavLinks newLeads={newLeads} />

        <div className="m-3 rounded bg-primary/10 p-4">
          <p className="text-sm font-semibold text-zinc-800">Kod za sajtove</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600">Jedna linija iz podešavanja sajta hvata forme i broji posete.</p>
          <Link href="/admin/sites" className="btn btn-sm btn-primary mt-3 w-full">
            Sajtovi
          </Link>
        </div>
      </aside>
      <label htmlFor="nav-toggle" className="fixed inset-0 z-30 hidden bg-zinc-900/40 peer-checked:block lg:peer-checked:hidden" aria-hidden="true" />

      <div className="flex min-h-screen flex-col lg:ps-sidenav">
        <header className="sticky top-0 z-20 flex min-h-topbar items-center border-b border-zinc-200 bg-white print:hidden">
          <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
            <div className="flex items-center gap-5">
              <label htmlFor="nav-toggle" className="btn size-9 cursor-pointer bg-zinc-400/10 p-0 hover:bg-zinc-100 lg:hidden" aria-label="Otvori meni">
                <AlignLeft className="size-5" />
              </label>
              <form method="get" action="/admin/leads" className="relative hidden items-center lg:flex" role="search">
                <Search className="pointer-events-none absolute start-3 size-4 text-zinc-500" />
                <input
                  id="admin-search"
                  type="search"
                  name="q"
                  placeholder="Pretraži lidove…"
                  className="form-input w-64 border-transparent bg-zinc-100 ps-10 pe-12 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20"
                  aria-label="Pretraži lidove po imenu, emailu ili telefonu"
                />
                <kbd className="pointer-events-none absolute end-3 text-xs font-medium text-zinc-500">⌘ K</kbd>
              </form>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/leads?status=new" className="btn relative size-9 rounded-full p-0 hover:bg-zinc-100" aria-label={`Novi lidovi: ${newLeads}`}>
                <Bell className="size-5 text-zinc-600" />
                {newLeads > 0 && <span className="absolute end-2 top-2 size-2 rounded-full bg-danger ring-2 ring-white" />}
              </Link>
              <div className="flex items-center gap-2.5 border-s border-zinc-200 ps-3">
                <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">{initial}</span>
                <div className="hidden leading-tight sm:block">
                  <div className="text-sm font-semibold text-zinc-800">WebTano</div>
                  <div className="text-xs text-zinc-500">{email}</div>
                </div>
                <form method="post" action="/admin/logout">
                  <button className="btn size-9 rounded-full p-0 text-zinc-600 hover:bg-zinc-100 hover:text-danger" type="submit" aria-label="Odjava" title="Odjava">
                    <LogOut className="size-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-5 p-4 lg:p-6">{children}</main>

        <footer className="flex h-14 items-center justify-between border-t border-zinc-200 px-6 text-xs text-zinc-500 print:hidden">
          <span>© {new Date().getFullYear()} WebTano</span>
          <span>Lidovi i analitika za sve sajtove</span>
        </footer>
      </div>
      <SearchShortcut />
    </>
  );
}
