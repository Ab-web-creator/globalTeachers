# Automatic emails

This guide describes the repository implementation of TeacherNavigator email delivery. Keep it updated when triggers, timing, templates, or mailbox storage change. Repository changes take effect in production only after the relevant migrations and application deployment.

## Application confirmation and the seven-hour reminder

1. A visitor submits the completed consultation application. The platform saves the latest answers as a pending application and immediately requests delivery of a confirmation email.
2. The confirmation link is valid for 24 hours from that submission.
3. If the visitor confirms, the pending application becomes a confirmed application available for review. Its pending record is removed, so no outstanding reminder can be sent. A package information email is queued separately (see below).
4. If the visitor has not confirmed after seven hours, the maintenance worker sends one reminder. It uses the name in the latest pending answers, including an updated surname, and includes a working confirmation link. Both the original link and the reminder link can confirm that pending application.
5. If the visitor confirms after receiving the reminder, the application is submitted normally; filling out the form again is unnecessary. The sent reminder remains in the mailbox.
6. If the visitor still does not confirm, the pending application expires 24 hours after submission. Both links expire at that deadline; sending the reminder does not extend it. Maintenance deletes expired pending records, while attempt history remains. There are no further scheduled reminders for that submission. The visitor must submit again to obtain a new link.

Submitting again replaces the pending application for the same normalized email address, saves the new answers, invalidates previous pending links, and restarts both the seven-hour reminder timer and the 24-hour expiry. Resubmissions have a 60-second cooldown. A later submission can receive its own reminder even if an earlier submission already received one.

Example: submissions at 11:20, 11:23, and 11:31 leave only the 11:31 submission eligible for a reminder, due at 18:31. If the surname changed in the last submission, that latest surname is used.

Only full applications stored in `consultation_pending` receive this reminder. Ordinary autosaved drafts, payment-page cases, and the separate education/English outcome verification flow do not receive it.

Existing pending applications are eligible once migration `059_confirmation_reminders.sql` and the application changes are deployed, provided they are at least seven hours old and have not yet expired. Expired historical attempts are not revived or emailed.

### Reminder content

Subject: **Подтвердите email, чтобы завершить подачу заявки — TeacherNavigator**

```text
Здравствуйте [актуальные имя и фамилия],

Вы заполнили анкету на сайте TeacherNavigator, но ваш адрес электронной почты пока не подтверждён. Чтобы завершить подачу заявки, пожалуйста, перейдите по ссылке подтверждения, которую мы отправили вам ранее.

[ссылка подтверждения]

Повторно заполнять анкету не нужно — ваши ответы сохранены.

После подтверждения мы сможем рассмотреть вашу заявку и связаться с вами по поводу дальнейших шагов.

Если вы не получили письмо, проверьте папку «Спам».

С уважением,
Команда TeacherNavigator
teachernavigator.com
```

Source: [confirmation-reminder.ts](../lib/consultation/confirmation-reminder.ts), [applications.ts](../lib/consultation/applications.ts), [submission route](../app/api/consultation/route.ts), [confirmation route](../app/api/consultation/confirm/route.ts).

## Other email flows

| Email | Trigger and timing | Saved in the website mailbox? |
| --- | --- | --- |
| Initial application confirmation | Immediately on full application submission; link valid for 24 hours | No |
| Seven-hour confirmation reminder | Latest full application is still pending after seven hours and has not expired | Yes, in Sent after successful sending |
| Education/English outcome confirmation | An applicable form outcome requests verification; link valid for 24 hours, with a one-minute resend cooldown | No |
| Education outcome information | Confirmation of an education outcome queues a message due one minute later; deduplicated by email address | No |
| English outcome information | Confirmation of an English outcome queues a message due one minute later; deduplicated by email address | No |
| Package information | A full application is confirmed; queued for one minute later. Content depends on Start, Pro, VIP, or no selected package; one job per application | No |
| Payment-page profile code | Visitor requests access to saved profile data; immediate sending, code valid for ten minutes | No |
| Personal-page invitation/key | Admin starts invitation delivery; normally scheduled after a ten-second countdown. Preview can pause it; explicit sending can make it due immediately | Yes, in Sent (existing invitation behavior) |
| Booking confirmation | A booking creates a delivery job; client and administrators receive separate messages, with maintenance retry support | No |
| Alternative-payment request notification | Visitor submits an alternative-payment contact request; immediate notification to configured administrators | Request stored as an incoming mailbox item; outgoing notification is not a Sent copy |
| Incoming-mail forwarding | Inbound mail is received; forwarding follows configured mailbox settings and loop prevention | Original incoming message is stored; forwarding is not a Sent copy |
| Admin-written email or reply | Admin sends from the website mailbox | Yes, in Sent after successful sending |

The reminder change adds mailbox storage only for confirmation reminders. It does not enable global archiving for other automatic messages. Admin-written messages and personal-page invitations already have their own mailbox storage.

