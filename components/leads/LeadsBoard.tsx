'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { differenceInDays, isPast } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { StatusBadge } from '@/components/status-badge';
import { LeadForm } from './LeadForm';
import type { Database } from '@/types/supabase';

const statuses: Database['public']['Enums']['lead_status'][] = ['new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost'];

export function LeadsBoard({ initialLeads, staff }: { initialLeads: Database['public']['Tables']['leads']['Row'][]; staff: Database['public']['Tables']['staff']['Row'][] }) {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState(initialLeads);
  const supabase = createClient();

  const filtered = useMemo(() => leads.filter((l) =>
    (l.full_name.toLowerCase().includes(query.toLowerCase()) || l.phone.includes(query)) &&
    (statusFilter === 'all' || l.status === statusFilter) &&
    (staffFilter === 'all' || l.assigned_to === staffFilter)
  ), [leads, query, statusFilter, staffFilter]);

  const onDropStatus = async (leadId: string, status: Database['public']['Enums']['lead_status']) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
    await supabase.from('leads').update({ status }).eq('id', leadId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button className={`rounded-md border px-3 py-2 ${view === 'table' ? 'bg-[#052044] text-white' : ''}`} onClick={() => setView('table')}>Table</button>
        <button className={`rounded-md border px-3 py-2 ${view === 'kanban' ? 'bg-[#052044] text-white' : ''}`} onClick={() => setView('kanban')}>Kanban</button>
        <input className="ml-auto rounded-md border px-3 py-2" placeholder="Search name/phone" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="rounded-md border px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All status</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="rounded-md border px-3 py-2" value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)}><option value="all">All staff</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
        <button onClick={() => setShowForm(true)} className="rounded-md bg-[#052044] px-3 py-2 text-white">New Lead</button>
      </div>

      {view === 'table' ? (
        <div className="overflow-auto rounded-lg border bg-white">
          <table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Name</th><th>Phone</th><th>Service</th><th>Source</th><th>Status</th><th>Assigned</th><th>Next follow-up</th><th>Created</th></tr></thead>
            <tbody>{filtered.map((l) => {
              const overdue = !!l.next_follow_up && isPast(new Date(l.next_follow_up));
              return <tr key={l.id} className={`border-t ${overdue ? 'bg-amber-50' : ''}`}><td className="p-2"><Link href={`/leads/${l.id}`} className="text-[#052044] underline">{l.full_name}</Link></td><td>{l.phone}</td><td>{l.service_interest}</td><td>{l.source}</td><td><StatusBadge status={l.status ?? 'new'} /></td><td>{staff.find((s) => s.id === l.assigned_to)?.full_name ?? '-'}</td><td>{l.next_follow_up ? new Date(l.next_follow_up).toLocaleString('en-IN') : '-'}</td><td>{l.created_at ? new Date(l.created_at).toLocaleDateString('en-IN') : '-'}</td></tr>;
            })}</tbody></table>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-6">
          {statuses.map((status) => (
            <div key={status} className="rounded-lg border bg-white p-2" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropStatus(e.dataTransfer.getData('leadId'), status)}>
              <h3 className="mb-2 text-sm font-semibold uppercase">{status}</h3>
              <div className="space-y-2">{filtered.filter((l) => l.status === status).map((l) => <Link key={l.id} href={`/leads/${l.id}`} draggable onDragStart={(e) => e.dataTransfer.setData('leadId', l.id)} className="block rounded-md border p-2 text-sm hover:bg-slate-50"><p className="font-medium">{l.full_name}</p><p>{l.phone}</p><p>{l.service_interest}</p><p className="text-xs text-slate-500">{l.source} · {differenceInDays(new Date(), new Date(l.created_at ?? new Date().toISOString()))}d</p></Link>)}</div>
            </div>
          ))}
        </div>
      )}
      <LeadForm open={showForm} onClose={() => setShowForm(false)} staff={staff} />
    </div>
  );
}
