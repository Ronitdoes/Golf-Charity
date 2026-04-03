import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Supabase OAuth and magic link callback handler
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Also handle optional next parameter to redirect user to specific destination
  const next = searchParams.get('next') ?? '/dashboard';
  
  if (code) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions if no code or exchange fails
  return NextResponse.redirect(`${origin}/login?error=Invalid+login+link`);
}
