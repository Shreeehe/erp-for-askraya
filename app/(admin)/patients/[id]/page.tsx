import { createClient } from '@/lib/supabase/server';
import { PatientDetailClient } from '@/components/patients/PatientDetailClient';

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [patientRes, casesRes, carePlanRes, visitsRes, invoicesRes, docsRes] = await Promise.all([
    supabase.from('patients').select('*').eq('id', params.id).single(),
    supabase.from('cases').select('*, staff(full_name)').eq('patient_id', params.id),
    supabase.from('care_plans').select('*').eq('patient_id', params.id).eq('is_active', true).limit(1).maybeSingle(),
    supabase.from('visits').select('*, staff(full_name), schedules(service_type, scheduled_at)').eq('patient_id', params.id).order('created_at', { ascending: false }),
    supabase.from('invoices').select('*').eq('patient_id', params.id).order('issued_at', { ascending: false }),
    supabase.storage.from('patient-docs').list(params.id)
  ]);

  if (!patientRes.data) return <div className="rounded-lg border bg-white p-4">Patient not found</div>;

  return <PatientDetailClient patient={patientRes.data} cases={casesRes.data ?? []} carePlan={carePlanRes.data} visits={visitsRes.data ?? []} invoices={invoicesRes.data ?? []} files={docsRes.data ?? []} />;
}
