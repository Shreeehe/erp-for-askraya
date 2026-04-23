'use client';

import { useState } from 'react';
import { Mail, MessageSquare, NotebookPen, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { LeadForm } from './LeadForm';
import type { Database } from '@/types/supabase';

const iconMap = { call: Phone, whatsapp: MessageSquare, email: Mail, meeting: NotebookPen, note: NotebookPen } as const;

export function LeadDetailClient({ lead, activities, staff, patientName }: { lead: Database['public']['Tables']['leads']['Row']; activities: (Database['public']['Tables']['lead_activities']['Row'] & { creator_name?: string | null })[]; staff: Database['public']['Tables']['staff']['Row'][]; patientName?: string | null; }) {
  const supabase = createClient();
  const [showEdit, setShowEdit] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [actType, setActType] = useState<'call' | 'whatsapp' | 'email' | 'meeting' | 'note'>('call');
  const [actNotes, setActNotes] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [convertedName, setConvertedName] = useState(patientName ?? null);

  const logActivity = async () => {
    const res = await supabase.from('lead_activities').insert({ lead_id: lead.id, type: actType, notes: actNotes, next_follow_up: followUp ? new Date(followUp).toISOString() : null }).select('*').single();
    if (res.error) return toast.error(res.error.message);
    toast.success('Activity logged');
    location.reload();
  };

  const convert = async () => {
    const patientRes = await supabase.from('patients').insert({ full_name: lead.full_name, phone: lead.phone, email: lead.email, source_lead_id: lead.id }).select('*').single();
    if (patientRes.error) return toast.error(patientRes.error.message);
    const updateRes = await supabase.from('leads').update({ status: 'converted', converted_at: new Date().toISOString(), patient_id: patientRes.data.id }).eq('id', lead.id);
    if (updateRes.error) return toast.error(updateRes.error.message);
    setConvertedName(patientRes.data.full_name);
    toast.success('Lead converted to patient');
    location.reload();
  };

  return <section className="space-y-4"><div className="rounded-lg border bg-white p-4"><div className="mb-3 flex items-center justify-between"><h1 className="text-2xl font-semibold text-[#052044]">{lead.full_name}</h1><button onClick={() => setShowEdit(true)} className="rounded-md border px-3 py-2">Edit</button></div>
    <div className="grid gap-2 text-sm md:grid-cols-2"><p><b>Phone:</b> {lead.phone}</p><p><b>Email:</b> {lead.email ?? '-'}</p><p><b>Service:</b> {lead.service_interest ?? '-'}</p><p><b>Source:</b> {lead.source ?? '-'}</p><p><b>Status:</b> {lead.status}</p><p><b>Assigned:</b> {staff.find((s) => s.id === lead.assigned_to)?.full_name ?? '-'}</p><p><b>Next follow-up:</b> {lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleString('en-IN') : '-'}</p><p><b>Created:</b> {lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN') : '-'}</p>{lead.status === 'lost' && <p><b>Lost reason:</b> {lead.lost_reason ?? '-'}</p>}</div>
    {!lead.patient_id && !convertedName ? <button onClick={convert} className="mt-3 rounded-md bg-emerald-600 px-3 py-2 text-white">Convert to Patient</button> : <p className="mt-3 rounded-md bg-emerald-50 p-2 text-sm text-emerald-700">Linked patient: {convertedName ?? patientName}</p>}
  </div>

  <div className="rounded-lg border bg-white p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Activity Timeline</h2><button onClick={() => setShowLog((v) => !v)} className="rounded-md border px-3 py-2">Log Activity</button></div>
    {showLog && <div className="mb-3 grid gap-2 md:grid-cols-4"><select value={actType} onChange={(e) => setActType(e.target.value as typeof actType)} className="rounded-md border p-2">{['call','whatsapp','email','meeting','note'].map((v) => <option key={v}>{v}</option>)}</select><input className="rounded-md border p-2 md:col-span-2" value={actNotes} onChange={(e) => setActNotes(e.target.value)} placeholder="Notes" /><input type="datetime-local" className="rounded-md border p-2" value={followUp} onChange={(e) => setFollowUp(e.target.value)} /><button onClick={logActivity} className="rounded-md bg-[#052044] px-3 py-2 text-white md:col-span-4">Submit</button></div>}
    <ul className="space-y-2">{activities.map((a) => { const Icon = iconMap[a.type ?? 'note']; return <li key={a.id} className="flex items-start gap-2 rounded-md border p-2"><Icon size={16} className="mt-1" /><div><p className="text-sm">{a.notes}</p><p className="text-xs text-slate-500">{a.creator_name ?? 'User'} · {a.created_at ? new Date(a.created_at).toLocaleString('en-IN') : '-'}</p></div></li>; })}</ul>
  </div>

  <LeadForm open={showEdit} onClose={() => setShowEdit(false)} staff={staff} initial={lead} />
  </section>;
}
