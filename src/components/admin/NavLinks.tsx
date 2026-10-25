'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { CheckSquare, FileText, FolderKanban, Globe, Inbox, KanbanSquare, LayoutDashboard, MailPlus, Settings, Wallet, Tags, Users, Zap } from 'lucide-react';

export function NavLinks({ newLeads, crmNew }: { newLeads: number; crmNew: number }) {
  const path = usePathname().replace(/\/$/, '') || '/admin';

  // Close the mobile drawer after a navigation.
  useEffect(() => {
    const toggle = document.getElementById('nav-toggle') as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
  }, [path]);

  const at = (prefix: string) => path === prefix || path.startsWith(prefix + '/');
  const sections = [
    {
      title: 'Pregled',
      items: [{ href: '/admin', label: 'Kontrolna tabla', icon: LayoutDashboard, active: path === '/admin', badge: 0 }],
    },
    {
      title: 'WebTano CRM',
      items: [
        { href: '/admin/crm/leads', label: 'Lidovi', icon: KanbanSquare, active: at('/admin/crm/leads'), badge: crmNew },
        { href: '/admin/crm/customers', label: 'Klijenti', icon: Users, active: at('/admin/crm/customers'), badge: 0 },
        { href: '/admin/crm/proposals', label: 'Ponude', icon: FileText, active: at('/admin/crm/proposals'), badge: 0 },
        { href: '/admin/crm/items', label: 'Cenovnik', icon: Tags, active: at('/admin/crm/items'), badge: 0 },
        { href: '/admin/crm/projects', label: 'Projekti', icon: FolderKanban, active: at('/admin/crm/projects'), badge: 0 },
        { href: '/admin/crm/tasks', label: 'Zadaci', icon: CheckSquare, active: at('/admin/crm/tasks'), badge: 0 },
        { href: '/admin/crm/automations', label: 'Automatizacija', icon: Zap, active: at('/admin/crm/automations'), badge: 0 },
      ],
    },
    {
      title: 'Finansije',
      items: [{ href: '/admin/finance', label: 'Prihodi i rashodi', icon: Wallet, active: at('/admin/finance'), badge: 0 }],
    },
    {
      title: 'Klijentski sajtovi',
      items: [
        { href: '/admin/sites', label: 'Sajtovi i izveštaji', icon: Globe, active: at('/admin/sites'), badge: 0 },
        { href: '/admin/leads', label: 'Lidovi sa sajtova', icon: Inbox, active: at('/admin/leads'), badge: newLeads },
      ],
    },
    {
      title: 'Marketing',
      items: [{ href: '/admin/subscribers', label: 'Pretplatnici', icon: MailPlus, active: at('/admin/subscribers'), badge: 0 }],
    },
    {
      title: 'Sistem',
      items: [{ href: '/admin/settings', label: 'Podešavanja', icon: Settings, active: at('/admin/settings'), badge: 0 }],
    },
  ];

  return (
    <nav className="flex-1 overflow-y-auto px-4 py-2" aria-label="Glavni meni">
      {sections.map((section) => (
        <div key={section.title} className="mb-3">
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
