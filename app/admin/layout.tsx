// Administrative root layout protecting admin routes and providing consistent sidebar/shell
import { createServerSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return redirect('/dashboard');
  }

  return (
    <AdminLayout adminName={profile.full_name || 'Admin User'}>
      {children}
    </AdminLayout>
  );
}
