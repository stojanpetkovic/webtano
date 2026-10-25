import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { AppSettings } from '../settings';
import { invoiceNumber, invoiceTotals } from './labels';
import type { Invoice, InvoiceItem } from './types';

/*
 * The invoice as a real PDF file, drawn with pdf-lib: the same file is
 * downloaded from the admin and attached to the email. Geist is embedded so
 * names such as Čalić print correctly. In English, for US clients.
 */

const hex = (h: string) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const INK = hex('#0b0d14');
const BODY = hex('#3f4451');
const MUTED = hex('#6b7280');
const LINE = hex('#e7e9ee');
const PANEL = hex('#f6f7f9');
const CYAN = hex('#01afe9');
const WHITE = rgb(1, 1, 1);

const W = 595.28;
const H = 841.89;
const M = 48;

let assets: Promise<{ regular: Uint8Array; medium: Uint8Array; bold: Uint8Array; logo: Uint8Array | null }> | null = null;
function loadAssets() {
  assets ??= (async () => {
    const dir = path.join(process.cwd(), 'assets', 'fonts');
    const [regular, medium, bold, logo] = await Promise.all([
      readFile(path.join(dir, 'Geist-Regular.ttf')),
      readFile(path.join(dir, 'Geist-Medium.ttf')),
      readFile(path.join(dir, 'Geist-SemiBold.ttf')),
      readFile(path.join(process.cwd(), 'public', 'brand', 'webtano-logo-dark.png')).catch(() => null),
    ]);
    return { regular, medium, bold, logo };
  })();
  return assets;
}

