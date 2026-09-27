This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Consultation email confirmation

Copy `.env.example` to `.env.local` and configure a Resend API key, a verified
sender (`CONSULTATION_EMAIL_FROM`), the team inbox (`CONSULTATION_EMAIL_TO`), and
`SITE_URL` (the public HTTPS origin in production). Generate the token secret
with `openssl rand -hex 32`; keep it stable across deployments and instances.
Never use a `NEXT_PUBLIC_` prefix for these secrets.

Submission sends a confirmation email. The application is encrypted into a
24-hour link; no application database is used. Opening the link posts the token
to the confirmation endpoint, which delivers the application to the team inbox.
The success page appears only after the email provider accepts that delivery.
[Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys) prevent repeated confirmations from sending duplicate
team emails during the link's lifetime. Unconfirmed applications expire.

The submission endpoint has a per-email, per-process 60-second cooldown. Before
public deployment across multiple instances, configure shared rate limiting at
the hosting/WAF layer to prevent email abuse. No real emails are sent by tests.
Email credentials must be configured to test actual inbox delivery.
