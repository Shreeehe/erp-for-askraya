'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase/client';

const leadSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal('')),
  service_interest: z.enum(['home nursing', 'physiotherapy', 'eldercare', 'post-surgery', 'caregiver', 'other']),
  source: z.enum(['website', 'instagram', 'referral', 'walk-in', 'whatsapp', 'google', 'other']),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost']),
  assigned_to: z.string().optional().or(z.literal('')),
  notes: z.string().optional(),
  next_follow_up: z.string().optional()
});

type LeadInput = z.infer<typeof leadSchema>;

export function LeadForm({
  open,
  onClose,
  staff,
  initial
}: {
  open: boolean;
  onClose: () => void;
  staff: Database['public']['Tables']['staff']['Row'][];
  initial?: Database['public']['Tables']['leads']['Row'] | null;
}) {
  const supabase = createClient();

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      service_interest: 'home nursing',
      source: 'website',
      status: 'new',
      assigned_to: '',
      notes: '',
      next_follow_up: ''
    }
  });

  useEffect(() => {
    if (!initial) return;
    form.reset({
      full_name: initial.full_name,
      phone: initial.phone,
      email: initial.email ?? '',
      service_interest: (initial.service_interest as LeadInput['service_interest']) ?? 'home nursing',
      source: (initial.source as LeadInput['source']) ?? 'website',
      status: (initial.status as LeadInput['status']) ?? 'new',
      assigned_to: initial.assigned_to ?? '',
      notes: initial.notes ?? '',
      next_follow_up: initial.next_follow_up ? initial.next_follow_up.slice(0, 16) : ''
    });
  }, [initial, form]);

  if (!open) return null;

  const onSubmit = async (values: LeadInput) => {
    const payload = {
      ...values,
      email: values.email || null,
      assigned_to: values.assigned_to || null,
      next_follow_up: values.next_follow_up ? new Date(values.next_follow_up).toISOString() : null
    };

    const result = initial
      ? await supabase.from('leads').update(payload).eq('id', initial.id).select('*').single()
      : await supabase.from('leads').insert(payload).select('*').single();
    if (result.error) return toast.error(result.error.message);
    toast.success(initial ? 'Lead updated' : 'Lead created');
    onClose();
    location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full max-w-md space-y-3 overflow-auto bg-white p-4">
        <h3 className="text-lg font-semibold text-[#052044]">{initial ? 'Edit Lead' : 'New Lead'}</h3>
        <input className="w-full rounded-md border p-2" placeholder="Full name" {...form.register('full_name')} />
        <input className="w-full rounded-md border p-2" placeholder="Phone" {...form.register('phone')} />
        <input className="w-full rounded-md border p-2" placeholder="Email" {...form.register('email')} />
        <select className="w-full rounded-md border p-2" {...form.register('service_interest')}>
          {['home nursing', 'physiotherapy', 'eldercare', 'post-surgery', 'caregiver', 'other'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="w-full rounded-md border p-2" {...form.register('source')}>
          {['website', 'instagram', 'referral', 'walk-in', 'whatsapp', 'google', 'other'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="w-full rounded-md border p-2" {...form.register('status')}>
          {['new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="w-full rounded-md border p-2" {...form.register('assigned_to')}>
          <option value="">Unassigned</option>
          {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
        </select>
        <textarea className="w-full rounded-md border p-2" rows={3} placeholder="Notes" {...form.register('notes')} />
        <input type="datetime-local" className="w-full rounded-md border p-2" {...form.register('next_follow_up')} />
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="w-full rounded-md border px-3 py-2">Cancel</button>
          <button className="w-full rounded-md bg-[#052044] px-3 py-2 text-white">Save</button>
        </div>
      </form>
    </div>
  );
}
