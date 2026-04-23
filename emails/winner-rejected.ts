import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendWinnerRejectedEmail(to: string, fullName: string, reason: string) {
  const content = `
    <div class="email-eyebrow">Verification Update</div>
    <h1 class="email-heading">Action Required:<br /><span style="color:#ef4444;">Proof Rejected</span></h1>

    <p class="email-body">
      Hi ${fullName}, our team reviewed your score verification submission and unfortunately it did not meet our verification requirements.
      Your prize is still on hold — you can re-submit with corrected proof at any time.
    </p>

    <div class="data-panel">
      <div class="data-row">
        <span class="data-label">Verification Status</span>
        <span class="badge" style="background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.3); color:#f87171;">Rejected</span>
      </div>
      <div class="data-row">
        <span class="data-label">Rejection Reason</span>
        <span class="data-value" style="color:#f87171; font-size:13px; max-width:280px; text-align:right;">${reason}</span>
      </div>
    </div>

    <div class="alert-danger">
      <strong>What to do next:</strong> Please upload a clear screenshot or photo of your official scorecards for the relevant month from your golf club's app or handicap system. The proof must show your name, dates, and individual hole scores clearly.
    </div>

    <ul class="steps-list" style="margin-top:8px;">
      <li>
        <span class="step-num" style="background:linear-gradient(135deg,#ef4444,#dc2626);">!</span>
        <div>Ensure your scorecard shows your <strong style="color:#e5e5e5;">full name</strong> and the <strong style="color:#e5e5e5;">date played</strong>.</div>
      </li>
      <li>
        <span class="step-num" style="background:linear-gradient(135deg,#ef4444,#dc2626);">!</span>
        <div>Screenshots must be <strong style="color:#e5e5e5;">legible and unedited</strong> — cropped or blurry images will be rejected.</div>
      </li>
      <li>
        <span class="step-num" style="background:linear-gradient(135deg,#ef4444,#dc2626);">!</span>
        <div>Upload one scorecard per score you've submitted on the platform.</div>
      </li>
    </ul>

    <div class="cta-wrap">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/winnings" class="cta">Re-Upload Proof</a>
    </div>

    <p class="email-body" style="font-size:13px; text-align:center; margin-top:4px; color:#525252;">
      Believe this was a mistake? Contact us directly at <strong style="color:#e5e5e5;">support@digitalhero.app</strong>
    </p>
  `;

  return sendEmail({
    to,
    subject: `⚠️ Action Required — Verification Rejected | DigitalHero`,
    html: emailWrapper(content),
  });
}
