'use client';

import { useOptimistic, useRef, useState, useTransition } from 'react';

export interface BoardItem {
  id: string;
  column: string;
  position: number;
}

interface Column {
  key: string;
  label: string;
  dot: string;
  /** Shown under the column title, e.g. the total value of its deals. */
  meta?: (items: BoardItem[]) => string | null;
}

/**
 * A kanban board with drag and drop (pointer devices) and a column picker on
 * each card (touch screens, keyboard). Moves show at once and are saved by
 * `onMove`, a server action that refreshes the page.
 */
export function Board<T extends BoardItem>({
  columns,
  items,
  renderCard,
  onMove,
  empty = 'Prevuci karticu ovde',
}: {
  columns: Column[];
  items: T[];
  renderCard: (item: T, picker: React.ReactNode) => React.ReactNode;
  onMove: (id: string, column: string, position: number) => Promise<void>;
  empty?: string;
}) {
  const [optimistic, apply] = useOptimistic(items, (state: T[], move: { id: string; column: string; position: number }) =>
    state.map((i) => (i.id === move.id ? { ...i, column: move.column, position: move.position } : i)),
  );
  const [, startTransition] = useTransition();
  const [over, setOver] = useState<{ column: string; index: number } | null>(null);
  const dragging = useRef<string | null>(null);

  const byColumn = (key: string) => optimistic.filter((i) => i.column === key).sort((a, b) => a.position - b.position);

  const move = (itemId: string, column: string, index: number) => {
    const list = byColumn(column).filter((i) => i.id !== itemId);
    const before = list[index - 1]?.position;
    const after = list[index]?.position;
    const position =
      before === undefined && after === undefined ? 0 : before === undefined ? after! - 1 : after === undefined ? before + 1 : (before + after) / 2;
    startTransition(async () => {
      apply({ id: itemId, column, position });
      await onMove(itemId, column, position);
    });
  };

  const picker = (item: T) => (
    <select
      aria-label="Premesti u kolonu"
      value={item.column}
      onChange={(e) => move(item.id, e.target.value, 0)}
      onClick={(e) => e.stopPropagation()}
      className="relative z-10 h-7 cursor-pointer rounded-md border border-line bg-white pe-6 ps-2 text-[11px] text-zinc-600 [@media(hover:hover)]:hidden"
    >
      {columns.map((c) => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="-mx-4 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-4 pb-3 lg:-mx-8 lg:px-8">
      {columns.map((col) => {
        const list = byColumn(col.key);
        const meta = col.meta?.(list);
        return (
          <section
            key={col.key}
            className={`flex w-[84vw] max-w-[300px] shrink-0 snap-start flex-col rounded-2xl bg-zinc-100/70 ring-1 ring-zinc-900/[0.04] transition sm:w-[272px] ${
              over?.column === col.key ? 'bg-sky-50 ring-accent/40' : ''
            }`}
            aria-label={col.label}
            onDragOver={(e) => {
              e.preventDefault();
              const cards = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-card]')];
              const index = cards.findIndex((c) => e.clientY < c.getBoundingClientRect().top + c.offsetHeight / 2);
              setOver({ column: col.key, index: index === -1 ? cards.length : index });
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const itemId = dragging.current;
              if (itemId && over) move(itemId, col.key, over.index);
              dragging.current = null;
              setOver(null);
            }}
          >
            <header className="flex items-center gap-2 px-3.5 pt-3 pb-2">
              <span className={`size-2 rounded-full ${col.dot}`} />
              <h2 className="text-[13px] font-semibold text-ink">{col.label}</h2>
              <span className="rounded-full bg-white px-1.5 py-0.5 font-mono text-[10.5px] text-zinc-500 ring-1 ring-zinc-900/5">{list.length}</span>
              {meta && <span className="ms-auto text-xs font-medium text-zinc-500 tabular-nums">{meta}</span>}
            </header>
            <div className="flex min-h-24 flex-1 flex-col gap-2 p-2 pt-1">
              {list.map((item, index) => (
                <div key={item.id}>
                  {over?.column === col.key && over.index === index && <div className="mb-2 h-1 rounded-full bg-accent" />}
                  <div
                    data-card
                    draggable
                    onDragStart={(e) => {
                      dragging.current = item.id;
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', item.id);
                    }}
                    onDragEnd={() => setOver(null)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    {renderCard(item, picker(item))}
                  </div>
                </div>
              ))}
              {over?.column === col.key && over.index === list.length && <div className="h-1 rounded-full bg-accent" />}
              {list.length === 0 && (
                <div className="grid h-24 place-items-center rounded-xl border border-dashed border-zinc-300 px-3 text-center text-xs text-zinc-400">{empty}</div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
