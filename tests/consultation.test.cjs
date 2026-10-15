/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS harness transpiles TypeScript for Node tests. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
const { Pool } = require('pg');

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};
const { createToken, hashToken } = require('../lib/consultation/token.ts');
const { POST: submit } = require('../app/api/consultation/route.ts');
const { POST: confirm } = require('../app/api/consultation/confirm/route.ts');
const { GET: maintain } = require('../app/api/consultation/maintenance/route.ts');
const { savePendingApplication, confirmApplication, removeExpiredApplications } = require('../lib/consultation/applications.ts');
const { listApplications, getApplication } = require('../lib/admin/applications.ts');
const { subjects } = require('../app/consultation/components/subjects.ts');
const { parseAnswers, summarize } = require('../lib/consultation/answers.ts');
const { consultationSteps } = require('../app/consultation/components/consultation-steps.ts');
const { emailConfig } = require('../lib/consultation/email.ts');
const { deliverEducationOutcomeEmail, educationOutcomeContent } = require('../lib/consultation/education-outcome-email.ts');
const { deliverEnglishOutcomeEmail, englishOutcomeContent } = require('../lib/consultation/english-outcome-email.ts');
const { deliverPackageEmail, unselectedPackageContent, proPackageContent, vipPackageContent, startPackageContent } = require('../lib/consultation/package-email.ts');
const { saveDraft } = require('../lib/consultation/drafts.ts');
const { POST: draftRoute } = require('../app/api/consultation/draft/route.ts');
const answers = {
  name: 'Test Teacher', country: 'Test', email: 'test@example.com', contact: '',
  subject: subjects[0], education: 'Бакалавр',
  qualification: 'Да', english: 'Свободный',
  packagePreference: '', goals: '',
};
const request = (body) => new Request('https://example.com/api/consultation', {
  method: 'POST', headers: { origin: 'https://example.com' }, body: JSON.stringify(body),
});

test('sender branding uses TeacherNavigator and preserves the configured email address', () => {
  const savedEnv = { ...process.env };
  try {
    process.env.RESEND_API_KEY = 'test-only';
    process.env.CONSULTATION_EMAIL_TO = 'team@example.com';
    process.env.SITE_URL = 'https://example.com';
    for (const sender of ['GlobalTeacherHub <noreply@example.com>', 'TeacherNavigator <noreply@example.com>', 'noreply@example.com']) {
      process.env.CONSULTATION_EMAIL_FROM = sender;
      assert.equal(emailConfig().from, 'TeacherNavigator <noreply@example.com>');
    }
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
    Object.assign(process.env, savedEnv);
  }
});

test('the eight-step consultation ignores retired answers from older clients', () => {
  assert.deepEqual(consultationSteps.map((step) => step.fields[0]), [
    'name', 'country', 'email', 'subject', 'education', 'english', 'qualification', 'packagePreference',
  ]);
  assert.deepEqual(parseAnswers(answers), answers);
  const legacy = { ...answers, experience: 'До 2 лет', international: 'Нет',
    timing: 'Как можно скорее', destinations: 'Азия', priority: 'Найти вакансии' };
  assert.deepEqual(parseAnswers(legacy), answers);
  assert.equal(summarize(legacy), summarize(answers));
});

test('package preference is optional and accepts only the offered programs', () => {
  for (const packagePreference of ['', 'Start', 'Pro', 'VIP']) {
    assert.equal(parseAnswers({ ...answers, packagePreference }).packagePreference, packagePreference);
  }
  const legacy = { ...answers };
  delete legacy.packagePreference;
  assert.equal(parseAnswers(legacy).packagePreference, '');
  assert.throws(() => parseAnswers({ ...answers, packagePreference: 'Unknown' }), (error) => error.field === 'packagePreference');
});

test('legacy free text is optional and validation identifies the earlier invalid field', async () => {
  assert.equal(parseAnswers(answers).goals, '');
  assert.equal(parseAnswers({ ...answers, goals: '   ' }).goals, '');
  const response = await submit(request({ ...answers, email: 'teacher@school' }));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'Укажите корректный email, например name@example.com.', field: 'email',
  });
  const missing = await submit(request({ ...answers, education: '' }));
  assert.equal(missing.status, 400);
  assert.equal((await missing.json()).field, 'education');
});

test('subject selection accepts three subjects and rejects a fourth', async () => {
  const subject = subjects.slice(0, 3).join('; ');
  assert.equal(parseAnswers({ ...answers, subject }).subject, subject);
  const response = await submit(request({ ...answers, subject: subjects.slice(0, 4).join('; ') }));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'Выберите не более 3 предметов.', field: 'subject',
  });
});

test('tokens are random, contain no answers, and malformed tokens are rejected', () => {
  const token = createToken();
  assert.equal(token.length, 43);
  assert.notEqual(createToken(), token);
  assert.equal(hashToken(token).length, 64);
  assert.notEqual(hashToken(token), token);
  for (const invalid of [null, '', {}, 'invalid', 'x'.repeat(10000)]) assert.throws(() => hashToken(invalid));
});

