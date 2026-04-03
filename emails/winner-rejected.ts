import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendWinnerRejectedEmail(to: string, fullName: string, reason: string) {
  const content = `
    <h1>Draw Verification Update</h1>
    <p>Hi ${fullName}, we reviewed your score verification proof and unfortunately it was rejected.</p>
    
    <p><strong>Reason:</strong> ${reason}</p>
    
    <p>To claim your prize, you must provide a valid scorecard screenshot or photo. Please upload a clear photo of your official scorecards for the relevant month.</p>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" class="cta">Re-Upload Proof</a>

    <p style="margin-top: 30px; font-size: 14px; font-style: italic;">If you believe there was a mistake, please reach out directly at support@digitalhero.app.</p>
  `;

  return sendEmail({
    to,
    subject: 'Action Required: Verification Rejected',
    html: emailWrapper(content),
  });
}
