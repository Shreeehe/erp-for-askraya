create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  service_interest text,
  source text check (source in ('website','instagram','referral','walk-in','whatsapp','google','other')),
  status text default 'new' check (status in ('new','contacted','qualified','proposal_sent','converted','lost')),
  assigned_to uuid references staff(id),
  notes text,
  next_follow_up timestamptz,
  converted_at timestamptz,
  patient_id uuid references patients(id),
  lost_reason text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);
