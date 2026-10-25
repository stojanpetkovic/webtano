import { env } from './env';

// The shared frame of every email the system sends. Built from tables and
// inline styles, because that is all Gmail and Outlook reliably render.

export const INK = '#0b0d14';
export const CYAN = '#01afe9';
const MUTED = '#6b7280';
const LINE = '#e7e9ee';

export const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** A solid button that survives Outlook. `ghost` is the outlined secondary style. */
export function button(label: string, href: string, ghost = false) {
  const style = ghost
    ? `background:#ffffff;color:${INK};border:1px solid #d4d7de`
    : `background:${INK};color:#ffffff;border:1px solid ${INK}`;
  return `<a href="${escape(href)}" style="display:inline-block;${style};text-decoration:none;font-weight:600;font-size:14px;line-height:20px;padding:11px 20px;border-radius:10px;font-family:${FONT}">${escape(label)}</a>`;
}

/** A row of buttons with a gap, as table cells so the gap holds everywhere. */
export function buttons(items: string[]) {
  if (!items.length) return '';
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>${items
    .map((b, i) => `<td style="padding:${i ? '0 0 8px 8px' : '0 0 8px 0'}">${b}</td>`)
    .join('')}</tr></table>`;
}

/** A small uppercase label above a block. */
export const kicker = (text: string, color = MUTED) =>
  `<div style="font-size:11px;line-height:16px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${color}">${escape(text)}</div>`;

/** Label and value pairs as a two column table with hairlines. */
export function facts(rows: { label: string; value: string; href?: string }[]) {
  if (!rows.length) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows
    .map((r, i) => {
      const value = r.href
        ? `<a href="${escape(r.href)}" style="color:${INK};text-decoration:underline;text-decoration-color:${CYAN}">${escape(r.value)}</a>`
        : escape(r.value);
      const border = i ? `border-top:1px solid ${LINE};` : '';
      return `<tr>
        <td valign="top" style="${border}padding:11px 12px 11px 0;width:34%;font-size:13px;line-height:19px;color:${MUTED}">${escape(r.label)}</td>
        <td valign="top" style="${border}padding:11px 0;font-size:14px;line-height:20px;color:${INK};white-space:pre-wrap;word-break:break-word">${value}</td>
      </tr>`;
    })
    .join('')}</table>`;
}

/** A light panel that holds a block of content inside the card. */
export const panel = (inner: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;background:#f7f8fa;border:1px solid ${LINE};border-radius:12px"><tr><td style="padding:16px 18px">${inner}</td></tr></table>`;

/**
 * The page: a dark WebTano bar, a white card with the eyebrow, heading and intro, the body, and a footer.
 * `preheader` is the grey preview line inboxes show next to the subject.
 */
export function shell({
  eyebrow,
  heading,
  intro,
  body,
  footer,
  preheader,
  unsubscribe,
  lang = 'sr',
}: {
  lang?: 'sr' | 'en';
  /** Adds an unsubscribe link to the footer, for newsletter emails. */
  unsubscribe?: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  body: string;
  footer: string;
  preheader?: string;
}) {
  const logo = `${env.siteUrl}/brand/webtano-logo-light.png`;
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escape(heading)}</title></head>
<body style="margin:0;padding:0;background:#eef0f4;font-family:${FONT};-webkit-font-smoothing:antialiased">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escape(preheader)}&#8203;&#847;&#8203;&#847;&#8203;&#847;&#8203;&#847;</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#eef0f4">
<tr><td align="center" style="padding:28px 12px 36px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:separate">
    <tr><td style="background:${INK};border-radius:16px 16px 0 0;padding:20px 28px;border-bottom:3px solid ${CYAN}">
      <a href="https://webtano.com" style="text-decoration:none"><img src="${logo}" width="107" height="28" alt="WebTano" style="display:block;border:0;height:28px;width:107px;color:#ffffff;font-size:18px;font-weight:700"></a>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:0 0 16px 16px;padding:30px 28px 32px;box-shadow:0 1px 2px rgba(11,13,20,.06)">
      ${eyebrow ? `<div style="margin:0 0 10px">${kicker(eyebrow, CYAN)}</div>` : ''}
      <h1 style="margin:0;font-size:24px;line-height:31px;font-weight:700;letter-spacing:-.01em;color:${INK}">${escape(heading)}</h1>
      ${intro ? `<p style="margin:10px 0 0;font-size:15px;line-height:23px;color:#4b5263">${escape(intro)}</p>` : ''}
      ${body}
    </td></tr>
    <tr><td align="center" style="padding:20px 24px 0;font-size:12px;line-height:18px;color:#9aa0ab">
      ${escape(footer)}<br>${unsubscribe ? `<a href="${escape(unsubscribe)}" style="color:#9aa0ab;text-decoration:underline">Unsubscribe</a> · ` : ''}<a href="https://webtano.com" style="color:#9aa0ab;text-decoration:underline">webtano.com</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}