const date = (d: string | null) =>
  d ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}T00:00:00Z`)) : '—';

/** Splits text into lines that fit the width, keeping the author's own line breaks. */
function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  for (const para of text.split(/\r?\n/)) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width) line = next;
      else {
        if (line) out.push(line);
        // A single word longer than the line is cut where it no longer fits.
        let rest = word;
        while (font.widthOfTextAtSize(rest, size) > width) {
          let cut = rest.length - 1;
          while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut--;
          out.push(rest.slice(0, cut));
          rest = rest.slice(cut);
        }
        line = rest;
      }
    }
    out.push(line);
  }
  return out;
}

export async function invoicePdf(invoice: Invoice, items: InvoiceItem[], settings: AppSettings): Promise<Uint8Array> {
  const a = await loadAssets();
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(a.regular, { subset: true });
  const medium = await doc.embedFont(a.medium, { subset: true });
  const bold = await doc.embedFont(a.bold, { subset: true });
  const logo = a.logo ? await doc.embedPng(a.logo) : null;

  const company = settings.company;
  const number = invoiceNumber(settings.invoices.prefix, invoice.number);
  const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || 'USD' }).format(n);
  const totals = invoiceTotals(items, invoice.discount_pct, invoice.tax_pct);
  doc.setTitle(`Invoice ${number}`);
  doc.setAuthor(company.name || 'WebTano');
  doc.setCreator('WebTano');

  const pages: PDFPage[] = [];
  let page = doc.addPage([W, H]);
  pages.push(page);
  let y = H - M;

  const text = (p: PDFPage, s: string, x: number, yy: number, size: number, font: PDFFont = regular, color = BODY) =>
    p.drawText(s, { x, y: yy, size, font, color });
  const right = (p: PDFPage, s: string, xRight: number, yy: number, size: number, font: PDFFont = regular, color = BODY) =>
    p.drawText(s, { x: xRight - font.widthOfTextAtSize(s, size), y: yy, size, font, color });

  // Header: logo on the left, the word INVOICE and its number on the right.
  if (logo) {
    const h = 26;
    const w = (logo.width / logo.height) * h;
    page.drawImage(logo, { x: M, y: y - h, width: w, height: h });
  } else text(page, company.name || 'WebTano', M, y - 20, 20, bold, INK);
  right(page, 'INVOICE', W - M, y - 22, 24, bold, INK);
  right(page, number, W - M, y - 40, 11, medium, MUTED);
  if (invoice.status === 'paid' || invoice.status === 'void') {
    const label = invoice.status === 'paid' ? 'PAID' : 'VOID';
    const lw = bold.widthOfTextAtSize(label, 9) + 18;
    page.drawRectangle({ x: W - M - lw, y: y - 66, width: lw, height: 17, color: invoice.status === 'paid' ? CYAN : MUTED, opacity: 1 });
    text(page, label, W - M - lw + 9, y - 61, 9, bold, WHITE);
  }
  y -= 92;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 2, color: CYAN });
  y -= 28;

  // Dates and the amount due.
  const meta = [
    ['Issue date', date(invoice.issue_date)],
    ['Due date', date(invoice.due_date)],
    [invoice.status === 'paid' ? 'Paid on' : 'Amount due', invoice.status === 'paid' ? date(invoice.paid_at) : money(totals.total)],
  ];
  const colW = (W - 2 * M) / 3;
  meta.forEach(([label, value], i) => {
    text(page, label.toUpperCase(), M + i * colW, y, 7.5, medium, MUTED);
    text(page, value, M + i * colW, y - 17, i === 2 ? 15 : 11.5, i === 2 ? bold : medium, INK);
  });
  y -= 52;

  // From and Bill to. The legal name, address and tax numbers belong on an invoice.
  const from = [
    company.legal_name || company.name || 'WebTano',
    ...(company.address ? company.address.split(/\r?\n/) : []),
    company.tax_id ? `Tax ID: ${company.tax_id}` : '',
    company.reg_no ? `Reg. no.: ${company.reg_no}` : '',
    company.email,
    company.website,
  ].filter(Boolean) as string[];
  const b = invoice.bill_to ?? {};
  const to = [b.company || b.name || 'Customer', b.company && b.name ? b.name : '', ...(b.address ? b.address.split(/\r?\n/) : []), [b.city, b.country].filter(Boolean).join(', '), b.email].filter(
    Boolean,
  ) as string[];
  const half = (W - 2 * M) / 2;
  text(page, 'FROM', M, y, 7.5, medium, MUTED);
  text(page, 'BILL TO', M + half, y, 7.5, medium, MUTED);
  let yl = y - 16;
  from.forEach((l, i) => {
    for (const part of wrap(l, i ? regular : bold, i ? 9.5 : 10.5, half - 20)) {
      text(page, part, M, yl, i ? 9.5 : 10.5, i ? regular : bold, i ? BODY : INK);
      yl -= 14;
    }
  });
  let yr = y - 16;
  to.forEach((l, i) => {
    for (const part of wrap(l, i ? regular : bold, i ? 9.5 : 10.5, half - 10)) {
      text(page, part, M + half, yr, i ? 9.5 : 10.5, i ? regular : bold, i ? BODY : INK);
      yr -= 14;
    }
  });
  y = Math.min(yl, yr) - 22;

  // Items table.
  const cols = { desc: M + 12, qty: W - M - 190, unit: W - M - 92, amount: W - M - 12 };
  const descW = cols.qty - 40 - cols.desc;
  const header = (p: PDFPage, yy: number) => {
    p.drawRectangle({ x: M, y: yy - 9, width: W - 2 * M, height: 26, color: PANEL });
    text(p, 'DESCRIPTION', cols.desc, yy, 7.5, medium, MUTED);
    right(p, 'QTY', cols.qty, yy, 7.5, medium, MUTED);
    right(p, 'UNIT PRICE', cols.unit, yy, 7.5, medium, MUTED);
    right(p, 'AMOUNT', cols.amount, yy, 7.5, medium, MUTED);
    return yy - 30;
  };
  y = header(page, y);
  const newPage = () => {
    page = doc.addPage([W, H]);
    pages.push(page);
    y = header(page, H - M - 10);
  };
  for (const item of items) {
    const lines = wrap(item.description, regular, 10, descW);
    const rowH = lines.length * 14 + 12;
    if (y - rowH < 150) newPage();
    lines.forEach((l, i) => text(page, l, cols.desc, y - i * 14, 10, i ? regular : medium, i ? BODY : INK));
    const qty = Number(item.qty);
    right(page, qty % 1 ? qty.toFixed(2) : String(qty), cols.qty, y, 10, regular, BODY);
    right(page, money(Number(item.unit_price)), cols.unit, y, 10, regular, BODY);
    right(page, money(qty * Number(item.unit_price)), cols.amount, y, 10, medium, INK);
    y -= rowH;
    page.drawLine({ start: { x: M, y: y + 8 }, end: { x: W - M, y: y + 8 }, thickness: 0.6, color: LINE });
  }

  // Totals, right aligned.
  if (y < 230) newPage();
  y -= 8;
  const tx = W - M - 220;
  const row = (label: string, value: string, strong = false) => {
    text(page, label, tx, y, strong ? 11 : 9.5, strong ? bold : regular, strong ? INK : MUTED);
    right(page, value, cols.amount, y, strong ? 13 : 9.5, strong ? bold : medium, INK);
    y -= strong ? 24 : 17;
  };
  row('Subtotal', money(totals.subtotal));
  if (totals.discount) row(`Discount (${Number(invoice.discount_pct)}%)`, `−${money(totals.discount)}`);
  if (Number(invoice.tax_pct)) row(`Tax (${Number(invoice.tax_pct)}%)`, money(totals.tax));
  page.drawLine({ start: { x: tx, y: y + 9 }, end: { x: cols.amount, y: y + 9 }, thickness: 1, color: INK });
  y -= 6;
  row(invoice.status === 'paid' ? 'Total paid' : 'Total due', money(totals.total), true);
  y -= 10;

  // Payment details and notes, in a light panel.
  const blocks: [string, string][] = [];
  if (invoice.status !== 'paid' && settings.invoices.payment_details) blocks.push(['How to pay', settings.invoices.payment_details]);
  const note = [invoice.notes, settings.invoices.note].filter(Boolean).join('\n\n');
  if (note) blocks.push(['Notes', note]);
  for (const [title, body] of blocks) {
    const lines = wrap(body, regular, 9.5, W - 2 * M - 32);
    const h = lines.length * 13.5 + 38;
    if (y - h < 70) newPage();
    page.drawRectangle({ x: M, y: y - h, width: W - 2 * M, height: h, color: PANEL });
    text(page, title.toUpperCase(), M + 16, y - 20, 7.5, medium, MUTED);
    lines.forEach((l, i) => text(page, l, M + 16, y - 36 - i * 13.5, 9.5, regular, BODY));
    y -= h + 14;
  }
  if (invoice.status === 'issued' && invoice.due_date) {
    if (y < 80) newPage();
    text(page, `Please pay by ${date(invoice.due_date)} and include ${number} as the reference.`, M, y - 4, 9.5, medium, INK);
  }

  // Footer on every page.
  const footer = [company.name || 'WebTano', company.website, company.email].filter(Boolean).join('  ·  ');
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: M, y: 46 }, end: { x: W - M, y: 46 }, thickness: 0.6, color: LINE });
    text(p, footer, M, 30, 8, regular, MUTED);
    right(p, `${number}  ·  Page ${i + 1} of ${pages.length}`, W - M, 30, 8, regular, MUTED);
  });

  return doc.save();
}
