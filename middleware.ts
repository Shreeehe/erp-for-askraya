import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

type Role = Database['public']['Enums']['app_role'];
const ADMIN_ROLES: Role[] = ['admin', 'coordinator', 'billing'];

async function getRole(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value, ...(options as Parameters<typeof response.cookies.set>[0]) });
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value: '', ...(options as Parameters<typeof response.cookies.set>[0]), maxAge: 0 });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role ?? 'viewer';
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const role = await getRole(request, response);
  const { pathname } = request.nextUrl;

  const isNursePath = pathname.startsWith('/nurse') || pathname.startsWith('/my-visits') || pathname.startsWith('/visit');
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/leads') || pathname.startsWith('/patients') || pathname.startsWith('/cases') || pathname.startsWith('/schedule') || pathname.startsWith('/visits') || pathname.startsWith('/billing') || pathname.startsWith('/staff') || pathname.startsWith('/reports');

  if ((isNursePath || isAdminPath) && !role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isNursePath && role !== 'nurse') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isAdminPath && !ADMIN_ROLES.includes(role as Role)) {
    return NextResponse.redirect(new URL('/my-visits', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/nurse/:path*', '/dashboard/:path*', '/leads/:path*', '/patients/:path*', '/cases/:path*', '/schedule/:path*', '/visits/:path*', '/billing/:path*', '/staff/:path*', '/reports/:path*', '/my-visits/:path*', '/visit/:path*']
};
