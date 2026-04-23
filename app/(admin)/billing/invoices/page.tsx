import { createClient } from '@/lib/supabase/server';
import { InvoicesClient } from '@/components/billing/InvoicesClient';

export default async function InvoicesPage() {
  const supabase = createClient();
  const [{ data: invoices }, { data: patients }] = await Promise.all([
    supabase.from('invoices').select('*, patients(full_name)').order('issued_at', { ascending: false }),
    supabase.from('patients').select('*')
  ]);

  return <InvoicesClient invoices={invoices ?? []} patients={patients ?? []} />;
}
