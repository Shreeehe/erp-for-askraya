import { createClient } from '@/lib/supabase/server';
import { startOfMonth } from 'date-fns';

export default async function StaffDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [staffRes, upcomingRes, monthCountRes] = await Promise.all([
    supabase.from('staff').select('*').eq('id', params.id).single(),
    supabase.from('schedules').select('*, patients(full_name)').eq('staff_id', params.id).gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(10),
    supabase.from('visits').select('id', { count: 'exact', head: true }).eq('staff_id', params.id).gte('created_at', startOfMonth(new Date()).toISOString())
  ]);

  const s = staffRes.data;
  if (!s) return <div className="rounded-lg border bg-white p-4">Staff not found</div>;

  return <section className="space-y-4"><div className="rounded-lg border bg-white p-4"><div className="flex items-center justify-between"><h1 className="text-2xl font-semibold text-[#052044]">{s.full_name}</h1><button className="rounded-md border px-3 py-2">Edit</button></div><div className="mt-2 grid gap-2 text-sm md:grid-cols-2"><p><b>Role:</b> {s.role}</p><p><b>Phone:</b> {s.phone}</p><p><b>Email:</b> {s.email}</p><p><b>Experience:</b> {s.experience_years ?? 0} years</p><p><b>Skills:</b> {(s.skills ?? []).join(', ')}</p><p><b>Area coverage:</b> {(s.area_coverage ?? []).join(', ')}</p></div></div>
  <div className="rounded-lg border bg-white p-4"><h2 className="mb-2 font-semibold">Upcoming Assigned Visits</h2><ul className="space-y-2 text-sm">{(upcomingRes.data ?? []).map((v) => <li key={v.id} className="rounded border p-2">{new Date(v.scheduled_at).toLocaleString('en-IN')} · {v.patients?.full_name ?? '-'}</li>)}</ul></div>
  <div className="rounded-lg border bg-white p-4"><h2 className="font-semibold">This Month's Visit Count</h2><p className="text-2xl font-semibold text-[#052044]">{monthCountRes.count ?? 0}</p></div>
  </section>;
}
