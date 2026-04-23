import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertCircle, BarChart3, CalendarDays, ClipboardList, HeartPulse, LayoutDashboard, Menu, Receipt, UserCheck, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AdminShellClient } from '@/components/admin-shell-client';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Leads', href: '/leads', icon: Users },
  { label: 'Patients', href: '/patients', icon: HeartPulse },
  { label: 'Cases', href: '/cases', icon: AlertCircle },
  { label: 'Schedule', href: '/schedule', icon: CalendarDays },
  { label: 'Visits', href: '/visits', icon: ClipboardList },
  { label: 'Billing', href: '/billing/invoices', icon: Receipt },
  { label: 'Staff', href: '/staff', icon: UserCheck },
  { label: 'Reports', href: '/reports', icon: BarChart3 }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();

  const sidebar = (
    <aside className="h-full w-64 bg-[#052044] text-white">
      <div className="border-b border-white/20 p-4">
        <h2 className="text-xl font-semibold">Aksraya ERP</h2>
      </div>
      <nav className="space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/10">
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return <AdminShellClient sidebar={sidebar} userName={profile?.full_name ?? user.email ?? 'User'} menuIcon={<Menu size={18} />}>
    {children}
  </AdminShellClient>;
}
