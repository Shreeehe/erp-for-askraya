'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';
import { CaseForm } from './CaseForm';

export function CasesTable({ initialCases, patients, staff }: { initialCases: any[]; patients: any[]; staff: any[] }) {
  const [priority, setPriority] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => initialCases.filter((c) => (priority === 'all' || c.priority === priority) && (type === 'all' || c.type === type) && (status === 'all' || c.status === status)), [initialCases, priority, type, status]);
  return <div className="space-y-3"><div className="flex flex-wrap gap-2"><select className="rounded-md border px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="all">All priorities</option>{['low','normal','high','urgent'].map((v) => <option key={v}>{v}</option>)}</select><select className="rounded-md border px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}><option value="all">All types</option>{['clinical','complaint','follow-up','emergency','escalation','general'].map((v) => <option key={v}>{v}</option>)}</select><select className="rounded-md border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All status</option>{['open','in-progress','resolved','closed'].map((v) => <option key={v}>{v}</option>)}</select><button className="ml-auto rounded-md bg-[#052044] px-3 py-2 text-white" onClick={() => setOpen(true)}>New Case</button></div>
  <div className="overflow-auto rounded-lg border bg-white"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Title</th><th>Patient</th><th>Type</th><th>Priority</th><th>Assigned</th><th>Status</th><th>Opened</th><th>Days open</th></tr></thead><tbody>{rows.map((c) => <tr key={c.id} className="border-t"><td className="p-2"><Link href={`/cases/${c.id}`} className="underline text-[#052044]">{c.title}</Link></td><td>{c.patients?.full_name ?? '-'}</td><td>{c.type}</td><td><PriorityBadge priority={c.priority ?? 'normal'} /></td><td>{c.staff?.full_name ?? '-'}</td><td><StatusBadge status={c.status ?? 'open'} /></td><td>{c.opened_at ? new Date(c.opened_at).toLocaleDateString('en-IN') : '-'}</td><td>{c.opened_at ? differenceInDays(new Date(), new Date(c.opened_at)) : 0}</td></tr>)}</tbody></table></div>
  <CaseForm open={open} onClose={() => setOpen(false)} patients={patients} staff={staff} />
  </div>;
}
