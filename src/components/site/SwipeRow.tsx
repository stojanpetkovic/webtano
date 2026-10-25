import type { ElementType, ReactNode } from 'react';

/**
 * A row of cards. It used to swipe sideways on phones; now cards stack one under
 * the other everywhere below md, and from md up the grid passed in className applies.
 */
export function SwipeRow({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; label?: string; as?: ElementType }) {
  return <Tag className={className}>{children}</Tag>;
}
