export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime font-display text-lg font-extrabold text-forest-950">
        W
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-forest-950'}`}>WebTano</span>
    </span>
  );
}
