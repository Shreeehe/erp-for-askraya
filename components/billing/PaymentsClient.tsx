'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function PaymentsClient({ payments, unpaidInvoices }: { payments: any[]; unpaidInvoices: any[] }) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState(unpaidInvoices[0]?.id ?? '');
  const [amount, setAmount] = useState(unpaidInvoices[0]?.total_amount ?? 0);
  const [method, setMethod] = useState('upi');
  const [reference, setReference] = useState('');

  const record = async () => {
    const inv = unpaidInvoices.find((x) => x.id === invoiceId);
    if (!inv) return;
    const res = await supabase.from('payments').insert({ invoice_id: invoiceId, patient_id: inv.patient_id, amount: Number(amount), method: method as any, reference_number: reference }).select('*').single();
    if (res.error) return toast.error(res.error.message);
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId);
    toast.success('Payment recorded');
    location.reload();
  };

  return <section className="space-y-4"><div className="flex items-center"><h1 className="text-2xl font-semibold text-[#052044]">Payments</h1><button className="ml-auto rounded-md bg-[#052044] px-3 py-2 text-white" onClick={() => setOpen(true)}>Record Payment</button></div>
    <div className="overflow-auto rounded-lg border bg-white"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Invoice #</th><th>Patient</th><th>Amount</th><th>Method</th><th>Reference</th><th>Paid at</th><th>Recorded by</th></tr></thead><tbody>{payments.map((p) => <tr key={p.id} className="border-t"><td className="p-2">{p.invoices?.invoice_number ?? '-'}</td><td>{p.patients?.full_name ?? '-'}</td><td>₹{Number(p.amount).toFixed(2)}</td><td>{p.method}</td><td>{p.reference_number ?? '-'}</td><td>{p.paid_at ? new Date(p.paid_at).toLocaleString('en-IN') : '-'}</td><td>{p.profiles?.full_name ?? '-'}</td></tr>)}</tbody></table></div>
    {open && <div className="fixed inset-0 z-50 flex justify-end bg-black/30"><div className="h-full w-full max-w-md space-y-2 bg-white p-4"><h3 className="text-lg font-semibold">Record Payment</h3><select className="w-full rounded-md border p-2" value={invoiceId} onChange={(e) => { setInvoiceId(e.target.value); const inv = unpaidInvoices.find((x) => x.id === e.target.value); setAmount(inv?.total_amount ?? 0); }}>{unpaidInvoices.map((i) => <option key={i.id} value={i.id}>{i.invoice_number}</option>)}</select><input type="number" className="w-full rounded-md border p-2" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /><select className="w-full rounded-md border p-2" value={method} onChange={(e) => setMethod(e.target.value)}>{['upi','cash','bank_transfer','cheque','card'].map((m) => <option key={m}>{m}</option>)}</select><input className="w-full rounded-md border p-2" placeholder="Reference" value={reference} onChange={(e) => setReference(e.target.value)} /><div className="flex gap-2"><button className="w-full rounded-md border p-2" onClick={() => setOpen(false)}>Cancel</button><button className="w-full rounded-md bg-[#052044] p-2 text-white" onClick={record}>Save</button></div></div></div>}
  </section>;
}
