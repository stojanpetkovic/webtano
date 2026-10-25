'use client';

import { Download } from 'lucide-react';

export function PrintButton() {
  return (
    <button type="button" className="btn btn-sm btn-primary ms-auto" onClick={() => window.print()}>
      <Download className="size-4" /> Sačuvaj kao PDF
    </button>
  );
}
