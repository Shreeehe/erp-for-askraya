import { createClient } from '@/lib/supabase/server';
import { NurseVisitClient } from '@/components/NurseVisitClient';

export default async function NurseVisitDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: visit } = await supabase.from('visits').select('*, patients(full_name, address, diagnosis), schedules(service_type, scheduled_at)').eq('id', params.id).single();
  if (!visit) return <div className="rounded-lg border bg-white p-4">Visit not found</div>;
  return <NurseVisitClient visit={visit} />;
}
