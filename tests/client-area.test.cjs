/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript integration harness. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");
const { randomUUID } = require("node:crypto");
const { Pool } = require("pg");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    filename,
  );
const { NextRequest } = require("next/server");
const { createSession, sessionCookie } = require("../lib/admin/session.ts");
const {
  clientAccessLink,
  clientFromSession,
  clientSessionCookie,
  exchangeClientKey,
} = require("../lib/client-area/access.ts");
const {
  getInvitation,
  prepareInvitation,
  deliverInvitation,
  pauseInvitation,
  updateInvitation,
} = require("../lib/client-area/invitations.ts");
const {
  addChatMessage,
  bookAppointment,
  closeAppointmentSlot,
  getWorkspace,
  listPrivateClients,
  markChatRead,
  openAppointmentSlot,
  openAppointmentSlots,
} = require("../lib/client-area/workspace.ts");
const { deliverBookingEmail } = require("../lib/client-area/booking-email.ts");
const {
  appointmentCallAllowed,
  createAppointmentCall,
  startAdminAppointmentCall,
  incomingAppointmentCall,
} = require("../lib/client-area/appointment-call.ts");
const {
  GET: adminGet,
  POST: adminPost,
} = require("../app/api/admin/clients/route.ts");
const { POST: access } = require("../app/api/client/access/route.ts");
const {
  GET: workspaceGet,
  POST: chatPost,
} = require("../app/api/client/messages/route.ts");
const { POST: bookingPost } = require("../app/api/client/bookings/route.ts");
const {
  GET: photoGet,
  POST: photoPost,
} = require("../app/api/client/profile-photo/route.ts");
const {
  GET: notificationsGet,
} = require("../app/api/client/notifications/route.ts");
const { POST: callPost } = require("../app/api/client/call/route.ts");
const { GET: callsGet, POST: callsPost } = require("../app/api/calls/route.ts");

const request = (path, body, cookie = "", origin = "https://example.com") =>
  new NextRequest(`https://example.com${path}`, {
    ...(body === undefined
      ? {}
      : { method: "POST", body: JSON.stringify(body) }),
    headers: { origin, ...(cookie ? { cookie } : {}) },
  });

