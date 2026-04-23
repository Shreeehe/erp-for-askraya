create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) not null,
  patient_id uuid references patients(id) not null,
  amount numeric(10,2) not null,
  method text check (method in ('upi','cash','bank_transfer','cheque','card')),
  reference_number text,
  paid_at timestamptz default now(),
  notes text,
  recorded_by uuid references profiles(id)
);
