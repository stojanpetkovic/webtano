'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useT } from '@/components/i18n/LangProvider';
import { CheckSquare, FileText, FolderKanban, Globe, Inbox, KanbanSquare, LayoutDashboard, MailPlus, Settings, Wallet, Tags, Users, Zap } from 'lucide-react';

export function NavLinks({ newLeads, crmNew }: { newLeads: number; crmNew: number }) {
  const t = useT();
  const path = usePathname().replace(/\/$/, '') || '/admin';

  // Close the mobile drawer after a navigation.
  useEffect(() => {
    const toggle = document.getElementById('nav-toggle') as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
  }, [path]);

  const at = (prefix: string) => path === prefix || path.startsWith(prefix + '/');
  const sections = [
    {
      title: t('Overview', 'Pregled'),
      items: [{ href: '/admin', label: t('Dashboard', 'Kontrolna tabla'), icon: LayoutDashboard, active: path === '/admin', badge: 0 }],
    },
    {
      title: 'WebTano CRM',
      items: [
        { href: '/admin/crm/leads', label: t('Leads', 'Lidovi'), icon: KanbanSquare, active: at('/admin/crm/leads'), badge: crmNew },
        { href: '/admin/crm/customers', label: t('Customers', 'Klijenti'), icon: Users, active: at('/admin/crm/customers'), badge: 0 },
        { href: '/admin/crm/proposals', label: t('Proposals', 'Ponude'), icon: FileText, active: at('/admin/crm/proposals'), badge: 0 },
        { href: '/admin/crm/items', label: t('Price list', 'Cenovnik'), icon: Tags, active: at('/admin/crm/items'), badge: 0 },
        { href: '/admin/crm/projects', label: t('Projects', 'Projekti'), icon: FolderKanban, active: at('/admin/crm/projects'), badge: 0 },
        { href: '/admin/crm/tasks', label: t('Tasks', 'Zadaci'), icon: CheckSquare, active: at('/admin/crm/tasks'), badge: 0 },
        { href: '/admin/crm/automations', label: t('Automation', 'Automatizacija'), icon: Zap, active: at('/admin/crm/automations'), badge: 0 },
      ],
    },
    {
      title: t('Finance', 'Finansije'),
      items: [{ href: '/admin/finance', label: t('Income and expenses', 'Prihodi i rashodi'), icon: Wallet, active: at('/admin/finance'), badge: 0 }],
    },
    {
      title: t('Client sites', 'Klijentski sajtovi'),
      items: [
        { href: '/admin/sites', label: t('Sites and reports', 'Sajtovi i izveštaji'), icon: Globe, active: at('/admin/sites'), badge: 0 },
        { href: '/admin/leads', label: t('Site leads', 'Lidovi sa sajtova'), icon: Inbox, active: at('/admin/leads'), badge: newLeads },
      ],
    },
    {
      title: t('Marketing', 'Marketing'),
      items: [{ href: '/admin/subscribers', label: t('Subscribers', 'Pretplatnici'), icon: MailPlus, active: at('/admin/subscribers'), badge: 0 }],
    },
    {
      title: t('System', 'Sistem'),
      items: [{ href: '/admin/settings', label: t('Settings', 'Podešavanja'), icon: Settings, active: at('/admin/settings'), badge: 0 }],
    },
  ];

  return (
    <nav className="flex-1 overflow-y-auto px-4 py-2 lg:flex-none lg:overflow-visible" aria-label={t('Main menu', 'Glavni meni')}>
      {sections.map((section) => (
        <div key={section.items[0].href} className="mb-3">
          <div className="menu-title">{section.title}</div>
          <ul className="mt-1 space-y-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="menu-link" aria-current={item.active ? 'page' : undefined}>
                  <item.icon className="size-[18px] shrink-0" />
                  <span>{item.label}</span>
                  {item.badge > 0 && <span className="menu-badge">{item.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
