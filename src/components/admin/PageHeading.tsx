import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

interface Crumb {
  label: string;
  href?: string;
}

/** The trail back to the dashboard, the page title and its description, with room for actions on the right. */
export function PageHeading({
  title,
  crumbs = [],
  description,
  children,
}: {
  title: string;
  crumbs?: Crumb[];
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-500" aria-label="Putanja">
          <Link href="/admin" className="transition hover:text-ink">
            Admin
          </Link>
          {crumbs.map((c) => (
            <Fragment key={c.label}>
              <ChevronRight className="size-3 text-zinc-400" />
              {c.href ? (
                <Link href={c.href} className="transition hover:text-ink">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
            </Fragment>
          ))}
          <ChevronRight className="size-3 text-zinc-400" />
          <span aria-current="page" className="max-w-[40ch] truncate text-zinc-700">
            {title}
          </span>
        </nav>
        <h1 className="mt-2 truncate text-[22px] leading-tight font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-[13.5px] text-zinc-500">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
