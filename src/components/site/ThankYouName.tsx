'use client';

import { useSyncExternalStore } from 'react';

export const NAME_KEY = 'wt_lead_name';

const noop = () => () => {};
function read() {
  try {
    return sessionStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

/** ", Dana" after "Thanks" when the form was just sent in this tab; nothing on a direct visit. */
export function ThankYouName() {
  const name = useSyncExternalStore(noop, read, () => '');
  return name ? <>, {name}</> : null;
}
