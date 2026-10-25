// A tiny trend line drawn in SVG on the server: no JavaScript, prints fine.
export function Sparkline({ data, color = '#01afe9', className = '' }: { data: number[]; color?: string; className?: string }) {
  if (data.length < 2) return null;
  const W = 120;
  const H = 36;
  const max = Math.max(1, ...data);
  const step = W / (data.length - 1);
  const pts = data.map((v, i) => [i * step, H - 2 - (v / max) * (H - 6)] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const id = `spark-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
