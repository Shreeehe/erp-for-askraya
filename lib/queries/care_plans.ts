import { createClient } from '@/lib/supabase/server';

export async function getCare_plans() {
  const supabase = createClient();
  return supabase.from('care_plans').select('*');
}
