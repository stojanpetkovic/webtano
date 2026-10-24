'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Download, Globe, Inbox, LayoutDashboard, Plus, Sparkles } from 'lucide-react';

export function NavLinks({ newLeads }: { newLeads: number }) {
  const path = usePathname().replace(/\/$/, '') || '/admin';

  // Close the mobile drawer after a navigation.
  useEffect(() => {
    const toggle = document.getElementById('nav-toggle') as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
  }, [path]);

  const sections = [
    {
      title: 'Pregled',
      items: [{ href: '/admin', label: 'Kontrolna tabla', icon: LayoutDashboard, active: path === '/admin', badge: 0 }],
    },
    {
      title: 'Upravljanje',
      items: [
        { href: '/admin/leads', label: 'Lidovi', icon: Inbox, active: path.startsWith('/admin/leads') && !path.includes('export'), badge: newLeads },
        { href: '/admin/sites', label: 'Sajtovi', icon: Globe, active: path === '/admin/sites' || path.startsWith('/admin/sites/'), badge: 0 },
      ],
    },
    {
      title: 'Brze radnje',
      items: [
        { href: '/admin/leads?status=new', label: 'Neobrađeni lidovi', icon: Sparkles, active: false, badge: 0 },
        { href: '/admin/sites#novi', label: 'Dodaj sajt', icon: Plus, active: false, badge: 0 },
        { href: '/admin/leads/export.csv', label: 'Izvezi CSV', icon: Download, active: false, badge: 0 },
      ],
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
                {item.href.endsWith('.csv') ? (
                  // A file download, so a plain link rather than client navigation.
                  <a href={item.href} className="menu-link">
                    <item.icon className="size-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <Link href={item.href} className="menu-link" aria-current={item.active ? 'page' : undefined}>
                    <item.icon className="size-[18px] shrink-0" />
                    <span>{item.label}</span>
                    {item.badge > 0 && <span className="menu-badge">{item.badge}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
