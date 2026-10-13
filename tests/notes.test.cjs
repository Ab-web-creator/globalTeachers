/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS TypeScript test harness. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const { createNote, loadNotes, saveNotes, reorderNotes, noteColors, notesStorageKey } = require('../lib/notes/storage.ts');

test('notes preserve multiline text, fixed colors, timestamps and order through a reload', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const first = { ...createNote(), title: 'Revision', body: 'Chapter 3\nAsk about the date' };
  const second = { ...createNote(), title: 'Questions' };
  assert.ok(noteColors.includes(first.color));
  saveNotes(storage, [first, second]);
  assert.deepEqual(loadNotes(storage), [first, second]);
  const reordered = reorderNotes(loadNotes(storage), first.id, second.id);
  saveNotes(storage, reordered);
  assert.deepEqual(loadNotes(storage), [second, first]);
  assert.equal(loadNotes(storage)[1].createdAt, first.createdAt);
  assert.equal(loadNotes(storage)[1].color, first.color);
  assert.equal(values.size, 1);
  assert.ok(values.has(notesStorageKey));
});

test('missing, corrupt, duplicate or invalid notes load safely as an empty board', () => {
  const note = createNote();
  for (const value of [null, '{bad JSON', '{}', '[null]', JSON.stringify([note, note]), JSON.stringify([{ ...note, color: 'red' }]), JSON.stringify([{ ...note, updatedAt: 1e100 }])]) {
    assert.deepEqual(loadNotes({ getItem: () => value }), []);
  }
  assert.deepEqual(loadNotes({ getItem: () => { throw new Error('Storage blocked'); } }), []);
});

test('storage write failures are surfaced and invalid reorder targets preserve the list', () => {
  const notes = [createNote()];
  assert.throws(() => saveNotes({ setItem: () => { throw new Error('Quota exceeded'); } }, notes), /Quota exceeded/);
  assert.equal(reorderNotes(notes, notes[0].id, 'missing'), notes);
  assert.equal(reorderNotes(notes, notes[0].id, notes[0].id), notes);
});
