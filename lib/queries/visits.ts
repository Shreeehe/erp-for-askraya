import { startOfDay } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/types/supabase';

export async function getVisits() {
  const supabase = createClient();
  return supabase.from('visits').select('*').order('created_at', { ascending: false });
}

export async function getTodaysVisits() {
  const supabase = createClient();
  return supabase.from('visits').select('*').gte('created_at', startOfDay(new Date()).toISOString()).order('created_at', { ascending: true });
}

export async function checkIn(id: string, vitals?: Json) {
  const supabase = createClient();
  return supabase
    .from('visits')
    .update({ checked_in_at: new Date().toISOString(), status: 'checked-in', ...(vitals ? { vitals } : {}) })
    .eq('id', id)
    .select('*')
    .single();
}

export async function checkOut(id: string, visit_notes?: string) {
  const supabase = createClient();
  return supabase
    .from('visits')
    .update({ checked_out_at: new Date().toISOString(), status: 'completed', visit_notes })
    .eq('id', id)
    .select('*')
    .single();
}
