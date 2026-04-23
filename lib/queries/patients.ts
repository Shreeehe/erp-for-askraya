import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type PatientInsert = Database['public']['Tables']['patients']['Insert'];
type PatientUpdate = Database['public']['Tables']['patients']['Update'];

export async function getPatients() {
  const supabase = createClient();
  return supabase.from('patients').select('*').order('created_at', { ascending: false });
}

export async function getPatientById(id: string) {
  const supabase = createClient();
  return supabase.from('patients').select('*').eq('id', id).single();
}

export async function createPatient(payload: PatientInsert) {
  const supabase = createClient();
  return supabase.from('patients').insert(payload).select('*').single();
}

export async function updatePatient(id: string, payload: PatientUpdate) {
  const supabase = createClient();
  return supabase.from('patients').update(payload).eq('id', id).select('*').single();
}
