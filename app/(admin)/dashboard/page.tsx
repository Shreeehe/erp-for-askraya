import { startOfDay, subDays } from 'date-fns';
import { KpiCard } from '@/components/kpi-card';
import { StatusBadge } from '@/components/status-badge';
import { createClient } from '@/lib/supabase/server';
import { formatINR, formatIST } from '@/lib/utils';
import { VisitsBarChart } from '@/components/visits-bar-chart';

export default async function DashboardPage() {
  const supabase = createClient();
  const now = new Date();
  const todayStart = startOfDay(now).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const last7Start = subDays(startOfDay(now), 6).toISOString();

  const [patientsRes, leadsRes, todayVisitsRes, casesRes, paidInvoicesRes, weekVisitsRes, todaySchedulesRes] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).in('status', ['new', 'contacted', 'qualified', 'proposal_sent']),
    supabase.from('visits').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('cases').select('id', { count: 'exact', head: true }).in('status', ['open', 'in-progress']),
    supabase.from('invoices').select('total_amount').eq('status', 'paid').gte('issued_at', monthStart),
    supabase.from('visits').select('created_at').gte('created_at', last7Start),
    supabase
      .from('schedules')
      .select('id, scheduled_at, service_type, status, patients(full_name), staff(full_name)')
      .gte('scheduled_at', todayStart)
      .order('scheduled_at', { ascending: true })
      .limit(10)
  ]);

  const revenue = (paidInvoicesRes.data ?? []).reduce((sum, item) => sum + Number(item.total_amount), 0);

  const visitsByDay = Array.from({ length: 7 }).map((_, idx) => {
    const day = subDays(startOfDay(now), 6 - idx);
    const key = day.toISOString().slice(0, 10);
    const count = (weekVisitsRes.data ?? []).filter((v) => (v.created_at ?? '').slice(0, 10) === key).length;
    return { label: formatIST(day, 'dd MMM'), visits: count };
  });

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        <KpiCard label="Active Patients" value={patientsRes.count ?? 0} />
        <KpiCard label="Open Leads" value={leadsRes.count ?? 0} />
        <KpiCard label="Today's Visits" value={todayVisitsRes.count ?? 0} />
        <KpiCard label="Open Cases" value={casesRes.count ?? 0} />
        <KpiCard label="Monthly Revenue" value={formatINR(revenue)} />
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold text-[#052044]">Visits in Last 7 Days</h2>
        <VisitsBarChart data={visitsByDay} />
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold text-[#052044]">Today's Scheduled Visits</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-600">
                <th className="py-2">Patient</th>
                <th>Staff</th>
                <th>Time</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(todaySchedulesRes.data ?? []).map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="py-2">{(row.patients as { full_name?: string } | null)?.full_name ?? '-'}</td>
                  <td>{(row.staff as { full_name?: string } | null)?.full_name ?? '-'}</td>
                  <td>{formatIST(row.scheduled_at)}</td>
                  <td>{row.service_type ?? '-'}</td>
                  <td><StatusBadge status={row.status ?? 'scheduled'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
