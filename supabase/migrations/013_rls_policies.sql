alter table profiles enable row level security;
alter table patients enable row level security;
alter table staff enable row level security;
alter table leads enable row level security;
alter table cases enable row level security;
alter table care_plans enable row level security;
alter table schedules enable row level security;
alter table visits enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table lead_activities enable row level security;
alter table case_notes enable row level security;

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select role from profiles where id = auth.uid()
$$;

create policy "admin full access profiles" on profiles for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

create policy "read all patients by allowed roles" on patients for select using (public.current_role() in ('admin','coordinator','nurse','billing','viewer'));
create policy "write patients by admin coordinator" on patients for all using (public.current_role() in ('admin','coordinator')) with check (public.current_role() in ('admin','coordinator'));

create policy "leads coordinator admin" on leads for all using (public.current_role() in ('admin','coordinator')) with check (public.current_role() in ('admin','coordinator'));
create policy "cases coordinator admin" on cases for all using (public.current_role() in ('admin','coordinator')) with check (public.current_role() in ('admin','coordinator'));
create policy "care plans coordinator admin" on care_plans for all using (public.current_role() in ('admin','coordinator')) with check (public.current_role() in ('admin','coordinator'));
create policy "schedules coordinator admin nurse read" on schedules for select using (public.current_role() in ('admin','coordinator','nurse','viewer','billing'));
create policy "schedules write" on schedules for insert with check (public.current_role() in ('admin','coordinator'));
create policy "schedules update" on schedules for update using (public.current_role() in ('admin','coordinator'));

create policy "visits nurse own" on visits for select using (public.current_role() = 'admin' or (public.current_role() = 'nurse' and staff_id in (select id from staff where profile_id = auth.uid())) or public.current_role() in ('coordinator','billing','viewer'));
create policy "visits nurse update own" on visits for update using (public.current_role() = 'admin' or (public.current_role() = 'nurse' and staff_id in (select id from staff where profile_id = auth.uid())));
create policy "visits coordinator insert" on visits for insert with check (public.current_role() in ('admin','coordinator'));

create policy "invoices billing" on invoices for all using (public.current_role() in ('admin','billing')) with check (public.current_role() in ('admin','billing'));
create policy "payments billing" on payments for all using (public.current_role() in ('admin','billing')) with check (public.current_role() in ('admin','billing'));

create policy "lead activities coordinator" on lead_activities for all using (public.current_role() in ('admin','coordinator')) with check (public.current_role() in ('admin','coordinator'));
create policy "case notes coordinator nurse" on case_notes for all using (public.current_role() in ('admin','coordinator','nurse')) with check (public.current_role() in ('admin','coordinator','nurse'));
