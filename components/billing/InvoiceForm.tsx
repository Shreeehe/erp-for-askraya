'use client';

import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';

type Row = { description: string; sub_description?: string; days?: string; unit_rate: number; amount: number };

type Input = {
  patient_id: string;
  due_date: string;
  gst_rate: number;
  care_manager?: string;
  payment_reference?: string;
  payment_method?: string;
  payment_date?: string;
  items: Row[];
};

export function InvoiceForm({ open, onClose, patients }: { open: boolean; onClose: () => void; patients: Database['public']['Tables']['patients']['Row'][] }) {
  const supabase = createClient();
  const { control, register, handleSubmit, watch, setValue } = useForm<Input>({
    defaultValues: {
      patient_id: patients[0]?.id ?? '',
      due_date: '',
      gst_rate: 18,
      care_manager: '',
      payment_reference: '',
      payment_method: 'upi',
      payment_date: '',
      items: [{ description: '', sub_description: '', days: '', unit_rate: 0, amount: 0 }]
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const gstRate = Number(watch('gst_rate') ?? 18);
  const subtotal = useMemo(() => items.reduce((s, i) => s + Number(i.amount || 0), 0), [items]);
  const gst = subtotal * (gstRate / 100);
  const total = subtotal + gst;

  if (!open) return null;

  const submit = async (values: Input) => {
    const year = new Date().getFullYear();
    const { count } = await supabase.from('invoices').select('id', { count: 'exact', head: true }).like('invoice_number', `AHC-${year}-%`);
    const invoiceNumber = `AHC-${year}-${String((count ?? 0) + 1).padStart(4, '0')}`;
    const res = await supabase.from('invoices').insert({
      invoice_number: invoiceNumber,
      patient_id: values.patient_id,
      line_items: values.items,
      subtotal,
      gst_rate: gstRate,
      gst_amount: gst,
      total_amount: total,
      due_date: values.due_date,
      care_manager: values.care_manager || null,
      payment_reference: values.payment_reference || null,
      payment_method: values.payment_method || null,
      payment_date: values.payment_date || null
    }).select('*').single();
    if (res.error) return toast.error(res.error.message);
    toast.success('Invoice created');
    onClose();
    location.reload();
  };

  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><form onSubmit={handleSubmit(submit)} className="h-full w-full max-w-xl space-y-2 overflow-auto bg-white p-4"><h3 className="text-lg font-semibold">Generate Invoice</h3>
    <select className="w-full rounded-md border p-2" {...register('patient_id')}>{patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}</select>
    {fields.map((f, i) => {
      const unit = Number(items[i]?.unit_rate || 0);
      const amount = unit;
      if (amount !== Number(items[i]?.amount || 0)) setValue(`items.${i}.amount`, amount);
      return <div key={f.id} className="grid grid-cols-12 gap-2 rounded-md border p-2">
        <input className="col-span-4 rounded-md border p-2" placeholder="Description" {...register(`items.${i}.description` as const)} />
        <input className="col-span-4 rounded-md border p-2" placeholder="Sub-description" {...register(`items.${i}.sub_description` as const)} />
        <input className="col-span-2 rounded-md border p-2" placeholder="Days" {...register(`items.${i}.days` as const)} />
        <input type="number" className="col-span-2 rounded-md border p-2" placeholder="Unit" {...register(`items.${i}.unit_rate` as const, { valueAsNumber: true })} />
        <input type="number" className="col-span-2 rounded-md border p-2" placeholder="Amount" {...register(`items.${i}.amount` as const, { valueAsNumber: true })} readOnly />
        <button type="button" className="col-span-2 rounded-md border" onClick={() => remove(i)}>Remove</button>
      </div>
    })}
    <button type="button" className="rounded-md border px-3 py-2" onClick={() => append({ description: '', sub_description: '', days: '', unit_rate: 0, amount: 0 })}>Add line item</button>
    <input type="text" className="w-full rounded-md border p-2" placeholder="Care Manager" {...register('care_manager')} />
    <select className="w-full rounded-md border p-2" {...register('gst_rate', { valueAsNumber: true })}><option value={0}>0% exempted</option><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option></select>
    <input className="w-full rounded-md border p-2" placeholder="Payment Reference" {...register('payment_reference')} />
    <select className="w-full rounded-md border p-2" {...register('payment_method')}>{['upi','cash','bank','cheque','card'].map((m) => <option key={m} value={m}>{m.toUpperCase()}</option>)}</select>
    <input type="text" className="w-full rounded-md border p-2" placeholder="Payment Date" {...register('payment_date')} />
    <input type="date" className="w-full rounded-md border p-2" {...register('due_date')} />
    <div className="rounded-md bg-slate-100 p-3 text-sm">Subtotal: ₹{subtotal.toFixed(2)} | GST: ₹{gst.toFixed(2)} | Total: ₹{total.toFixed(2)}</div>
    <div className="flex gap-2"><button type="button" onClick={onClose} className="w-full rounded-md border p-2">Cancel</button><button className="w-full rounded-md bg-[#052044] p-2 text-white">Create</button></div>
  </form></div>;
}
