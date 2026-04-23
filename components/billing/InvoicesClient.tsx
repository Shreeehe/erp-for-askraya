'use client';

import { useMemo, useState } from 'react';
import { StatusBadge } from '@/components/status-badge';
import { InvoiceForm } from './InvoiceForm';

export function InvoicesClient({ invoices, patients }: { invoices: any[]; patients: any[] }) {
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => invoices.filter((i) => status === 'all' || i.status === status), [invoices, status]);
  return <section className="space-y-4"><div className="flex items-center gap-2"><h1 className="text-2xl font-semibold text-[#052044]">Invoices</h1><select className="rounded-md border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All status</option>{['draft','sent','paid','overdue','cancelled'].map((s) => <option key={s}>{s}</option>)}</select><button className="ml-auto rounded-md bg-[#052044] px-3 py-2 text-white" onClick={() => setOpen(true)}>Generate Invoice</button></div>
    <div className="overflow-auto rounded-lg border bg-white"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Invoice #</th><th>Patient</th><th>Line items</th><th>Subtotal</th><th>GST</th><th>Total</th><th>Status</th><th>Due</th><th>Issued</th></tr></thead><tbody>{rows.map((i) => <tr key={i.id} className="border-t"><td className="p-2">{i.invoice_number}</td><td>{i.patients?.full_name ?? '-'}</td><td>{Array.isArray(i.line_items) ? i.line_items.length : 0}</td><td>₹{Number(i.subtotal).toFixed(2)}</td><td>₹{Number(i.gst_amount ?? 0).toFixed(2)}</td><td>₹{Number(i.total_amount).toFixed(2)}</td><td><StatusBadge status={i.status ?? 'draft'} /></td><td>{i.due_date ?? '-'}</td><td>{i.issued_at ? new Date(i.issued_at).toLocaleDateString('en-IN') : '-'}</td></tr>)}</tbody></table></div>
    <InvoiceForm open={open} onClose={() => setOpen(false)} patients={patients} />
  </section>;
}
