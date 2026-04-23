import { createClient } from '@/lib/supabase/server';
import { StaffGrid } from '@/components/staff/StaffGrid';

export default async function StaffPage() {
  const supabase = createClient();
  const { data } = await supabase.from('staff').select('*').order('created_at', { ascending: false });
  return <StaffGrid staff={data ?? []} />;
}
