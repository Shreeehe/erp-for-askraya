create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) not null,
  title text not null,
  type text check (type in ('clinical','complaint','follow-up','emergency','escalation','general')),
  priority text default 'normal' check (priority in ('low','normal','high','urgent')),
  status text default 'open' check (status in ('open','in-progress','resolved','closed')),
  assigned_to uuid references staff(id),
  notes text,
  resolution_notes text,
  opened_at timestamptz default now(),
  resolved_at timestamptz,
  created_by uuid references profiles(id)
);
