import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendWinnerNotification(
  to: string,
  fullName: string,
  amount: number,
  matchCount: 3 | 4 | 5,
  month: string
) {
  const tierLabel =
    matchCount === 5 ? 'JACKPOT — 5 MATCHES' :
    matchCount === 4 ? 'MAJOR WIN — 4 MATCHES' :
    'PRIZE WIN — 3 MATCHES';

  const content = `
    <div class="email-eyebrow">🏆 You Won the ${month} Draw</div>
    <h1 class="email-heading">Congratulations,<br /><span>${fullName}!</span></h1>

    <p class="email-body">
      The numbers have been drawn and your scores delivered a match. You're a winner in this month's DigitalHero prize draw.
    </p>

    <div class="data-panel">
      <div class="data-row">
        <span class="data-label">Draw Month</span>
        <span class="data-value">${month}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Match Count</span>
        <span class="data-value accent">${matchCount} of 5</span>
      </div>
      <div class="data-row">
        <span class="data-label">Prize Tier</span>
        <span class="badge">${tierLabel}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Prize Amount</span>
        <span class="data-value accent" style="font-size:20px;">£${amount.toLocaleString()}</span>
      </div>
    </div>

    <div class="alert-warning">
      <strong>Action required:</strong> To release your prize, you must verify your scores. Upload a clear screenshot or photo of your official scorecards from your golf club's app or handicap system.
    </div>

    <div class="cta-wrap">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" class="cta">Submit Proof &amp; Claim Prize</a>
    </div>

    <p class="email-body" style="font-size:12px; text-align:center; color:#525252; margin-top:4px;">
      Verification typically takes 2–4 business days. You'll receive a confirmation once approved.
    </p>
  `;

  return sendEmail({
    to,
    subject: `🏆 YOU WON £${amount.toLocaleString()} — DigitalHero ${month} Draw`,
    html: emailWrapper(content),
  });
}
