'use client';

import Link from 'next/link';
import { MobileVisitCard } from '@/components/mobile-visit-card';
import { StatusBadge } from '@/components/status-badge';

export function MobileVisitsClient({ visits }: { visits: any[] }) {
  const upcoming = visits.filter((v) => v.status === 'pending');
  const inProgress = visits.filter((v) => v.status === 'checked-in');
  const completed = visits.filter((v) => v.status === 'completed');

  const block = (title: string, data: any[]) => <section className="space-y-2"><h2 className="text-sm font-semibold text-slate-600">{title}</h2>{data.map((v) => <Link key={v.id} href={`/visit/${v.id}`}><div className="relative"><MobileVisitCard patient={v.patients?.full_name ?? '-'} address={v.patients?.address ?? '-'} time={v.schedules?.scheduled_at ? new Date(v.schedules.scheduled_at).toLocaleTimeString('en-IN') : '-'} /><div className="absolute right-3 top-3"><StatusBadge status={v.status ?? 'pending'} /></div></div></Link>)}</section>;

  return <section className="space-y-4"><h1 className="text-xl font-semibold text-[#052044]">My Visits</h1>{block('Upcoming', upcoming)}{block('In Progress', inProgress)}{block('Completed', completed)}</section>;
}
