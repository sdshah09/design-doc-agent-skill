#!/usr/bin/env node
// Installs the amazon-design-doc skill into whichever agent tools a project uses.
// ponytail: plain fs copy + one flattened markdown per tool. No deps, no template engine.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, cpSync, realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'amazon-design-doc');
const NAME = 'amazon-design-doc';
const DESC =
  'Write, review, or improve a technical design doc, RFC, or tech spec using the Amazon design doc format.';

// Each target says where the skill lands for that tool, per-project and (where it exists) globally.
// `dir` targets get the real skill directory; `file` targets get one flattened markdown document.
export const TARGETS = {
  claude: {
    label: 'Claude Code / Claude.ai skills',
    dir: `.claude/skills/${NAME}`,
    global: `~/.claude/skills/${NAME}`,
  },
  cursor: {
    // Cursor has native skills — its own manifest lists builtins including `migrate-to-skills`,
    // which converts legacy .cursor/rules into this layout. Same SKILL.md format as Claude.
    label: 'Cursor skills',
    dir: `.cursor/skills/${NAME}`,
    global: `~/.cursor/skills/${NAME}`,
  },
  codex: {
    // Codex only reads skills from $CODEX_HOME/skills, never from the project, so this target
    // is home-scoped with or without --global. Same SKILL.md format as Claude.
    label: 'OpenAI Codex skills (always installed to $CODEX_HOME)',
    dir: `${process.env.CODEX_HOME || '~/.codex'}/skills/${NAME}`,
  },
  copilot: {
    label: 'GitHub Copilot instructions',
    file: `.github/instructions/${NAME}.instructions.md`,
    header: `---\napplyTo: '**/*.md'\ndescription: ${DESC}\n---\n\n`,
  },
  windsurf: { label: 'Windsurf rules', file: `.windsurf/rules/${NAME}.md` },
  gemini: { label: 'Gemini CLI commands', file: `.gemini/commands/design-doc.toml`, toml: true },
  agents: {
    label: 'AGENTS.md (Codex, Jules, Amp, and anything else that reads it)',
    file: 'AGENTS.md',
    append: true,
  },
};

const MARK_START = `<!-- ${NAME}:start -->`;
const MARK_END = `<!-- ${NAME}:end -->`;

const expand = (p) => (p.startsWith('~') ? join(homedir(), p.slice(1)) : p);

/** Concatenate SKILL.md and its references into one self-contained document. */
export function flatten(skillDir = SKILL) {
  const strip = (md) => md.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  const parts = [strip(readFileSync(join(skillDir, 'SKILL.md'), 'utf8'))];
  const refs = join(skillDir, 'references');
  if (existsSync(refs)) {
    for (const f of readdirSync(refs).sort()) {
      parts.push(strip(readFileSync(join(refs, f), 'utf8')));
    }
  }
  return parts.join('\n\n---\n\n') + '\n';
}

/** Wrap `body` in markers and splice it into existing file content, replacing any prior block. */
export function spliceBlock(existing, body) {
  const block = `${MARK_START}\n${body.trim()}\n${MARK_END}\n`;
  if (existing.includes(MARK_START) && existing.includes(MARK_END)) {
    const re = new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}\\n?`);
    return existing.replace(re, block);
  }
  return existing.trim() ? `${existing.trimEnd()}\n\n${block}` : block;
}

function install(key, { global: useGlobal, cwd = process.cwd() } = {}) {
  const t = TARGETS[key];
  if (!t) throw new Error(`Unknown target: ${key}. Try: ${Object.keys(TARGETS).join(', ')}`);

  const rel = useGlobal ? t.global || t.dir || t.file : t.dir || t.file;
  if (useGlobal && !t.global && !t.dir) throw new Error(`${key} has no global location`);
  const dest = rel.startsWith('~') ? expand(rel) : resolve(cwd, rel);

  if (t.dir && (!useGlobal || t.global)) {
    // Directory target: copy the skill verbatim so references stay lazily loadable.
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(SKILL, dest, { recursive: true });
    return dest;
  }

  const body = flatten();
  mkdirSync(dirname(dest), { recursive: true });
  if (t.toml) {
    writeFileSync(dest, `description = ${JSON.stringify(DESC)}\nprompt = """\n${body}"""\n`);
  } else if (t.append) {
    writeFileSync(dest, spliceBlock(existsSync(dest) ? readFileSync(dest, 'utf8') : '', body));
  } else {
    writeFileSync(dest, (t.header || '') + body);
  }
  return dest;
}

const HELP = `
amazon-design-doc — install the "write design docs like Amazon" skill into your agent tools

Usage:
  npx amazon-design-doc install [targets...] [--global]
  npx amazon-design-doc list
  npx amazon-design-doc print

Targets (default: claude cursor codex agents):
${Object.entries(TARGETS)
  .map(([k, t]) => `  ${k.padEnd(9)} ${t.label}`)
  .join('\n')}

  all        every target above

Flags:
  --global   install to your home directory instead of this project (claude, cursor)
`;

export function main(argv = process.argv.slice(2)) {
  const global = argv.includes('--global');
  const args = argv.filter((a) => !a.startsWith('-'));
  const cmd = args[0] || 'install';

  if (argv.includes('-h') || argv.includes('--help') || cmd === 'help') return console.log(HELP);
  if (cmd === 'list') return console.log(Object.keys(TARGETS).join('\n'));
  if (cmd === 'print') return process.stdout.write(flatten());
  if (cmd !== 'install') {
    console.error(`Unknown command: ${cmd}`);
    console.log(HELP);
    process.exitCode = 1;
    return;
  }

  let names = args.slice(1);
  if (names.includes('all')) names = Object.keys(TARGETS);
  if (!names.length) names = ['claude', 'cursor', 'codex', 'agents'];

  for (const name of names) {
    try {
      // Global install only makes sense where the tool has a home-dir location.
      const useGlobal = global && !!TARGETS[name]?.global;
      console.log(`✓ ${name.padEnd(9)} ${install(name, { global: useGlobal })}`);
    } catch (err) {
      console.error(`✗ ${name.padEnd(9)} ${err.message}`);
      process.exitCode = 1;
    }
  }
}

// npm and npx invoke the bin through a `.bin` symlink, so argv[1] is the link and
// import.meta.url is its target. Compare resolved paths or the CLI silently does nothing.
function isEntrypoint() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isEntrypoint()) main();
