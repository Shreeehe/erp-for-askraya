'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StaffForm } from './StaffForm';

export function StaffGrid({ staff }: { staff: any[] }) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const toggle = async (id: string, active: boolean) => {
    await supabase.from('staff').update({ is_active: active }).eq('id', id);
    location.reload();
  };
  return <section className="space-y-4"><div className="flex items-center"><h1 className="text-2xl font-semibold text-[#052044]">Staff</h1><button className="ml-auto rounded-md bg-[#052044] px-3 py-2 text-white" onClick={() => setOpen(true)}>New Staff</button></div>
  <div className="grid gap-3 md:grid-cols-3">{staff.map((s) => <article key={s.id} className="rounded-lg border bg-white p-4"><div className="mb-2 flex items-center gap-2"><div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 font-semibold">{s.full_name.split(' ').map((x: string) => x[0]).slice(0,2).join('')}</div><div><Link href={`/staff/${s.id}`} className="font-semibold text-[#052044] underline">{s.full_name}</Link><p className="text-xs uppercase text-slate-500">{s.role}</p></div></div><p className="text-sm">Skills: {(s.skills ?? []).join(', ') || '-'}</p><p className="text-sm">Area: {(s.area_coverage ?? []).join(', ') || '-'}</p><label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={!!s.is_active} onChange={(e) => toggle(s.id, e.target.checked)} /> Active</label></article>)}</div>
  <StaffForm open={open} onClose={() => setOpen(false)} />
  </section>;
}
