create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) not null,
  staff_id uuid references staff(id) not null,
  care_plan_id uuid references care_plans(id),
  scheduled_at timestamptz not null,
  duration_minutes integer default 60,
  service_type text,
  status text default 'scheduled' check (status in ('scheduled','confirmed','in-progress','completed','cancelled','no-show')),
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);
