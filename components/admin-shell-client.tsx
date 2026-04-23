'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const titleMap: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  patients: 'Patients',
  cases: 'Cases',
  schedule: 'Schedule',
  visits: 'Visits',
  billing: 'Billing',
  staff: 'Staff',
  reports: 'Reports'
};

export function AdminShellClient({ children, sidebar, userName, menuIcon }: { children: React.ReactNode; sidebar: React.ReactNode; userName: string; menuIcon: React.ReactNode; }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const title = useMemo(() => {
    const key = pathname.split('/')[1] || 'dashboard';
    return titleMap[key] ?? 'Admin';
  }, [pathname]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 md:grid md:grid-cols-[256px_1fr]">
      <div className="hidden md:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-30 md:hidden" onClick={() => setOpen(false)}>
        <div className="h-full w-64" onClick={(e) => e.stopPropagation()}>{sidebar}</div>
      </div>}
      <section>
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-md border p-2 md:hidden" onClick={() => setOpen((prev) => !prev)}>{menuIcon}</button>
            <h1 className="text-lg font-semibold text-[#052044]">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{userName}</span>
            <button onClick={signOut} className="rounded-md bg-[#052044] px-3 py-1.5 text-sm text-white">Logout</button>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </section>
    </div>
  );
}
