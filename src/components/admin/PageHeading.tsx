import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

interface Crumb {
  label: string;
  href?: string;
}

/** The page title, with the trail back to the dashboard on the right. */
export function PageHeading({ title, crumbs = [] }: { title: string; crumbs?: Crumb[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:justify-between">
      <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
      <nav className="hidden items-center gap-2 text-sm font-medium text-zinc-700 md:flex" aria-label="Putanja">
        <Link href="/admin" className="hover:text-primary">
          WebTano Admin
        </Link>
        {crumbs.map((c) => (
          <Fragment key={c.label}>
            <ChevronRight className="size-3.5 text-zinc-500" />
            {c.href ? (
              <Link href={c.href} className="hover:text-primary">
                {c.label}
              </Link>
            ) : (
              <span>{c.label}</span>
            )}
          </Fragment>
        ))}
        <ChevronRight className="size-3.5 text-zinc-500" />
        <span aria-current="page" className="text-zinc-500">
          {title}
        </span>
      </nav>
    </div>
  );
}
