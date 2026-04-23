import { createClient } from '@/lib/supabase/server';

export async function getLead_activities() {
  const supabase = createClient();
  return supabase.from('lead_activities').select('*');
}
