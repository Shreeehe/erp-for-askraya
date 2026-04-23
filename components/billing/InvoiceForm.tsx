'use client';

import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';

type Row = { service: string; quantity: number; rate: number };

type Input = { patient_id: string; due_date: string; items: Row[] };

export function InvoiceForm({ open, onClose, patients }: { open: boolean; onClose: () => void; patients: Database['public']['Tables']['patients']['Row'][] }) {
  const supabase = createClient();
  const { control, register, handleSubmit, watch } = useForm<Input>({ defaultValues: { patient_id: patients[0]?.id ?? '', due_date: '', items: [{ service: '', quantity: 1, rate: 0 }] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const subtotal = useMemo(() => items.reduce((s, i) => s + (Number(i.quantity) * Number(i.rate)), 0), [items]);
  const gst = subtotal * 0.18;
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
      gst_rate: 18,
      gst_amount: gst,
      total_amount: total,
      due_date: values.due_date
    }).select('*').single();
    if (res.error) return toast.error(res.error.message);
    toast.success('Invoice created'); onClose(); location.reload();
  };

  return <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><form onSubmit={handleSubmit(submit)} className="h-full w-full max-w-xl space-y-2 overflow-auto bg-white p-4"><h3 className="text-lg font-semibold">Generate Invoice</h3>
    <select className="w-full rounded-md border p-2" {...register('patient_id')}>{patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}</select>
    {fields.map((f, i) => <div key={f.id} className="grid grid-cols-12 gap-2"><input className="col-span-5 rounded-md border p-2" placeholder="Service" {...register(`items.${i}.service` as const)} /><input type="number" className="col-span-2 rounded-md border p-2" {...register(`items.${i}.quantity` as const, { valueAsNumber: true })} /><input type="number" className="col-span-3 rounded-md border p-2" {...register(`items.${i}.rate` as const, { valueAsNumber: true })} /><button type="button" className="col-span-2 rounded-md border" onClick={() => remove(i)}>Remove</button></div>)}
    <button type="button" className="rounded-md border px-3 py-2" onClick={() => append({ service: '', quantity: 1, rate: 0 })}>Add line item</button>
    <input type="date" className="w-full rounded-md border p-2" {...register('due_date')} />
    <div className="rounded-md bg-slate-100 p-3 text-sm">Subtotal: ₹{subtotal.toFixed(2)} | GST: ₹{gst.toFixed(2)} | Total: ₹{total.toFixed(2)}</div>
    <div className="flex gap-2"><button type="button" onClick={onClose} className="w-full rounded-md border p-2">Cancel</button><button className="w-full rounded-md bg-[#052044] p-2 text-white">Create</button></div>
  </form></div>;
}
