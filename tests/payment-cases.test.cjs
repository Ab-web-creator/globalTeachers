/* eslint-disable @typescript-eslint/no-require-imports -- TypeScript integration harness. */
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
const { POST } = require("../app/api/payment/case/route.ts");
const {
  listApplications,
  getApplication,
  paymentCandidateTier,
} = require("../lib/admin/applications.ts");
const { paymentProfileExists } = require("../lib/payment/profile.ts");
const { markApplicationPaid, markMessagePaid, messagePaymentDetails, setClientPayment } = require("../lib/admin/client-payment.ts");
const { listPrivateClients, getWorkspace, addChatMessage, bookAppointment } = require("../lib/client-area/workspace.ts");
const { draftTokenHash } = require("../lib/consultation/drafts.ts");
const request = (body, origin = "https://example.com") =>
  new Request("https://example.com/api/payment/case", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
const payload = (tier = "START", email = `${randomUUID()}@example.com`) => ({
  email,
  tier,
  draft: { id: randomUUID(), token: randomUUID() },
  revision: 1,
  profile: { name: "", subject: "", education: "", english: "" },
});
const complete = { name: "Анна" };

test("payment case route rejects cross-origin requests before reading the database", async () => {
  assert.equal(
    (await POST(request(payload(), "https://other.example"))).status,
    403,
  );
});

test(
  "direct payment cases require email and name and appear in admin without changing confirmed applications",
  { skip: !process.env.TEST_DATABASE_URL },
  async (t) => {
    const root = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    const schema = "payment_cases_" + randomUUID().replaceAll("-", "");
    const previous = global.consultationPool;
    const previousUrl = process.env.DATABASE_URL;
    const previousSite = process.env.SITE_URL;
    await root.query(`CREATE SCHEMA ${schema}`);
    const db = new Pool({
      connectionString: process.env.TEST_DATABASE_URL,
      options: `-c search_path=${schema},public`,
    });
    global.consultationPool = db;
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
    process.env.SITE_URL = "https://example.com";
    try {
      for (const file of fs
        .readdirSync("database/migrations")
        .filter((file) => file.endsWith(".sql"))
        .sort()) {
        await db.query(fs.readFileSync("database/migrations/" + file, "utf8"));
      }
      await t.test(
        "each package requires a name before creating a case, then updates the same case",
        async () => {
          for (const tier of ["START", "PRO", "VIP"]) {
            const input = payload(tier);
            assert.equal((await POST(request(input))).status, 400);
            assert.equal(await getApplication(input.draft.id), null);
            assert.equal(await paymentProfileExists(input.email), false);
            input.profile = { name: "   " };
            assert.equal((await POST(request(input))).status, 400);
            assert.equal(await getApplication(input.draft.id), null);
            input.profile = complete;
            input.revision++;
            assert.equal((await POST(request(input))).status, 200);
            const record = await getApplication(input.draft.id);
            assert.equal(record.status, "payment");
            assert.equal(paymentCandidateTier(record.last_step), tier);
            assert.equal(record.answers.packagePreference.toUpperCase(), tier);
            assert.equal(record.attempts.length, 1);
            assert.equal(record.email_confirmed_at, null);
            assert.equal(record.answers.country, "");
            assert.equal(record.answers.subject, "");
            assert.equal(record.answers.education, "");
            assert.equal(record.answers.english, "");
            assert.equal(record.editable, false);
            const found = await listApplications("payment", input.email, 1);
            assert.equal(found.total, 1);
            assert.equal(found.applications[0].id, input.draft.id);
            input.revision++;
            assert.equal((await POST(request(input))).status, 200);
            assert.equal(
              (
                await db.query(
                  "SELECT count(*)::int AS n FROM consultation_attempts WHERE email=$1",
                  [input.email],
                )
              ).rows[0].n,
              1,
            );
            assert.equal(
              (
                await db.query(
                  "SELECT count(*)::int AS n FROM consultation_applications WHERE email=$1",
                  [input.email],
                )
              ).rows[0].n,
              0,
            );
            assert.equal(
              (
                await db.query(
                  "SELECT count(*)::int AS n FROM private_clients WHERE email=$1",
                  [input.email],
                )
              ).rows[0].n,
              0,
            );
          }
        },
      );
      await t.test("only explicit payment adds a candidate to the client directory", async () => {
        const input = { ...payload("PRO"), profile: complete };
        assert.equal((await POST(request(input))).status, 200);
        assert.equal((await listPrivateClients()).some(client => client.email === input.email), false);
        const client = await markApplicationPaid(input.draft.id, "PRO");
        assert.equal((await listPrivateClients()).some(item => item.id === client.id), true);
        assert.ok((await getApplication(input.draft.id)).paid_at);
        assert.equal((await getApplication(input.draft.id)).paid_tier, "PRO");
        assert.equal((await listApplications("paid", input.email, 1)).total, 1);
        assert.equal((await listApplications("payment", input.email, 1)).total, 0);
        assert.equal((await getWorkspace(client.id, true)).client.active, true);
        assert.equal((await markApplicationPaid(input.draft.id, "PRO")).id, client.id);
        const unpaidEmail = `${randomUUID()}@example.com`;
        const unpaid = (await db.query("INSERT INTO private_clients(email,name,tier,key_hash) VALUES($1,'Unpaid','START',$2) RETURNING id", [unpaidEmail, draftTokenHash(randomUUID())])).rows[0];
        assert.equal((await listApplications("all", unpaidEmail, 1)).total, 1);
        assert.equal(await getWorkspace(unpaid.id, true), null);
        assert.equal((await listPrivateClients()).some(item => item.id === unpaid.id), false);
      });
      await t.test("admin marks payment from an inbound email without sending a key", async () => {
        const input = { ...payload("VIP"), profile: complete };
        await POST(request(input));
        const messageId = randomUUID();
        await db.query("INSERT INTO mailbox_messages(id,direction,from_address,to_addresses,reply_to,subject) VALUES($1,'inbound',$2,ARRAY['admin@example.com'],ARRAY[$2],'Payment')", [messageId, input.email]);
        assert.equal((await messagePaymentDetails(messageId)).paid_at, null);
        const client = await markMessagePaid(messageId, "VIP");
        assert.ok((await messagePaymentDetails(messageId)).paid_at);
        assert.equal((await getApplication(input.draft.id)).paid_tier, "VIP");
        assert.equal((await getWorkspace(client.id, true)).client.active, true);
        assert.equal((await db.query("SELECT count(*)::int AS n FROM client_invitations WHERE client_id=$1", [client.id])).rows[0].n, 1);
        assert.equal((await markMessagePaid(messageId, "VIP")).id, client.id);
        const { getMessage, listMessages } = require("../lib/mailbox/messages.ts");
        assert.equal((await getMessage(messageId)).folder, "vip-clients");
        assert.ok((await listMessages("vip-clients", 1)).messages.some(item => item.id === messageId));
        await markMessagePaid(messageId, "START");
        assert.equal((await getMessage(messageId)).folder, "start-clients");
        assert.equal((await getApplication(input.draft.id)).paid_tier, "START");
        await db.query("UPDATE private_clients SET active=true WHERE id=$1", [client.id]);
        const historyId = randomUUID();
        assert.equal(await addChatMessage(client.id, "client", historyId, "Previous conversation"), true);
        const { clientAccessLink, clientFromSession, exchangeClientKey } = require("../lib/client-area/access.ts");
        const originalLink = await clientAccessLink(client.id);
        const key = originalLink.split("#")[1];
        assert.equal((await db.query("SELECT status FROM client_invitations WHERE client_id=$1", [client.id])).rows[0].status, "draft");
        const session = await exchangeClientKey(key);
        await markMessagePaid(messageId, null);
        assert.equal(await clientFromSession(session), client.id);
        assert.ok(await exchangeClientKey(key));
        assert.ok((await getWorkspace(client.id)).messages.some(item => item.id === historyId));
        const rejectedId = randomUUID();
        assert.equal(await addChatMessage(client.id, "client", rejectedId, "Blocked while frozen"), false);
        await assert.rejects(bookAppointment(client.id, randomUUID()), /Аккаунт заморожен/);
        assert.equal((await db.query("SELECT count(*)::int AS n FROM private_chat_messages WHERE id=$1", [rejectedId])).rows[0].n, 0);
        assert.equal((await getMessage(messageId)).folder, "frozen");
        assert.ok((await listMessages("frozen", 1)).messages.some(item => item.id === messageId));
        assert.equal((await getApplication(input.draft.id)).paid_at, null);
        assert.equal((await listApplications("paid", input.email, 1)).total, 0);
        assert.equal((await listPrivateClients()).some(item => item.id === client.id), false);
        await markMessagePaid(messageId, "START");
        assert.equal((await getMessage(messageId)).folder, "start-clients");
        assert.equal((await db.query("SELECT frozen_at FROM private_clients WHERE id=$1", [client.id])).rows[0].frozen_at, null);
        assert.equal(await clientFromSession(session), client.id);
        assert.equal(await clientAccessLink(client.id), originalLink);
        assert.equal(await addChatMessage(client.id, "client", randomUUID(), "Resumed after payment"), true);
        await assert.rejects(markMessagePaid(randomUUID(), "VIP"), /не найдено/);
      });
      await t.test("client consultation profiles prefill, save partial answers, and remain isolated", async () => {
        const { clientConsultationProfile, saveClientConsultationProfile } = require("../lib/client-area/profile.ts");
        const { missingProfileFields } = require("../lib/client-area/profile-fields.ts");
        const input = { ...payload("PRO"), profile: { name: "Profile Teacher", subject: "Математика", education: "Магистр" } };
        await POST(request(input));
        const client = await markApplicationPaid(input.draft.id, "PRO");
        await db.query("UPDATE private_clients SET active=true WHERE id=$1", [client.id]);
        let profile = await clientConsultationProfile(client.id);
        assert.equal(profile.email, input.email);
        assert.equal(profile.name, "Profile Teacher");
        assert.equal(profile.subject, "Математика");
        assert.equal(profile.education, "Магистр");
        assert.ok(missingProfileFields(profile).includes("Страна проживания"));
        profile = await saveClientConsultationProfile(client.id, { ...profile, email: "other@example.com", country: "Нидерланды", qualification: "Нет", english: "Средний — могу поддерживать разговор" });
        assert.equal(profile.email, input.email);
        assert.equal(profile.country, "Нидерланды");
        const updatedCase = await getApplication(input.draft.id);
        assert.equal(updatedCase.has_personal_profile, true);
        assert.equal(updatedCase.answers.country, "Нидерланды");
        assert.equal(updatedCase.answers.education, "Магистр");
        assert.equal(updatedCase.attempts[0].answers.country, "");
        assert.equal((await listApplications("all", input.email, 1)).applications[0].answers.country, "Нидерланды");

        assert.deepEqual(missingProfileFields(profile), []);
        assert.equal((await getWorkspace(client.id, true)).profile.country, "Нидерланды");
        await setClientPayment(client.id, "VIP");
        assert.equal((await getApplication(input.draft.id)).paid_tier, "VIP");
        await setClientPayment(client.id, null);
        assert.equal(await getWorkspace(client.id, true), null);
        assert.ok((await db.query("SELECT frozen_at FROM private_clients WHERE id=$1", [client.id])).rows[0].frozen_at);
        assert.equal((await getWorkspace(client.id)).profile.country, "Нидерланды");
        await setClientPayment(client.id, "PRO");
        assert.equal((await getWorkspace(client.id, true)).client.tier, "PRO");
        await assert.rejects(setClientPayment(randomUUID(), "START"), /не найден/);

        profile = await saveClientConsultationProfile(client.id, { ...profile, subject: "" });
        assert.equal((await clientConsultationProfile(client.id)).subject, "");
        assert.ok(missingProfileFields(profile).includes("Специализация"));
        await assert.rejects(saveClientConsultationProfile(client.id, { ...profile, subject: "Injected" }), /предметов/);
        await assert.rejects(saveClientConsultationProfile(client.id, { ...profile, name: " " }), /имя/);
        const otherInput = { ...payload("START"), profile: { name: "Other Teacher" } };
        await POST(request(otherInput));
        const other = await markApplicationPaid(otherInput.draft.id, "START");
        assert.equal((await clientConsultationProfile(other.id)).country, "");
        assert.equal((await clientConsultationProfile(other.id)).email, otherInput.email);
        const { POST: saveRoute } = require("../app/api/client/profile/route.ts");
        const { NextRequest } = require("next/server");
        assert.equal((await saveRoute(new NextRequest("https://example.com/api/client/profile", { method: "POST", headers: { origin: "https://example.com" }, body: JSON.stringify({ profile }) }))).status, 401);
        assert.equal((await saveRoute(new NextRequest("https://example.com/api/client/profile", { method: "POST", headers: { origin: "https://other.example" }, body: JSON.stringify({ profile }) }))).status, 403);
      });
      await t.test("older private clients get one missing case without changing access", async () => {
        const email = `${randomUUID()}@example.com`;
        const inserted = await db.query(
          "INSERT INTO private_clients(email,name,tier,key_hash,active) VALUES($1,'Older client','START',$2,true) RETURNING id,key_hash",
          [email, draftTokenHash(randomUUID())],
        );
        const migration = fs.readFileSync("database/migrations/049_existing_client_cases.sql", "utf8");
        await db.query(migration);
        await db.query(migration);
        const found = await listApplications("payment", email, 1);
        assert.equal(found.total, 1);
        assert.equal(found.applications[0].answers.name, "Older client");
        assert.equal(found.applications[0].attempts.length, 1);
        assert.equal(found.applications[0].email_confirmed_at, null);
        const client = (await db.query("SELECT id,key_hash,active FROM private_clients WHERE email=$1", [email])).rows[0];
        assert.equal(client.id, inserted.rows[0].id);
        assert.equal(client.key_hash, inserted.rows[0].key_hash);
        assert.equal(client.active, true);
      });
      await t.test(
        "wrong tokens, stale updates and malformed fields cannot overwrite saved cases",
        async () => {
          const input = payload();
          input.profile = complete;
          assert.equal((await POST(request(input))).status, 200);
          assert.equal(
            (
              await POST(
                request({
                  ...input,
                  revision: 2,
                  draft: { ...input.draft, token: randomUUID() },
                }),
              )
            ).status,
            400,
          );
          assert.equal(
            (
              await POST(
                request({
                  ...input,
                  email: "different@example.com",
                  revision: 2,
                }),
              )
            ).status,
            400,
          );
          assert.equal(
            (await POST(request({ ...input, revision: 0 }))).status,
            400,
          );
          assert.equal(
            (
              await POST(
                request({
                  ...input,
                  revision: 2,
                  profile: { ...complete, subject: "Injected subject" },
                }),
              )
            ).status,
            400,
          );
          assert.equal(
            (await POST(request({ ...payload(), email: "bad" }))).status,
            400,
          );
          assert.equal(
            (await POST(request({ ...payload(), tier: "ADMIN" }))).status,
            400,
          );
          assert.equal(
            (await getApplication(input.draft.id)).answers.name,
            complete.name,
          );
        },
      );
      await t.test(
        "a payment visit is grouped by email and preserves prior verified case history",
        async () => {
          const input = payload("PRO");
          const earlier = randomUUID();
          await db.query(
            `INSERT INTO consultation_attempts(id,email,answers,submitted_at,confirmed_at,status,draft_token_hash)
        VALUES($1,$2,$3,now()-interval '1 day',now()-interval '1 day','confirmed',$4)`,
            [
              earlier,
              input.email,
              JSON.stringify({
                ...complete,
                email: input.email,
                country: "Нидерланды",
                packagePreference: "Start",
              }),
              draftTokenHash(randomUUID()),
            ],
          );
          input.profile = { ...complete, name: "Новое имя" };
          assert.equal((await POST(request(input))).status, 200);
          const result = await listApplications("all", input.email, 1);
          assert.equal(result.total, 1);
          assert.equal(result.applications[0].attempts.length, 2);
          assert.ok(result.applications[0].email_confirmed_at);
          const original = (
            await db.query(
              "SELECT answers,status FROM consultation_attempts WHERE id=$1",
              [earlier],
            )
          ).rows[0];
          assert.equal(original.answers.name, complete.name);
          assert.equal(original.status, "confirmed");
          assert.equal(
            (
              await POST(
                request({
                  ...input,
                  draft: { id: earlier, token: randomUUID() },
                  revision: 2,
                }),
              )
            ).status,
            400,
          );
        },
      );
      await t.test(
        "new record creation is capped per address but existing records still update",
        async () => {
          const input = payload();
          let kept;
          for (let i = 0; i < 10; i++) {
            kept = { ...payload("START", input.email), profile: complete };
            assert.equal((await POST(request(kept))).status, 200);
          }
          assert.equal(
            (await POST(request({ ...payload("START", input.email), profile: complete }))).status,
            400,
          );
          assert.equal(
            (await POST(request({ ...kept, revision: 2, profile: complete })))
              .status,
            200,
          );
        },
      );
    } finally {
      global.consultationPool = previous;
      if (previousUrl === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = previousUrl;
      if (previousSite === undefined) delete process.env.SITE_URL;
      else process.env.SITE_URL = previousSite;
      await db.end();
      await root.query(`DROP SCHEMA ${schema} CASCADE`);
      await root.end();
    }
  },
);
