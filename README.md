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

## Consultation database

Consultations use PostgreSQL. The separate admin mailbox uses Resend. Configure `.env.local` from `.env.example`:

- `DATABASE_URL`: the PostgreSQL connection string (use your provider's TLS settings).
- `RESEND_API_KEY`, `CONSULTATION_EMAIL_FROM`, `CONSULTATION_EMAIL_TO`: admin mailbox settings.
- `SITE_URL`: public HTTPS origin in production; localhost for local development.
- `CRON_SECRET`: a random secret generated with `openssl rand -hex 32`.

Run `npm run db:migrate` to apply the versioned schema, then `npm run dev`.
The migration is transactional and safe to rerun. Secrets belong only in
`.env.local` or server environment settings, never in Git or `NEXT_PUBLIC_` variables.

### Record lifecycle

Final submission saves a pending application and emails a confirmation link to
the entered address. The form shows that address, a 24-hour expiry notice, and a
small correction note above the privacy footer. Restarting clears the form so
the visitor can enter a corrected address. The application becomes received
when the confirmation link is opened; no internal notification is sent.

Submissions have a 60-second per-address cooldown. The protected maintenance
endpoint removes expired pending links. Education and English outcome emails
remain separate, as described below. Configure Resend and the public `SITE_URL`
for final verification email delivery.

This stores application records separately from user login accounts. Database
access is server-side only. Row-level security is enabled with no public policies;
use a server-only connection with the table-owning role. Deploy the schema before the app update. New submissions require email confirmation.
`CONSULTATION_TOKEN_SECRET` is no longer used and can be removed from local/hosted settings.

### Verification

The consultation form has eight steps. Migration
`002_remove_consultation_steps.sql` removes the retired experience, international
experience, timing, destinations, and priority answers from pending and confirmed
records. Run `npm run db:migrate` against each database when deploying this change.
Application records and legacy confirmation tokens are preserved.

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
cleanup of legacy pending records.

### Repeat consultation submissions

Run `npm run db:migrate` to apply `003_consultation_attempt_history.sql` before
deploying the history UI. Existing pending and confirmed records are backfilled.
Answers overwritten before this migration cannot be recovered.

Every accepted submission creates an original snapshot in `consultation_attempts`.
A one-minute cooldown rejects rapid retries without creating attempts. Completed
submissions appear as received in admin. Historical pending and expired attempts
remain visible. Email grouping ignores letter case; admin search includes answers
from every attempt. Receipt of an application does not verify email ownership.

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

### Unsupported subjects

After selecting only group A/B subjects, Next shows the subject warning.
Continue saves a terminal `unsupported_subjects` attempt and shows the selected
subjects with a service-unavailable message. Close returns home; no further
form steps or emails follow. Admin lists these cases as «Неподходящие предметы»
and offers a matching filter. Apply `022_unsupported_subject_cases.sql` before
deploying. Subsequent draft writes cannot overwrite a terminal case.

### Secondary vocational education

Selecting «Среднее специальное» opens the education notice. Continue saves a
terminal `not-enough-education` case, then shows the education step with choices
locked. «Выбрать Start» opens `/#plans`; «Закрыть» returns home. A START recommendation email is queued one minute after this outcome is saved.
Admin has a matching education outcome label and filter. Apply
`023_unsupported_education_cases.sql` and `024_not_enough_education_status.sql`
before deployment. Migration 024 also renames existing education outcomes.

### Form step emails

Step answers do not send emails. Migration `020_remove_step_followups.sql`
removes the former follow-up queues, triggers, functions, and queued messages.
Historical migrations remain so existing installations can upgrade consistently.

The maintenance worker continues to clean expired legacy confirmation links. `scripts/deploy.sh` runs it under PM2 using `CRON_SECRET`.

### Answer-change warnings

Migration `011_answer_change_warnings.sql` records changes to subjects, education,
and English, including changes between eligible answers and reversals within a
single draft. Qualification keeps its existing audit. Admin cards show amber
warnings and user profiles show the previous answer, new answer, and timestamp.
These choices save immediately in order once an email has been entered. Initial
empty fields are not changes; deleting the user also deletes their audit records.
Existing differences between saved attempts are recovered by the migration.

### Consultation maintenance in development

`npm run dev` starts the maintenance worker when `CRON_SECRET` is configured.
It uses the port reported by Next.js, including when the default port is busy,
and removes expired legacy confirmation records every minute. Stopping the development server stops
its worker. Production uses the PM2 worker configured by `scripts/deploy.sh`.

### Mailbox (tn.connect@teachernavigator.com)

Admin mailbox mail is sent from `CONSULTATION_EMAIL_FROM` (`TeacherNavigator <tn.connect@teachernavigator.com>`).
Apply `013_mailbox.sql`, then open `/admin/mail` to read incoming mail, reply,
and write new emails. Applicant profiles link to a prefilled compose form.

Incoming mail uses Resend Inbound:

1. In Resend → Domains → teachernavigator.com, enable receiving and copy its MX record.
2. In Namecheap → Advanced DNS → Mail settings, choose Custom MX and add only
   Resend's MX record for `@`. This replaces Namecheap email forwarding for every
   address on the domain. Keep the existing `send` and DKIM records for sending.
3. In Resend → Webhooks, add `https://teachernavigator.com/api/mail/inbound`
   with the `email.received` event and copy its signing secret.
4. Set `RESEND_WEBHOOK_SECRET` (and optionally `MAILBOX_FORWARD_TO`, a
   comma-separated list that receives a copy of every incoming email) on the server.

The webhook verifies the Svix signature, fetches the full message from Resend's
Receiving API, and stores it once per Resend email id. Failed processing returns
500 so Resend retries; a stored email only retries its forward, which uses a
stable idempotency key. Forwarded copies set Reply-To to the original sender;
replying from Gmail sends from the Gmail address, so reply from `/admin/mail` to
answer as tn.connect@. Attachments stay in Resend and are opened through a fresh signed
link. Received HTML is shown in a sandboxed iframe without scripts. Each compose
form uses one id as the database key and Resend idempotency key, so a repeated
submission cannot send twice.

The domain accepts mail for any name, so only email addressed (To or Cc) to the
`CONSULTATION_EMAIL_FROM` address reaches the inbox. Email to any other name, and
bot probes with a code-only subject such as `#15597965-4da8a56e` and an empty
body, go to the Spam folder: they are kept but not forwarded or counted as unread
(`lib/mailbox/spam.ts`, migration `037_mailbox_spam.sql`).

### Personal browser notes

The homepage's circular **N** button opens a local sticky-note board. All
visitors can create, edit, search, delete and reorder notes. The whole list is
saved immediately to `localStorage` under `notes-browser`; this site has no
visitor accounts, so notes are scoped to the browser rather than a user ID.
No note content is sent to the server. Other browsers, devices and private
windows have separate notes, and clearing site data deletes them. There is no
live synchronization between tabs. Storage failures show a warning and keep
changes in memory for the current page.

Notes retain one randomly chosen pastel color, their creation time and their
last-edit timestamp. Blank notes are removed when editing finishes. Only the
six-dot handle reorders cards (5px pointer threshold); arrow keys on the handle
also reorder them. Labels support English, German, Dutch, Turkish, Uzbek and
Russian through the modal's locale prop; dates use Russian. The modal
defaults to Russian. It supports Escape, backdrop dismissal and native focus
trapping, and temporarily pauses hero rotation while open.

### Visitor analytics

Admin typography uses 18px eyebrow labels, descriptions, controls and table
content; 36px page headings; 24px section headings; and 20px card/subsection
headings. Compact badges, timestamps and chart labels may use 16px. Use the
standard Tailwind scales consistently across applications, analytics and mail.

Apply migration `014_site_visits.sql` with `npm run db:migrate`. The authenticated
`/admin/analytics` section reports page views and anonymous visits for an inclusive
date range (up to 366 days) in each administrator's browser time zone, grouped by
day or month. It includes popular pages
and the timestamps of the latest 12 page views. Counts begin after deployment;
previous visits cannot be recovered.

The admin UI detects the browser's IANA time zone automatically and remembers it
in an admin-only preference cookie. Application, history and mail timestamps use
that zone. Analytics date filters and daily/monthly grouping use its local
midnight boundaries, including daylight-saving transitions. Event timestamps
remain stored as PostgreSQL `timestamptz`. UTC is the initial fallback until the
browser preference is available; this does not change any other administrator's
display settings.

The production-only tracker records initial page loads and client-side navigation
on an allowlist of public pages. It sends only a random event UUID, a random
session UUID and the pathname. PostgreSQL assigns the timestamp. A session uses
tab-scoped `sessionStorage` and rotates after 30 minutes without navigation;
blocked storage falls back to memory. It is not a count of unique people and is
not linked to consultation records. No IP addresses, user agents, referrers,
query strings, confirmation tokens or form answers are stored by analytics.
Approximate country and city are resolved locally from the proxy's `X-Real-IP`
header and stored with each event; the address itself is discarded. The location
tables include unknown results, and the recent-events list shows location next
to the timestamp. VPNs and mobile networks can distort these estimates.
Do Not Track and Global Privacy Control signals suppress tracking; obvious bots
and all admin/API paths are excluded. Event IDs deduplicate repeat submissions,
and writes are limited to 30 events per minute per session. The public endpoint
requires a same-origin POST. Ad blockers, disabled JavaScript and spoofed clients
mean these figures should be treated as estimates. Analytics records currently
remain in the database; no automatic retention cleanup is configured.

Administrators are excluded while browsing public pages as well. Successful
login sets a separate signed, HttpOnly exclusion cookie for the whole site
(one year); it never grants admin access and is retained after logout. Opening
the authenticated admin section also marks the browser in local storage and
registers its current anonymous session as excluded. Migration
`016_excluded_admin_visits.sql` enables removal of that session's previous page
views and blocks delayed tracking requests from recreating them. Existing
logged-in administrators should open an admin page once after this update.
Older unlinked sessions cannot be identified retroactively; no IP or identity
was stored to associate them with administrators.

Apply `015_visit_locations.sql` and run `npm run geoip:update` to download the
current monthly [DB-IP City Lite database](https://db-ip.com/db/download/ip-to-city-lite).
The database lives in ignored `.local/geoip/city.mmdb` (or the path supplied by
`ANALYTICS_GEOIP_DATABASE`), outside the browser bundle. Attribution appears in
the analytics dashboard. The deployment script refreshes the database, and
repeated updates in the same month are skipped. Run the update monthly, or add
`cd /path/to/globalTeachers && npm run geoip:update` to your server scheduler.
The reader watches for file updates without keeping the process alive. Failed
updates preserve an existing database; missing geolocation never blocks visits.

In Nginx's existing proxy location, overwrite the incoming header:

```nginx
proxy_set_header X-Real-IP $remote_addr;
```

Bind Next.js to loopback (`next start --hostname 127.0.0.1`) or otherwise restrict
its port to the trusted proxy, so visitors cannot spoof `X-Real-IP` directly.
If you later put Cloudflare or another proxy before Nginx, configure Nginx's
trusted real-IP ranges before using these figures. Local requests and older
events without geodata are shown as unknown; locations cannot be backfilled
because IP addresses were never stored.

### Education outcome email

Migration `025_education_outcome_email.sql` queues the supplied START email only
when a new case becomes `not-enough-education`. Existing cases are not emailed
retroactively. Each email address receives this message once; repeated saves do
not reset the delay. Deleting its source case deletes its queued message.

The email becomes due after one minute. The maintenance worker checks every
minute, so delivery happens on the first successful check after that deadline
and can take longer if the worker or provider is unavailable. Configure Resend,
`SITE_URL`, the sender settings, and `CRON_SECRET`; keep the maintenance worker
running. Failed sends retry after one minute using the same idempotency key,
with automatic retries stopping 23 hours after the first attempt. English outcome emails are configured separately below; other consultation
emails remain disabled.

### English outcome email

Migration `027_english_outcome_email.sql` queues the supplied START email when a
new case becomes `not-enough-english`. It becomes due one minute later and uses
the same maintenance worker, delivery configuration, retries and duplicate
protection as the education outcome email. Existing cases are not retroactively
emailed. Bold emphasis and the `/programs/start` link are included in HTML, with
a plain-text alternative.

### Follow-up after email confirmation

Migration `028_confirmed_package_email.sql` queues the provided package overview
email only when a visitor confirms a new application without choosing a package.
It becomes due one minute after confirmation, delivered on the maintenance
worker's next successful check. The HTML preserves emphasis and links to
`/#plans`. Repeated confirmation does not queue another email. Delivery uses
leases, stable idempotency keys and one-minute retries within a 23-hour window.
Existing confirmed applications are not emailed retroactively. START, PRO and VIP selections receive their respective templates below.

Migration `029_pro_package_email.sql` adds the PRO variant to the same confirmation
queue. Choosing PRO sends the supplied program details one minute after email
confirmation; «Оформить пакет PRO →» links to `/payment/pro`. Existing confirmations
are not queued retroactively. Checkout and consultation booking remain placeholders.

Migration `030_vip_package_email.sql` adds the VIP variant, due one minute after
confirmation, with the supplied service details and individually agreed pricing.
«Оформить заявку на VIP →» links to `/payment/vip`. All section headings and the
call-to-action are emphasized in HTML; plain text is included too. Existing
confirmations are not retroactively emailed.

Migration `031_start_package_email.sql` adds the START variant, due one minute
after confirmation. It uses the supplied seven-part program description, bold
headings and a link to `/payment/start`, with the same delivery and retry rules.
Existing confirmed applications are not queued retroactively.

### Education outcome verification

Migration `032_verify_education_outcome.sql` makes `not-enough-education` cases
require email confirmation. Continuing from the education notice first shows the locked education screen.
Both «Выбрать Start» and «Закрыть» send a 24-hour verification link and open the
confirmation popup over that screen. Closing the popup opens `/#plans` when
the visitor chose «Выбрать Start», or `/` when they chose «Закрыть». The education recommendation is queued only after confirmation, due one
minute later. The case retains its `not-enough-education` status and records the
confirmation time. Pending unverified education recommendation jobs are removed
by this migration; existing cases are not emailed retroactively. English outcome verification is described below.

### English outcome verification

Migration `033_verify_english_outcome.sql` extends outcome verification to
`not-enough-english`. Both buttons on the locked English screen send verification
and show the confirmation popup. Closing it follows the selected destination:
packages or home. English advice is queued one minute after confirmation, never
before. The case retains its English outcome and records confirmation time.
Pending unverified English advice jobs are removed by this migration; no
retroactive verification emails are sent. Existing education links remain valid.

### Private client pages, invitations, and appointments

Apply migrations `038_client_area.sql` through `047_client_message_notifications.sql` with
`npm run db:migrate`. The admin navigation now has a **Клиенты** tab at
`/admin/clients`. START includes **1 hour**, PRO includes **3 hours on separate
calendar days**, and VIP initially includes **1 hour**. Only VIP clients can receive
additional hours through their individual admin page. The PRO daily restriction
uses Europe/Amsterdam consistently and is enforced by the booking transaction,
including concurrent requests. Existing applications do not automatically become private clients.

On an incoming email, **Send Key** prepares a personalized invitation and starts
a ten-second countdown. Clicking the email preview pauses the schedule on the
server and opens an editor. The administrator can then explicitly send the
edited message; its private access link must remain in the text. Closing the
preview before sending also pauses it. Once delivery has begun, the message is
frozen for safe retries. Sent invitations appear in the admin mailbox. Repeated
clicks for the same email address reuse the existing invitation and client page.

The invitation's `/client#...` link is the only way to establish client access.
The key has 256 bits of randomness; its lookup value is stored as a hash. The
administrator-only invitation and sent email necessarily retain the link so it
can be delivered and viewed in the mailbox. The client exchanges it via POST for
an HttpOnly, SameSite=Strict session, removes the fragment from browser history,
and can remain signed in for 30 days. Signing out revokes that browser session;
reentry requires the emailed link. No email-address or client-ID login exists.
Treat the link like a password: anyone who obtains it can sign in as that client.
The client page is excluded from analytics, has no-index/no-referrer metadata,
and client APIs return no-store responses.

Private chat is persisted per client, with administrator replies available from
`/admin/clients`. Both sides refresh every five seconds while the page is visible.
The page shows the latest 200 messages; older messages remain in the database.

Only administrator-opened, non-overlapping, future one-hour slots are available.
Admin selects a date and multiple whole-hour buttons, with morning/afternoon/workday
presets, then opens the selection in one atomic action. Minute-based start times
are rejected; the grid consistently uses Europe/Amsterdam, including DST changes.
A booking atomically checks both client allowance and slot availability; a booked
slot is unavailable to everyone else and cannot be closed through the admin
availability controls. Clients see times in their browser's timezone. Successful
bookings queue a short client confirmation and an admin notification; client confirmations include both their browser time zone captured at booking
and UTC; admin notifications use UTC. The stored zone keeps retries consistent.

During a booked hour, the client page enables **Позвонить администратору** using
the existing browser video-calling system. Creating a call and accessing its
signalling requires both the client's private session and a currently active
booking. A call token alone does not authorize an appointment call. Calls expire
at the end of the booked hour; incoming calls use the existing admin notification
and accept/decline controls. Production calling still depends on the existing
HTTPS, microphone/camera permissions, and TURN configuration.

The existing consultation maintenance worker retries invitation and booking
notification delivery with leases and stable Resend idempotency keys. Normally
the invitation preview requests sending after ten seconds; if the tab closes or
background timers are suspended, the worker sends it on its next check. Paused
drafts are never sent by the worker. Failed delivery retries for up to 23 hours.
Do not remove the maintenance worker from the production deployment.

Run the integration checks with `TEST_DATABASE_URL` set to a test connection:
`node --test tests/client-area.test.cjs`. They use a disposable database schema and
mock all outgoing emails, covering invitation access, pausing, tenant isolation,
concurrent booking, allowance limits, notifications and appointment-only calls.

Invitation emails now include a styled HTML alternative with an access button,
a readable key panel, and plain-text fallback. The HTML is saved with the draft
so retries retain an identical provider payload. Already-attempted older messages
without saved HTML continue their original plain-text delivery. The authenticated
client page includes **Скопировать ключ**, with manual selection if browser
clipboard access is unavailable. Key retrieval is scoped to the authenticated
client and checks the key against that client's stored hash.

The admin client directory supports name/email search, package filters, and 25 clients per page. Unread client messages are tracked persistently (shared across admins); opening a conversation marks its displayed history read. Clients whose last message is from the client are listed first until an admin replies. The directory refreshes every five seconds.

Admins can start an appointment call using «Позвонить клиенту» beside «Свернуть» in the expanded client card. The client must have an active booking and an open personal page (presence expires after 20 seconds). Incoming admin calls appear privately on that page with accept/decline; they are excluded from admin incoming-call alerts. Migration `045_admin_appointment_calls.sql` adds call direction and presence tracking.

The client welcome area includes a private profile photo, with initials as fallback. Clients can upload JPG, PNG or WebP up to 2 MB. Photo reads and writes are scoped to the authenticated client session and responses are not cached. Apply `046_client_profile_photo.sql` before deploying the updated client area.

The personal-page navbar includes notification counts for unread admin chat messages. Counts refresh every five seconds and persist across sessions. Client messages are marked read only when the end of the chat is visible in an active tab; reading does not change admin unread markers. Apply `047_client_message_notifications.sql`.

### Direct payment-page cases

Run `npm run db:migrate` to apply `048_payment_page_cases.sql`. START, PRO, and VIP payment pages create a candidate case only after both a valid email and a nonblank name are supplied, then update the same record as details change. Entering email alone does not create a case. The case appears under «Оформление пакета» in the admin application list. This status does not mean paid or email-confirmed. Existing consultation histories stay grouped by email and remain intact. Updates require the browser's private draft token and increasing revisions; card details are never included. Automatic saves do not send package emails or create personal-page access. Each browser tab retains its case identity in session storage, and creation is capped at ten payment attempts per email per day.

Payment pages ask candidates only for name and email as personal details. Card payment fields and acknowledgement of the terms remain required in the payment section. Existing profile lookup still requires email verification before loading saved information.

Migration `049_existing_client_cases.sql` backfills missing admin cases for older private clients with a name and email. Existing case histories, private pages, keys, chats, and bookings remain intact; it does not mark payment or email as confirmed or send emails.

Run migration `050_client_payment_status.sql` for the unified user list. All users remain in `/admin`; open an individual inbound email in `/admin/mail`, choose Start/Pro/ViP in the payment selector (saved immediately; «Не заплатил(а)» removes the paid mark) to include them in `/admin/clients`. Email verification, form completion, and Send Key do not mark payment. Marking payment immediately activates the personal page and prepares its persistent key in a draft invitation. It sends no email; Send Key remains an optional separate action, and admin can copy the link for manual sharing. New private clients automatically receive a missing main case.

Both consultation drafts and payment candidates require a nonblank name and a valid email before any case is created. Consultation answers continue autosaving after that minimum is met; neither entering a name alone nor entering an email alone registers a case.

Selecting a paid package in an incoming email also routes all incoming messages from that sender to the corresponding client folder. Unpaid payment-page requests share the Candidates folder; package client folders contain paid clients only.

Removing the paid mark freezes client writing and new appointment bookings, enforced in database mutations and reflected in the client UI. Their active key, existing sessions, chat history, and bookings remain available to read. Marking payment again restores writing and booking without changing their access key.

Migration `051_frozen_client_accounts.sql` records when payment is removed. Incoming mail from frozen accounts appears in «Замороженные», distinct from unpaid Candidates. Restoring payment clears the frozen state and routes correspondence to the selected paid-package folder.

Migration `052_client_consultation_profile.sql` adds editable consultation profiles at the bottom of personal pages. Existing answers prefill from case history; explicit saved values (including cleared optional answers) take precedence. Email remains the verified account identity and is read-only. Partial profiles can be saved, and expanded admin client cases list missing required fields and the saved profile. Updates require the client session and do not change historical consultation submissions or paid-package status.

The admin calendar detects the browser time zone and uses it for date boundaries and whole-hour selection, converting times to UTC for storage. Slots remain shared between administrators. Server validation supports whole local hours even in half-hour-offset zones. The package rule for PRO meetings on separate days still uses the existing booking-policy time zone.

Paid-client keys are copyable before invitation delivery. Existing draft or sent keys are preserved across package changes and payment restoration; canceling an invitation stops email delivery without disabling a paid client’s page. The activation flow needs SITE_URL but does not require email-provider credentials.
