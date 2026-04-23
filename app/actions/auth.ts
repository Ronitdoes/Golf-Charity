'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { sendWelcomeEmail } from '@/emails/welcome';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;

  // Server-side validation fallback
  if (!email || !password || password.length < 8) {
    return { error: 'Invalid submission parameters' };
  }

  const supabase = await createServerSupabaseClient();

  try {
    // 1. Attempt standard registration
    const { data: initialData, error: initialError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    let data = initialData;
    const signupError = initialError;

    if (signupError) {
      console.error('[AUTH_SIGNUP_ERROR]', { message: signupError.message, email });
      return { error: signupError.message };
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          subscription_status: 'inactive',
        });

      // Send the welcome email (High-Fidelity Communication Trigger)
      try {
        await sendWelcomeEmail(email, fullName);
      } catch (emailError) {
        console.error('[WELCOME_EMAIL_FAILURE]', { email, error: emailError });
      }
    }
  } catch (err) {
    console.error('[AUTH_SIGNUP_CRITICAL]', err);
    return { error: 'A critical authentication fault occurred.' };
  }

  return { 
    isVerifying: true,
    success: 'Registration initiated! Please enter the 8-digit code sent to your email.' 
  };
}

export async function verifyEmailOTP(email: string, token: string) {
  if (!email || !token || token.length < 8) {
    return { error: 'Verification code must be at least 8 digits long' };
  }

  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) {
      console.error('[AUTH_VERIFY_ERROR]', error.message);
      return { error: error.message };
    }

    if (data.user) {
       // Profile already created by trigger or UPSERT in signUp
       return { success: 'Email confirmed! Redirecting to login...' };
    }
  } catch (err) {
    console.error('[AUTH_VERIFY_CRITICAL]', err);
    return { error: 'Internal verification fault' };
  }

  return { error: 'Verification failed' };
}

import { createClient } from '@supabase/supabase-js';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createServerSupabaseClient();
  let isAdmin = false;

  try {

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[AUTH_SIGNIN_ERROR]', { message: error.message, email });
      return { error: 'Invalid login credentials' };
    }

    // 2. High-Fidelity Verification Guard: Block access if email is not confirmed
    const isConfirmed = !!(authData.user?.email_confirmed_at || authData.user?.confirmed_at);
    
    if (authData.user && !isConfirmed) {
      // Force logout to clear any partial session state
      await supabase.auth.signOut();
      return { error: 'Security Protocol: Please verify your email address before accessing the platform.' };
    }

    // Role-based redirection logic fetch: Check database and environment secrets
    if (authData.user) {
      // 1. Check database-level flag
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', authData.user.id)
        .single();

      if (profile?.is_admin) {
        isAdmin = true;
      }
    }
  } catch (err) {
    console.error('[AUTH_SIGNIN_CRITICAL]', err);
    return { error: 'Internal security boundary fault.' };
  }

  if (isAdmin) {
    redirect('/admin');
  }

  redirect('/');
}

export async function signOut() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[AUTH_SIGNOUT_ERROR]', err);
  }
  redirect('/');
}
