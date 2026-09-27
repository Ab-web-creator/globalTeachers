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

## Consultation database and email confirmation

The app uses PostgreSQL and Resend. Configure `.env.local` from `.env.example`:

- `DATABASE_URL`: the PostgreSQL connection string (use your provider's TLS settings).
- `RESEND_API_KEY`, `CONSULTATION_EMAIL_FROM`, `CONSULTATION_EMAIL_TO`: email settings.
- `SITE_URL`: public HTTPS origin in production; localhost for local development.
- `CRON_SECRET`: a random secret generated with `openssl rand -hex 32`.

Run `npm run db:migrate` to apply the versioned schema, then `npm run dev`.
The migration is transactional and safe to rerun. Secrets belong only in
`.env.local` or server environment settings, never in Git or `NEXT_PUBLIC_` variables.

### Record lifecycle

1. Submission saves answers in `consultation_pending` **before** sending email.
2. A random confirmation token is emailed; only its SHA-256 hash is stored.
   Personal data no longer travels in confirmation links.
3. Links expire after 24 hours. A new submission for the same email replaces
   its pending record and invalidates the older link, with a database-enforced
   60-second cooldown. Confirmed records are never overwritten by resubmission.
4. Confirmation atomically inserts into `consultation_applications` and deletes
   the pending row. A repeated/concurrent click returns the existing record.
5. The thank-you page appears once the permanent record is committed. Team
   notification is attempted separately; email failures cannot undo confirmation.

Configure your hosting scheduler to GET `/api/consultation/maintenance` every
five minutes, with `Authorization: Bearer <CRON_SECRET>`. It deletes expired
pending rows and retries up to five queued team notifications per invocation.
Expired pending rows are also deleted on new submissions, but **the scheduler is
required to remove records when there is no traffic**. Expired links are rejected
immediately even before cleanup. Confirmed applications are excluded from cleanup.

Notification leases prevent concurrent sends. Resend idempotency keys protect
retries; automatic retries stop 23 hours after the first attempt to stay within
Resend's 24-hour deduplication window. Rows with a null `notification_sent_at`
after that window need manual review in Resend before retrying. Keep email
sender/recipient settings stable while retrying jobs. The record remains saved.

This adds application records, not login accounts or an admin dashboard. Database
access is server-side only. Row-level security is enabled with no public policies;
use a server-only connection with the table-owning role. Deploy the schema before the app update. Previously
issued encrypted links are incompatible: submit again to receive a new link.
`CONSULTATION_TOKEN_SECRET` is no longer used and can be removed from local/hosted settings.

### Verification

Run `npm run lint`, `npx tsc --noEmit`, and `npm test`.
Integration tests require a dedicated empty PostgreSQL test database:

```sh
TEST_DATABASE_URL=postgresql://... npm test
```

Tests create/drop an isolated schema and mock Resend; they send no emails.
Without `TEST_DATABASE_URL`, database integration tests are explicitly skipped.

## Private application viewer

Open `/admin` to view pending and confirmed applications, search names/emails,
and expand a record to see all submitted answers. Results are paginated (20 per
page); expired pending rows are marked as awaiting cleanup. Viewing is read-only.

Set `ADMIN_PASSWORD` (at least 16 characters) and `ADMIN_SESSION_SECRET` (at least
32 characters) in server environment settings. Generate strong values with
`openssl rand -hex 32`. Local credentials were generated in `.env.local`; read
`ADMIN_PASSWORD` there to sign in. Do not put secrets in `.env.example`.

Sessions expire after eight hours and use HTTP-only, SameSite=Strict cookies
(HTTPS-only in production). Changing either credential invalidates existing
sessions. Anonymous requests never load the application data. The admin page
is dynamic and excluded from search indexing; it is not linked in public navigation.
Configure hosting-level rate limiting for `/admin/login` before public deployment.
The database and migrations must be configured before records can be displayed.
