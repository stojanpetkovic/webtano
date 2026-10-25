/** The WebTano mark and wordmark. `tone` follows the background it sits on. */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/webtano-mark.svg" alt="" width={30} height={30} className="size-[30px] rounded-[9px]" />
      <span className={`text-[16px] font-semibold tracking-tight ${tone === 'dark' ? 'text-white' : 'text-ink'}`}>
        WebTano
        <span className="ms-1.5 rounded-md bg-accent/15 px-1.5 py-0.5 align-middle font-mono text-[10px] font-medium tracking-wider text-accent uppercase">
          Admin
        </span>
      </span>
    </>
  );
}
