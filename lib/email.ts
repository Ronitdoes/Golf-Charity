import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Common sender for all platform emails
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DigitalHero <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[RESEND_API_ERROR]', { error, to, subject });
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email exception:', err);
    return { success: false, error: err };
  }
}

/**
 * Foundry Dark Protocol — premium HTML email base template.
 * Renders a full dark-mode branded email with emerald accents.
 */
export function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>DigitalHero</title>
  <style>
    /* Reset */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #060606;
      color: #e5e5e5;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    /* Wrapper */
    .email-outer {
      background-color: #060606;
      width: 100%;
      padding: 40px 16px 60px;
    }
    .email-inner {
      max-width: 600px;
      margin: 0 auto;
    }
    /* Header bar */
    .email-header {
      background: linear-gradient(135deg, #0d0d0d 0%, #111 100%);
      border: 1px solid rgba(34, 197, 94, 0.15);
      border-radius: 16px 16px 0 0;
      padding: 28px 36px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-mark {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #22C55E, #16A34A);
      border-radius: 8px;
      display: inline-block;
      flex-shrink: 0;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.05em;
      color: #ffffff;
      text-transform: uppercase;
    }
    .logo-dot {
      width: 6px;
      height: 6px;
      background: #22C55E;
      border-radius: 50%;
      display: inline-block;
      margin-left: 4px;
      vertical-align: super;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
    }
    /* Card body */
    .email-card {
      background: linear-gradient(160deg, #0f0f0f 0%, #111111 100%);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-top: none;
      padding: 40px 36px;
    }
    /* Divider bar */
    .emerald-bar {
      height: 3px;
      background: linear-gradient(90deg, #22C55E, #16A34A, transparent);
      border-radius: 0 0 3px 3px;
      margin-bottom: 36px;
    }
    /* Typography */
    .email-eyebrow {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #22C55E;
      margin-bottom: 12px;
    }
    .email-heading {
      font-size: 30px;
      font-weight: 900;
      letter-spacing: -0.04em;
      line-height: 1.1;
      color: #ffffff;
      margin-bottom: 20px;
    }
    .email-heading span {
      color: #22C55E;
    }
    .email-body {
      font-size: 15px;
      line-height: 1.7;
      color: #a3a3a3;
      margin-bottom: 16px;
    }
    .email-body strong {
      color: #e5e5e5;
    }
    /* Data panel */
    .data-panel {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      padding: 24px 28px;
      margin: 28px 0;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .data-row:last-child { border-bottom: none; }
    .data-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #525252;
    }
    .data-value {
      font-size: 14px;
      font-weight: 700;
      color: #e5e5e5;
    }
    .data-value.accent { color: #22C55E; }
    /* Highlight badge */
    .badge {
      display: inline-block;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #22C55E;
    }
    /* Numbers grid */
    .numbers-grid {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin: 16px 0;
    }
    .number-chip {
      width: 44px;
      height: 44px;
      background: rgba(34, 197, 94, 0.08);
      border: 1px solid rgba(34, 197, 94, 0.25);
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
      color: #22C55E;
    }
    .number-chip.match {
      background: rgba(34, 197, 94, 0.2);
      border-color: #22C55E;
      box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
    }
    .number-chip.neutral {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.08);
      color: #737373;
    }
    /* Steps list */
    .steps-list {
      list-style: none;
      margin: 20px 0;
    }
    .steps-list li {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 10px 0;
      font-size: 14px;
      color: #a3a3a3;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .steps-list li:last-child { border-bottom: none; }
    .step-num {
      flex-shrink: 0;
      width: 26px;
      height: 26px;
      background: linear-gradient(135deg, #22C55E, #16A34A);
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      color: #000;
    }
    /* Alert boxes */
    .alert-box {
      border-radius: 10px;
      padding: 16px 20px;
      margin: 24px 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .alert-success {
      background: rgba(34, 197, 94, 0.08);
      border: 1px solid rgba(34, 197, 94, 0.25);
      color: #86efac;
    }
    .alert-warning {
      background: rgba(234, 179, 8, 0.08);
      border: 1px solid rgba(234, 179, 8, 0.25);
      color: #fde68a;
    }
    .alert-danger {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #fca5a5;
    }
    /* CTA Button */
    .cta-wrap { text-align: center; margin: 36px 0 20px; }
    .cta {
      display: inline-block;
      background: linear-gradient(135deg, #22C55E, #16A34A);
      color: #000000 !important;
      font-weight: 900;
      font-size: 14px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 16px 40px;
      border-radius: 10px;
      text-decoration: none;
      box-shadow: 0 0 24px rgba(34, 197, 94, 0.35);
    }
    /* Footer */
    .email-footer {
      background: #0a0a0a;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-top: none;
      border-radius: 0 0 16px 16px;
      padding: 24px 36px;
      text-align: center;
    }
    .footer-text {
      font-size: 11px;
      color: #404040;
      line-height: 1.8;
    }
    .footer-links {
      margin-top: 10px;
    }
    .footer-links a {
      color: #525252;
      text-decoration: none;
      font-size: 11px;
      margin: 0 8px;
    }
  </style>
</head>
<body>
  <div class="email-outer">
    <div class="email-inner">

      <!-- Header -->
      <div class="email-header">
        <div class="logo-mark"></div>
        <div>
          <span class="logo-text">DIGITALHERO</span><span class="logo-dot"></span>
        </div>
      </div>

      <!-- Emerald accent bar -->
      <div class="emerald-bar"></div>

      <!-- Main card -->
      <div class="email-card">
        ${content}
      </div>

      <!-- Footer -->
      <div class="email-footer">
        <div class="footer-text">
          &copy; ${new Date().getFullYear()} DigitalHero Golf Platform. All rights reserved.<br />
          Subscribe &middot; Play &middot; Give
        </div>
        <div class="footer-links">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Dashboard</a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings">Settings</a>
          <a href="mailto:support@digitalhero.app">Support</a>
        </div>
      </div>

    </div>
  </div>
</body>
</html>`;
}
