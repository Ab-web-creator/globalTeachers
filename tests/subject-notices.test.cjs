/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { getSubjectNotice } = require('../app/consultation/components/subject-notices.ts');
const { subjects } = require('../app/consultation/components/subjects.ts');

test('subject warnings distinguish groups and suppress warnings for any unrestricted selection', () => {
  assert.equal(getSubjectNotice([]), null);
  for (const subject of subjects.slice(0, 3)) assert.equal(getSubjectNotice([subject]), 'early-education');
  for (const subject of subjects.filter((subject) => subject.endsWith(' язык') || subject === 'Современные языки')) {
    assert.equal(getSubjectNotice([subject]), 'languages');
    assert.equal(getSubjectNotice(['Начальная школа', subject]), 'mixed');
    assert.equal(getSubjectNotice([subject, 'Математика']), null);
  }
  assert.equal(getSubjectNotice(['Начальная школа', 'Дошкольное образование']), 'early-education');
  assert.equal(getSubjectNotice(['Русский язык', 'Узбекский язык']), 'languages');
  assert.equal(getSubjectNotice(['Начальная школа', 'Русский язык', 'Физика']), null);
});

test('mixed selections have a distinct notice unless a C-group subject is present', () => {
  const { earlyEducationSubjects, languageSubjects, subjectNotices } = require('../app/consultation/components/subject-notices.ts');
  const unrestricted = subjects.filter((subject) => !earlyEducationSubjects.has(subject) && !languageSubjects.has(subject));
  for (const early of earlyEducationSubjects) {
    for (const language of languageSubjects) {
      assert.equal(getSubjectNotice([early, language]), 'mixed');
      assert.equal(getSubjectNotice([language, early]), 'mixed');
      for (const subject of unrestricted) {
        assert.equal(getSubjectNotice([early, language, subject]), null);
      }
    }
  }
  assert.equal(subjectNotices['early-education'].recommendStart, false);
});
