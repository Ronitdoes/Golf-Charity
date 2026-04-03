# ⛳️ Digital Hero: Golf Charity Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=for-the-badge&logo=supabase)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=for-the-badge&logo=razorpay)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer)

**A high-performance, visually stunning platform for charity golf events and decentralized prize draws.**

[Explore Features](#-key-features) • [Tech Stack](#-tech-stack) • [Setup Guide](#-setup-guide) • [Architecture](#-project-architecture)

</div>

---

## ✨ Key Features

### 💎 Premium User Experience
- **GSAP & Framer Motion**: Smooth, staggered entry animations and scroll-triggered parallax effects.
- **Three.js Integration**: Interactive 3D scene layers (`Scene.tsx`) for a futuristic editorial feel.
- **Stark Glassmorphism**: Modern, translucent UI components with high-fidelity blur and border effects.

### 💳 Payment & Subscriptions
- **Unified Razorpay Flow**: Secure donation processing and plan activation via the [Razorpay Checkout](file:///d:/acm/digitalhero/components/payments/RazorpayCheckout.tsx) component.
- **Webhook Processing**: Real-time subscription state updates handled by [Razorpay Webhooks](file:///d:/acm/digitalhero/app/api/webhooks/razorpay/route.ts) with full HMAC signature verification using raw request bodies.

### 🏆 Prize Draw Engine
- **Deterministic Draws**: Complex randomization logic for fair winner selection.
- **Admin Dashboard**: Full control over charities, winners, and user prize distributions.
- **Verified Payout Workflow**: Integrated proof-of-winning upload system for users and administrative review cycle for secure disbursements.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router), React 18 |
| **Auth/Middleware** | `@supabase/ssr` (Modern getAll/setAll pattern) |
| **Database** | Supabase (PostgreSQL, Storage) |
| **State** | Zustand (Global State), Server Actions (Mutations) |
| **Styling** | Tailwind CSS, Lucide React Icons |
| **Animations** | GSAP, Framer Motion, Lenis (Smooth Scroll) |
| **Payments** | Razorpay SDK & Webhooks |

---

## 🚀 Setup Guide

### 1. Repository Initialization
```bash
git clone https://github.com/Ronitdoes/golf.git
cd digitalhero
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Other Services
RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=admin@example.com
```

### 3. Database Sync
Apply the project schema to your Supabase instance using the `schema.sql` file located at the root of the project.

### 4. Vercel Deployment
The project is optimized for Vercel with **Forced Dynamic Rendering** on protected routes to prevent build-time 403 errors and ensure runtime authorization stability.

---

## 🏗 Project Architecture

```text
├── app/                  # App Router: Pages, Webhooks, and API Actions
│   ├── actions/          # Razorpay orders and DB mutations
│   ├── admin/            # Dashboard for managing charities/draws (force-dynamic)
│   ├── api/webhooks/     # Razorpay webhook listener (HMAC verified)
│   └── dashboard/        # User-facing winnings and score tracking (force-dynamic)
├── components/           # Core UI Components
│   ├── canvas/           # Three.js / Scene logic
│   ├── payments/         # Razorpay Checkout logic
│   └── sections/         # Beautiful Hero and CTA blocks
├── lib/                  # Engines & Utilities
│   ├── analytics.ts      # Synchronized pricing (€96/yr) logic
│   ├── draw-engine.ts    # Core logic for raffle selection
│   └── supabase.ts       # Supabase client wrapper (Admin & User modes)
└── middleware.ts         # Modern Supabase SSR auth protection
```

---

## 🔒 Security & Stability

- **Vercel Optimized**: Protected layouts are explicitly configured with `dynamic = 'force-dynamic'` to avoid static generation failures on restricted data.
- **Robust Webhooks**: Signature verification uses raw request buffers to prevent tampering and ensure valid payment state transitions.
- **Modern Auth**: Implements the latest `@supabase/ssr` middleware guidelines for persistent session management across Edge environments.
- **Admin Access**: Combined database RBAC and environment-level Master Admin bypass for high-security environments.

---

<div align="center">
Built for high-impact charity golf events. 🏌️‍♂️ ⛳️
</div>
