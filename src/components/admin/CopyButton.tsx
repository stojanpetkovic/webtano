'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';
import { useT } from '@/components/i18n/LangProvider';

export function CopyButton({ value }: { value: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-soft"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <Copy className="size-4" /> <span>{copied ? t('Copied', 'Kopirano') : t('Copy', 'Kopiraj')}</span>
    </button>
  );
}
