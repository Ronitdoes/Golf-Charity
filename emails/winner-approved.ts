import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendWinnerApprovedEmail(to: string, fullName: string, amount: number) {
  const content = `
    <div class="email-eyebrow">✅ Verification Approved</div>
    <h1 class="email-heading">Your Prize is<br /><span>Confirmed!</span></h1>

    <p class="email-body">
      Hi ${fullName}, great news — our team has reviewed and approved your score verification proof.
      Your prize is now confirmed and payment is being processed.
    </p>

    <div class="data-panel">
      <div class="data-row">
        <span class="data-label">Verification Status</span>
        <span class="badge">Approved</span>
      </div>
      <div class="data-row">
        <span class="data-label">Prize Amount</span>
        <span class="data-value accent" style="font-size:24px; font-weight:900;">£${amount.toLocaleString()}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Payment ETA</span>
        <span class="data-value">2–3 Business Days</span>
      </div>
    </div>

    <div class="alert-success">
      🎉 Your prize payment of <strong>£${amount.toLocaleString()}</strong> is being sent via your linked payout method.
      Your win also generated a direct contribution to your selected charity — thank you for playing and giving back.
    </div>

    <div class="cta-wrap">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" class="cta">View Winning Status</a>
    </div>

    <p class="email-body" style="font-size:13px; text-align:center; margin-top:4px; color:#525252;">
      Questions about your payment? Contact us at <strong style="color:#e5e5e5;">support@digitalhero.app</strong>
    </p>
  `;

  return sendEmail({
    to,
    subject: `✅ Prize Approved — £${amount.toLocaleString()} Payment Processing | DigitalHero`,
    html: emailWrapper(content),
  });
}
