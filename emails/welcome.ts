import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendWelcomeEmail(to: string, fullName: string) {
  const content = `
    <h1>Welcome to DigitalHero, ${fullName}!</h1>
    <p>You've officially joined the elite community of golfers supporting the causes that matter most.</p>
    <p><strong>Next steps:</strong></p>
    <ul>
      <li>Choose your monthly subscription plan.</li>
      <li>Pick a charity you want to support directly.</li>
      <li>Enter your last 5 Stableford scores into the dashboard.</li>
    </ul>
    <p>You must have exactly 5 scores entered to be eligible for the monthly draw.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta">Go to Dashboard</a>
  `;

  return sendEmail({
    to,
    subject: 'Welcome to DigitalHero!',
    html: emailWrapper(content),
  });
}
