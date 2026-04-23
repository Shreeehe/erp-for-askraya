create table if not exists case_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) not null,
  note text not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);
