/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { isJunkEmail, isSpam } = require('../lib/mailbox/spam.ts');

const mailbox = 'tn.connect@teachernavigator.com';

test('bot probes with a code subject and an empty body are junk', () => {
  assert.equal(isJunkEmail({ subject: '#15597965-4da8a56e', text: '-' }), true);
  assert.equal(isJunkEmail({ subject: '15597966-14961931', text: '', html: '<p>&nbsp;—</p>' }), true);
  assert.equal(isJunkEmail({ subject: ' #15597964-C194FB4B ', text: null }), true);
});

test('real emails are never junk', () => {
  assert.equal(isJunkEmail({ subject: '#15597965-4da8a56e', text: 'Здравствуйте, вопрос по оплате' }), false);
  assert.equal(isJunkEmail({ subject: '#15597965-4da8a56e', html: '<p>Order 42</p>' }), false);
  assert.equal(isJunkEmail({ subject: '#15597965-4da8a56e', text: '你好' }), false);
  assert.equal(isJunkEmail({ subject: '#15597965-4da8a56e', text: '-', attachments: [{ id: 'a' }] }), false);
  assert.equal(isJunkEmail({ subject: 'Invoice #15597965-4da8a56e', text: '' }), false);
  assert.equal(isJunkEmail({ subject: '', text: '' }), false);
});

test('only email addressed to the mailbox reaches the inbox', () => {
  const email = { subject: 'Вопрос', text: 'Здравствуйте' };
  assert.equal(isSpam({ ...email, to: [mailbox] }, mailbox), false);
  assert.equal(isSpam({ ...email, to: ['Teacher Navigator <TN.Connect@TeacherNavigator.com>'] }, mailbox), false);
  assert.equal(isSpam({ ...email, to: ['someone@example.com'], cc: [mailbox] }, mailbox), false);
  assert.equal(isSpam({ ...email, to: ['ulysses@teachernavigator.com'] }, mailbox), true);
  assert.equal(isSpam({ ...email, to: ['noreply@teachernavigator.com'] }, mailbox), true);
  assert.equal(isSpam({ ...email, to: ['xtn.connect@teachernavigator.com'] }, mailbox), true);
  assert.equal(isSpam({ ...email, to: [] }, mailbox), true);
  assert.equal(isSpam({ subject: '#15597965-4da8a56e', text: '-', to: [mailbox] }, mailbox), true);
});
