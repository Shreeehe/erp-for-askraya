'use client';

import { useMemo } from 'react';
import { format, subMonths } from 'date-fns';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function exportCSV(name: string, data: Record<string, unknown>[]) {
  const keys = Object.keys(data[0] ?? {});
  const csv = [keys.join(','), ...data.map((r) => keys.map((k) => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.csv`;
  a.click();
}

export function ReportsClient({ invoices, schedules, leads, staff, patientCount }: { invoices: any[]; schedules: any[]; leads: any[]; staff: any[]; patientCount: number }) {
  const revenueByMonth = useMemo(() => Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const key = format(d, 'yyyy-MM');
    const total = invoices.filter((x) => (x.issued_at ?? '').slice(0, 7) === key && x.status === 'paid').reduce((s, x) => s + Number(x.total_amount), 0);
    return { month: format(d, 'MMM yy'), revenue: total };
  }), [invoices]);

  const visitsByService = useMemo(() => {
    const map = new Map<string, number>();
    schedules.forEach((s) => map.set(s.service_type ?? 'Unknown', (map.get(s.service_type ?? 'Unknown') ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [schedules]);

  const funnel = useMemo(() => {
    const statuses = ['new','contacted','qualified','proposal_sent','converted','lost'];
    return statuses.map((s) => ({ status: s, count: leads.filter((l) => l.status === s).length }));
  }, [leads]);

  const staffUtil = useMemo(() => staff.map((s) => ({ name: s.full_name, visits: schedules.filter((v) => v.staff_id === s.id).length })), [staff, schedules]);

  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + Number(i.total_amount), 0);
  const totalVisits = schedules.length;
  const converted = leads.filter((l) => l.status === 'converted').length;
  const conversionRate = leads.length ? (converted / leads.length) * 100 : 0;
  const avgVisitsPerPatient = patientCount ? totalVisits / patientCount : 0;

  const chart = (title: string, node: React.ReactNode, data: Record<string, unknown>[], key: string) => <div className="rounded-lg border bg-white p-4"><div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">{title}</h2><button className="rounded-md border px-2 py-1 text-xs" onClick={() => exportCSV(key, data)}>Export CSV</button></div><div className="h-64">{node}</div></div>;

  return <section className="space-y-4"><h1 className="text-2xl font-semibold text-[#052044]">Reports</h1><div className="grid gap-3 md:grid-cols-4"><div className="rounded-lg border bg-white p-3"><p className="text-xs text-slate-500">Total revenue</p><p className="text-xl font-semibold">₹{totalRevenue.toFixed(0)}</p></div><div className="rounded-lg border bg-white p-3"><p className="text-xs text-slate-500">Total visits</p><p className="text-xl font-semibold">{totalVisits}</p></div><div className="rounded-lg border bg-white p-3"><p className="text-xs text-slate-500">Conversion rate</p><p className="text-xl font-semibold">{conversionRate.toFixed(1)}%</p></div><div className="rounded-lg border bg-white p-3"><p className="text-xs text-slate-500">Avg visits / patient</p><p className="text-xl font-semibold">{avgVisitsPerPatient.toFixed(2)}</p></div></div>
    <div className="grid gap-4 md:grid-cols-2">
      {chart('Revenue by month', <ResponsiveContainer width="100%" height="100%"><BarChart data={revenueByMonth}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Bar dataKey="revenue" fill="#052044"/></BarChart></ResponsiveContainer>, revenueByMonth as any, 'revenue')}
      {chart('Visits by service type', <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={visitsByService} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} fill="#22d3ee"/><Tooltip/></PieChart></ResponsiveContainer>, visitsByService as any, 'visits_by_service')}
      {chart('Lead conversion funnel', <ResponsiveContainer width="100%" height="100%"><BarChart data={funnel} layout="vertical"><CartesianGrid strokeDasharray="3 3"/><XAxis type="number"/><YAxis dataKey="status" type="category"/><Tooltip/><Bar dataKey="count" fill="#16a34a"/></BarChart></ResponsiveContainer>, funnel as any, 'lead_funnel')}
      {chart('Staff utilisation', <ResponsiveContainer width="100%" height="100%"><BarChart data={staffUtil}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="visits" fill="#7c3aed"/></BarChart></ResponsiveContainer>, staffUtil as any, 'staff_utilisation')}
    </div></section>;
}
