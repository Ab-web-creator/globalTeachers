/* eslint-disable @typescript-eslint/no-require-imports -- Node test runner. */
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('fresh collaborator configuration creates credentials and preserves mail settings', async () => {
  const { prepareDatabaseEnvironment } = await import('../scripts/database-environment.mjs');
  const initial = 'RESEND_API_KEY=test-key\nDATABASE_URL=\nADMIN_PASSWORD=\n';
  const first = prepareDatabaseEnvironment(initial, { RESEND_API_KEY: 'test-key' });
  assert.match(first.values.DATABASE_URL, /^postgresql:\/\/teachernavigator:[a-f0-9]{64}@127\.0\.0\.1:55433\/teachernavigator$/);
  assert.equal(first.values.LOCAL_DATABASE_MANAGED, 'docker');
  assert.equal(first.values.ADMIN_PASSWORD.length, 64);
  assert.match(first.text, /RESEND_API_KEY=test-key/);
  const again = prepareDatabaseEnvironment(first.text, first.values);
  assert.deepEqual(again, first, 'rerunning must not rotate passwords or duplicate settings');
});

test('existing database and secrets are preserved; invalid ports fail before changes', async () => {
  const { prepareDatabaseEnvironment } = await import('../scripts/database-environment.mjs');
  const values = { DATABASE_URL: 'postgresql://existing', ADMIN_PASSWORD: 'existing', ADMIN_SESSION_SECRET: 'existing', CRON_SECRET: 'existing' };
  const text = 'DATABASE_URL=postgresql://existing\n';
  assert.deepEqual(prepareDatabaseEnvironment(text, values), { text, values });
  assert.throws(() => prepareDatabaseEnvironment('', { LOCAL_DATABASE_PORT: 'nope' }));
  assert.throws(() => prepareDatabaseEnvironment('', { LOCAL_DATABASE_PORT: '99999' }));
});
