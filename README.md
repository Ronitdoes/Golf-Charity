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
- **Webhook Processing**: Real-time subscription state updates handled by [Razorpay Webhooks](file:///d:/acm/digitalhero/app/api/webhooks/razorpay/route.ts).

### 🏆 Prize Draw Engine
- **Deterministic Draws**: Complex randomization logic for fair winner selection.
- **Admin Dashboard**: Full control over charities, winners, and user prize distributions.
- **Automated Certificates**: Dynamic generation of participation/winning certificates.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router), React 18 |
| **Languages** | TypeScript, React Three Fiber (R3F) |
| **Database/Auth** | Supabase (PostgreSQL, Auth, Storage) |
| **State** | Zustand (Global State), Server Actions (Mutations) |
| **Styling** | Tailwind CSS, Lucide React Icons |
| **Animations** | GSAP, Framer Motion, Lenis (Smooth Scroll) |
| **Payments** | Razorpay SDK |
| **Testing** | Jest, React Testing Library |

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
```

### 3. Database Sync
Apply the project schema to your Supabase instance:
```bash
# Locate and run schema.sql in your Supabase SQL Editor
cat supabase/schema.sql 
```

### 4. Development
```bash
npm run dev
```

---

## 🏗 Project Architecture

```text
├── app/                  # App Router: Pages, Webhooks, and API Actions
│   ├── actions/          # Razorpay orders and DB mutations
│   ├── admin/            # Dashboard for managing charities/draws
│   └── api/webhooks/     # Razorpay webhook listener
├── components/           # Core UI Components
│   ├── canvas/           # Three.js / Scene logic
│   ├── payments/         # Razorpay Checkout logic
│   └── sections/         # Beautiful Hero and CTA blocks
├── lib/                  # Engines & Utilities
│   ├── draw-engine.ts    # Core logic for raffle selection
│   ├── razorpay.ts       # Razorpay client instantiation
│   └── supabase.ts       # Supabase client wrapper
└── __tests__/            # Core logic test suites
```

---

## 🎨 Design System

This project uses a custom-tuned CSS strategy:
- **Tailwind Extend**: Custom color palettes and animation keyframes in `tailwind.config.ts`.
- **Global Themes**: Defined in `globals.css` with a focus on dark/light mode balance and premium aesthetics.
- **Typography**: Optimized loading using `next/font`.

---

## 🔒 Security

- **Role-Based Access (RBAC)**: Enforced via Supabase Middleware and Server Components.
- **Secure Payments**: Signature verification for all Razorpay transactions in the webhook handler.
- **Type Safety**: Zod schema validation for all incoming server action data.

---

<div align="center">
Built for high-impact charity golf events. 🏌️‍♂️ ⛳️
</div>
