import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
  const bodyText = await req.text();
  const body = JSON.parse(bodyText);
  const signature = req.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature missing' }, { status: 400 });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[RAZORPAY_WEBHOOK_ERROR] RAZORPAY_WEBHOOK_SECRET missing');
    return NextResponse.json({ error: 'Configuration fault' }, { status: 500 });
  }

  // Verify signature using the raw body text as per Razorpay documentation
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(bodyText)
    .digest('hex');

  const isValid = expectedSignature === signature;

  if (!isValid) {
    console.error('[RAZORPAY_WEBHOOK_ERROR] Invalid signature');
    return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
  }

  const { event, payload } = body;

  // Handle specific events
  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = payload.payment?.entity;
    const order = payload.order?.entity;
    const notes = payment?.notes || order?.notes;
    
    if (notes && notes.userId) {
      // Use Admin client to bypass RLS for server-to-server updates
      const supabase = createAdminSupabaseClient();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_plan: notes.plan || 'monthly',
          updated_at: new Date().toISOString(),
        })
        .eq('id', notes.userId);

      if (error) {
        console.error('[RAZORPAY_WEBHOOK_DB_ERROR]', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`[RAZORPAY_WEBHOOK_SUCCESS] Updated user ${notes.userId} to ${notes.plan}`);
    }
  }

  return NextResponse.json({ status: 'ok' });
}
