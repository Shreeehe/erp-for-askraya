'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/status-badge';
import { PatientForm } from './PatientForm';
import type { Database } from '@/types/supabase';

export function PatientsTable({ initialPatients }: { initialPatients: Database['public']['Tables']['patients']['Row'][] }) {
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [area, setArea] = useState('all');

  const rows = useMemo(() => initialPatients.filter((p) =>
    (p.full_name.toLowerCase().includes(query.toLowerCase()) || (p.phone ?? '').includes(query)) &&
    (status === 'all' || p.status === status) &&
    (area === 'all' || p.area === area)
  ), [initialPatients, query, status, area]);

  const areas = [...new Set(initialPatients.map((p) => p.area).filter(Boolean))] as string[];

  return <div className="space-y-3"><div className="flex flex-wrap gap-2"><input className="rounded-md border px-3 py-2" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} /><select className="rounded-md border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All status</option>{['active','inactive','discharged'].map((v) => <option key={v}>{v}</option>)}</select><select className="rounded-md border px-3 py-2" value={area} onChange={(e) => setArea(e.target.value)}><option value="all">All areas</option>{areas.map((v) => <option key={v}>{v}</option>)}</select><button className="ml-auto rounded-md bg-[#052044] px-3 py-2 text-white" onClick={() => setShowForm(true)}>New Patient</button></div>
    <div className="overflow-auto rounded-lg border bg-white"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Name</th><th>Phone</th><th>Age</th><th>Gender</th><th>Diagnosis</th><th>Area</th><th>Status</th><th>Created</th></tr></thead><tbody>{rows.map((p) => <tr key={p.id} className="border-t"><td className="p-2"><Link href={`/patients/${p.id}`} className="underline text-[#052044]">{p.full_name}</Link></td><td>{p.phone}</td><td>{p.age ?? '-'}</td><td>{p.gender ?? '-'}</td><td>{p.diagnosis ?? '-'}</td><td>{p.area ?? '-'}</td><td><StatusBadge status={p.status} /></td><td>{p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN') : '-'}</td></tr>)}</tbody></table></div>
    <PatientForm open={showForm} onClose={() => setShowForm(false)} />
  </div>;
}
