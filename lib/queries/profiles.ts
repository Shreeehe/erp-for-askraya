import { createClient } from '@/lib/supabase/server';

export async function getProfiles() {
  const supabase = createClient();
  return supabase.from('profiles').select('*');
}
