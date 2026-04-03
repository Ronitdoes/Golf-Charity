// Shared layout for authentication pages (login/signup)
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect users who are already logged in to the dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-[#070707]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full flex flex-col items-center max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-12 flex flex-col items-center group transition-all">
          <div className="w-16 h-16 rounded-3xl bg-green-500 mb-4 flex items-center justify-center shadow-[0_0_40px_-5px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform duration-500">
            <span className="text-neutral-950 font-black text-3xl">D</span>
          </div>
          <span className="text-sm font-black tracking-[0.4em] uppercase text-white/40 group-hover:text-white/60 transition-colors">Digital Heroes</span>
        </Link>

        {children}
      </div>
    </div>
  );
}
