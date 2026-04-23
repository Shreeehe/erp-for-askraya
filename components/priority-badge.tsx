import { cn } from '@/lib/utils';

const priorityMap: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  normal: 'bg-blue-100 text-blue-700',
  low: 'bg-slate-100 text-slate-700'
};

export function PriorityBadge({ priority }: { priority: string }) {
  return <span className={cn('rounded-full px-2 py-1 text-xs', priorityMap[priority] ?? 'bg-slate-100')}>{priority}</span>;
}
