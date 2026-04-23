import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type CaseInsert = Database['public']['Tables']['cases']['Insert'];
type CaseUpdate = Database['public']['Tables']['cases']['Update'];
type CaseNoteInsert = Database['public']['Tables']['case_notes']['Insert'];

export async function getCases() {
  const supabase = createClient();
  return supabase.from('cases').select('*').order('opened_at', { ascending: false });
}

export async function getCaseById(id: string) {
  const supabase = createClient();
  return supabase.from('cases').select('*').eq('id', id).single();
}

export async function createCase(payload: CaseInsert) {
  const supabase = createClient();
  return supabase.from('cases').insert(payload).select('*').single();
}

export async function updateCase(id: string, payload: CaseUpdate) {
  const supabase = createClient();
  return supabase.from('cases').update(payload).eq('id', id).select('*').single();
}

export async function addCaseNote(payload: CaseNoteInsert) {
  const supabase = createClient();
  return supabase.from('case_notes').insert(payload).select('*').single();
}
