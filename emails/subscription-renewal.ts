import { sendEmail, emailWrapper } from '@/lib/email';

export async function sendSubscriptionRenewalEmail(
  to: string,
  fullName: string,
  renewalDate: string,
  amount: number
) {
  const content = `
    <div class="email-eyebrow">Subscription Update</div>
    <h1 class="email-heading">Renewal in<br /><span>3 Days</span></h1>

    <p class="email-body">
      Hi ${fullName}, this is a friendly reminder that your DigitalHero subscription is set to auto-renew in <strong style="color:#e5e5e5;">3 days</strong>.
      No action is required — we'll process the payment automatically so your access and draw eligibility remain uninterrupted.
    </p>

    <div class="data-panel">
      <div class="data-row">
        <span class="data-label">Account</span>
        <span class="data-value">${fullName}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Renewal Date</span>
        <span class="data-value">${renewalDate}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Amount</span>
        <span class="data-value accent" style="font-size:18px;">£${amount.toLocaleString()}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Status</span>
        <span class="badge">Auto-Renewing</span>
      </div>
    </div>

    <div class="alert-success">
      ✅ Your subscription continues your eligibility for upcoming monthly draws and maintains your charity contribution allocation.
    </div>

    <div class="cta-wrap">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings" class="cta">Review Plan Settings</a>
    </div>

    <p class="email-body" style="font-size:13px; text-align:center; margin-top:4px; color:#525252;">
      Want to cancel or change your plan? You can do so anytime in your settings before the renewal date.
    </p>
  `;

  return sendEmail({
    to,
    subject: `Subscription Renewal in 3 Days — £${amount.toLocaleString()} | DigitalHero`,
    html: emailWrapper(content),
  });
}
