import { createClient } from '@/lib/supabase/server';

export async function getStaff() {
  const supabase = createClient();
  return supabase.from('staff').select('*').eq('is_active', true).order('full_name', { ascending: true });
}

export async function getStaffById(id: string) {
  const supabase = createClient();
  return supabase.from('staff').select('*').eq('id', id).single();
}
