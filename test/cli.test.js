import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { flatten, spliceBlock, TARGETS } from '../bin/cli.js';

const CLI = new URL('../bin/cli.js', import.meta.url).pathname;
const run = (args, cwd) => execFileSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });

test('flatten inlines every reference and drops frontmatter', () => {
  const md = flatten();
  assert.ok(!md.startsWith('---'), 'frontmatter must be stripped');
  assert.match(md, /Write Design Docs like Amazon/);
  assert.match(md, /Design Doc Template/, 'template reference is inlined');
  assert.match(md, /Weasel words to strike/, 'examples reference is inlined');
});

test('spliceBlock appends once and replaces on reinstall', () => {
  const first = spliceBlock('# Project\n', 'BODY-A');
  assert.match(first, /# Project/);
  assert.match(first, /BODY-A/);
  const second = spliceBlock(first, 'BODY-B');
  assert.doesNotMatch(second, /BODY-A/, 'stale block must be replaced, not duplicated');
  assert.equal(second.match(/amazon-design-doc:start/g).length, 1);
  assert.match(second, /# Project/, 'surrounding content survives');
});

test('install writes each target to its documented path', () => {
  const dir = mkdtempSync(join(tmpdir(), 'add-'));
  writeFileSync(join(dir, 'AGENTS.md'), '# House rules\n');
  run(['install', 'all'], dir);
  for (const t of Object.values(TARGETS)) {
    assert.ok(existsSync(join(dir, t.dir || t.file)), `${t.dir || t.file} exists`);
  }
  assert.ok(existsSync(join(dir, '.claude/skills/amazon-design-doc/references/template.md')));
  assert.match(readFileSync(join(dir, '.cursor/rules/amazon-design-doc.mdc'), 'utf8'), /^---\ndescription:/);
  assert.match(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), /# House rules/);
  assert.match(readFileSync(join(dir, '.gemini/commands/design-doc.toml'), 'utf8'), /^prompt = """/m);
});

test('unknown target fails loudly', () => {
  const dir = mkdtempSync(join(tmpdir(), 'add-'));
  assert.throws(() => run(['install', 'nope'], dir), /Command failed/);
});
