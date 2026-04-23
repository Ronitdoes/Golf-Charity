import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Supabase OAuth and magic link callback handler
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // If Supabase returned an error in the URL (e.g. link expired)
  if (error || errorDescription) {
    const msg = encodeURIComponent(errorDescription || error || 'Authentication failed');
    return NextResponse.redirect(`${origin}/login?error=${msg}`);
  }
  
  // Also handle optional next parameter to redirect user to specific destination
  // (Removed unused 'next' variable)
  
  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      // Redirect to login with a success message for a better user experience
      return NextResponse.redirect(`${origin}/login?success=Account+confirmed!+Please+log+in+to+continue.`);
    }

    // Specialized handling for PKCE errors (Common on mobile apps)
    if (exchangeError.message.includes('code verifier') || exchangeError.message.includes('PKCE')) {
       const msg = encodeURIComponent('Security verification failed. Please open the confirmation link in the SAME browser/tab you used to sign up.');
       return NextResponse.redirect(`${origin}/login?error=${msg}`);
    }

    // Redirect with the specific exchange error message
    const msg = encodeURIComponent(exchangeError.message || 'Invalid or expired login link');
    return NextResponse.redirect(`${origin}/login?error=${msg}`);
  }

  // Final fallback
  return NextResponse.redirect(`${origin}/login?error=Authentication+request+missing+verification+code`);
}
