import { endOfWeek, startOfWeek } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type ScheduleInsert = Database['public']['Tables']['schedules']['Insert'];

export async function getSchedules() {
  const supabase = createClient();
  return supabase.from('schedules').select('*').order('scheduled_at', { ascending: true });
}

export async function getWeekSchedule(anchorDate = new Date()) {
  const supabase = createClient();
  return supabase
    .from('schedules')
    .select('*')
    .gte('scheduled_at', startOfWeek(anchorDate, { weekStartsOn: 1 }).toISOString())
    .lte('scheduled_at', endOfWeek(anchorDate, { weekStartsOn: 1 }).toISOString())
    .order('scheduled_at', { ascending: true });
}

export async function createSchedule(payload: ScheduleInsert) {
  const supabase = createClient();
  const { data, error } = await supabase.from('schedules').insert(payload).select('*').single();
  if (error || !data) return { data: null, error };

  const visit = await supabase.from('visits').insert({
    schedule_id: data.id,
    patient_id: data.patient_id,
    staff_id: data.staff_id,
    status: 'pending'
  }).select('*').single();

  if (visit.error) return { data: null, error: visit.error };
  return { data, error: null };
}
