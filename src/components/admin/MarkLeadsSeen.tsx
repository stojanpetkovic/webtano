'use client';

import { useEffect } from 'react';
import { markLeadsSeen } from '@/app/(admin)/admin/(panel)/leads/seen';
import type { SeenScope } from '@/lib/admin/seen';

/** Marks a lead list as seen once the page is on screen. Rendered only when there is something unseen. */
export function MarkLeadsSeen({ scope }: { scope: SeenScope }) {
  useEffect(() => {
    markLeadsSeen(scope);
  }, [scope]);
  return null;
}
