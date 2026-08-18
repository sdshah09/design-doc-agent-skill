# amazon-design-doc

[![npm](https://img.shields.io/npm/v/amazon-design-doc.svg)](https://www.npmjs.com/package/amazon-design-doc)
[![CI](https://github.com/sdshah09/design-doc-agent-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/sdshah09/design-doc-agent-skill/actions/workflows/ci.yml)

An agent skill that teaches your coding assistant to write design docs the way Amazon does —
based on [Eric Clemmons' template](https://ericclemmons.com/blog/write-design-docs-like-amazon/),
written from his experience authoring design docs at AWS Amplify.

Works with Claude Code, Cursor, Codex, Copilot, Windsurf, Gemini CLI, and anything that reads
`AGENTS.md`.

## Install

```sh
npx amazon-design-doc install
```

That installs into Claude Code, Cursor, Codex, and `AGENTS.md` for the current project. Then ask
your agent to "write a design doc for X" and it picks the skill up.

```sh
npx amazon-design-doc install all              # every supported tool
npx amazon-design-doc install cursor windsurf  # pick your own
npx amazon-design-doc install claude --global  # ~/.claude instead of ./
npx amazon-design-doc print > design-doc.md    # just give me the markdown
npx amazon-design-doc list                     # what targets exist
```

## Where it installs

| Target | Path |
| --- | --- |
| `claude` | `.claude/skills/amazon-design-doc/` — or `~/.claude/skills/` with `--global` |
| `cursor` | `.cursor/rules/amazon-design-doc.mdc` |
| `codex` | `.codex/prompts/design-doc.md` — or `~/.codex/prompts/` with `--global` |
| `copilot` | `.github/instructions/amazon-design-doc.instructions.md` |
| `windsurf` | `.windsurf/rules/amazon-design-doc.md` |
| `gemini` | `.gemini/commands/design-doc.toml` |
| `agents` | `AGENTS.md`, spliced between markers so reinstalls replace rather than duplicate |

Directory-based tools get the skill verbatim, so its references load only when needed.
Single-file tools get one flattened document generated from the same source at install time.

## What the skill enforces

Four rules that matter more than the section list:

1. **6-8 pages of primary content.** Everything else goes in the Appendix.
2. **No weasel words.** "Significantly faster" becomes "4x faster, 200ms to 50ms". No data means
   go get data before writing the sentence.
3. **Data-point in the body, methodology in the Appendix.**
4. **Prose, not bullets.** Bullets hide the reasoning that connects two facts.

And a section template covering problem statement, glossary, use cases, breaking changes, success
criteria, proposed design, technical design, components, dependencies, monitoring, new APIs, pros
& cons, risks & mitigations, security, scope, out of scope, alternatives considered (including
"do nothing", which is mandatory), FAQ, open questions, and appendix.

The skill also works in reverse: point it at an existing doc and ask for a review, and it scores
against the same checklist and quotes the lines that fail.

## Use it without installing

The skill is plain markdown. Read [`skills/amazon-design-doc/SKILL.md`](skills/amazon-design-doc/SKILL.md),
the [template](skills/amazon-design-doc/references/template.md), and the
[worked examples](skills/amazon-design-doc/references/examples.md), or paste the output of
`npx amazon-design-doc print` wherever your tool takes custom instructions.

## Credit

The template and all guidance come from
[Write Design Docs like Amazon](https://ericclemmons.com/blog/write-design-docs-like-amazon/) by
Eric Clemmons. This package packages it for agents.

## License

MIT
