import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendSubscriptionRenewalEmail(to: string, fullName: string, renewalDate: string, amount: number) {
  const content = `
    <h1>Subscription Renewal Reminder</h1>
    <p>Hi ${fullName}, this is a friendly reminder that your DigitalHero subscription is set to auto-renew in 3 days.</p>
    
    <p><strong>Renewal Date:</strong> ${renewalDate}</p>
    <p><strong>Amount:</strong> £${amount.toLocaleString()}</p>
    
    <p>We'll process the payment automatically for you so you can continue playing and giving back.</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings" class="cta">Review Plan Settings</a>

    <p style="margin-top: 30px; font-size: 14px; font-style: italic;">Thank you for being part of DigitalHero. You are making a huge difference!</p>
  `;

  return sendEmail({
    to,
    subject: 'Upcoming Subscription Renewal',
    html: emailWrapper(content),
  });
}
