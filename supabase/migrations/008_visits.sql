create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references schedules(id),
  patient_id uuid references patients(id) not null,
  staff_id uuid references staff(id) not null,
  checked_in_at timestamptz,
  checked_out_at timestamptz,
  visit_notes text,
  vitals jsonb,
  status text default 'pending' check (status in ('pending','checked-in','completed','cancelled')),
  created_at timestamptz default now()
);
