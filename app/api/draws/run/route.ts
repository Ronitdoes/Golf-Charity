import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runDraw } from '@/lib/draw-runner';

// POST Endpoint strictly isolating mathematically explicit parameter configurations preventing generic global faults defensively dynamically natively
export async function POST(req: Request) {
  try {
     const body = await req.json();
     const { drawId, mode, logicType } = body;
     
     // 1. Authenticate Request header explicitly natively isolating user authorization inherently universally 
     const authHeader = req.headers.get('Authorization');
     if (!authHeader) {
         return NextResponse.json({ error: 'Missing physical authentication token globally dynamically missing intrinsically' }, { status: 401 });
     }

     const token = authHeader.replace('Bearer ', '');
     const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     );
     
     const { data: { user }, error: authError } = await supabase.auth.getUser(token);
     if (authError || !user) {
         return NextResponse.json({ error: 'Auth explicitly logically invalid tracking intrinsically globally natively blocked payload' }, { status: 401 });
     }

     // 2. Validate explicitly Admin Context securely structurally mathematically routing securely actively
     // Leverage securely instantiated Service Context internally safely natively
     const supabaseAdmin = createClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL!,
         process.env.SUPABASE_SERVICE_ROLE_KEY!
     );
     
     const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

     if (!profile?.is_admin) {
        return NextResponse.json({ error: 'Forbidden. Action physically bounds universally specifically natively only administrators.' }, { status: 403 });
     }

     if (!drawId) {
         return NextResponse.json({ error: 'ID formally mathematically organically missing universally intrinsically natively logically' }, { status: 400 });
     }

     // 3. Extrapolate sequentially generating mathematical targets internally mapping independently 
     // Defensively fallback generically explicitly logically isolating defaults
     const summary = await runDraw(drawId, mode || 'simulation', logicType || 'random');
     
     return NextResponse.json(summary);

  } catch (error: unknown) {
     const message = error instanceof Error ? error.message : 'Logical algorithmic intersection functionally explicitly tracking dropped intrinsically natively mathematically.';
     console.error('Core algorithmic mapping structurally fundamentally fault explicitly dynamically routing:', error);
     return NextResponse.json({ 
        error: message 
     }, { status: 500 });
  }
}
