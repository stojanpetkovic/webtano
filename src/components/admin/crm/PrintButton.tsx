'use client';

import { Download } from 'lucide-react';
import { useT } from '@/components/i18n/LangProvider';

export function PrintButton() {
  const t = useT();
  return (
    <button type="button" className="btn btn-sm btn-primary ms-auto" onClick={() => window.print()}>
      <Download className="size-4" /> {t('Save as PDF', 'Sačuvaj kao PDF')}
    </button>
  );
}
