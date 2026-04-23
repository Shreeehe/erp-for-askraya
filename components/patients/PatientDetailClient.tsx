'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/status-badge';
import { PriorityBadge } from '@/components/priority-badge';
import { PatientForm } from './PatientForm';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

export function PatientDetailClient({ patient, cases, carePlan, visits, invoices, files }: { patient: Database['public']['Tables']['patients']['Row']; cases: any[]; carePlan: any; visits: any[]; invoices: any[]; files: any[] }) {
  const supabase = createClient();
  const [tab, setTab] = useState<'cases'|'care'|'visits'|'invoices'|'documents'>('cases');
  const [editOpen, setEditOpen] = useState(false);

  const upload = async (file: File) => {
    const res = await supabase.storage.from('patient-docs').upload(`${patient.id}/${Date.now()}-${file.name}`, file, { upsert: true });
    if (res.error) return toast.error(res.error.message);
    toast.success('File uploaded');
    location.reload();
  };

  return <section className="space-y-4"><div className="rounded-lg border bg-white p-4"><div className="flex items-center justify-between"><h1 className="text-2xl font-semibold text-[#052044]">{patient.full_name}</h1><button onClick={() => setEditOpen(true)} className="rounded-md border px-3 py-2">Edit</button></div><div className="mt-2 grid gap-2 text-sm md:grid-cols-2"><p><b>Age/Gender:</b> {patient.age ?? '-'} / {patient.gender ?? '-'}</p><p><b>Phone:</b> {patient.phone ?? '-'}</p><p><b>Address:</b> {patient.address ?? '-'}</p><p><b>Diagnosis:</b> {patient.diagnosis ?? '-'}</p><p><b>Emergency:</b> {patient.emergency_contact_name ?? '-'} ({patient.emergency_contact_phone ?? '-'})</p></div></div>
    <div className="flex flex-wrap gap-2">{[{k:'cases',l:'Cases'},{k:'care',l:'Care Plan'},{k:'visits',l:'Visits'},{k:'invoices',l:'Invoices'},{k:'documents',l:'Documents'}].map((t) => <button key={t.k} onClick={() => setTab(t.k as any)} className={`rounded-full border px-3 py-1 ${tab===t.k?'bg-[#052044] text-white':''}`}>{t.l}</button>)}</div>
    {tab==='cases' && <div className="rounded-lg border bg-white p-4"><button className="mb-3 rounded-md border px-3 py-2">Open New Case</button><ul className="space-y-2">{cases.map((c) => <li key={c.id} className="rounded border p-2 text-sm"><div className="flex gap-2"><b>{c.title}</b><PriorityBadge priority={c.priority ?? 'normal'} /><StatusBadge status={c.status ?? 'open'} /></div><p>Assigned: {c.staff?.full_name ?? '-'}</p></li>)}</ul></div>}
    {tab==='care' && <div className="rounded-lg border bg-white p-4"><button className="mb-3 rounded-md border px-3 py-2">Edit</button>{carePlan ? <div className="text-sm"><p><b>Services:</b> {(carePlan.services ?? []).join(', ')}</p><p><b>Frequency:</b> {carePlan.frequency}</p><p><b>Instructions:</b> {carePlan.special_instructions}</p></div> : <p>No active care plan</p>}</div>}
    {tab==='visits' && <div className="rounded-lg border bg-white p-4 overflow-auto"><table className="w-full text-sm"><thead><tr><th className="text-left">Date</th><th>Staff</th><th>Service</th><th>Status</th><th>Check-in</th><th>Check-out</th></tr></thead><tbody>{visits.map((v) => <tr key={v.id} className="border-t"><td>{v.schedules?.scheduled_at ? new Date(v.schedules.scheduled_at).toLocaleString('en-IN') : '-'}</td><td>{v.staff?.full_name ?? '-'}</td><td>{v.schedules?.service_type ?? '-'}</td><td><StatusBadge status={v.status ?? 'pending'} /></td><td>{v.checked_in_at ? new Date(v.checked_in_at).toLocaleString('en-IN') : '-'}</td><td>{v.checked_out_at ? new Date(v.checked_out_at).toLocaleString('en-IN') : '-'}</td></tr>)}</tbody></table></div>}
    {tab==='invoices' && <div className="rounded-lg border bg-white p-4"><button className="mb-3 rounded-md border px-3 py-2">Generate Invoice</button><ul className="space-y-2">{invoices.map((i) => <li key={i.id} className="rounded border p-2 text-sm">{i.invoice_number} · ₹{i.total_amount} · <StatusBadge status={i.status ?? 'draft'} /> · Due {i.due_date ?? '-'}</li>)}</ul></div>}
    {tab==='documents' && <div className="rounded-lg border bg-white p-4"><input type="file" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} /><ul className="mt-3 space-y-2 text-sm">{files.map((f) => <li key={f.name} className="rounded border p-2"><a className="underline" href="#">{f.name}</a></li>)}</ul></div>}
    <PatientForm open={editOpen} onClose={() => setEditOpen(false)} initial={patient} />
  </section>;
}
