import Link from 'next/link';
import { Bell, ExternalLink, Menu, Search } from 'lucide-react';
import { unseenLeadCount } from '@/lib/admin/seen';
import { adminEmail } from '@/lib/admin/session';
import { getAdminI18n } from '@/lib/admin/i18n';
import { Logo } from '@/components/admin/Logo';
import { NavLinks } from '@/components/admin/NavLinks';
import { ProfileMenu } from '@/components/admin/ProfileMenu';
import { LangSwitch } from '@/components/admin/LangSwitch';
import { SearchShortcut } from '@/components/admin/SearchShortcut';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const [email, { t }] = await Promise.all([adminEmail(), getAdminI18n()]);
  const initial = email.charAt(0).toUpperCase() || 'W';

  // Leads that came in since the lead list was last opened, on the bell and beside "Leads".
  const [newLeads, crmNew] = await Promise.all([unseenLeadCount('sites'), unseenLeadCount('crm')]);
  const unseen = newLeads + crmNew;

  return (
    // On desktop the menu is a full-height column that scrolls away with the page; on phones it stays a fixed drawer.
    <div className="relative">
      <input type="checkbox" id="nav-toggle" className="peer hidden" />

      <aside className="fixed inset-y-0 start-0 z-40 flex w-sidenav -translate-x-full flex-col bg-ink-975 text-white transition-transform duration-300 ease-out peer-checked:translate-x-0 lg:absolute lg:translate-x-0 print:hidden">
        {/* A faint cyan glow behind the logo, as on webtano.com. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-70"
          style={{ background: 'radial-gradient(80% 60% at 20% 0%, rgb(1 175 233 / 0.16), transparent 70%)' }}
          aria-hidden="true"
        />
        <Link href="/admin" className="relative flex h-topbar shrink-0 items-center gap-2.5 px-6">
          <Logo />
        </Link>

        <NavLinks newLeads={newLeads} crmNew={crmNew} />

        {/* Hidden on short screens, so the menu keeps room for every item. */}
        <div className="relative m-4 hidden overflow-hidden rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/[0.08] [@media(min-height:960px)]:block">
          <p className="text-[13px] font-semibold text-white">{t('Site code', 'Kod za sajtove')}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/50">
            {t('One line from the site settings captures forms and counts visits.', 'Jedna linija iz podešavanja sajta hvata forme i broji posete.')}
          </p>
          <Link href="/admin/sites" className="btn btn-sm btn-accent mt-3 w-full">
            {t('Open sites', 'Otvori sajtove')}
          </Link>
        </div>

        <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-white/[0.08] px-6 py-4">
          <span className="text-[13px] text-white/60">{t('Language', 'Jezik')}</span>
          <LangSwitch tone="dark" />
        </div>
      </aside>
      <label
        htmlFor="nav-toggle"
        className="fixed inset-0 z-30 hidden bg-ink-975/50 backdrop-blur-[2px] peer-checked:block lg:peer-checked:hidden"
        aria-hidden="true"
      />

      <div className="flex min-h-screen flex-col lg:ps-sidenav">
        <header className="sticky top-0 z-20 flex min-h-topbar items-center border-b border-line/80 bg-body/80 backdrop-blur-xl print:hidden">
          <div className="flex w-full items-center justify-between gap-3 px-4 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <label
                htmlFor="nav-toggle"
                className="btn btn-outline size-9 shrink-0 cursor-pointer p-0 lg:hidden"
                aria-label={t('Open menu', 'Otvori meni')}
              >
                <Menu className="size-[18px]" />
              </label>
              <Link href="/admin" className="flex items-center gap-2 lg:hidden" aria-label={t('Dashboard', 'Kontrolna tabla')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/webtano-mark.svg" alt="" width={28} height={28} className="size-7 rounded-lg" />
              </Link>
              <form method="get" action="/admin/leads" className="relative hidden w-full max-w-sm items-center md:flex" role="search">
                <Search className="pointer-events-none absolute start-3.5 size-4 text-zinc-400" />
                <input
                  id="admin-search"
                  type="search"
                  name="q"
                  placeholder={t('Search leads…', 'Pretraži lidove…')}
                  className="form-input ps-10 pe-14"
                  aria-label={t('Search leads by name, email or phone', 'Pretraži lidove po imenu, emailu ili telefonu')}
                />
                <kbd className="pointer-events-none absolute end-2.5 rounded-md border border-line bg-zinc-50 px-1.5 py-0.5 font-mono text-[10.5px] text-zinc-500">
                  ⌘K
                </kbd>
              </form>
            </div>

            <div className="flex items-center gap-2">
              <a href="https://webtano.com" target="_blank" rel="noopener" className="btn btn-outline hidden h-9 sm:inline-flex">
                webtano.com <ExternalLink className="size-3.5 text-zinc-400" />
              </a>
              <Link
                href={crmNew > 0 ? '/admin/crm/leads' : '/admin/leads'}
                className="btn btn-outline relative size-9 p-0"
                aria-label={`${t('New leads since you last looked', 'Novi lidovi od poslednjeg pregleda')}: ${unseen}`}
                title={`${t('New leads since you last looked', 'Novi lidovi od poslednjeg pregleda')}: ${unseen}`}
              >
                <Bell className="size-[18px]" />
                {unseen > 0 && (
                  <span className="absolute -end-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-ink-950 ring-2 ring-body">
                    {unseen > 99 ? '99+' : unseen}
                  </span>
                )}
              </Link>
              <ProfileMenu email={email} initial={initial} />
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 animate-rise lg:p-8">{children}</main>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-4 text-xs text-zinc-500 lg:px-8 print:hidden">
          <span>© {new Date().getFullYear()} WebTano</span>
          <span>{t('Leads and analytics for every site', 'Lidovi i analitika za sve sajtove')}</span>
        </footer>
      </div>
      <SearchShortcut />
    </div>
  );
}
