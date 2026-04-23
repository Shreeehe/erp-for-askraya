'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginForm) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Welcome back');
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input className="w-full rounded-md border px-3 py-2" placeholder="you@aksraya.com" {...form.register('email')} />
        {form.formState.errors.email && <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <input type="password" className="w-full rounded-md border px-3 py-2" placeholder="••••••••" {...form.register('password')} />
        {form.formState.errors.password && <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>}
      </div>

      <button disabled={form.formState.isSubmitting} className="w-full rounded-md bg-[#052044] py-2 font-medium text-white disabled:opacity-70">
        {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
