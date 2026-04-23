'use client';

import Link from 'next/link';
import { differenceInMinutes } from 'date-fns';
import { useMemo, useState } from 'react';
import { StatusBadge } from '@/components/status-badge';

export function VisitsTable({ visits, from, to }: { visits: any[]; from: string; to: string }) {
  const [status, setStatus] = useState('all');
  const rows = useMemo(() => visits.filter((v) => status === 'all' || v.status === status), [visits, status]);
  return <section className="space-y-4"><div className="flex flex-wrap gap-2"><Link href={`/visits?from=${from}&to=${to}`} className="rounded-md border px-3 py-2">Date range</Link><select className="rounded-md border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All status</option>{['pending','checked-in','completed','cancelled'].map((v) => <option key={v}>{v}</option>)}</select></div>
  <div className="overflow-auto rounded-lg border bg-white"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Patient</th><th>Staff</th><th>Scheduled</th><th>Service</th><th>Check-in</th><th>Check-out</th><th>Duration</th><th>Status</th></tr></thead><tbody>{rows.map((v) => <tr key={v.id} className="border-t"><td className="p-2">{v.patients?.full_name ?? '-'}</td><td>{v.staff?.full_name ?? '-'}</td><td>{v.schedules?.scheduled_at ? new Date(v.schedules.scheduled_at).toLocaleString('en-IN') : '-'}</td><td>{v.schedules?.service_type ?? '-'}</td><td>{v.checked_in_at ? new Date(v.checked_in_at).toLocaleString('en-IN') : '-'}</td><td>{v.checked_out_at ? new Date(v.checked_out_at).toLocaleString('en-IN') : '-'}</td><td>{v.checked_in_at && v.checked_out_at ? `${differenceInMinutes(new Date(v.checked_out_at), new Date(v.checked_in_at))} min` : '-'}</td><td><StatusBadge status={v.status ?? 'pending'} /></td></tr>)}</tbody></table></div></section>;
}
