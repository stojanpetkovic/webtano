'use client';

import { useEffect } from 'react';
import { markLeadsSeen } from '@/app/(admin)/admin/(panel)/leads/seen';

/** Marks the leads as seen once the page is on screen. Rendered only when there is something unseen. */
export function MarkLeadsSeen() {
  useEffect(() => {
    markLeadsSeen();
  }, []);
  return null;
}
