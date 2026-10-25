import { env } from '../env';
import { CYAN, INK, button, buttons, escape, kicker, shell } from '../mail';

export { escape };

export const adminUrl = (path: string) => `${env.siteUrl}${path}`;

export interface Section {
  title: string;
  rows: { label: string; note?: string; href: string }[];
}

/** An email to Stojan in the shared WebTano frame: a heading, an intro, sections of linked rows, a button. */
export function layout({
  eyebrow = 'WebTano admin',
  heading,
  intro,
  sections = [],
  button: action,
  footer,
}: {
  eyebrow?: string;
  heading: string;
  intro: string;
  sections?: Section[];
  button?: { label: string; href: string };
  footer: string;
}) {
  const blocks = sections
    .filter((s) => s.rows.length)
    .map(
      (s) => `<div style="margin:28px 0 0">${kicker(`${s.title} · ${s.rows.length}`)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0 0;border-collapse:separate;border:1px solid #e7e9ee;border-radius:12px">${s.rows
        .map(
          (r, i) => `<tr><td style="${i ? 'border-top:1px solid #e7e9ee;' : ''}padding:13px 16px">
            <a href="${escape(r.href)}" style="display:block;text-decoration:none">
              <span style="display:block;font-size:15px;line-height:21px;font-weight:600;color:${INK}">${escape(r.label)} <span style="color:${CYAN}">&rsaquo;</span></span>
              ${r.note ? `<span style="display:block;margin-top:3px;font-size:13px;line-height:19px;color:#6b7280">${escape(r.note)}</span>` : ''}
            </a>
          </td></tr>`,
        )
        .join('')}</table></div>`,
    )
    .join('');
  const html = shell({
    eyebrow,
    heading,
    intro,
    body: `${blocks}${action ? `<div style="margin:28px 0 0">${buttons([button(action.label, action.href)])}</div>` : ''}`,
    footer,
    preheader: intro,
  });
  const text = [
    heading,
    '',
    intro,
    ...sections
      .filter((s) => s.rows.length)
      .flatMap((s) => ['', s.title, ...s.rows.map((r) => `- ${r.label}${r.note ? ` (${r.note})` : ''}: ${r.href}`)]),
    ...(action ? ['', `${action.label}: ${action.href}`] : []),
    '',
    footer,
  ].join('\n');
  return { html, text };
}

export const OWNER_FOOTER = 'Automatski email iz WebTano admina. Podešavanja: Automatizacija.';
