import { env } from '../env';

export const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const adminUrl = (path: string) => `${env.siteUrl}${path}`;

export interface Section {
  title: string;
  rows: { label: string; note?: string; href: string }[];
}

/** One plain email in the lead emails' look: a heading, an intro, sections of linked rows, a button. */
export function layout({
  heading,
  intro,
  sections = [],
  button,
  footer,
}: {
  heading: string;
  intro: string;
  sections?: Section[];
  button?: { label: string; href: string };
  footer: string;
}) {
  const blocks = sections
    .filter((s) => s.rows.length)
    .map(
      (s) => `<h2 style="margin:28px 0 8px;font-size:15px;color:#18181b">${escape(s.title)}</h2>
      <table style="width:100%;border-collapse:collapse">${s.rows
        .map(
          (r) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #e4e4e7;font-size:14px">
            <a href="${escape(r.href)}" style="color:#0369a1;text-decoration:none;font-weight:600">${escape(r.label)}</a>
            ${r.note ? `<div style="margin-top:2px;color:#71717a;font-size:13px">${escape(r.note)}</div>` : ''}
          </td></tr>`,
        )
        .join('')}</table>`,
    )
    .join('');
  const html = `<!doctype html><html><body style="margin:0;background:#f4f6f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">
    <div style="background:#fff;border-radius:16px;padding:28px;border:1px solid #e4e4e7">
      <h1 style="margin:0;font-size:20px;color:#18181b">${escape(heading)}</h1>
      <p style="margin:10px 0 0;color:#3f3f46;font-size:14px;line-height:1.55">${escape(intro)}</p>
      ${blocks}
      ${button ? `<p style="margin:28px 0 0"><a href="${escape(button.href)}" style="display:inline-block;background:#18181b;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:10px">${escape(button.label)}</a></p>` : ''}
    </div>
    <p style="margin:16px 0 0;text-align:center;color:#a1a1aa;font-size:12px">${escape(footer)}</p>
  </div></body></html>`;
  const text = [
    heading,
    '',
    intro,
    ...sections
      .filter((s) => s.rows.length)
      .flatMap((s) => ['', s.title, ...s.rows.map((r) => `- ${r.label}${r.note ? ` (${r.note})` : ''}: ${r.href}`)]),
    ...(button ? ['', `${button.label}: ${button.href}`] : []),
    '',
    footer,
  ].join('\n');
  return { html, text };
}

export const OWNER_FOOTER = 'Automatski email iz WebTano admina. Podešavanja: Automatizacija.';
