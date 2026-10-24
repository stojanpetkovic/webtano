import Image from 'next/image';

/** The WebTano mark and wordmark, drawn as one SVG so it looks the same everywhere. */
export function Logo({ light = false, className = 'h-8 w-auto' }: { light?: boolean; className?: string }) {
  return (
    <Image
      src={light ? '/brand/webtano-logo-light.svg' : '/brand/webtano-logo-dark.svg'}
      alt="WebTano"
      width={184}
      height={48}
      unoptimized
      priority
      className={className}
    />
  );
}
