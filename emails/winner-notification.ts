import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendWinnerNotification(
  to: string, 
  fullName: string, 
  amount: number, 
  matchCount: 3 | 4 | 5, 
  month: string
) {
  const content = `
    <h1>CONGRATULATIONS, WINNER!</h1>
    <p>Hi ${fullName}, we have some exciting news!</p>
    <p>You matched <strong>${matchCount} numbers</strong> in the ${month} draw, and you've won a prize of <strong>£${amount.toLocaleString()}!</strong></p>
    
    <p> To claim your prize, we need to verify your scores. Please upload a screenshot or photo of your most recent scorecards from your golf club's official app or handicap system.</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" class="cta">Submit Proof of Winning</a>
    
    <p style="margin-top: 20px; font-size: 14px; font-style: italic;">Verification typically takes 2-4 business days. Once approved, you'll receive another automated confirmation.</p>
  `;

  return sendEmail({
    to,
    subject: `YOU WON! - DigitalHero Monthly Draw`,
    html: emailWrapper(content),
  });
}
