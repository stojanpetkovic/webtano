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
      <p className={`text-sm font-semibold tracking-widest uppercase ${light ? 'text-lime' : 'text-forest-700'}`}>{eyebrow}</p>
      <h2
        className={`mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl ${light ? 'text-white' : 'text-forest-950'}`}
      >
        {title}
      </h2>
      {lead && <p className={`mt-4 text-lg text-pretty ${light ? 'text-white/75' : 'text-zinc-600'}`}>{lead}</p>}
    </div>
  );
}
