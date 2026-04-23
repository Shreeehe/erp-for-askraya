import { createClient } from '@/lib/supabase/server';
import { PaymentsClient } from '@/components/billing/PaymentsClient';

export default async function PaymentsPage() {
  const supabase = createClient();
  const [{ data: payments }, { data: invoices }] = await Promise.all([
    supabase.from('payments').select('*, invoices(invoice_number), patients(full_name), profiles(full_name)').order('paid_at', { ascending: false }),
    supabase.from('invoices').select('id, invoice_number, total_amount, status, patient_id').neq('status', 'paid')
  ]);
  return <PaymentsClient payments={payments ?? []} unpaidInvoices={invoices ?? []} />;
}
