import { createClient } from '@/lib/supabase/server';
import { LeadsBoard } from '@/components/leads/LeadsBoard';

export default async function LeadsPage() {
  const supabase = createClient();
  const [{ data: leads }, { data: staff }] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }),
    supabase.from('staff').select('*').eq('is_active', true)
  ]);

  return <section className="space-y-4"><h1 className="text-2xl font-semibold text-[#052044]">Leads</h1><LeadsBoard initialLeads={leads ?? []} staff={staff ?? []} /></section>;
}
