create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  full_name text not null,
  phone text,
  email text,
  role text check (role in ('nurse','physiotherapist','caregiver','coordinator','doctor')),
  skills text[],
  experience_years integer,
  availability jsonb default '{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true,"sat":false,"sun":false}',
  area_coverage text[],
  is_active boolean default true,
  joined_at date,
  created_at timestamptz default now()
);
