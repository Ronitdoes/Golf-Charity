import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendWelcomeEmail(to: string, fullName: string) {
  const content = `
    <div class="email-eyebrow">Welcome Aboard</div>
    <h1 class="email-heading">Welcome to<br /><span>DigitalHero</span>, ${fullName}.</h1>

    <p class="email-body">
      You've officially joined the elite community of golfers turning every scorecard into an act of charity.
      Here's everything you need to get started — it only takes a few minutes.
    </p>

    <ul class="steps-list">
      <li>
        <span class="step-num">1</span>
        <div><strong style="color:#e5e5e5;">Choose your subscription plan.</strong><br />Monthly or Annual — full platform access either way.</div>
      </li>
      <li>
        <span class="step-num">2</span>
        <div><strong style="color:#e5e5e5;">Select a charity to support.</strong><br />Your contribution percentage flows directly to the cause you care about.</div>
      </li>
      <li>
        <span class="step-num">3</span>
        <div><strong style="color:#e5e5e5;">Enter your last 5 Stableford scores.</strong><br />You need exactly 5 scores on file to be eligible for the monthly prize draw.</div>
      </li>
    </ul>

    <div class="alert-success" style="margin-top:28px;">
      ⛳ You must have <strong>5 active scores</strong> logged in your dashboard before each draw closes. Keep them updated every month.
    </div>

    <div class="cta-wrap">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta">Open Your Dashboard</a>
    </div>

    <p class="email-body" style="font-size:13px; text-align:center; margin-top: 8px;">
      Questions? Reply to this email or contact us at <strong style="color:#e5e5e5;">support@digitalhero.app</strong>
    </p>
  `;

  return sendEmail({
    to,
    subject: '⛳ Welcome to DigitalHero — Let\'s Get Started',
    html: emailWrapper(content),
  });
}
