import { createClient } from '@/lib/supabase/server';
import { ReportsClient } from '@/components/ReportsClient';

export default async function ReportsPage() {
  const supabase = createClient();
  const [invoicesRes, visitsRes, leadsRes, staffRes, patientsRes] = await Promise.all([
    supabase.from('invoices').select('*').order('issued_at', { ascending: true }),
    supabase.from('schedules').select('service_type, staff_id, scheduled_at'),
    supabase.from('leads').select('status'),
    supabase.from('staff').select('id, full_name'),
    supabase.from('patients').select('id')
  ]);

  return <ReportsClient invoices={invoicesRes.data ?? []} schedules={visitsRes.data ?? []} leads={leadsRes.data ?? []} staff={staffRes.data ?? []} patientCount={(patientsRes.data ?? []).length} />;
}
