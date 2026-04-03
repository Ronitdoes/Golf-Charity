import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server Client (only for use in Server Components, Server Actions, or Route Handlers)
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(_name: string) {
          return cookieStore.get(_name)?.value
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          try {
            cookieStore.set({ name: _name, value: _value, ..._options })
          } catch (_error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(_name: string, _options: CookieOptions) {
          try {
            cookieStore.set({ name: _name, value: '', ..._options })
          } catch (_error) {
            // The `remove` method was called from a Server Component.
          }
        },
      },
    }
  )
}

// Admin Client (bypass RLS and manage users - Server Side Only)
export function createAdminSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        cookies: {
          get(_name: string) { return undefined },
          set(_name: string, _value: string, _options: CookieOptions) {},
          remove(_name: string, _options: CookieOptions) {},
        },
    }
  )
}


