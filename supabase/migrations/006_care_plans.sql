create table if not exists care_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) not null,
  case_id uuid references cases(id),
  services text[],
  frequency text,
  duration_weeks integer,
  special_instructions text,
  is_active boolean default true,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);
