import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { OG_IMAGE } from '@/lib/seo';
import { translator, type Lang } from '@/lib/i18n';

/** The site's share card in one language, drawn by src/app/og.png and src/app/og-sr.png. */
export async function shareCard(lang: Lang) {
  const t = translator(lang);
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
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>{t('Websites, local SEO and Google Ads', 'Sajtovi, lokalni SEO i Google Ads')}</div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: '#01afe9' }}>{t('that bring calls.', 'koji donose pozive.')}</div>
        <div style={{ marginTop: 28, fontSize: 28, color: 'rgba(255,255,255,0.68)' }}>
          {t('For tree services and other local companies. Every call and form tracked.', 'Za firme za seču drveća i druge lokalne firme. Svaki poziv i upit se broji.')}
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.55)', letterSpacing: 1 }}>webtano.com</div>
    </div>,
    { width: OG_IMAGE.width, height: OG_IMAGE.height },
  );
}
