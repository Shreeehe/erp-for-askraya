import { createClient } from '@/lib/supabase/server';
import { PatientsTable } from '@/components/patients/PatientsTable';

export default async function PatientsPage() {
  const supabase = createClient();
  const { data: patients } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
  return <section className="space-y-4"><h1 className="text-2xl font-semibold text-[#052044]">Patients</h1><PatientsTable initialPatients={patients ?? []} /></section>;
}
