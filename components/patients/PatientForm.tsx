'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().optional(),
  age: z.coerce.number().int().min(0).max(120),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().default('Bangalore'),
  diagnosis: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  status: z.enum(['active', 'inactive', 'discharged'])
});

type Input = z.infer<typeof schema>;

export function PatientForm({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Database['public']['Tables']['patients']['Row'] | null }) {
  const supabase = createClient();
  const form = useForm<Input>({ resolver: zodResolver(schema), defaultValues: { full_name: '', phone: '', email: '', age: 0, gender: 'male', address: '', area: '', city: 'Bangalore', diagnosis: '', emergency_contact_name: '', emergency_contact_phone: '', status: 'active' } });

  useEffect(() => {
    if (!initial) return;
    form.reset({ ...initial, age: initial.age ?? 0, gender: initial.gender ?? 'male', city: initial.city ?? 'Bangalore', status: initial.status });
  }, [initial, form]);

  if (!open) return null;

  const submit = async (values: Input) => {
    const payload = { ...values };
    const res = initial
      ? await supabase.from('patients').update(payload).eq('id', initial.id).select('*').single()
      : await supabase.from('patients').insert(payload).select('*').single();
    if (res.error) return toast.error(res.error.message);
    toast.success(initial ? 'Patient updated' : 'Patient created');
    onClose();
    location.reload();
  };

  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><form onSubmit={form.handleSubmit(submit)} className="h-full w-full max-w-md space-y-2 overflow-auto bg-white p-4"><h3 className="text-lg font-semibold">{initial ? 'Edit Patient' : 'New Patient'}</h3>
    <input className="w-full rounded-md border p-2" placeholder="Full name" {...form.register('full_name')} />
    <input className="w-full rounded-md border p-2" placeholder="Phone" {...form.register('phone')} />
    <input className="w-full rounded-md border p-2" placeholder="Email" {...form.register('email')} />
    <input type="number" className="w-full rounded-md border p-2" placeholder="Age" {...form.register('age')} />
    <select className="w-full rounded-md border p-2" {...form.register('gender')}>{['male','female','other'].map(v => <option key={v}>{v}</option>)}</select>
    <input className="w-full rounded-md border p-2" placeholder="Address" {...form.register('address')} />
    <input className="w-full rounded-md border p-2" placeholder="Area" {...form.register('area')} />
    <input className="w-full rounded-md border p-2" placeholder="City" {...form.register('city')} />
    <input className="w-full rounded-md border p-2" placeholder="Diagnosis" {...form.register('diagnosis')} />
    <input className="w-full rounded-md border p-2" placeholder="Emergency contact name" {...form.register('emergency_contact_name')} />
    <input className="w-full rounded-md border p-2" placeholder="Emergency contact phone" {...form.register('emergency_contact_phone')} />
    <select className="w-full rounded-md border p-2" {...form.register('status')}>{['active','inactive','discharged'].map(v => <option key={v}>{v}</option>)}</select>
    <div className="flex gap-2"><button type="button" onClick={onClose} className="w-full rounded-md border p-2">Cancel</button><button className="w-full rounded-md bg-[#052044] p-2 text-white">Save</button></div>
  </form></div>;
}
