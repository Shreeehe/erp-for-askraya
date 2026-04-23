'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { PriorityBadge } from '@/components/priority-badge';
import { StatusBadge } from '@/components/status-badge';

export function CaseDetailClient({ caseRow, notes, staff }: { caseRow: any; notes: any[]; staff: any[] }) {
  const supabase = createClient();
  const [status, setStatus] = useState(caseRow.status ?? 'open');
  const [assigned, setAssigned] = useState(caseRow.assigned_to ?? '');
  const [newNote, setNewNote] = useState('');
  const [resolution, setResolution] = useState('');
  const [localNotes, setLocalNotes] = useState(notes);

  const updateCase = async (patch: Record<string, unknown>) => {
    const res = await supabase.from('cases').update(patch).eq('id', caseRow.id);
    if (res.error) toast.error(res.error.message);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const optimistic = { id: `tmp-${Date.now()}`, note: newNote, created_at: new Date().toISOString() };
    setLocalNotes((prev) => [optimistic as any, ...prev]);
    setNewNote('');
    const res = await supabase.from('case_notes').insert({ case_id: caseRow.id, note: optimistic.note }).select('*').single();
    if (res.error) return toast.error(res.error.message);
    setLocalNotes((prev) => [res.data, ...prev.filter((n) => n.id !== optimistic.id)]);
  };

  return <section className="space-y-4"><div className="rounded-lg border bg-white p-4"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-semibold text-[#052044]">{caseRow.title}</h1><PriorityBadge priority={caseRow.priority ?? 'normal'} /><StatusBadge status={status} /></div>
    <p className="mt-2 text-sm">Patient: <Link href={`/patients/${caseRow.patient_id}`} className="underline text-[#052044]">{caseRow.patients?.full_name ?? caseRow.patient_id}</Link></p>
    <div className="mt-3 grid gap-2 md:grid-cols-2"><select value={status} onChange={(e) => { setStatus(e.target.value); updateCase({ status: e.target.value }); }} className="rounded-md border p-2">{['open','in-progress','resolved','closed'].map((v) => <option key={v}>{v}</option>)}</select><select value={assigned} onChange={(e) => { setAssigned(e.target.value); updateCase({ assigned_to: e.target.value || null }); }} className="rounded-md border p-2"><option value="">Unassigned</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select></div>
    <div className="mt-3 flex gap-2"><textarea className="flex-1 rounded-md border p-2" rows={2} value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Resolution notes" /><button onClick={() => updateCase({ status: 'resolved', resolved_at: new Date().toISOString(), resolution_notes: resolution })} className="rounded-md bg-emerald-600 px-3 py-2 text-white">Mark Resolved</button></div>
  </div>
  <div className="rounded-lg border bg-white p-4"><h2 className="mb-3 text-lg font-semibold">Case Notes</h2><div className="space-y-2">{localNotes.map((n) => <div key={n.id} className="rounded-md border p-2"><div className="mb-1 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-xs font-semibold">AU</span><span className="text-xs text-slate-500">{n.created_at ? new Date(n.created_at).toLocaleString('en-IN') : '-'}</span></div><p className="text-sm">{n.note}</p></div>)}</div>
    <div className="mt-3 flex gap-2"><textarea className="flex-1 rounded-md border p-2" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add note" /><button onClick={addNote} className="rounded-md bg-[#052044] px-3 py-2 text-white">Submit</button></div></div></section>;
}
