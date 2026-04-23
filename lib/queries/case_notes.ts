import { createClient } from '@/lib/supabase/server';

export async function getCase_notes() {
  const supabase = createClient();
  return supabase.from('case_notes').select('*');
}
