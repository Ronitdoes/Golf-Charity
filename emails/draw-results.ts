import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendDrawResultsEmail(
  to: string,
  fullName: string,
  month: string,
  drawnNumbers: number[],
  userScores: number[],
  matchCount: number
) {
  // Build number chips — mark matched scores
  const matchedScores = new Set(
    userScores.filter(s => drawnNumbers.includes(s))
  );

  const drawnChips = drawnNumbers
    .map(n => {
      const isMatch = userScores.includes(n);
      return `<span class="number-chip${isMatch ? ' match' : ''}">${n}</span>`;
    })
    .join('');

  const userChips = userScores
    .map(n => {
      const isMatch = matchedScores.has(n);
      return `<span class="number-chip${isMatch ? ' match' : ' neutral'}">${n}</span>`;
    })
    .join('');

  const isWinner = matchCount >= 3;

  const resultBanner = isWinner
    ? `<div class="alert-success">
        🎉 <strong>You won!</strong> You matched <strong>${matchCount} number${matchCount > 1 ? 's' : ''}</strong> in the ${month} draw.
        Head to your dashboard to view your prize amount and submit verification proof.
      </div>`
    : `<div class="alert-warning">
        You matched <strong>${matchCount} number${matchCount !== 1 ? 's' : ''}</strong> this month.
        Keep your scores updated — you need 5 scores on file for next month's draw.
      </div>`;

  const content = `
    <div class="email-eyebrow">Draw Results — ${month}</div>
    <h1 class="email-heading">Monthly Draw<br /><span>Results</span></h1>

    <p class="email-body">
      Hi ${fullName}, the official numbers for the <strong style="color:#e5e5e5;">${month}</strong> draw have been published.
      Here's a full breakdown of how your scores compared.
    </p>

    <div class="data-panel">
      <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#525252; margin-bottom:12px;">Official Numbers Drawn</p>
      <div class="numbers-grid">${drawnChips}</div>

      <div style="border-top:1px solid rgba(255,255,255,0.05); margin: 16px 0;"></div>

      <p style="font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#525252; margin-bottom:12px;">Your Scores</p>
      <div class="numbers-grid">${userChips}</div>

      <div style="border-top:1px solid rgba(255,255,255,0.05); margin: 16px 0;"></div>

      <div class="data-row">
        <span class="data-label">Total Matches</span>
        <span class="data-value ${isWinner ? 'accent' : ''}">${matchCount} of 5</span>
      </div>
      <div class="data-row">
        <span class="data-label">Result</span>
        <span class="badge" style="${isWinner ? '' : 'background:rgba(255,255,255,0.03); border-color:rgba(255,255,255,0.08); color:#737373;'}">${isWinner ? '🏆 WINNER' : 'NO PRIZE'}</span>
      </div>
    </div>

    ${resultBanner}

    <div class="cta-wrap">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" class="cta">${isWinner ? 'Claim Your Prize' : 'View Dashboard'}</a>
    </div>
  `;

  return sendEmail({
    to,
    subject: isWinner
      ? `🏆 You Won the ${month} Draw — DigitalHero Results`
      : `Monthly Draw Results — ${month} | DigitalHero`,
    html: emailWrapper(content),
  });
}
