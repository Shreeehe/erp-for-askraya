import { createClient } from '@/lib/supabase/server';
import { CasesTable } from '@/components/cases/CasesTable';

export default async function CasesPage() {
  const supabase = createClient();
  const [{ data: cases }, { data: patients }, { data: staff }] = await Promise.all([
    supabase.from('cases').select('*, patients(full_name), staff(full_name)').order('opened_at', { ascending: false }),
    supabase.from('patients').select('*'),
    supabase.from('staff').select('*')
  ]);
  return <section className="space-y-4"><h1 className="text-2xl font-semibold text-[#052044]">Cases</h1><CasesTable initialCases={cases ?? []} patients={patients ?? []} staff={staff ?? []} /></section>;
}
