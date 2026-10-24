'use client';

import { useEffect } from 'react';

// ⌘K / Ctrl+K or "/" jumps to the lead search, as in the Tailwick topbar.
export function SearchShortcut() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const search = document.getElementById('admin-search') as HTMLInputElement | null;
      if (!search) return;
      const typing = (event.target as HTMLElement)?.closest('input, textarea, select, [contenteditable]');
      if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !typing)) {
        event.preventDefault();
        search.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return null;
}
