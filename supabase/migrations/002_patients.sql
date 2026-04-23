create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  age integer,
  gender text check (gender in ('male','female','other')),
  address text,
  area text,
  city text default 'Bangalore',
  diagnosis text,
  emergency_contact_name text,
  emergency_contact_phone text,
  status text default 'active' check (status in ('active','inactive','discharged')),
  source_lead_id uuid,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);
