'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Inbox, MonitorDot } from 'lucide-react';

export function NavLinks({ newLeads }: { newLeads: number }) {
  const path = usePathname().replace(/\/$/, '') || '/admin';
  const sections = [
    {
      title: 'Pregled',
      items: [{ href: '/admin', label: 'Kontrolna tabla', icon: MonitorDot, active: path === '/admin', badge: 0 }],
    },
    {
      title: 'Upravljanje',
      items: [
        { href: '/admin/leads', label: 'Lidovi', icon: Inbox, active: path.startsWith('/admin/leads'), badge: newLeads },
        { href: '/admin/sites', label: 'Sajtovi', icon: Globe, active: path.startsWith('/admin/sites'), badge: 0 },
      ],
    },
  ];

  return (
    <nav className="flex-1 overflow-y-auto p-3" aria-label="Glavni meni">
      {sections.map((section) => (
        <div key={section.title} className="mb-1">
          <div className="menu-title">{section.title}</div>
          <ul className="mt-1 space-y-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="menu-link" aria-current={item.active ? 'page' : undefined}>
                  <item.icon className="size-[18px]" />
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
