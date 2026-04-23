import { createClient } from '@/lib/supabase/server';
import { ScheduleBoard } from '@/components/ScheduleBoard';

export default async function SchedulePage({ searchParams }: { searchParams?: { week?: string } }) {
  const supabase = createClient();
  const weekStart = searchParams?.week ? new Date(searchParams.week) : new Date();
  const start = new Date(weekStart);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start); end.setDate(end.getDate() + 7);

  const [{ data: schedules }, { data: patients }, { data: staff }] = await Promise.all([
    supabase.from('schedules').select('*, patients(full_name), staff(full_name)').gte('scheduled_at', start.toISOString()).lt('scheduled_at', end.toISOString()),
    supabase.from('patients').select('*'),
    supabase.from('staff').select('*')
  ]);

  return <ScheduleBoard schedules={schedules ?? []} patients={patients ?? []} staff={staff ?? []} weekStartISO={start.toISOString()} />;
}
