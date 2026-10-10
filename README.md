## Collaborator setup after git pull

Install Node.js and [Docker Desktop](https://docs.docker.com/get-started/get-docker/),
and start Docker Desktop. In the project directory run:

```sh
git pull
npm ci
npm run db:setup
npm run dev
```

`db:setup` creates `.env.local` if missing, generates private local credentials,
starts PostgreSQL 16, waits for it to be ready, and applies all migrations.
An existing `DATABASE_URL` is preserved; for externally managed databases it
only generates missing admin credentials and applies migrations to that database.
Your existing native PostgreSQL setup remains supported.

Each collaborator gets an **empty independent database**, not a copy of another
person's applications. Git carries the schema/setup, never user data or passwords.
Data persists in a Docker volume through container restarts and ordinary git pulls.
Keep `.env.local` so its password continues to match the database; do not delete
Docker volumes unless you intentionally want to erase local records.

Fill in `RESEND_API_KEY`, a verified `CONSULTATION_EMAIL_FROM`, and a reachable
`CONSULTATION_EMAIL_TO` in `.env.local` for real email testing. These credentials
must be shared separately. Read `ADMIN_PASSWORD` in that file to use `/admin`.
`SITE_URL=http://localhost:3000` works for local testing.

If you set up the Docker database before the TeacherNavigator rename, delete the
`DATABASE_URL`, `LOCAL_DATABASE_MANAGED` and `LOCAL_DATABASE_PASSWORD` lines from
`.env.local` and rerun `npm run db:setup`; this creates a fresh, empty
`teachernavigator` database (the old `globalteachers-local` volume is left untouched).

On later days, start Docker Desktop and run `npm run db:start`. Use `npm run
db:stop` to stop the database without deleting records. After code updates, rerun
`npm run db:setup` to apply new migrations. Port 55433 is used for Docker; change
`LOCAL_DATABASE_PORT` before the first setup if that port is already occupied.

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

This stores application records separately from user login accounts. Database
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

### Local database on this computer

A dedicated PostgreSQL instance is initialized in `.local/postgres` and listens
only on `127.0.0.1:55432`. Its application connection is in `.env.local`. Database
files and credentials are ignored by Git. Records survive application/server
restarts; do not delete `.local` if you want to keep them.

After restarting your computer, run `npm run db:start` before `npm run dev`.
Use `npm run db:stop` to stop PostgreSQL cleanly. These commands require the
locally installed PostgreSQL tools; they are not production deployment commands.
The application role owns its database and has no PostgreSQL superuser rights.
The protected maintenance endpoint still needs a scheduler for unattended expiry
cleanup and notification retries.
