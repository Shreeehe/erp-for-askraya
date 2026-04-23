import { createClient } from '@/lib/supabase/server';
import { MobileVisitsClient } from '@/components/MobileVisitsClient';

export default async function MyVisitsPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data: staff } = await supabase.from('staff').select('id').eq('profile_id', userId).single();
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);

  const { data: visits } = await supabase
    .from('visits')
    .select('*, patients(full_name, address), schedules(scheduled_at, service_type)')
    .eq('staff_id', staff?.id ?? '00000000-0000-0000-0000-000000000000')
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())
    .order('created_at', { ascending: true });

  return <MobileVisitsClient visits={visits ?? []} />;
}
