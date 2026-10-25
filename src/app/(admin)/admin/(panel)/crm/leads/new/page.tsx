import { redirect } from 'next/navigation';
import { toParams } from '@/lib/admin/params';

// Adding now happens in a pop-up on the list; old links open it there.
export default async function New({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = toParams(await searchParams);
  const next = new URLSearchParams({ new: '1' });
  for (const k of [] as string[]) if (query.get(k)) next.set(k, query.get(k)!);
  redirect(`/admin/crm/leads?${next}`);
}
