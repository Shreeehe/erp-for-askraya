import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];

export async function getInvoices() {
  const supabase = createClient();
  return supabase.from('invoices').select('*').order('issued_at', { ascending: false });
}

export async function generateInvoiceNumber() {
  const supabase = createClient();
  const year = new Date().getFullYear();
  const prefix = `AHC-${year}-`;
  const { count } = await supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .like('invoice_number', `${prefix}%`);

  return `${prefix}${String((count ?? 0) + 1).padStart(4, '0')}`;
}

export async function createInvoice(payload: Omit<InvoiceInsert, 'invoice_number'>) {
  const supabase = createClient();
  const invoice_number = await generateInvoiceNumber();
  return supabase.from('invoices').insert({ ...payload, invoice_number }).select('*').single();
}

export async function markPaid(invoiceId: string) {
  const supabase = createClient();
  return supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId).select('*').single();
}
