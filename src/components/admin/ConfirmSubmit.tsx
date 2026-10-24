'use client';

import type { ReactNode } from 'react';

/** A submit button that asks before a step that cannot be undone. */
export function ConfirmSubmit({ message, className, children }: { message: string; className: string; children: ReactNode }) {
  return (
    <button
      className={className}
      type="submit"
      onClick={(event) => {
        if (!confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
