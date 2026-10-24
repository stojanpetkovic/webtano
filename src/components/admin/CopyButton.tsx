'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react';

export function CopyButton({ value }: { value: string }) {
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
      <Copy className="size-4" /> <span>{copied ? 'Kopirano' : 'Kopiraj'}</span>
    </button>
  );
}