Outcome verification is distinct from full application confirmation: confirming an education/English outcome sends the relevant information email and records confirmation on that attempt; it does not insert a full application into `consultation_applications`.

Retired per-step qualification, subject, education, and English follow-ups were removed by migration `020_remove_step_followups.sql`. Do not infer current behavior from those earlier migrations.

## Scheduling, retries, and delivery status

The PM2 process `teachernavigator-maintenance` runs [scripts/consultation-maintenance.mjs](../scripts/consultation-maintenance.mjs). It calls the authenticated [maintenance endpoint](../app/api/consultation/maintenance/route.ts) immediately on startup and then every 60 seconds. Each successful run processes up to five jobs of each email type. A due time is the earliest eligibility time; worker cadence, backlog, or delivery failures can delay sending.

Confirmation reminders lock the pending record through sending and save the Sent copy and reminder marker in the same database transaction. Concurrent maintenance workers skip locked records. Confirmation and resubmission wait for an in-progress reminder transaction. Failures roll back the database changes, and a later maintenance tick retries while the application remains eligible. Retries use a stable provider idempotency key to reduce duplicate delivery after an ambiguous network or database failure.

Education, English, package, invitation, and booking jobs use one-minute leases, stable provider idempotency keys, and retry delays of one minute. Their workers stop selecting jobs once the first attempt is 23 hours old. Initial confirmation emails and profile-code requests are sent in the request handler; they do not have an independent maintenance retry queue.

“Sent” means the provider accepted the send request and the application saved the corresponding marker. It does not prove inbox placement, opening, or reading. The application does not track reminder opens here. Delivery webhooks now provide separate delivery, delay, bounce, failure, and suppression status for saved Sent messages.

## Mailbox storage

Confirmation reminders store sender, recipient, subject, full text, provider message ID when returned, and send time in `mailbox_messages` with direction `outbound`. Their copy survives removal of the pending application. Failed send requests do not create a Sent copy.

Admin-written messages and replies use [lib/mailbox/messages.ts](../lib/mailbox/messages.ts), which records the outgoing message, sends it, and marks it sent on success. A repeated request with the same message ID is guarded against duplicate sending. Replies preserve threading headers when the original provider message ID is available.

Mailbox messages moved to Trash are automatically purged after 14 days. An administrator can also open a trashed message and choose «Удалить навсегда», confirm the prompt, and immediately remove that message from the website mailbox. Permanent deletion is restricted to messages already in Trash; it does not delete the recipient’s copy or provider records.

The website Sent folder is application database storage. It is not a synchronized Sent folder in an external Gmail or other mail account.

## Configuration and deployment

Email delivery uses [lib/consultation/email.ts](../lib/consultation/email.ts) and the Resend API. Required settings are `RESEND_API_KEY`, `CONSULTATION_EMAIL_FROM`, `CONSULTATION_EMAIL_TO`, and `SITE_URL`. The configured sender is displayed as TeacherNavigator. `CRON_SECRET` authenticates maintenance requests and also derives reminder confirmation tokens; keep it stable while pending reminders are being retried. Never document actual secrets here.

Before enabling reminders in production:

1. Apply migration `059_confirmation_reminders.sql` using `npm run db:migrate`.
2. Deploy the updated application.
3. Start or restart `teachernavigator-maintenance` with the correct environment. The existing [deployment script](../scripts/deploy.sh) handles migrations, application restart, and maintenance restart.

Creating this guide does not deploy the changes or send any emails.

## Delivery failures and bounces

Migration `060_mail_delivery_events.sql` stores signed delivery webhook metadata separately from email bodies. The Sent list shows the reported status; opening a sent message shows the provider’s reason when supplied. The lookup uses the provider email ID, so a webhook received before its Sent copy is saved can still be matched afterward. Replayed webhook IDs are ignored. Permanent failure events take precedence over delivery/delay events; otherwise the latest provider timestamp wins.

After migration and deployment, edit the existing Resend webhook for `https://teachernavigator.com/api/mail/inbound` and subscribe to `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.failed`, and `email.suppressed`, retaining `email.received`. Keep its signing secret configured as `RESEND_WEBHOOK_SECRET`. No new webhook endpoint or signing secret is needed when updating the existing subscription.

Provider event definitions: [Resend’s official webhook reference](https://github.com/resend/resend-skills/blob/main/skills/resend/references/webhooks.md).

Messages without a delivery event show “Отправлено · доставка не подтверждена” when opened. Delivery means acceptance by the recipient mail server, not that the user read the message or that it reached the inbox. A bounce does not always prove that an address is nonexistent; read the provider’s reason. For multiple recipients, a failure can concern only some recipients; the displayed status describes the message and should not be interpreted as failure for every address.

This adds delivery metadata for provider events, not Sent copies of other automatic emails. It does not automatically resend failed emails or change application confirmation status. Existing messages are not backfilled from the provider; statuses require webhook events. Permanently deleting a mailbox message removes its website copy; delivery metadata is stored separately and is not an email body archive.