test('PostgreSQL application lifecycle', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  process.env.RESEND_API_KEY = 'test-only';
  process.env.CONSULTATION_EMAIL_FROM = 'noreply@example.com';
  process.env.CONSULTATION_EMAIL_TO = 'team@example.com, second@example.com';
  process.env.SITE_URL = 'https://example.com';
  process.env.CRON_SECRET = 'test-scheduler-secret';
  const admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  const schema = `test_consultation_${Date.now()}`;
  await admin.query(`CREATE SCHEMA ${schema}`);
  const db = new Pool({ connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}`, max: 5 });
  global.consultationPool = db;
  const originalFetch = global.fetch;
  const calls = [];
  let failEmail = false;
  global.fetch = async (url, options) => {
    calls.push({ url, ...options, body: JSON.parse(options.body) });
    return failEmail ? new Response('', { status: 503 }) : Response.json({ id: 'mock-email' });
  };
  const count = async (table) => Number((await db.query(`SELECT count(*) FROM ${table}`)).rows[0].count);
  try {
    await db.query(fs.readFileSync('database/migrations/001_consultations.sql', 'utf8'));
    await t.test('migration removes retired answers from both tables and preserves metadata', async () => {
      const client = await db.connect();
      try {
        await client.query('BEGIN');
        const legacy = { ...answers, experience: 'До 2 лет', international: 'Нет',
          timing: 'Как можно скорее', destinations: 'Азия', priority: 'Найти вакансии' };
        for (const table of ['consultation_pending', 'consultation_applications']) {
          const submitted = table === 'consultation_applications' ? ', submitted_at' : '';
          const timestamp = submitted ? ', now()' : '';
          await client.query(`INSERT INTO ${table} (id, email, answers, token_hash${submitted})
            VALUES ('11111111-1111-4111-8111-111111111111', $1, $2, $3${timestamp})`,
          [answers.email, JSON.stringify(legacy), 'migration-test-token']);
        }
        const before = {};
        for (const table of ['consultation_pending', 'consultation_applications']) {
          before[table] = (await client.query(`SELECT * FROM ${table}`)).rows[0];
        }
        const migration = fs.readFileSync('database/migrations/002_remove_consultation_steps.sql', 'utf8');
        await client.query(migration);
        await client.query(migration);
        for (const table of ['consultation_pending', 'consultation_applications']) {
          const after = (await client.query(`SELECT * FROM ${table}`)).rows;
          assert.deepEqual(after, [{ ...before[table], answers }]);
        }
      } finally {
        await client.query('ROLLBACK');
        client.release();
      }
    });
    await db.query(fs.readFileSync('database/migrations/002_remove_consultation_steps.sql', 'utf8'));
    await t.test('history migration backfills existing records', async () => {
      await db.query(`INSERT INTO consultation_pending (id, email, answers, token_hash)
        VALUES ('22222222-2222-4222-8222-222222222222', $1, $2, 'backfill-token')`,
      [answers.email, JSON.stringify(answers)]);
      await db.query(fs.readFileSync('database/migrations/003_consultation_attempt_history.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/004_consultation_drafts.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/005_qualification_followups.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/006_qualification_change_warning.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/007_temporary_four_minute_followups.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/008_subject_followups.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/009_education_followups.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/010_english_followups.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/011_answer_change_warnings.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/012_temporary_one_minute_followups.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/020_remove_step_followups.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/021_remove_consultation_notifications.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/022_unsupported_subject_cases.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/023_unsupported_education_cases.sql', 'utf8'));
      await db.query("INSERT INTO consultation_attempts (id, email, answers, submitted_at, status) VALUES ('11111111-2222-4333-8444-555555555555', 'education-migration@example.com', '{}', now(), 'unsupported_education')");
      await db.query(fs.readFileSync('database/migrations/024_not_enough_education_status.sql', 'utf8'));
      assert.equal((await db.query("SELECT status FROM consultation_attempts WHERE email = 'education-migration@example.com'")).rows[0].status, 'not-enough-education');
      await db.query("DELETE FROM consultation_attempts WHERE email = 'education-migration@example.com'");
      await db.query(fs.readFileSync('database/migrations/025_education_outcome_email.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/026_not_enough_english_cases.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/027_english_outcome_email.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/028_confirmed_package_email.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/029_pro_package_email.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/030_vip_package_email.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/031_start_package_email.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/032_verify_education_outcome.sql', 'utf8'));
      await db.query(fs.readFileSync('database/migrations/033_verify_english_outcome.sql', 'utf8'));
      const queues = await db.query("SELECT tablename FROM pg_tables WHERE schemaname = current_schema() AND tablename LIKE 'consultation_%_followups'");
      assert.equal(queues.rowCount, 0);
      const history = (await db.query('SELECT * FROM consultation_attempts')).rows;
      assert.equal(history.length, 1);
      assert.deepEqual(history[0].answers, answers);
      assert.equal(history[0].status, 'pending');
      await db.query('DELETE FROM consultation_attempts');
      assert.equal(await count('consultation_pending'), 0);
    });
    await t.test('drafts require an entered email, retain partial input, and promote without duplicate attempts', async () => {
      const draft = { id: '33333333-3333-4333-8333-333333333333', token: '44444444-4444-4444-8444-444444444444' };
      const payload = { draft, revision: 1, step: 'email', answers: { name: 'Incomplete Teacher', email: '' } };
      assert.equal((await draftRoute(request(payload))).status, 400);
      const foreign = new Request('https://example.com/api/consultation/draft', {
        method: 'POST', headers: { origin: 'https://attacker.example' }, body: JSON.stringify(payload),
      });
      assert.equal((await draftRoute(foreign)).status, 403);
      payload.answers.email = 'not-yet-a-valid-email';
      assert.equal((await draftRoute(request(payload))).status, 204);
      let record = (await listApplications('draft', 'not-yet-a-valid-email', 1)).applications[0];
      assert.equal(record.status, 'draft');
      assert.equal(record.editable, false);
      assert.equal(record.attempts[0].last_step, 'email');
      assert.equal(record.answers.education, '');
      assert.equal(JSON.stringify(record).includes('draft_token_hash'), false);
      const next = { ...payload, revision: 3, step: 'education', answers: { ...payload.answers, email: 'draft@example.com', education: 'Магистр' } };
      await saveDraft(next);
      await saveDraft({ ...payload, revision: 2 });
      await saveDraft({ ...next, revision: 4, draft: { ...draft, token: '55555555-5555-4555-8555-555555555555' }, answers: { email: 'intruder@example.com' } });
      record = await getApplication(draft.id);
      assert.equal(record.email, 'draft@example.com');
      assert.equal(record.answers.education, 'Магистр');
      assert.equal(record.attempts.length, 1);
      const token = await savePendingApplication({ ...answers, email: 'draft@example.com' }, draft);
      record = await getApplication(draft.id);
      assert.equal(record.id, draft.id);
      assert.equal(record.status, 'pending');
      assert.equal(record.attempts.length, 1);
      assert.deepEqual(record.answers, { ...answers, email: 'draft@example.com' });
      await saveDraft({ ...next, revision: 5 });
      assert.equal((await getApplication(draft.id)).status, 'pending');
      assert.equal(await confirmApplication(hashToken(token)), draft.id);
      assert.equal((await getApplication(draft.id)).status, 'confirmed');
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [draft.id]);
      assert.equal(await getApplication(draft.id), null);
    });
    await t.test('submission emails the entered address and completes only after confirmation', async () => {
      assert.equal((await submit(request({ ...answers, subject: 'Custom subject' }))).status, 400);
      assert.equal((await submit(request(answers))).status, 200);
      assert.equal(await count('consultation_pending'), 1);
      assert.equal(await count('consultation_applications'), 0);
      assert.equal(calls[0].body.to, answers.email);
      const token = calls[0].body.text.match(/\/confirm#([^\s]+)/)[1];
      assert.equal((await submit(request(answers))).status, 429);
      assert.equal(calls.length, 1);
      const responses = await Promise.all([confirm(request({ token })), confirm(request({ token }))]);
      assert.deepEqual(responses.map((response) => response.status), [200, 200]);
      assert.equal(await count('consultation_pending'), 0);
      assert.equal(await count('consultation_applications'), 1);
      assert.deepEqual((await db.query('SELECT answers FROM consultation_applications')).rows[0].answers, answers);
      assert.equal(calls.length, 1, 'confirmation sends no internal notification');
      const draft = { id: 'abababab-abab-4bab-8bab-abababababab', token: 'cdcdcdcd-cdcd-4dcd-8dcd-cdcdcdcdcdcd' };
      await saveDraft({ draft, revision: 1, step: 'email', answers: { email: 'direct@example.com' } });
      assert.equal((await submit(request({ ...answers, email: 'direct@example.com', draft }))).status, 200);
      const record = await getApplication(draft.id);
      assert.equal(record.status, 'pending');
      assert.equal(record.attempts.length, 1);
      assert.deepEqual(record.answers, { ...answers, email: 'direct@example.com' });
      assert.equal(calls.at(-1).body.to, 'direct@example.com');
      await saveDraft({ draft, revision: 2, step: 'email', answers: { email: 'overwritten@example.com' } });
      assert.equal((await getApplication(draft.id)).email, 'direct@example.com');
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [draft.id]);
    });
    await t.test('expired pending records are rejected and purged without deleting confirmed data', async () => {
      const token = await savePendingApplication({ ...answers, email: 'expired@example.com' });
      await db.query("UPDATE consultation_pending SET expires_at = now() - interval '1 second'");
      assert.equal((await confirm(request({ token }))).status, 400);
      assert.equal(await removeExpiredApplications(), 1);
      assert.equal(await count('consultation_applications'), 1);
    });
    await t.test('resubmission replaces pending answers and invalidates the old link', async () => {
      const old = await savePendingApplication({ ...answers, email: 'resubmit@example.com' });
      await db.query("UPDATE consultation_pending SET created_at = now() - interval '61 seconds'");
      const fresh = await savePendingApplication({ ...answers, email: 'resubmit@example.com', name: 'Updated' });
      assert.equal(await confirmApplication(hashToken(old)), null);
      const id = await confirmApplication(hashToken(fresh));
      assert.equal((await db.query('SELECT answers FROM consultation_applications WHERE id = $1', [id])).rows[0].answers.name, 'Updated');
    });
    await t.test('repeat emails keep three original attempts in one searchable admin card', async () => {
      const email = 'history@example.com';
      const first = { ...answers, email, goals: 'Original situation' };
      const token1 = await savePendingApplication(first);
      assert.equal(await savePendingApplication(first), null);
      assert.equal((await db.query('SELECT count(*)::int AS count FROM consultation_attempts WHERE email = $1', [email])).rows[0].count, 1);
      await db.query("UPDATE consultation_pending SET created_at = now() - interval '61 seconds' WHERE email = $1", [email]);
      const second = { ...first, email: 'HISTORY@example.com', english: 'Средний', goals: 'Second situation' };
      const token2 = await savePendingApplication(second);
      assert.equal(await confirmApplication(hashToken(token1)), null);
      const id2 = await confirmApplication(hashToken(token2));
      assert.ok(id2);
      const third = { ...first, english: 'Уверенный', packagePreference: '', goals: '' };
      const token3 = await savePendingApplication(third);
      const pendingThird = (await listApplications('confirmed', email, 1)).applications[0];
      assert.equal(pendingThird.status, 'confirmed');
      assert.equal(pendingThird.latest_status, 'pending');
      assert.ok(pendingThird.email_confirmed_at);
      assert.equal((await listApplications('pending', email, 1)).total, 0);
      const id3 = await confirmApplication(hashToken(token3));
      assert.ok(id3);
      assert.equal(await confirmApplication(hashToken(token2)), id2);
      const grouped = await listApplications('all', 'Original situation', 1);
      assert.equal(grouped.total, 1);
      const record = grouped.applications[0];
      assert.equal(record.email, email);
      assert.equal(record.id, id3);
      assert.equal(record.attempts.length, 3);
      assert.deepEqual(await getApplication(record.attempts[0].id), record);
      assert.deepEqual(await getApplication(id2), record);
      assert.equal(await getApplication('invalid'), null);
      assert.equal(await getApplication('99999999-9999-4999-8999-999999999999'), null);
      assert.deepEqual(record.attempts.map((attempt) => attempt.answers), [first, second, third]);
      assert.deepEqual(record.attempts.map((attempt) => attempt.status), ['superseded', 'confirmed', 'confirmed']);
      assert.equal(JSON.stringify(record).includes('token_hash'), false);
      await db.query("UPDATE consultation_applications SET answers = jsonb_set(answers, '{goals}', '\"Admin correction\"') WHERE id = $1", [id3]);
      const edited = (await listApplications('all', email, 1)).applications[0];
      assert.equal(edited.answers.goals, 'Admin correction');
      assert.equal(edited.attempts[2].answers.goals, '');
      await savePendingApplication({ ...third, goals: 'Fourth attempt' });
      await db.query("UPDATE consultation_pending SET expires_at = now() - interval '1 second' WHERE email = $1", [email]);
      await removeExpiredApplications();
      const expiredLatest = (await listApplications('confirmed', email, 1)).applications[0];
      assert.equal(expiredLatest.status, 'confirmed');
      assert.equal(expiredLatest.expired, true);
      assert.ok(expiredLatest.email_confirmed_at);
      assert.equal((await getApplication(record.attempts[0].id)).attempts.length, 4);
      await db.query('DELETE FROM consultation_attempts WHERE email = $1', [email]);
      assert.equal((await listApplications('all', email, 1)).total, 0);
      assert.equal(await getApplication(record.attempts[0].id), null);
      assert.equal((await db.query('SELECT id FROM consultation_applications WHERE lower(email) = $1', [email])).rowCount, 0);
    });
    await t.test('transaction rolls back without losing pending data', async () => {
      const token = await savePendingApplication({ ...answers, email: 'rollback@example.com' });
      await db.query("ALTER TABLE consultation_applications ADD CONSTRAINT test_reject CHECK (email <> 'rollback@example.com')");
      await assert.rejects(confirmApplication(hashToken(token)));
      assert.equal((await db.query('SELECT id FROM consultation_pending WHERE token_hash = $1', [hashToken(token)])).rowCount, 1);
      await db.query('ALTER TABLE consultation_applications DROP CONSTRAINT test_reject');
    });
    await t.test('confirmation sends no internal mail and failed delivery preserves pending data', async () => {
      const token = await savePendingApplication({ ...answers, email: 'retry@example.com' });
      assert.equal((await confirm(request({ token }))).status, 200);
      assert.equal((await confirm(request({ token }))).status, 200);
      const beforeConfirmation = calls.length;
      assert.equal((await confirm(request({ token }))).status, 200);
      assert.equal(calls.length, beforeConfirmation);
      failEmail = true;
      assert.equal((await submit(request({ ...answers, email: 'send-failed@example.com' }))).status, 503);
      assert.equal((await db.query("SELECT id FROM consultation_pending WHERE email = 'send-failed@example.com'")).rowCount, 1);
      assert.equal((await db.query("SELECT id FROM consultation_applications WHERE email = 'send-failed@example.com'")).rowCount, 0);
      const before = calls.length;
      global.consultationPool = { connect: async () => { throw new Error('Database unavailable'); }, query: async () => { throw new Error('Database unavailable'); } };
      try { assert.equal((await submit(request({ ...answers, email: 'db-failed@example.com' }))).status, 503); }
      finally { global.consultationPool = db; }
      assert.equal(calls.length, before);
      failEmail = false;
    });
    await t.test('admin listing separates statuses, searches literal text, and excludes tokens', async () => {
      const all = await listApplications('all', '', 1);
      assert.ok(all.counts.pending > 0);
      assert.ok(all.counts.confirmed > 0);
      assert.equal(all.total, all.counts.pending + all.counts.confirmed);
      assert.ok(all.applications.every((row) => !('token_hash' in row)));
      const pending = await listApplications('pending', '', 1);
      assert.ok(pending.applications.every((row) => row.status === 'pending'));
      const confirmed = await listApplications('confirmed', 'RETRY@', 999);
      assert.equal(confirmed.total, 1);
      assert.equal(confirmed.page, 1);
      assert.equal(confirmed.applications[0].email, 'retry@example.com');
      assert.equal((await listApplications('all', "' OR 1=1 --", 1)).total, 0);
      assert.equal((await listApplications('all', '%', 1)).total, 0);
    });
    await t.test('maintenance is authenticated and cannot delete permanent records', async () => {
      assert.equal((await maintain(new Request('https://example.com/api/consultation/maintenance'))).status, 401);
      await db.query("UPDATE consultation_pending SET expires_at = now() - interval '1 second'");
      const before = await count('consultation_applications');
      const response = await maintain(new Request('https://example.com/api/consultation/maintenance', {
        headers: { authorization: 'Bearer test-scheduler-secret' },
      }));
      assert.equal(response.status, 200);
      assert.equal(await count('consultation_pending'), 0);
      assert.equal(await count('consultation_applications'), before);
    });
    await t.test('unsupported subject cases are saved, locked, and visible in admin without emails', async () => {
      const draft = { id: '12121212-1212-4212-8212-121212121212', token: '34343434-3434-4434-8434-343434343434' };
      const payload = { draft, revision: 1, step: 'subject', answers: { email: 'unsupported@example.com', subject: 'Русский язык' }, outcome: 'unsupported_subjects' };
      const before = calls.length;
      assert.equal((await draftRoute(request(payload))).status, 204);
      const record = await getApplication(draft.id);
      assert.equal(record.status, 'unsupported_subjects');
      assert.equal(record.attempts[0].status, 'unsupported_subjects');
      assert.equal((await listApplications('unsupported_subjects', 'unsupported@example.com', 1)).total, 1);
      await saveDraft({ ...payload, revision: 2, outcome: undefined, answers: { ...payload.answers, subject: 'Математика' } });
      assert.equal((await getApplication(draft.id)).answers.subject, 'Русский язык');
      assert.equal((await draftRoute(request({ ...payload, revision: 3, draft: { ...draft, token: '56565656-5656-4656-8656-565656565656' } }))).status, 400);
      assert.equal((await draftRoute(request({ ...payload, revision: 3, answers: { ...payload.answers, subject: 'Математика' } }))).status, 400);
      assert.equal(calls.length, before);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [draft.id]);
    });
    await t.test('secondary vocational education saves a locked outcome and requests email verification', async () => {
      const draft = { id: '78787878-7878-4878-8878-787878787878', token: '90909090-9090-4090-8090-909090909090' };
      const payload = { draft, revision: 1, step: 'education', answers: { email: 'vocational@example.com', subject: 'Математика', education: 'Среднее специальное' }, outcome: 'not-enough-education' };
      const before = calls.length;
      assert.equal((await draftRoute(request({ ...payload, answers: { ...payload.answers, education: 'Бакалавр' } }))).status, 400);
      assert.equal((await draftRoute(request({ ...payload, requestVerification: false }))).status, 204);
      assert.equal(calls.length, before, 'locked education screen does not send verification yet');
      assert.equal((await draftRoute(request({ ...payload, revision: 2, requestVerification: true }))).status, 204);
      assert.equal((await getApplication(draft.id)).status, 'not-enough-education');
      assert.equal((await listApplications('not-enough-education', 'vocational@example.com', 1)).total, 1);
      await saveDraft({ ...payload, outcome: undefined, revision: 3, answers: { ...payload.answers, education: 'Магистр' } });
      assert.equal((await getApplication(draft.id)).answers.education, 'Среднее специальное');
      assert.equal(calls.length, before + 1);
      assert.equal(calls.at(-1).body.subject, 'Подтвердите email — TeacherNavigator');
      assert.equal((await db.query('SELECT id FROM consultation_education_emails WHERE attempt_id = $1', [draft.id])).rowCount, 0);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [draft.id]);
    });
    await t.test('education outcome email waits one minute, retries, deduplicates, and preserves the supplied content', async () => {
      const draft = { id: 'abab1212-1212-4212-8212-121212121212', token: 'cdcd3434-3434-4434-8434-343434343434' };
      const payload = { draft, revision: 1, step: 'education', answers: { email: 'education-email@example.com', education: 'Среднее специальное' }, outcome: 'not-enough-education' };
      const before = calls.length;
      await saveDraft({ ...payload, outcome: undefined });
      assert.equal((await db.query("SELECT * FROM consultation_education_emails WHERE email = 'education-email@example.com'")).rowCount, 0);
      assert.equal((await draftRoute(request({ ...payload, revision: 2 }))).status, 204);
      assert.equal(calls.at(-1).body.to, payload.answers.email);
      assert.equal((await db.query("SELECT * FROM consultation_education_emails WHERE email = 'education-email@example.com'")).rowCount, 0);
      const token = calls.at(-1).body.text.match(/\/confirm#([^\s]+)/)[1];
      const invalidToken = createToken();
      assert.equal((await confirm(request({ token: invalidToken }))).status, 400);
      const responses = await Promise.all([confirm(request({ token })), confirm(request({ token }))]);
      assert.deepEqual(responses.map((response) => response.status), [200, 200]);
      assert.equal((await getApplication(draft.id)).status, 'not-enough-education');
      assert.ok((await getApplication(draft.id)).email_confirmed_at);
      const job = (await db.query("SELECT * FROM consultation_education_emails WHERE email = 'education-email@example.com'")).rows[0];
      assert.ok(job.due_at.getTime() > Date.now() + 59000);
      assert.equal(await deliverEducationOutcomeEmail(), false);
      await saveDraft({ ...payload, revision: 3 });
      assert.equal((await db.query("SELECT * FROM consultation_education_emails WHERE email = 'education-email@example.com'")).rowCount, 1);
      await db.query('UPDATE consultation_education_emails SET due_at = now(), next_attempt_at = now()');
      failEmail = true;
      assert.equal(await deliverEducationOutcomeEmail(), true);
      failEmail = false;
      assert.equal(await deliverEducationOutcomeEmail(), false);
      await db.query('UPDATE consultation_education_emails SET next_attempt_at = now()');
      const results = await Promise.all([deliverEducationOutcomeEmail(), deliverEducationOutcomeEmail()]);
      assert.equal(results.filter(Boolean).length, 1);
      assert.equal(calls.length, before + 3);
      assert.equal(calls.at(-1).body.to, 'education-email@example.com');
      assert.equal(calls.at(-1).headers['Idempotency-Key'], calls.at(-2).headers['Idempotency-Key']);
      const content = educationOutcomeContent('https://example.com');
      assert.equal(calls.at(-1).body.text, content.text);
      assert.ok(content.html.includes('<strong>Педагогическая квалификация.</strong>'));
      assert.ok(content.html.includes('<strong>Английский язык.</strong>'));
      assert.ok(content.html.includes('<strong>Однако это не означает, что международная карьера для вас закрыта.</strong>'));
      assert.ok(content.html.includes('href="https://example.com/programs/start"'));
      assert.equal(await deliverEducationOutcomeEmail(), false);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [draft.id]);
      assert.equal((await db.query("SELECT * FROM consultation_education_emails WHERE email = 'education-email@example.com'")).rowCount, 0);
    });
    await t.test('english outcome email waits one minute, retries, deduplicates, and preserves the supplied content', async () => {
      const draft = { id: 'abab5656-5656-4656-8656-565656565656', token: 'cdcd3434-3434-4434-8434-343434343434' };
      const payload = { draft, revision: 1, step: 'english', answers: { email: 'english-email@example.com', english: 'Базовый — могу общаться на простые темы' }, outcome: 'not-enough-english' };
      const before = calls.length;
      await saveDraft({ ...payload, outcome: undefined });
      assert.equal((await db.query("SELECT * FROM consultation_english_emails WHERE email = 'english-email@example.com'")).rowCount, 0);
      assert.equal((await draftRoute(request({ ...payload, revision: 2, requestVerification: false }))).status, 204);
      assert.equal(calls.length, before);
      assert.equal((await db.query("SELECT * FROM consultation_english_emails WHERE email = 'english-email@example.com'")).rowCount, 0);
      assert.equal((await draftRoute(request({ ...payload, revision: 3, requestVerification: true }))).status, 204);
      assert.equal(calls.at(-1).body.subject, 'Подтвердите email — TeacherNavigator');
      assert.equal(calls.at(-1).body.to, payload.answers.email);
      assert.equal((await db.query("SELECT * FROM consultation_english_emails WHERE email = 'english-email@example.com'")).rowCount, 0);
      const token = calls.at(-1).body.text.match(/\/confirm#([^\s]+)/)[1];
      const responses = await Promise.all([confirm(request({ token })), confirm(request({ token }))]);
      assert.deepEqual(responses.map((response) => response.status), [200, 200]);
      assert.equal((await getApplication(draft.id)).status, 'not-enough-english');
      assert.ok((await getApplication(draft.id)).email_confirmed_at);
      const job = (await db.query("SELECT * FROM consultation_english_emails WHERE email = 'english-email@example.com'")).rows[0];
      assert.ok(job.due_at.getTime() > Date.now() + 59000);
      assert.equal(await deliverEnglishOutcomeEmail(), false);
      await saveDraft({ ...payload, revision: 4 });
      assert.equal((await db.query("SELECT * FROM consultation_english_emails WHERE email = 'english-email@example.com'")).rowCount, 1);
      await db.query('UPDATE consultation_english_emails SET due_at = now(), next_attempt_at = now()');
      failEmail = true;
      assert.equal(await deliverEnglishOutcomeEmail(), true);
      failEmail = false;
      assert.equal(await deliverEnglishOutcomeEmail(), false);
      await db.query('UPDATE consultation_english_emails SET next_attempt_at = now()');
      const results = await Promise.all([deliverEnglishOutcomeEmail(), deliverEnglishOutcomeEmail()]);
      assert.equal(results.filter(Boolean).length, 1);
      assert.equal(calls.length, before + 3);
      assert.equal(calls.at(-1).body.to, 'english-email@example.com');
      assert.equal(calls.at(-1).headers['Idempotency-Key'], calls.at(-2).headers['Idempotency-Key']);
      const content = englishOutcomeContent('https://example.com');
      assert.equal(calls.at(-1).body.text, content.text);
      assert.ok(content.html.includes('<strong>педагогическую квалификацию</strong>'));
      assert.ok(content.html.includes('<strong>Английский язык</strong>'));
      assert.ok(content.html.includes('<strong>Однако это не означает, что международная карьера для вас недоступна!</strong>'));
      assert.ok(content.html.includes('href="https://example.com/programs/start"'));
      assert.equal(await deliverEnglishOutcomeEmail(), false);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [draft.id]);
      assert.equal((await db.query("SELECT * FROM consultation_english_emails WHERE email = 'english-email@example.com'")).rowCount, 0);
    });
    await t.test('beginner English outcomes are locked, listed in admin, and queue no education email', async () => {
      const draft = { id: 'abcd7878-7878-4878-8878-787878787878', token: 'abcd9090-9090-4090-8090-909090909090' };
      const payload = { draft, revision: 1, step: 'english', answers: { email: 'english-outcome@example.com', english: 'Не говорю по-английски' }, outcome: 'not-enough-english', requestVerification: false };
      const before = calls.length;
      assert.equal((await draftRoute(request({ ...payload, answers: { ...payload.answers, english: 'Уверенный — могу работать на английском' } }))).status, 400);
      assert.equal((await draftRoute(request(payload))).status, 204);
      assert.equal((await getApplication(draft.id)).status, 'not-enough-english');
      assert.equal((await listApplications('not-enough-english', payload.answers.email, 1)).total, 1);
      await saveDraft({ ...payload, revision: 2, outcome: undefined, answers: { ...payload.answers, english: 'Уверенный — могу работать на английском' } });
      assert.equal((await getApplication(draft.id)).answers.english, payload.answers.english);
      assert.equal((await db.query('SELECT id FROM consultation_education_emails WHERE attempt_id = $1', [draft.id])).rowCount, 0);
      assert.equal(calls.length, before);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [draft.id]);
    });
    await t.test('no-package followup is queued only after confirmation, waits one minute and sends once', async () => {
      const email = 'no-package@example.com';
      const token = await savePendingApplication({ ...answers, email, packagePreference: '' });
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE email = $1', [email])).rowCount, 0);
      const id = await confirmApplication(hashToken(token));
      const job = (await db.query('SELECT * FROM consultation_package_emails WHERE application_id = $1', [id])).rows[0];
      assert.ok(job.due_at.getTime() > Date.now() + 59000);
      assert.equal(await deliverPackageEmail(), false);
      assert.equal(await confirmApplication(hashToken(token)), id);
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE application_id = $1', [id])).rowCount, 1);
      await db.query('UPDATE consultation_package_emails SET due_at = now(), next_attempt_at = now() WHERE id = $1', [job.id]);
      const before = calls.length;
      failEmail = true;
      assert.equal(await deliverPackageEmail(), true);
      failEmail = false;
      assert.equal(await deliverPackageEmail(), false);
      await db.query('UPDATE consultation_package_emails SET next_attempt_at = now() WHERE id = $1', [job.id]);
      const results = await Promise.all([deliverPackageEmail(), deliverPackageEmail()]);
      assert.equal(results.filter(Boolean).length, 1);
      assert.equal(calls.length, before + 2);
      assert.equal(calls.at(-1).body.to, email);
      assert.equal(calls.at(-1).headers['Idempotency-Key'], calls.at(-2).headers['Idempotency-Key']);
      assert.equal(calls.at(-1).body.text, unselectedPackageContent('https://example.com').text);
      assert.ok(calls.at(-1).body.html.includes('<strong>Когда вы решите двигаться дальше, мы будем рады вам помочь.</strong>'));
      assert.ok(calls.at(-1).body.html.includes('href="https://example.com/#plans"'));
      assert.equal(await deliverPackageEmail(), false);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [id]);
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE application_id = $1', [id])).rowCount, 0);
    });
    await t.test('PRO confirmation queues the supplied email once with its payment link', async () => {
      const email = 'pro-followup@example.com';
      const token = await savePendingApplication({ ...answers, email, packagePreference: 'Pro' });
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE email = $1', [email])).rowCount, 0);
      const id = await confirmApplication(hashToken(token));
      const job = (await db.query('SELECT * FROM consultation_package_emails WHERE application_id = $1', [id])).rows[0];
      assert.equal(job.package_preference, 'Pro');
      assert.ok(job.due_at.getTime() > Date.now() + 59000);
      assert.equal(await deliverPackageEmail(), false);
      await confirmApplication(hashToken(token));
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE application_id = $1', [id])).rowCount, 1);
      await db.query('UPDATE consultation_package_emails SET due_at = now(), next_attempt_at = now() WHERE id = $1', [job.id]);
      const before = calls.length;
      assert.equal(await deliverPackageEmail(), true);
      assert.equal(calls.length, before + 1);
      assert.equal(calls.at(-1).body.to, email);
      assert.equal(calls.at(-1).body.subject, 'Пакет PRO — TeacherNavigator');
      assert.equal(calls.at(-1).body.text, proPackageContent('https://example.com').text);
      assert.ok(calls.at(-1).body.html.includes('<strong>Что входит в пакет PRO?</strong>'));
      for (const title of ['Всё из пакета START', 'Профессиональное CV', 'Сопроводительное письмо (Cover Letter)', 'Teacher Portfolio', 'LinkedIn', 'Поддержка в течение 30 дней', 'Как начать?', 'Наша цель', 'Команда TeacherNavigator']) {
        assert.ok(calls.at(-1).body.html.includes(`<strong>${title}</strong>`));
      }
      assert.ok(calls.at(-1).body.html.includes('<strong>Оформить пакет PRO →</strong>'));
      assert.equal(calls.at(-1).body.text.includes('**'), false);
      assert.ok(calls.at(-1).body.html.includes('href="https://example.com/payment/pro"'));
      assert.ok(calls.at(-1).body.text.includes('продолжительностью 60 минут'));
      assert.equal(await deliverPackageEmail(), false);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [id]);
    });
    await t.test('VIP confirmation queues the supplied email once with its payment link', async () => {
      const email = 'vip-followup@example.com';
      const token = await savePendingApplication({ ...answers, email, packagePreference: 'VIP' });
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE email = $1', [email])).rowCount, 0);
      const id = await confirmApplication(hashToken(token));
      const job = (await db.query('SELECT * FROM consultation_package_emails WHERE application_id = $1', [id])).rows[0];
      assert.equal(job.package_preference, 'VIP');
      assert.ok(job.due_at.getTime() > Date.now() + 59000);
      assert.equal(await deliverPackageEmail(), false);
      await confirmApplication(hashToken(token));
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE application_id = $1', [id])).rowCount, 1);
      await db.query('UPDATE consultation_package_emails SET due_at = now(), next_attempt_at = now() WHERE id = $1', [job.id]);
      const before = calls.length;
      assert.equal(await deliverPackageEmail(), true);
      assert.equal(calls.length, before + 1);
      assert.equal(calls.at(-1).body.to, email);
      assert.equal(calls.at(-1).body.subject, 'Пакет VIP — TeacherNavigator');
      assert.equal(calls.at(-1).body.text, vipPackageContent('https://example.com').text);
      assert.ok(calls.at(-1).body.html.includes('<strong>Что входит в пакет VIP?</strong>'));
      for (const title of ['Всё из пакетов START и PRO', 'Индивидуальная стратегия поиска работы', 'Сопровождение при поиске вакансий', 'Подготовка и сопровождение заявок', 'Подготовка к собеседованиям', 'Анализ предложений о работе (Job Offers)', 'Поддержка после принятия предложения', 'Индивидуальное сопровождение', 'Как начать?', 'Наша цель', 'Команда TeacherNavigator', 'Оформить заявку на VIP →']) {
        assert.ok(calls.at(-1).body.html.includes(`<strong>${title}</strong>`));
      }
      assert.equal(calls.at(-1).body.text.includes('**'), false);
      assert.ok(calls.at(-1).body.html.includes('href="https://example.com/payment/vip"'));
      assert.ok(calls.at(-1).body.text.includes('Мы не можем гарантировать получение предложения о работе'));
      assert.equal(await deliverPackageEmail(), false);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [id]);
    });
    await t.test('START confirmation queues the supplied email once with its payment link', async () => {
      const email = 'start-followup@example.com';
      const token = await savePendingApplication({ ...answers, email, packagePreference: 'Start' });
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE email = $1', [email])).rowCount, 0);
      const id = await confirmApplication(hashToken(token));
      const job = (await db.query('SELECT * FROM consultation_package_emails WHERE application_id = $1', [id])).rows[0];
      assert.equal(job.package_preference, 'Start');
      assert.ok(job.due_at.getTime() > Date.now() + 59000);
      assert.equal(await deliverPackageEmail(), false);
      await confirmApplication(hashToken(token));
      assert.equal((await db.query('SELECT id FROM consultation_package_emails WHERE application_id = $1', [id])).rowCount, 1);
      await db.query('UPDATE consultation_package_emails SET due_at = now(), next_attempt_at = now() WHERE id = $1', [job.id]);
      const before = calls.length;
      assert.equal(await deliverPackageEmail(), true);
      assert.equal(calls.length, before + 1);
      assert.equal(calls.at(-1).body.to, email);
      assert.equal(calls.at(-1).body.subject, 'Пакет START — TeacherNavigator');
      assert.equal(calls.at(-1).body.text, startPackageContent('https://example.com').text);
      assert.ok(calls.at(-1).body.html.includes('<strong>Что входит в пакет START?</strong>'));
      for (const title of ['Анализ профессионального профиля', 'Подбор стран и направлений', 'Индивидуальная онлайн-консультация (60 минут)', 'Проверка готовности документов', 'Рекомендации по CV и сопроводительному письму', 'Ресурсы для самостоятельного поиска работы', 'Поддержка в течение 7 дней', 'Как начать?', 'Наша цель', 'Команда TeacherNavigator', 'Оформить пакет START →']) {
        assert.ok(calls.at(-1).body.html.includes(`<strong>${title}</strong>`));
      }
      assert.equal(calls.at(-1).body.text.includes('**'), false);
      assert.ok(calls.at(-1).body.html.includes('href="https://example.com/payment/start"'));
      assert.ok(calls.at(-1).body.text.includes('продолжительностью 60–90 минут'));
      assert.equal(await deliverPackageEmail(), false);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [id]);
    });
    await t.test('answer changes remain audited without step email queues', async () => {
      const draft = { id: '66666666-6666-4666-8666-666666666666', token: '77777777-7777-4777-8777-777777777777' };
      const payload = { draft, revision: 1, step: 'qualification', answers: { email: 'start@example.com', qualification: 'Нет' } };
      const before = calls.length;
      await saveDraft(payload);
      await saveDraft({ ...payload, revision: 2, answers: { ...payload.answers, qualification: 'Есть BEd/MEd' } });
      await saveDraft({ draft: { ...draft, id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee' }, revision: 19, step: 'english', answers: { ...answers, email: 'warning@example.com' } });
      // Record eligible-to-eligible changes and reversals within the same draft.
      await saveDraft({ draft: { ...draft, id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee' }, revision: 20, step: 'english', answers: { ...answers, email: 'warning@example.com', education: 'Магистр', english: 'Средний — могу поддерживать разговор', subject: subjects[3] } });
      await saveDraft({ draft: { ...draft, id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee' }, revision: 21, step: 'education', answers: { ...answers, email: 'warning@example.com' } });
      const changes = (await getApplication('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee')).answer_changes;
      assert.equal(changes.filter((change) => change.field === 'education').length, 2);
      assert.equal(changes.filter((change) => change.field === 'english').length, 2);
      assert.equal(changes.filter((change) => change.field === 'subject').length, 2);
      let warning = (await getApplication(draft.id)).qualification_changes;
      assert.equal(warning.length, 1);
      assert.equal(warning[0].previous_answer, 'Нет');
      assert.equal(warning[0].new_answer, 'Есть BEd/MEd');
      await saveDraft({ ...payload, revision: 2 });
      assert.equal((await getApplication(draft.id)).qualification_changes.length, 1);
      await saveDraft({ ...payload, revision: 3 });
      warning = (await getApplication(draft.id)).qualification_changes;
      assert.equal(warning.length, 2);
      assert.equal(warning[1].new_answer, 'Нет');
      await saveDraft({ ...payload, revision: 4 });
      assert.equal(calls.length, before);
      await db.query('DELETE FROM consultation_attempts WHERE id = $1', [draft.id]);
    });
  } finally {
    global.fetch = originalFetch;
    delete global.consultationPool;
    await db.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
});
