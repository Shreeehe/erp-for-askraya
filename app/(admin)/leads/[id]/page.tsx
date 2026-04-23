import { createClient } from '@/lib/supabase/server';
import { LeadDetailClient } from '@/components/leads/LeadDetailClient';

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: lead }, { data: activities }, { data: staff }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', params.id).single(),
    supabase.from('lead_activities').select('*').eq('lead_id', params.id).order('created_at', { ascending: false }),
    supabase.from('staff').select('*')
  ]);

  if (!lead) return <div className="rounded-lg border bg-white p-4">Lead not found</div>;

  let patientName: string | null = null;
  if (lead.patient_id) {
    const { data: patient } = await supabase.from('patients').select('full_name').eq('id', lead.patient_id).single();
    patientName = patient?.full_name ?? null;
  }

  return <LeadDetailClient lead={lead} activities={activities ?? []} staff={staff ?? []} patientName={patientName} />;
}
