import { createClient } from '@/lib/supabase/server';
import { CaseDetailClient } from '@/components/cases/CaseDetailClient';

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: caseRow }, { data: notes }, { data: staff }] = await Promise.all([
    supabase.from('cases').select('*, patients(full_name)').eq('id', params.id).single(),
    supabase.from('case_notes').select('*').eq('case_id', params.id).order('created_at', { ascending: false }),
    supabase.from('staff').select('*')
  ]);

  if (!caseRow) return <div className="rounded-lg border bg-white p-4">Case not found</div>;

  return <CaseDetailClient caseRow={caseRow} notes={notes ?? []} staff={staff ?? []} />;
}
