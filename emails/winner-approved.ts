import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendWinnerApprovedEmail(to: string, fullName: string, amount: number) {
  const content = `
    <h1>CONGRATULATIONS - Win Approved!</h1>
    <p>Hi ${fullName}, your verification proof has been approved by our team.</p>
    <p>You'll receive a payment of <strong>£${amount.toLocaleString()}</strong> within 2-3 business days via your linked payout method (Stripe or Direct Refund).</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" class="cta">Review Winning Status</a>

    <p style="margin-top: 30px;">Thank you for being part of DigitalHero. Your win also helped generate major contributions to your selected charity!</p>
  `;

  return sendEmail({
    to,
    subject: 'Winning Verification Approved!',
    html: emailWrapper(content),
  });
}
