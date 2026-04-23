import { cn } from '@/lib/utils';

const statusMap: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  open: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  lost: 'bg-rose-100 text-rose-800',
  converted: 'bg-cyan-100 text-cyan-800'
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn('rounded-full px-2 py-1 text-xs', statusMap[status] ?? 'bg-slate-100 text-slate-800')}>{status}</span>;
}
