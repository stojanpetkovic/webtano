'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

/** The period picker: dates matter only for a custom period; a preset applies at once. */
export function PeriodSelect({
  label,
  options,
  value,
  customLabel,
  children,
}: {
  label: string;
  options: { key: string; label: string }[];
  value: string;
  customLabel: string;
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(value);
  return (
    <>
      <label className="text-xs text-zinc-500">
        {label}
        <select
          name="period"
          className="form-input mt-0.5 block w-auto py-1.5"
          aria-label={label}
          value={current}
          onChange={(event) => {
            setCurrent(event.target.value);
            if (event.target.value !== 'custom') event.target.form?.requestSubmit();
          }}
        >
          {options.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
          <option value="custom">{customLabel}</option>
        </select>
      </label>
      <div className="contents" hidden={current !== 'custom'}>
        {current === 'custom' && children}
      </div>
    </>
  );
}

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="btn btn-sm btn-primary ms-auto" onClick={() => window.print()}>
      <Download className="size-4" />
      {label}
    </button>
  );
}
