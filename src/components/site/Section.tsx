export function SectionHeading({
  eyebrow,
  title,
  lead,
  light = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] uppercase ring-1 ${
          light ? 'bg-white/[0.04] text-lime ring-white/12' : 'bg-white text-forest-700 shadow-soft ring-zinc-200'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-lime' : 'bg-forest-600'}`} aria-hidden />
        {eyebrow}
      </p>
      <h2
        className={`mt-4 font-display text-3xl font-bold tracking-tight text-balance md:text-[2.75rem] md:leading-[1.08] ${light ? 'text-white' : 'text-forest-950'}`}
      >
        {title}
      </h2>
      {lead && <p className={`mt-4 text-lg text-pretty ${light ? 'text-white/75' : 'text-zinc-600'}`}>{lead}</p>}
    </div>
  );
}
