import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { OG_IMAGE } from '@/lib/seo';

// Drawn once at build time and served as a plain file.
export const dynamic = 'force-static';

/** The share card for every page without its own image (home, pricing, work, privacy). */
export async function GET() {
  const mark = `data:image/png;base64,${(await readFile(join(process.cwd(), 'public/brand/webtano-mark-512.png'))).toString('base64')}`;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: 'radial-gradient(120% 90% at 85% 0%, rgba(1,175,233,0.28), transparent 55%), #05060a',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain img tags only. */}
        <img src={mark} width={76} height={76} alt="" style={{ borderRadius: 20 }} />
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>WebTano</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>Websites, local SEO and Google Ads</div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: '#01afe9' }}>that bring calls.</div>
        <div style={{ marginTop: 28, fontSize: 28, color: 'rgba(255,255,255,0.68)' }}>
          For tree services and other local companies. Every call and form tracked.
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.55)', letterSpacing: 1 }}>webtano.com</div>
    </div>,
    { width: OG_IMAGE.width, height: OG_IMAGE.height },
  );
}
