import { createClient } from '@/lib/supabase/server';
import { VisitsTable } from '@/components/VisitsTable';

export default async function VisitsPage({ searchParams }: { searchParams?: { from?: string; to?: string } }) {
  const supabase = createClient();
  const from = searchParams?.from ? new Date(searchParams.from) : new Date();
  from.setHours(0,0,0,0);
  const to = searchParams?.to ? new Date(searchParams.to) : new Date();
  to.setHours(23,59,59,999);

  const { data } = await supabase
    .from('visits')
    .select('*, staff(full_name), patients(full_name, address), schedules(scheduled_at, service_type)')
    .gte('created_at', from.toISOString())
    .lte('created_at', to.toISOString())
    .order('created_at', { ascending: false });

  return <VisitsTable visits={data ?? []} from={from.toISOString().slice(0,10)} to={to.toISOString().slice(0,10)} />;
}
