import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];
type LeadActivityInsert = Database['public']['Tables']['lead_activities']['Insert'];

export async function getLeads() {
  const supabase = createClient();
  return supabase.from('leads').select('*').order('created_at', { ascending: false });
}

export async function getLeadById(id: string) {
  const supabase = createClient();
  return supabase.from('leads').select('*').eq('id', id).single();
}

export async function createLead(payload: LeadInsert) {
  const supabase = createClient();
  return supabase.from('leads').insert(payload).select('*').single();
}

export async function updateLead(id: string, payload: LeadUpdate) {
  const supabase = createClient();
  return supabase.from('leads').update(payload).eq('id', id).select('*').single();
}

export async function convertLeadToPatient(leadId: string) {
  const supabase = createClient();
  const { data: lead, error } = await getLeadById(leadId);
  if (error || !lead) return { data: null, error };

  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .insert({
      full_name: lead.full_name,
      phone: lead.phone,
      email: lead.email,
      source_lead_id: lead.id
    })
    .select('*')
    .single();

  if (patientError || !patient) return { data: null, error: patientError };

  return supabase
    .from('leads')
    .update({ status: 'converted', patient_id: patient.id, converted_at: new Date().toISOString() })
    .eq('id', leadId)
    .select('*')
    .single();
}

export async function addLeadActivity(payload: LeadActivityInsert) {
  const supabase = createClient();
  return supabase.from('lead_activities').insert(payload).select('*').single();
}
