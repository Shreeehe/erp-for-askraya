'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const skillsList = ['wound care', 'IV therapy', 'physiotherapy', 'post-surgery care', 'dementia care', 'palliative care', 'catheter care'];

type Input = {
  full_name: string;
  phone: string;
  email: string;
  role: 'nurse' | 'physiotherapist' | 'caregiver' | 'coordinator' | 'doctor';
  experience_years: number;
  area_coverage: string;
  is_active: boolean;
};

export function StaffForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const supabase = createClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState({ mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false });
  const form = useForm<Input>({ defaultValues: { full_name: '', phone: '', email: '', role: 'nurse', experience_years: 0, area_coverage: '', is_active: true } });
  if (!open) return null;
  const submit = async (values: Input) => {
    const res = await supabase.from('staff').insert({ ...values, skills, availability, area_coverage: values.area_coverage.split(',').map((x) => x.trim()) }).select('*').single();
    if (res.error) return toast.error(res.error.message);
    toast.success('Staff created'); onClose(); location.reload();
  };
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><form onSubmit={form.handleSubmit(submit)} className="h-full w-full max-w-md space-y-2 overflow-auto bg-white p-4"><h3 className="text-lg font-semibold">New Staff</h3>
    <input className="w-full rounded-md border p-2" placeholder="Full name" {...form.register('full_name', { required: true })} />
    <input className="w-full rounded-md border p-2" placeholder="Phone" {...form.register('phone')} />
    <input className="w-full rounded-md border p-2" placeholder="Email" {...form.register('email')} />
    <select className="w-full rounded-md border p-2" {...form.register('role')}>{['nurse','physiotherapist','caregiver','coordinator','doctor'].map(v => <option key={v}>{v}</option>)}</select>
    <div className="grid grid-cols-2 gap-2 text-xs">{skillsList.map((s) => <button key={s} type="button" className={`rounded border px-2 py-1 ${skills.includes(s) ? 'bg-[#052044] text-white' : ''}`} onClick={() => setSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}>{s}</button>)}</div>
    <input type="number" className="w-full rounded-md border p-2" placeholder="Experience years" {...form.register('experience_years', { valueAsNumber: true })} />
    <input className="w-full rounded-md border p-2" placeholder="Area coverage comma separated" {...form.register('area_coverage')} />
    <div className="grid grid-cols-4 gap-1 text-xs">{Object.keys(availability).map((d) => <button key={d} type="button" className={`rounded border px-2 py-1 ${availability[d as keyof typeof availability] ? 'bg-emerald-100' : ''}`} onClick={() => setAvailability((prev) => ({ ...prev, [d]: !prev[d as keyof typeof prev] }))}>{d}</button>)}</div>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register('is_active')} /> Active</label>
    <div className="flex gap-2"><button type="button" className="w-full rounded-md border p-2" onClick={onClose}>Cancel</button><button className="w-full rounded-md bg-[#052044] p-2 text-white">Save</button></div>
  </form></div>;
}
