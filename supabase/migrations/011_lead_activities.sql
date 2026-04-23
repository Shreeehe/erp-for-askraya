create table if not exists lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) not null,
  type text check (type in ('call','whatsapp','email','meeting','note')),
  notes text,
  next_follow_up timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);
