create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  patient_id uuid references patients(id) not null,
  visit_ids uuid[],
  line_items jsonb not null,
  subtotal numeric(10,2) not null,
  gst_rate numeric(5,2) default 18,
  gst_amount numeric(10,2),
  total_amount numeric(10,2) not null,
  status text default 'draft' check (status in ('draft','sent','paid','overdue','cancelled')),
  due_date date,
  issued_at timestamptz default now(),
  created_by uuid references profiles(id)
);
