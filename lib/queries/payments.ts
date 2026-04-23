import { createClient } from '@/lib/supabase/server';

export async function getPayments() {
  const supabase = createClient();
  return supabase.from('payments').select('*');
}
