'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useT } from '@/components/i18n/LangProvider';

// Short forms sit on white; the proposal editor keeps its cards on the page grey.
const WIDTH = {
  md: 'w-[min(640px,calc(100vw-2rem))] bg-white',
  xl: 'w-[min(1100px,calc(100vw-2rem))] bg-body',
};

/**
 * A button that opens a form in a pop-up instead of a new page. The form inside is
 * rendered on the server; the pop-up closes when it is sent, and the server action
 * then redirects or refreshes as usual.
 */
export function Modal({
  label,
  title,
  description,
  size = 'md',
  buttonClassName = 'btn btn-primary',
  defaultOpen = false,
  closeHref,
  children,
}: {
  label?: ReactNode;
  title: string;
  description?: string;
  size?: keyof typeof WIDTH;
  buttonClassName?: string;
  /** Open on load, for links such as ?new=1 or ?edit=id. */
  defaultOpen?: boolean;
  /** Where to go when the pop-up is closed, to drop ?new or ?edit from the address. */
  closeHref?: string;
  children: ReactNode;
}) {
  const t = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  // After a send the server action decides where to go, so closeHref is skipped.
  const sent = useRef(false);

  useEffect(() => {
    if (defaultOpen && !dialog.current?.open) dialog.current?.showModal();
  }, [defaultOpen]);

  return (
    <>
      {label && (
        <button type="button" className={buttonClassName} onClick={() => dialog.current?.showModal()}>
          {label}
        </button>
      )}
      <dialog
        ref={dialog}
        aria-label={title}
        className={`m-auto max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl p-0 text-left shadow-pop backdrop:bg-ink-975/45 backdrop:backdrop-blur-[2px] open:flex open:flex-col ${WIDTH[size]}`}
        onClose={() => {
          if (closeHref && !sent.current) router.replace(closeHref, { scroll: false });
          sent.current = false;
        }}
        // A click on the dimmed backdrop lands on the dialog itself and closes it.
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        // Close once a valid form inside is sent; the browser checks required fields first.
        onSubmit={() => {
          sent.current = true;
          setTimeout(() => dialog.current?.close(), 0);
        }}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line bg-white px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {description && <p className="mt-0.5 text-[13px] text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="-me-1.5 grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-ink"
            aria-label={t('Close', 'Zatvori')}
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </dialog>
    </>
  );
}
