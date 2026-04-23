'use client';

import { addDays, addMinutes, format } from 'date-fns';
import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';

const palette = ['#bfdbfe','#bbf7d0','#fbcfe8','#fde68a','#ddd6fe','#99f6e4'];

export function ScheduleBoard({ schedules, patients, staff, weekStartISO }: { schedules: any[]; patients: any[]; staff: any[]; weekStartISO: string }) {
  const supabase = createClient();
  const weekStart = new Date(weekStartISO);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ patient_id: patients[0]?.id ?? '', staff_id: staff[0]?.id ?? '', date: format(weekStart, 'yyyy-MM-dd'), time: '09:00', duration_minutes: 60, service_type: '', notes: '' });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const slots = useMemo(() => {
    const arr: string[] = [];
    let t = new Date(); t.setHours(7, 0, 0, 0);
    for (let i = 0; i <= 28; i += 1) { arr.push(format(addMinutes(t, i * 30), 'HH:mm')); }
    return arr;
  }, []);

  const colorFor = (staffId: string) => palette[Math.abs(staffId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % palette.length];

  const saveSchedule = async () => {
    const scheduled_at = new Date(`${form.date}T${form.time}:00`).toISOString();
    const res = await supabase.from('schedules').insert({ ...form, scheduled_at }).select('*').single();
    if (res.error) return toast.error(res.error.message);
    await supabase.from('visits').insert({ schedule_id: res.data.id, patient_id: form.patient_id, staff_id: form.staff_id, status: 'pending' });
    toast.success('Schedule created');
    location.reload();
  };

  const cancel = async (id: string) => {
    await supabase.from('schedules').update({ status: 'cancelled' }).eq('id', id);
    toast.success('Schedule cancelled');
    location.reload();
  };

  const prevWeek = format(addDays(weekStart, -7), 'yyyy-MM-dd');
  const nextWeek = format(addDays(weekStart, 7), 'yyyy-MM-dd');

  return <section className="space-y-4"><div className="flex items-center gap-2"><h1 className="text-2xl font-semibold text-[#052044]">Schedule</h1><Link className="rounded-md border px-3 py-2" href={`/schedule?week=${prevWeek}`}>Prev</Link><Link className="rounded-md border px-3 py-2" href={`/schedule?week=${nextWeek}`}>Next</Link><button className="ml-auto rounded-md bg-[#052044] px-3 py-2 text-white" onClick={() => setShowForm(true)}>New Schedule</button></div>
    <div className="overflow-auto rounded-lg border bg-white"><div className="grid min-w-[1000px]" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}><div className="border-b p-2" />{days.map((d) => <div key={d.toISOString()} className="border-b p-2 text-sm font-semibold">{format(d, 'EEE dd')}</div>)}{slots.map((slot) => <><div key={`t-${slot}`} className="border-b p-2 text-xs text-slate-500">{slot}</div>{days.map((d) => {
      const events = schedules.filter((s) => {
        const dt = new Date(s.scheduled_at);
        return format(dt, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd') && format(dt, 'HH:mm') === slot;
      });
      return <div key={`${slot}-${d.toISOString()}`} className="relative min-h-10 border-b border-l p-1">{events.map((e) => <button key={e.id} onClick={() => setSelected(e)} className="w-full rounded p-1 text-left text-xs" style={{ backgroundColor: colorFor(e.staff_id) }}><div>{e.patients?.full_name ?? 'Patient'}</div><div>{e.service_type ?? 'Service'}</div></button>)}</div>;
    })}</>)}
    </div></div>

    {selected && <div className="rounded-lg border bg-white p-4"><h3 className="font-semibold">Visit details</h3><p>{selected.patients?.full_name}</p><p>{selected.staff?.full_name}</p><p>{new Date(selected.scheduled_at).toLocaleString('en-IN')}</p><button onClick={() => cancel(selected.id)} className="mt-2 rounded-md bg-red-600 px-3 py-2 text-white">Cancel</button></div>}

    {showForm && <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><div className="h-full w-full max-w-md space-y-2 overflow-auto bg-white p-4"><h3 className="text-lg font-semibold">New Schedule</h3>
      <select className="w-full rounded-md border p-2" value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })}>{patients.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}</select>
      <select className="w-full rounded-md border p-2" value={form.staff_id} onChange={(e) => setForm({ ...form, staff_id: e.target.value })}>{staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
      <input type="date" className="w-full rounded-md border p-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <input type="time" className="w-full rounded-md border p-2" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
      <select className="w-full rounded-md border p-2" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}>{[30,60,90,120].map((v) => <option key={v} value={v}>{v} min</option>)}</select>
      <input className="w-full rounded-md border p-2" placeholder="Service type" value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} />
      <textarea className="w-full rounded-md border p-2" rows={3} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <div className="flex gap-2"><button className="w-full rounded-md border p-2" onClick={() => setShowForm(false)}>Close</button><button className="w-full rounded-md bg-[#052044] p-2 text-white" onClick={saveSchedule}>Save</button></div>
    </div></div>}
  </section>;
}