test("client administration rejects anonymous and cross-origin requests before database access", async () => {
  const saved = process.env.NODE_ENV,
    savedUrl = process.env.SITE_URL;
  process.env.NODE_ENV = "production";
  process.env.SITE_URL = "https://example.com";
  try {
    assert.equal((await adminGet(request("/api/admin/clients"))).status, 401);
    assert.equal(
      (await adminPost(request("/api/admin/clients", { action: "prepare" })))
        .status,
      401,
    );
    assert.equal(
      (
        await access(
          request(
            "/api/client/access",
            { key: "x" },
            "",
            "https://other.example",
          ),
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await bookingPost(
          request("/api/client/bookings", {}, "", "https://other.example"),
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await callPost(
          request("/api/client/call", {}, "", "https://other.example"),
        )
      ).status,
      403,
    );
  } finally {
    if (saved === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = saved;
    if (savedUrl === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = savedUrl;
  }
});

test(
  "private client lifecycle, bookings, notifications and appointment-only calling",
  { skip: !process.env.TEST_DATABASE_URL },
  async (t) => {
    const savedEnv = { ...process.env },
      savedPool = global.consultationPool,
      savedFetch = global.fetch;
    Object.assign(process.env, {
      NODE_ENV: "production",
      DATABASE_URL: process.env.TEST_DATABASE_URL,
      SITE_URL: "https://example.com",
      RESEND_API_KEY: "mock",
      CONSULTATION_EMAIL_FROM: "TeacherNavigator <team@example.com>",
      CONSULTATION_EMAIL_TO: "admin@example.com",
      ADMIN_PASSWORD: "p".repeat(24),
      ADMIN_SESSION_SECRET: "s".repeat(64),
    });
    const admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    const schema = `test_client_area_${Date.now()}`;
    await admin.query(`CREATE SCHEMA ${schema}`);
    const db = new Pool({
      connectionString: process.env.TEST_DATABASE_URL,
      options: `-c search_path=${schema}`,
      max: 8,
    });
    global.consultationPool = db;
    const sent = [];
    let failEmail = false;
    global.fetch = async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      if (failEmail)
        return Response.json({ message: "temporary failure" }, { status: 503 });
      sent.push({
        ...JSON.parse(options.body),
        key: options.headers["Idempotency-Key"],
      });
      return Response.json({ id: randomUUID() });
    };
    const adminCookie = `${sessionCookie}=${createSession()}`;
    const clients = [];
    const future = (hours) => {
      const date = new Date(Date.now() + hours * 3600000);
      date.setUTCMinutes(0, 0, 0);
      return date.toISOString();
    };
    try {
      for (const name of [
        "001_consultations.sql",
        "003_consultation_attempt_history.sql",
        "004_consultation_drafts.sql",
        "013_mailbox.sql",
        "017_browser_calls.sql",
        "018_retry_browser_calls.sql",
        "019_persistent_call_invitations.sql",
        "035_payment_contact_requests.sql",
        "037_mailbox_spam.sql",
        "038_client_area.sql",
        "039_appointment_calls.sql",
        "041_invitation_countdown.sql",
        "042_invitation_html.sql",
        "043_booking_client_timezone.sql",
        "044_private_chat_read.sql",
        "045_admin_appointment_calls.sql",
        "046_client_profile_photo.sql",
        "047_client_message_notifications.sql",
        "048_payment_page_cases.sql",
        "050_client_payment_status.sql",
        "051_frozen_client_accounts.sql",
        "052_client_consultation_profile.sql",
      ]) {
        await db.query(fs.readFileSync(`database/migrations/${name}`, "utf8"));
      }
      await t.test(
        "only authenticated admin can prepare a key; the page stays locked before sending",
        async () => {
          for (const tier of ["START", "PRO", "VIP"]) {
            const id = randomUUID(),
              email = `${tier.toLowerCase()}@example.com`;
            await db.query(
              "INSERT INTO payment_contact_requests(id, name, email, tier, message) VALUES ($1, $2, $3, $4, $5)",
              [id, `${tier} Teacher`, email, tier, "Payment question"],
            );
            await db.query(
              `INSERT INTO mailbox_messages(id, direction, from_address, to_addresses, reply_to, subject)
          VALUES ($1, 'inbound', $2, ARRAY['team@example.com'], ARRAY[$2], $3)`,
              [id, email, `Другой способ оплаты ${tier} — TeacherNavigator`],
            );
            const response = await adminPost(
              request(
                "/api/admin/clients",
                { action: "prepare", messageId: id },
                adminCookie,
              ),
            );
            assert.equal(response.status, 200);
            const invite = await response.json();
            assert.equal(invite.email, email);
            assert.equal(invite.name, `${tier} Teacher`);
            assert.equal(invite.status, "scheduled");
            assert.ok(new Date(invite.due_at).getTime() >= Date.now() + 9500);
            const key = invite.body.match(/\/client#([A-Za-z0-9_-]{43})/)[1];
            assert.equal(await exchangeClientKey(key), null);
            assert.equal(await clientAccessLink(invite.client_id), null);
            assert.equal((await adminPost(request("/api/admin/clients", { action: "copy-key", clientId: invite.client_id }, adminCookie))).status, 403);
            assert.equal(await deliverInvitation(invite.id), "waiting");
            const repeated = await prepareInvitation(id);
            assert.equal(repeated.id, invite.id);
            assert.equal((await listPrivateClients()).some(client => client.id === invite.client_id), false);
            await db.query("UPDATE private_clients SET paid_at=now() WHERE id=$1", [invite.client_id]);
            clients.push({
              tier,
              id: invite.client_id,
              invitation: invite.id,
              key,
              email,
            });
          }
          assert.equal(sent.length, 0);
          assert.equal(
            (
              await workspaceGet(
                request("/api/client/messages?client=" + clients[0].id),
              )
            ).status,
            401,
          );
        },
      );

      await t.test(
        "clicking pauses the server schedule; editing preserves the key and delivery activates access once",
        async () => {
          for (const client of clients) {
            const paused = await pauseInvitation(client.invitation);
            assert.equal(paused.status, "draft");
            await db.query(
              "UPDATE client_invitations SET due_at = now() - interval '1 minute' WHERE id = $1",
              [client.invitation],
            );
            assert.equal(await deliverInvitation(client.invitation), "waiting");
            await assert.rejects(
              updateInvitation(
                client.invitation,
                "Access key",
                "Removed the link",
              ),
              /Сохраните персональную ссылку/,
            );
            await updateInvitation(
              client.invitation,
              paused.subject,
              paused.body + "\nДо встречи!",
            );
            assert.equal(await deliverInvitation(client.invitation), "sent");
            assert.equal(
              (await getInvitation(client.invitation)).status,
              "sent",
            );
            assert.equal(await deliverInvitation(client.invitation), "waiting");
            assert.equal(
              sent.filter((email) => email.to === client.email).length,
              1,
            );
            const session = await exchangeClientKey(client.key);
            assert.ok(session);
            client.session = session;
            client.cookie = `${clientSessionCookie}=${session}`;
            assert.equal(await clientFromSession(session), client.id);
            const copied = await adminPost(request("/api/admin/clients", { action: "copy-key", clientId: client.id }, adminCookie));
            assert.equal(copied.status, 200);
            assert.equal((await copied.json()).link, `https://example.com/client#${client.key}`);
            assert.equal(copied.headers.get("cache-control"), "no-store");
            assert.equal((await adminPost(request("/api/admin/clients", { action: "copy-key", clientId: client.id }, client.cookie))).status, 401);

            assert.equal(
              await clientAccessLink(client.id),
              `https://example.com/client#${client.key}`,
            );
            const delivered = sent.find((email) => email.to === client.email);
            assert.ok(delivered.html.includes("Открыть личную страницу"));
            assert.ok(
              delivered.html.includes(
                `https://example.com/client#${client.key}`,
              ),
            );
            assert.equal(/<script|onclick=/i.test(delivered.html), false);
            assert.equal(
              (
                await db.query(
                  "SELECT direction FROM mailbox_messages WHERE id = $1",
                  [client.invitation],
                )
              ).rows[0].direction,
              "outbound",
            );
          }
          const reply = await access(
            request("/api/client/access", { key: clients[0].key }),
          );
          assert.equal(reply.status, 200);
          const cookie = reply.headers.get("set-cookie");
          assert.match(cookie, /HttpOnly/i);
          assert.match(cookie, /Secure/i);
          assert.match(cookie, /SameSite=strict/i);
          const stored = (
            await db.query(
              "SELECT key_hash FROM private_clients WHERE id = $1",
              [clients[0].id],
            )
          ).rows[0].key_hash;
          assert.notEqual(stored, clients[0].key);
          assert.equal(
            (
              await access(
                request("/api/client/access", { email: clients[0].email }),
              )
            ).status,
            401,
          );
          await assert.rejects(
            pauseInvitation(clients[0].invitation),
            /уже отправляется/,
          );
        },
      );

      await t.test(
        "automatic invitations retry safely and concurrent workers cannot send duplicates",
        async () => {
          const id = randomUUID();
          await db.query(
            "INSERT INTO payment_contact_requests(id, name, email, tier, message) VALUES ($1, 'Retry Teacher', 'retry@example.com', 'PRO', 'Hello')",
            [id],
          );
          await db.query(
            "INSERT INTO mailbox_messages(id, direction, from_address, to_addresses, reply_to, subject) VALUES ($1, 'inbound', 'retry@example.com', ARRAY['team@example.com'], ARRAY['retry@example.com'], 'Другой способ оплаты PRO — TeacherNavigator')",
            [id],
          );
          const invitation = await prepareInvitation(id);
          const key = invitation.body.match(/\/client#([A-Za-z0-9_-]{43})/)[1];
          await db.query(
            "UPDATE client_invitations SET due_at = now() WHERE id = $1",
            [invitation.id],
          );
          failEmail = true;
          assert.equal(await deliverInvitation(invitation.id), "failed");
          assert.equal(await exchangeClientKey(key), null);
          assert.equal(
            (await getInvitation(invitation.id)).status,
            "scheduled",
          );
          await assert.rejects(
            pauseInvitation(invitation.id),
            /уже отправляется/,
          );
          failEmail = false;
          await db.query(
            "UPDATE client_invitations SET due_at = now() WHERE id = $1",
            [invitation.id],
          );
          const results = await Promise.all([
            deliverInvitation(invitation.id),
            deliverInvitation(invitation.id),
          ]);
          assert.equal(results.filter((result) => result === "sent").length, 1);
          assert.equal(
            sent.filter((email) => email.to === "retry@example.com").length,
            1,
          );
          assert.ok(await exchangeClientKey(key));
        },
      );

      await t.test(
        "chat and workspace are scoped to the session, not a supplied client id",
        async () => {
          const own = clients[0],
            other = clients[1];
          const id = randomUUID();
          const body = {
            id,
            body: "Private question <script>test</script>",
            clientId: other.id,
          };
          assert.equal(
            (await chatPost(request("/api/client/messages", body, own.cookie)))
              .status,
            200,
          );
          assert.equal(
            (await chatPost(request("/api/client/messages", body, own.cookie)))
              .status,
            200,
          );
          assert.equal(
            (
              await chatPost(
                request("/api/client/messages", body, other.cookie),
              )
            ).status,
            409,
          );
          await addChatMessage(own.id, "admin", randomUUID(), "Private reply");
          const response = await workspaceGet(
            request(
              `/api/client/messages?client=${other.id}`,
              undefined,
              own.cookie,
            ),
          );
          const workspace = await response.json();
          assert.equal(workspace.client.id, own.id);
          assert.equal(workspace.messages.length, 2);
          assert.equal((await getWorkspace(other.id)).messages.length, 0);
          assert.equal("key_hash" in workspace.client, false);
          assert.equal(
            (
              await adminGet(
                request(
                  `/api/admin/clients?client=${own.id}`,
                  undefined,
                  other.cookie,
                ),
              )
            ).status,
            401,
          );
          assert.equal(
            (
              await chatPost(
                request(
                  "/api/client/messages",
                  { id: randomUUID(), body: " " },
                  own.cookie,
                ),
              )
            ).status,
            400,
          );
        },
      );

      await t.test(
        "unread messages persist, reads are scoped, and clients awaiting replies sort first",
        async () => {
          const own = clients[0],
            other = clients[1];
          const first = randomUUID(),
            later = randomUUID(),
            foreign = randomUUID();
          await addChatMessage(own.id, "client", first, "Question");
          await addChatMessage(other.id, "client", foreign, "Other question");
          await markChatRead(own.id, [first, foreign]);
          await addChatMessage(
            own.id,
            "client",
            later,
            "New question after read",
          );
          let listed = await listPrivateClients();
          assert.equal(
            listed.find((item) => item.id === own.id).unread_count,
            1,
          );
          assert.equal(
            listed.find((item) => item.id === other.id).unread_count,
            1,
          );
          assert.equal(
            listed.find((item) => item.id === own.id).awaiting_reply,
            true,
          );
          await addChatMessage(own.id, "admin", randomUUID(), "Answer");
          listed = await listPrivateClients();
          assert.equal(
            listed.find((item) => item.id === own.id).awaiting_reply,
            false,
          );
          assert.ok(
            listed.findIndex((item) => item.id === other.id) <
              listed.findIndex((item) => item.id === own.id),
          );
          const workspace = await getWorkspace(own.id);
          await markChatRead(
            own.id,
            workspace.messages.map((item) => item.id),
          );
          listed = await listPrivateClients();
          assert.equal(
            listed.find((item) => item.id === own.id).unread_count,
            0,
          );
          assert.equal(
            listed.find((item) => item.id === other.id).unread_count,
            1,
          );
        },
      );

      await t.test(
        "profile photos are private, persist, and reject unsafe or oversized uploads",
        async () => {
          assert.equal(
            (await photoGet(request("/api/client/profile-photo"))).status,
            401,
          );
          assert.equal(
            (
              await photoPost(
                request(
                  "/api/client/profile-photo",
                  {},
                  clients[0].cookie,
                  "https://other.example",
                ),
              )
            ).status,
            403,
          );
          const upload = (bytes, cookie) =>
            photoPost(
              new NextRequest("https://example.com/api/client/profile-photo", {
                method: "POST",
                headers: { origin: "https://example.com", cookie },
                body: bytes,
              }),
            );
          assert.equal(
            (await upload(Buffer.from("<svg/>"), clients[0].cookie)).status,
            400,
          );
          assert.equal(
            (await upload(Buffer.alloc(2097153), clients[0].cookie)).status,
            413,
          );
          const png = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFLsAAAAASUVORK5CYII=",
            "base64",
          );
          assert.equal((await upload(png, clients[0].cookie)).status, 200);
          const own = await photoGet(
            request("/api/client/profile-photo", undefined, clients[0].cookie),
          );
          assert.equal(own.status, 200);
          assert.equal(own.headers.get("content-type"), "image/png");
          assert.match(own.headers.get("cache-control"), /no-store/);
          assert.deepEqual(Buffer.from(await own.arrayBuffer()), png);
          assert.equal(
            (
              await photoGet(
                request(
                  "/api/client/profile-photo",
                  undefined,
                  clients[1].cookie,
                ),
              )
            ).status,
            404,
          );
          assert.equal(
            (await getWorkspace(clients[0].id)).client.has_profile_photo,
            true,
          );
          assert.equal(
            "profile_photo" in (await getWorkspace(clients[0].id)).client,
            false,
          );
        },
      );

      await t.test(
        "client notifications count only their unread admin messages and read markers cannot affect another client",
        async () => {
          assert.equal(
            (await notificationsGet(request("/api/client/notifications")))
              .status,
            401,
          );
          const own = clients[0],
            other = clients[1];
          const before = (
            await (
              await notificationsGet(
                request("/api/client/notifications", undefined, own.cookie),
              )
            ).json()
          ).unread;
          const id = randomUUID(),
            foreign = randomUUID();
          await addChatMessage(own.id, "admin", id, "Message for you");
          await addChatMessage(
            other.id,
            "admin",
            foreign,
            "Private message for someone else",
          );
          let notification = await notificationsGet(
            request("/api/client/notifications", undefined, own.cookie),
          );
          assert.match(notification.headers.get("cache-control"), /no-store/);
          assert.equal((await notification.json()).unread, before + 1);
          assert.equal(
            (
              await chatPost(
                request(
                  "/api/client/messages",
                  { action: "read-chat", ids: [foreign], clientId: other.id },
                  own.cookie,
                ),
              )
            ).status,
            200,
          );
          notification = await notificationsGet(
            request("/api/client/notifications", undefined, other.cookie),
          );
          assert.equal((await notification.json()).unread, 1);
          await chatPost(
            request(
              "/api/client/messages",
              { action: "read-chat", ids: [id] },
              own.cookie,
            ),
          );
          await addChatMessage(
            own.id,
            "admin",
            randomUUID(),
            "Arrived after the read",
          );
          notification = await notificationsGet(
            request("/api/client/notifications", undefined, own.cookie),
          );
          assert.equal((await notification.json()).unread, 1);
        },
      );

      await t.test(
        "package defaults are START 1, PRO 3, VIP 1; only VIP allows admin overrides",
        async () => {
          await db.query(
            "UPDATE private_clients SET allowance_hours = 99 WHERE tier = 'START'",
          );
          await db.query(
            fs.readFileSync(
              "database/migrations/040_package_booking_rules.sql",
              "utf8",
            ),
          );
          assert.equal((await getWorkspace(clients[0].id)).slots.length, 0);
          for (const client of clients) {
            assert.equal(
              (await getWorkspace(client.id)).client.allowance_hours,
              client.tier === "PRO" ? 3 : 1,
            );
            if (client.tier !== "VIP") {
              const response = await adminPost(
                request(
                  "/api/admin/clients",
                  {
                    action: "client-allowance",
                    clientId: client.id,
                    hours: 99,
                  },
                  adminCookie,
                ),
              );
              assert.equal(response.status, 400);
            }
          }
          const slot = await openAppointmentSlot(future(24));
          assert.equal(await closeAppointmentSlot(slot), true);
        },
      );

      await t.test(
        "past slots cannot be opened or booked, including through direct requests",
        async () => {
          const past = new Date(Date.now() - 2 * 3600000).toISOString();
          await assert.rejects(openAppointmentSlot(past), /в будущем/);
          const response = await adminPost(
            request(
              "/api/admin/clients",
              { action: "open-slot", startsAt: past },
              adminCookie,
            ),
          );
          assert.equal(response.status, 400);
          const slot = (
            await db.query(
              "INSERT INTO appointment_slots(starts_at, ends_at, open) VALUES ($1, $1::timestamptz + interval '1 hour', true) RETURNING id",
              [past],
            )
          ).rows[0].id;
          await assert.rejects(
            bookAppointment(clients[0].id, slot),
            /уже недоступно/,
          );
          assert.equal(
            (await getWorkspace(clients[0].id)).slots.some(
              (item) => item.id === slot,
            ),
            false,
          );
          assert.equal(
            (
              await db.query(
                "SELECT booked_by FROM appointment_slots WHERE id = $1",
                [slot],
              )
            ).rows[0].booked_by,
            null,
          );
        },
      );

      await t.test(
        "slots cannot overlap; admin can close and reopen only unbooked slots",
        async () => {
          const start = future(30),
            slot = await openAppointmentSlot(start);
          await assert.rejects(
            openAppointmentSlot(
              new Date(new Date(start).getTime() + 30 * 60000).toISOString(),
            ),
            /пересекается|полные часы/,
          );
          assert.equal(await closeAppointmentSlot(slot), true);
          assert.equal(
            (await getWorkspace(clients[0].id)).slots.some(
              (item) => item.id === slot,
            ),
            false,
          );
          assert.equal(await openAppointmentSlot(start), slot);
          await bookAppointment(clients[0].id, slot);
          assert.equal(await closeAppointmentSlot(slot), false);
          await assert.rejects(openAppointmentSlot(start), /забронирован/);
        },
      );

      await t.test(
        "two clients competing for the same hour cannot both book it",
        async () => {
          const slot = await openAppointmentSlot(future(36));
          const results = await Promise.allSettled([
            bookAppointment(clients[1].id, slot),
            bookAppointment(clients[2].id, slot),
          ]);
          assert.equal(
            results.filter((result) => result.status === "fulfilled").length,
            1,
          );
          assert.equal(
            (
              await db.query(
                "SELECT count(*)::int AS n FROM appointment_email_jobs WHERE slot_id = $1",
                [slot],
              )
            ).rows[0].n,
            1,
          );
          for (const client of clients)
            assert.equal(
              (await getWorkspace(client.id)).slots.some(
                (item) => item.id === slot,
              ),
              false,
            );
          const booked = (
            await db.query(
              "SELECT booked_by FROM appointment_slots WHERE id = $1",
              [slot],
            )
          ).rows[0].booked_by;
          await bookAppointment(booked, slot); // A retried booking is idempotent.
          const other = clients.find((client) => client.id !== booked);
          await assert.rejects(bookAppointment(other.id, slot));
        },
      );

      await t.test(
        "parallel requests cannot exceed a client allowance",
        async () => {
          await db.query(
            "UPDATE private_clients SET allowance_hours = 1 WHERE id = $1",
            [clients[1].id],
          );
          // Use a fresh client so previous race results do not affect this test's balance.
          const source = clients[2];
          const used = (await getWorkspace(source.id)).client.booked_hours;
          await db.query(
            "UPDATE private_clients SET allowance_hours = $2 WHERE id = $1",
            [source.id, used + 1],
          );
          const slots = await Promise.all([
            openAppointmentSlot(future(40)),
            openAppointmentSlot(future(42)),
          ]);
          const results = await Promise.allSettled(
            slots.map((slot) => bookAppointment(source.id, slot)),
          );
          assert.equal(
            results.filter((result) => result.status === "fulfilled").length,
            1,
          );
          const data = await getWorkspace(source.id);
          assert.equal(data.client.booked_hours, data.client.allowance_hours);
        },
      );

      await t.test(
        "PRO has three hours on separate calendar days, including concurrent requests",
        async () => {
          const id = randomUUID();
          await db.query(
            "INSERT INTO private_clients(id, email, name, tier, key_hash, active, allowance_hours, paid_at) VALUES ($1, 'pro-days@example.com', 'PRO Days', 'PRO', $2, true, 99, now())",
            [id, randomUUID()],
          );
          assert.equal((await getWorkspace(id)).client.allowance_hours, 3);
          const date = new Date();
          date.setUTCDate(date.getUTCDate() + 10);
          date.setUTCHours(12, 0, 0, 0);
          const start = date.getTime();
          const slots = [];
          for (const offset of [0, 2, 24, 26, 48, 72])
            slots.push(
              await openAppointmentSlot(
                new Date(start + offset * 3600000).toISOString(),
              ),
            );
          await bookAppointment(id, slots[0]);
          await assert.rejects(
            bookAppointment(id, slots[1]),
            /один час в день/,
          );
          assert.equal(
            (await getWorkspace(id)).slots.some((slot) => slot.id === slots[1]),
            false,
          );
          const race = await Promise.allSettled([
            bookAppointment(id, slots[2]),
            bookAppointment(id, slots[3]),
          ]);
          assert.equal(
            race.filter((result) => result.status === "fulfilled").length,
            1,
          );
          await bookAppointment(id, slots[4]);
          await assert.rejects(
            bookAppointment(id, slots[5]),
            /часы уже использованы/,
          );
          assert.equal((await getWorkspace(id)).client.booked_hours, 3);
        },
      );

      await t.test(
        "VIP starts with one hour; admin can grant further hours",
        async () => {
          const id = randomUUID();
          await db.query(
            "INSERT INTO private_clients(id, email, name, tier, key_hash, active, paid_at) VALUES ($1, 'vip-extra@example.com', 'VIP Extra', 'VIP', $2, true, now())",
            [id, randomUUID()],
          );
          const slots = await Promise.all([
            openAppointmentSlot(future(100)),
            openAppointmentSlot(future(102)),
          ]);
          await bookAppointment(id, slots[0]);
          await assert.rejects(
            bookAppointment(id, slots[1]),
            /часы уже использованы/,
          );
          const response = await adminPost(
            request(
              "/api/admin/clients",
              { action: "client-allowance", clientId: id, hours: 2 },
              adminCookie,
            ),
          );
          assert.equal(response.status, 200);
          await bookAppointment(id, slots[1]);
          assert.equal((await getWorkspace(id)).client.booked_hours, 2);
        },
      );

      await t.test(
        "admin opens multiple full hours atomically and rejects minute-based slots",
        async () => {
          const values = [future(150), future(151), future(152)];
          const response = await adminPost(
            request(
              "/api/admin/clients",
              { action: "open-slots", startsAts: values },
              adminCookie,
            ),
          );
          assert.equal(response.status, 200);
          assert.equal((await response.json()).ids.length, 3);
          assert.equal(
            (
              await db.query(
                "SELECT id FROM appointment_slots WHERE starts_at = ANY($1::timestamptz[]) AND open",
                [values],
              )
            ).rowCount,
            3,
          );
          await assert.rejects(
            openAppointmentSlots([
              new Date(Date.parse(future(155)) + 15 * 60000).toISOString(),
            ]),
            /без минут/,
          );
          const clientId = randomUUID();
          await db.query(
            "INSERT INTO private_clients(id, email, name, tier, key_hash, active, allowance_hours, paid_at) VALUES ($1, 'batch@example.com', 'Batch Client', 'VIP', $2, true, 10, now())",
            [clientId, randomUUID()],
          );
          const taken = await openAppointmentSlot(future(202));
          await bookAppointment(clientId, taken);
          await assert.rejects(
            openAppointmentSlots([future(200), future(202)]),
            /забронирован/,
          );
          assert.equal(
            (
              await db.query(
                "SELECT id FROM appointment_slots WHERE starts_at = $1",
                [future(200)],
              )
            ).rowCount,
            0,
          );
          const halfOffset = new Date(future(2000));
          halfOffset.setUTCMinutes(30);
          assert.equal((await openAppointmentSlots([halfOffset.toISOString()], "Asia/Kolkata")).length, 1);
          await assert.rejects(openAppointmentSlots([halfOffset.toISOString()], "UTC"), /полные часы/);
          const twoDays = Array.from({ length: 48 }, (_, index) => future(1000 + index));
          assert.equal((await openAppointmentSlots(twoDays)).length, 48);
          await assert.rejects(openAppointmentSlots([...twoDays, future(1048)]), /48/);
          const duplicate = await openAppointmentSlots([
            future(204),
            future(204),
          ]);
          assert.equal(duplicate.length, 1);
        },
      );

      await t.test(
        "booking emails retry and are not duplicated; booking remains recorded if email fails",
        async () => {
          const slot = (
            await db.query(
              "SELECT slot_id FROM appointment_email_jobs ORDER BY id LIMIT 1",
            )
          ).rows[0].slot_id;
          failEmail = true;
          assert.equal(await deliverBookingEmail(slot), true);
          assert.ok(
            (
              await db.query(
                "SELECT booked_by FROM appointment_slots WHERE id = $1",
                [slot],
              )
            ).rows[0].booked_by,
          );
          failEmail = false;
          await db.query(
            "UPDATE appointment_email_jobs SET next_attempt_at = now() WHERE slot_id = $1",
            [slot],
          );
          const before = sent.length;
          assert.equal(await deliverBookingEmail(slot), true);
          assert.equal(sent.length, before + 2);
          assert.equal(
            sent.at(-2).subject,
            "Консультация забронирована — TeacherNavigator",
          );
          assert.equal(sent.at(-1).to[0], "admin@example.com");
          assert.equal(await deliverBookingEmail(slot), false);
        },
      );

      await t.test(
        "booking captures the client's zone and includes both local time and UTC in email",
        async () => {
          const client = clients[2];
          const workspace = await getWorkspace(client.id);
          await db.query(
            "UPDATE private_clients SET allowance_hours = $2 WHERE id = $1",
            [client.id, workspace.client.booked_hours + 1],
          );
          const startsAt = future(500);
          const slotId = await openAppointmentSlot(startsAt);
          const before = sent.length;
          const response = await bookingPost(
            request(
              "/api/client/bookings",
              { slotId, timeZone: "Asia/Tokyo" },
              client.cookie,
            ),
          );
          assert.equal(response.status, 200);
          const job = (
            await db.query(
              "SELECT client_time_zone FROM appointment_email_jobs WHERE slot_id = $1",
              [slotId],
            )
          ).rows[0];
          assert.equal(job.client_time_zone, "Asia/Tokyo");
          const email = sent
            .slice(before)
            .find((item) => item.to === client.email);
          assert.ok(email.text.includes("(Asia/Tokyo)"));
          assert.ok(email.text.includes("Время UTC:"));
          assert.ok(
            email.text.includes(
              new Intl.DateTimeFormat("ru-RU", {
                dateStyle: "long",
                timeStyle: "short",
                timeZone: "Asia/Tokyo",
              }).format(new Date(startsAt)),
            ),
          );
        },
      );

      await t.test(
        "appointment calls require the private session and the currently booked hour",
        async () => {
          for (const client of clients)
            await assert.rejects(
              createAppointmentCall(client.id),
              /только во время/,
            );
          assert.equal(
            (
              await callPost(
                request("/api/client/call", {}, "", "https://example.com"),
              )
            ).status,
            401,
          );
          assert.equal(
            (await callPost(request("/api/client/call", {}, clients[0].cookie)))
              .status,
            403,
          );
          const slot = (
            await db.query(
              "SELECT id FROM appointment_slots WHERE booked_by = $1 LIMIT 1",
              [clients[0].id],
            )
          ).rows[0].id;
          await db.query(
            "UPDATE appointment_slots SET starts_at = now() - interval '5 minutes', ends_at = now() + interval '55 minutes' WHERE id = $1",
            [slot],
          );
          const room = await createAppointmentCall(clients[0].id);
          assert.equal(
            (await createAppointmentCall(clients[0].id)).id,
            room.id,
          );
          assert.equal(
            await appointmentCallAllowed(slot, clients[0].session),
            true,
          );
          assert.equal(
            await appointmentCallAllowed(slot, clients[1].session),
            false,
          );
          assert.equal(await appointmentCallAllowed(slot), false);
          const noSession = new NextRequest(
            `https://example.com/api/calls?id=${room.id}`,
            { headers: { "x-call-token": room.token } },
          );
          assert.equal((await callsGet(noSession)).status, 401);
          const unauthorized = new NextRequest(
            "https://example.com/api/calls",
            {
              method: "POST",
              body: JSON.stringify({ action: "ring", id: room.id }),
              headers: {
                origin: "https://example.com",
                "x-call-token": room.token,
                cookie: clients[1].cookie,
              },
            },
          );
          assert.equal((await callsPost(unauthorized)).status, 401);
          const ring = new NextRequest("https://example.com/api/calls", {
            method: "POST",
            body: JSON.stringify({ action: "ring", id: room.id }),
            headers: {
              origin: "https://example.com",
              "x-call-token": room.token,
              cookie: clients[0].cookie,
            },
          });
          assert.equal((await callsPost(ring)).status, 204);
          const incoming = await callsGet(
            request("/api/calls?incoming=1", undefined, adminCookie),
          );
          assert.ok(
            (await incoming.json()).some((item) => item.id === room.id),
          );
          // End the client-initiated call, then exercise the reverse direction.
          await callsPost(
            request("/api/calls", { id: room.id, action: "end" }, adminCookie),
          );
          await assert.rejects(
            startAdminAppointmentCall(clients[0].id),
            /не в сети/,
          );
          assert.equal(await incomingAppointmentCall(clients[1].id), null);
          assert.equal(await incomingAppointmentCall(clients[0].id), null);
          const lastVisit = (await listPrivateClients()).find(
            (item) => item.id === clients[0].id,
          ).last_seen_at;
          assert.ok(lastVisit && Number.isFinite(Date.parse(lastVisit)));
          await getWorkspace(clients[0].id);
          assert.equal(
            (await listPrivateClients()).find(
              (item) => item.id === clients[0].id,
            ).last_seen_at,
            lastVisit,
          );
          const outgoing = await startAdminAppointmentCall(clients[0].id);
          assert.equal(outgoing.id, room.id);
          const clientIncoming = await incomingAppointmentCall(clients[0].id);
          assert.equal(clientIncoming.token, room.token);
          assert.equal(await incomingAppointmentCall(clients[1].id), null);
          const adminIncoming = await callsGet(
            request("/api/calls?incoming=1", undefined, adminCookie),
          );
          assert.ok(
            !(await adminIncoming.json()).some((item) => item.id === room.id),
          );
          assert.equal(
            (
              await callsPost(
                request(
                  "/api/calls",
                  { id: room.id, action: "accept" },
                  adminCookie,
                ),
              )
            ).status,
            403,
          );
          const clientAnswer = (kind, cookie) =>
            new NextRequest("https://example.com/api/calls", {
              method: "POST",
              body: JSON.stringify({ id: room.id, action: kind }),
              headers: {
                origin: "https://example.com",
                "x-call-token": room.token,
                cookie,
              },
            });
          assert.equal(
            (await callsPost(clientAnswer("accept", clients[1].cookie))).status,
            401,
          );
          assert.equal(
            (await callsPost(clientAnswer("decline", clients[0].cookie)))
              .status,
            204,
          );
          assert.equal(await incomingAppointmentCall(clients[0].id), null);
          await startAdminAppointmentCall(clients[0].id);
          assert.equal(
            (await callsPost(clientAnswer("accept", clients[0].cookie))).status,
            204,
          );
          assert.equal(
            (
              await callsGet(
                new NextRequest(`https://example.com/api/calls?id=${room.id}`, {
                  headers: {
                    "x-call-token": room.token,
                    cookie: clients[0].cookie,
                  },
                }),
              )
            ).status,
            200,
          );
          await assert.rejects(
            startAdminAppointmentCall(clients[0].id),
            /уже идёт/,
          );
          await db.query(
            "UPDATE appointment_slots SET starts_at = now() - interval '65 minutes', ends_at = now() - interval '5 minutes' WHERE id = $1",
            [slot],
          );
          assert.equal(
            await appointmentCallAllowed(slot, clients[0].session),
            false,
          );
          await assert.rejects(
            createAppointmentCall(clients[0].id),
            /только во время/,
          );
          await assert.rejects(
            startAdminAppointmentCall(clients[0].id),
            /только во время/,
          );
        },
      );

      await t.test(
        "logout revokes the browser session; only the emailed key restores access",
        async () => {
          const client = clients[0];
          assert.equal(
            (
              await access(
                request(
                  "/api/client/access",
                  { action: "logout" },
                  client.cookie,
                ),
              )
            ).status,
            200,
          );
          assert.equal(await clientFromSession(client.session), null);
          assert.equal(
            (
              await workspaceGet(
                request("/api/client/messages", undefined, client.cookie),
              )
            ).status,
            401,
          );
          assert.ok(await exchangeClientKey(client.key));
        },
      );
    } finally {
      global.fetch = savedFetch;
      global.consultationPool = savedPool;
      for (const key of Object.keys(process.env))
        if (!(key in savedEnv)) delete process.env[key];
      Object.assign(process.env, savedEnv);
      await db.end();
      await admin.query(`DROP SCHEMA ${schema} CASCADE`);
      await admin.end();
    }
  },
);
