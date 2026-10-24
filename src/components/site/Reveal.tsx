import type { ElementType, ReactNode } from 'react';

/**
 * Fades its content up when it scrolls into view. RevealObserver in the layout
 * does the watching; this only marks the element, so it stays a server component.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  variant = 'up',
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: 'up' | 'fade' | 'scale';
  className?: string;
}) {
  return (
    <Tag
      data-reveal={variant === 'up' ? '' : variant}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
