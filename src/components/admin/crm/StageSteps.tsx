import { Check } from 'lucide-react';
import { setDealStage } from '@/app/(admin)/admin/(panel)/crm/actions';
import { STAGES } from '@/lib/admin/crm/labels';
import { getAdminI18n } from '@/lib/admin/i18n';
import type { DealStage } from '@/lib/admin/crm/types';

/** The pipeline as clickable steps: each one is a tiny form that moves the deal there. */
export async function StageSteps({ dealId, stage }: { dealId: string; stage: DealStage }) {
  const { lang, t } = await getAdminI18n();
  const open = STAGES.filter((s) => s.key !== 'lost');
  const current = open.findIndex((s) => s.key === stage);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ol className="flex flex-1 overflow-x-auto rounded-xl bg-zinc-100 p-1">
        {open.map((s, i) => {
          const done = stage !== 'lost' && i < current;
          const active = s.key === stage;
          return (
            <li key={s.key} className="min-w-fit flex-1">
              <form action={setDealStage}>
                <input type="hidden" name="id" value={dealId} />
                <input type="hidden" name="stage" value={s.key} />
                <button
                  type="submit"
                  className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition ${
                    active
                      ? s.key === 'won'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-ink-950 text-white shadow-sm'
                      : done
                        ? 'text-ink hover:bg-white/70'
                        : 'text-zinc-500 hover:bg-white/70 hover:text-ink'
                  }`}
                  aria-current={active ? 'step' : undefined}
                >
                  {done && <Check className="size-3.5 text-emerald-600" />}
                  {s.label[lang]}
                </button>
              </form>
            </li>
          );
        })}
      </ol>
      <form action={setDealStage}>
        <input type="hidden" name="id" value={dealId} />
        <input type="hidden" name="stage" value="lost" />
        <button type="submit" className={`btn btn-sm ${stage === 'lost' ? 'bg-zinc-700 text-white' : 'btn-light'}`}>
          {stage === 'lost' ? t('Lost', 'Izgubljen') : t('Mark as lost', 'Označi kao izgubljen')}
        </button>
      </form>
    </div>
  );
}
