'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';

const schema = z.object({
  patient_id: z.string().uuid(),
  title: z.string().min(3),
  type: z.enum(['clinical','complaint','follow-up','emergency','escalation','general']),
  priority: z.enum(['low','normal','high','urgent']),
  assigned_to: z.string().optional().or(z.literal('')),
  notes: z.string().optional()
});

type Input = z.infer<typeof schema>;

export function CaseForm({ open, onClose, patients, staff }: { open: boolean; onClose: () => void; patients: Database['public']['Tables']['patients']['Row'][]; staff: Database['public']['Tables']['staff']['Row'][] }) {
  const supabase = createClient();
  const form = useForm<Input>({ resolver: zodResolver(schema), defaultValues: { patient_id: patients[0]?.id ?? '', title: '', type: 'clinical', priority: 'normal', assigned_to: '', notes: '' } });
  if (!open) return null;
  const submit = async (values: Input) => {
    const res = await supabase.from('cases').insert({ ...values, assigned_to: values.assigned_to || null }).select('*').single();
    if (res.error) return toast.error(res.error.message);
    toast.success('Case created'); onClose(); location.reload();
  };
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><form onSubmit={form.handleSubmit(submit)} className="h-full w-full max-w-md space-y-2 overflow-auto bg-white p-4"><h3 className="text-lg font-semibold">New Case</h3>
    <select className="w-full rounded-md border p-2" {...form.register('patient_id')}>{patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}</select>
    <input className="w-full rounded-md border p-2" placeholder="Title" {...form.register('title')} />
    <select className="w-full rounded-md border p-2" {...form.register('type')}>{['clinical','complaint','follow-up','emergency','escalation','general'].map(v => <option key={v}>{v}</option>)}</select>
    <select className="w-full rounded-md border p-2" {...form.register('priority')}>{['low','normal','high','urgent'].map(v => <option key={v}>{v}</option>)}</select>
    <select className="w-full rounded-md border p-2" {...form.register('assigned_to')}><option value="">Unassigned</option>{staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}</select>
    <textarea className="w-full rounded-md border p-2" rows={3} placeholder="Notes" {...form.register('notes')} />
    <div className="flex gap-2"><button type="button" onClick={onClose} className="w-full rounded-md border p-2">Cancel</button><button className="w-full rounded-md bg-[#052044] p-2 text-white">Create</button></div>
  </form></div>;
}
