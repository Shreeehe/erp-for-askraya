'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function NurseVisitClient({ visit }: { visit: any }) {
  const supabase = createClient();
  const [status, setStatus] = useState(visit.status ?? 'pending');
  const [vitals, setVitals] = useState<any>(visit.vitals ?? { bp_systolic: '', bp_diastolic: '', pulse: '', temperature: '', spo2: '' });
  const [notes, setNotes] = useState(visit.visit_notes ?? '');

  const checkIn = async () => {
    const res = await supabase.from('visits').update({ status: 'checked-in', checked_in_at: new Date().toISOString() }).eq('id', visit.id);
    if (res.error) return toast.error(res.error.message);
    setStatus('checked-in');
  };

  const checkOut = async () => {
    const res = await supabase.from('visits').update({ status: 'completed', checked_out_at: new Date().toISOString(), vitals, visit_notes: notes }).eq('id', visit.id);
    if (res.error) return toast.error(res.error.message);
    setStatus('completed');
    toast.success('Visit completed');
  };

  return <section className="space-y-4"><div className="rounded-lg border bg-white p-4"><h1 className="text-xl font-semibold text-[#052044]">{visit.patients?.full_name}</h1><p className="text-sm">{visit.patients?.address}</p><p className="text-sm">{visit.patients?.diagnosis}</p><p className="text-sm">{visit.schedules?.service_type} · {visit.schedules?.scheduled_at ? new Date(visit.schedules.scheduled_at).toLocaleString('en-IN') : '-'}</p></div>
  {status === 'pending' && <button onClick={checkIn} className="w-full rounded-md bg-[#052044] p-2 text-white">Check In</button>}
  {status === 'checked-in' && <div className="space-y-2 rounded-lg border bg-white p-4"><div className="grid grid-cols-2 gap-2"><input className="rounded-md border p-2" placeholder="BP systolic" value={vitals.bp_systolic} onChange={(e) => setVitals({ ...vitals, bp_systolic: e.target.value })} /><input className="rounded-md border p-2" placeholder="BP diastolic" value={vitals.bp_diastolic} onChange={(e) => setVitals({ ...vitals, bp_diastolic: e.target.value })} /><input className="rounded-md border p-2" placeholder="Pulse" value={vitals.pulse} onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })} /><input className="rounded-md border p-2" placeholder="Temperature" value={vitals.temperature} onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })} /><input className="col-span-2 rounded-md border p-2" placeholder="SpO2" value={vitals.spo2} onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })} /></div><textarea className="w-full rounded-md border p-2" rows={3} placeholder="Visit notes" value={notes} onChange={(e) => setNotes(e.target.value)} /><button onClick={checkOut} className="w-full rounded-md bg-emerald-600 p-2 text-white">Check Out</button></div>}
  {status === 'completed' && <div className="rounded-lg border bg-white p-4 text-sm"><h2 className="mb-2 font-semibold">Visit Summary</h2><pre className="rounded bg-slate-100 p-2">{JSON.stringify(vitals, null, 2)}</pre><p className="mt-2">{notes}</p></div>}
  </section>;
}
