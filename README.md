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

The consultation form has eight steps. Migration
`002_remove_consultation_steps.sql` removes the retired experience, international
experience, timing, destinations, and priority answers from pending and confirmed
records. Run `npm run db:migrate` against each database when deploying this change.
Application records, confirmation tokens, and notification metadata are preserved.

Run `npm run lint`, `npx tsc --noEmit`, and `npm test`.
Integration tests require a dedicated empty PostgreSQL test database:

```sh
TEST_DATABASE_URL=postgresql://... npm test
```

Tests create/drop an isolated schema and mock Resend; they send no emails.
Without `TEST_DATABASE_URL`, database integration tests are explicitly skipped.

## Private application viewer

Open `/admin` to view pending and confirmed applications, search names/emails,
and expand a record to see all submitted answers. Results are grouped by email and paginated (20 addresses per page). Open a card
to visit its private `/admin/applications/[id]` page and compare dated attempts side by side; changed fields are highlighted. Editing
updates the latest live application while preserving original submission snapshots.
Deleting a card removes all attempts and live records for that email.

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

### Repeat consultation submissions

Run `npm run db:migrate` to apply `003_consultation_attempt_history.sql` before
deploying the history UI. Existing pending and confirmed records are backfilled.
Answers overwritten before this migration cannot be recovered.

Every accepted submission creates an original snapshot in `consultation_attempts`.
The existing one-minute pending cooldown still rejects rapid retries without
creating attempts. Replacing a pending submission invalidates its old link while
retaining its answers with a superseded status. Confirmation and expiry update
the snapshot status. Expiry cleanup removes the pending token record, but retains
the attempt history, including unconfirmed submissions. Email grouping ignores
letter case; admin search includes answers from every attempt. Status filters
and counts describe whether the email has ever been confirmed. A later pending
or expired attempt does not remove that confirmation. Individual attempt statuses
remain visible in the history.

### Incomplete consultation forms

Apply `004_consultation_drafts.sql` before deploying draft saving. Saving starts
only after a nonempty email has been entered, without verifying the address or
requiring final submission. Changes are saved after a short pause and flushed
when the page is hidden or closed. Draft writes send no emails. Network failures
are retried while the page is open; closing before any request succeeds cannot
guarantee a saved draft.

Admin includes an unfinished-form filter, partial answers, and the last step
reached. Draft updates use a private browser-generated token and increasing
revision numbers. Final submission converts the owned draft into the same attempt;
late draft writes cannot overwrite submitted answers. Drafts are retained until
admin deletion and do not expire with confirmation links. Entering an email is
not proof that the visitor owns it.

### START qualification followup

Apply `005_qualification_followups.sql`. Selecting «Нет» opens the qualification
notice. When that answer is saved with a correctly formatted email, a START
followup is temporarily due four minutes later, including for unconfirmed draft addresses.
Correcting the qualification answer cancels unsent followups. Delivery happens
once per email, with leased jobs, stable Resend idempotency keys, and bounded
retries. Existing records are not emailed retroactively.

`scripts/deploy.sh` starts/restarts `teachernavigator-maintenance` under PM2 and
saves the process list. The worker calls the protected maintenance endpoint every
minute on `127.0.0.1:${PORT:-3000}` using `CRON_SECRET`. Delivery occurs on the
first successful check after the four-minute deadline; server downtime or email
provider failures delay it. Configure PM2 startup on the VPS for reboot recovery.
For local testing, run `node scripts/consultation-maintenance.mjs` alongside the
app only when you want to deliver real queued emails. Integration tests mock mail.

The temporary four-minute delay is set by `007_temporary_four_minute_followups.sql`.
Admin displays a reminder to restore four hours. Use a new migration to restore
both column defaults and the cancelled-job requeue delay in `queue_qualification_followup`.

### Subject-specific emails

Apply `008_subject_followups.sql`. Subject selections containing A or B queue one
email per address, due four minutes after the first eligible selection is saved.
A is early education/primary/English; B contains national languages and the
Modern Languages option; C contains the remaining subjects. Email variants cover
A, B, AB, AC, BC, and ABC (the combined AC/BC message). C alone queues no email.
The latest saved selection determines the variant before first delivery; changing
to C alone cancels an unsent job. Templates retain their original emphasis in HTML
and include plain-text alternatives. A has no START link; other variants link to
`/programs/start`. Retries reuse the saved message and idempotency key.

These emails include unconfirmed drafts and are separate from the qualification
START email. Existing records are not emailed retroactively. The same maintenance
worker delivers them. Restore this migration's four-minute delay along with the
qualification delay when ending the temporary test period.

### Secondary vocational education followup

Migration `009_education_followups.sql` queues a four-minute START recommendation
when «Среднее специальное» is saved. The popup explains that degree requirements
vary by school, country, and role. Emails include unconfirmed drafts, are sent
once per address, and cancel when the education answer changes. The maintenance
worker delivers them. Existing records are not mailed retroactively. Restore
this temporary delay alongside the other followups after testing.

### Beginner English followup

Migration `010_english_followups.sql` queues the English preparation email four
minutes after either «Не говорю по-английски» or «Базовый — могу общаться на простые
темы» is saved. Selecting either option opens a popup recommending language
preparation and START. English has no preselected answer. Emails include
unconfirmed drafts, are sent once per address, and cancel when the answer changes
to a higher level. The maintenance worker delivers them; existing records are
not mailed retroactively. Restore this temporary delay alongside the other
followups after testing.

### Answer-change warnings

Migration `011_answer_change_warnings.sql` records changes to subjects, education,
and English, including changes between eligible answers and reversals within a
single draft. Qualification keeps its existing audit. Admin cards show amber
warnings and user profiles show the previous answer, new answer, and timestamp.
These choices save immediately in order once an email has been entered. Initial
empty fields are not changes; deleting the user also deletes their audit records.
Existing differences between saved attempts are recovered by the migration.

### Email maintenance in development

`npm run dev` starts the maintenance worker when `CRON_SECRET` is configured.
It uses the port reported by Next.js, including when the default port is busy,
and checks due email queues every minute. Stopping the development server stops
its worker. Production uses the PM2 worker configured by `scripts/deploy.sh`.
