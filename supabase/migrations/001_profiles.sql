create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text default 'viewer' check (role in ('admin','coordinator','nurse','billing','viewer')),
  avatar_url text,
  created_at timestamptz default now()
);
