import { SERVICES } from '@/lib/admin/crm/labels';
import { getAdminLang } from '@/lib/admin/i18n';

/** The services a customer has, as small pills; nothing when none are set. */
export async function ServicePills({ services, className = '' }: { services?: string[] | null; className?: string }) {
  const keys = (services ?? []).filter((k) => k in SERVICES);
  if (!keys.length) return null;
  const lang = await getAdminLang();
  return (
    <span className={`flex flex-wrap gap-1 ${className}`}>
      {keys.map((k) => (
        <span key={k} className="rounded-full bg-primary/[0.07] px-2 py-0.5 whitespace-nowrap text-[11px] font-medium text-primary ring-1 ring-primary/15 ring-inset">
          {SERVICES[k][lang]}
        </span>
      ))}
    </span>
  );
}
