# amazon-design-doc

[![npm](https://img.shields.io/npm/v/amazon-design-doc.svg)](https://www.npmjs.com/package/amazon-design-doc)
[![CI](https://github.com/sdshah09/design-doc-agent-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/sdshah09/design-doc-agent-skill/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/amazon-design-doc.svg)](LICENSE)

**An agent skill that makes your coding assistant write design docs the way Amazon does — and
review the ones you already have.**

Your agent will happily produce a design doc today. It will also produce a bulleted outline full
of "significantly faster" and "improved developer experience", with no `Alternatives Considered`
section and no argument for doing nothing. This skill replaces that with a specific format and
four writing rules it enforces on every draft.

Based on [Write Design Docs like Amazon](https://ericclemmons.com/blog/write-design-docs-like-amazon/)
by Eric Clemmons, written from his experience authoring design docs at AWS Amplify.

Works with Claude Code, Cursor, Codex, GitHub Copilot, Windsurf, Gemini CLI, and anything that
reads `AGENTS.md`.

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

## Why this one

Most "design doc" prompts hand the model a list of headings and stop. The heading list is the
easy part — anyone can produce a document with a `Risks` section in it. What makes a design doc
worth reviewing is the writing underneath the headings, and that is what this skill constrains:

1. **6-8 pages of primary content.** Everything else goes to the Appendix. A doc nobody finishes
   is a doc nobody approves.
2. **No weasel words.** "Significantly faster", "many customers", "should scale", "soon" are
   banned outright. Numbers, percentages, dates. If the data doesn't exist, the skill tells you
   to go get it before writing the sentence.
3. **Data-point in the body, methodology in the Appendix.** The reader gets "TTFB drops from
   200ms to 50ms", not your benchmark harness.
4. **Prose, not bullets.** Bullets hide the reasoning that connects two facts. Lists are reserved
   for genuinely enumerable things — glossaries, dependencies, components.

It also runs in reverse. Point it at a doc you already wrote and ask for a review, and it scores
against the same checklist and quotes the lines that fail — including whether "do nothing" was
addressed in `Alternatives considered`, which is mandatory, and whether each decision is marked a
one-way or two-way door.

## What the output looks like

Ask your agent *"write a design doc for moving webhook delivery off the cron sweep"* and the
opening reads like this — prose, numbers, problem before solution:

> ## Problem statement
>
> Webhook delivery runs as a 60-second cron sweep over the `pending_events` table. At current
> volume (1.2M events/day) the sweep consumes 41s of its 60s budget and p99 delivery latency is
> 94 seconds. Three customers filed support tickets last quarter asking why their integrations
> lag the UI; one of them has a contractual sub-10-second delivery requirement that we currently
> meet for 12% of events.
>
> This document proposes replacing the sweep with a durable queue drained by a worker pool,
> retaining `pending_events` as the write-ahead record so the change is reversible. The goal is
> p99 delivery under 5 seconds at 3x today's volume, with no change to the public payload.
>
> ## Success criteria
>
> - **Latency** — p99 delivery drops from 94s to under 5s (19x), measured on the existing
>   `webhook.delivered` span.
> - **Contract compliance** — sub-10-second delivery rises from 12% of events to 99.9%.
> - **Headroom** — the system sustains 3.6M events/day with worker CPU below 60%.
> - **Cost** — queue infrastructure adds no more than $400/month, from $0 today.

And a review of an existing doc comes back quoting the specific lines:

> **Weasel words — 4 found.**
> - L12 "significantly reduce latency" — reduce it from what, to what?
> - L31 "most customers are affected" — how many, out of how many?
> - L47 "should scale comfortably" — to what load, measured how?
>
> **Success criteria — no absolute values.** "Adoption doubles" is meaningless until the reader
> learns it went from 1 user to 2. Give each metric a before and an after.
>
> **Alternatives considered — "do nothing" is missing.** Two alternatives are listed and both are
> rewrites. The reader cannot tell what happens if this ships in Q3 instead of Q1.
>
> **Prose — L60-L84 is a 19-item bullet list** doing the work of the technical design section.

## Where it installs

| Target | Path |
| --- | --- |
| `claude` | `.claude/skills/amazon-design-doc/` — or `~/.claude/skills/` with `--global` |
| `cursor` | `.cursor/skills/amazon-design-doc/` — or `~/.cursor/skills/` with `--global` |
| `codex` | `~/.codex/skills/amazon-design-doc/` — always home-scoped, honours `$CODEX_HOME` |
| `copilot` | `.github/instructions/amazon-design-doc.instructions.md` |
| `windsurf` | `.windsurf/rules/amazon-design-doc.md` |
| `gemini` | `.gemini/commands/design-doc.toml` |
| `agents` | `AGENTS.md`, spliced between markers so reinstalls replace rather than duplicate |

Codex only ever loads skills from `$CODEX_HOME/skills`, so that target ignores `--global` and
always installs there. Everything else is project-local by default.

Directory-based tools get the skill verbatim, so its references load only when needed.
Single-file tools get one flattened document generated from the same source at install time.

## The section template

Problem statement, glossary, use cases, breaking changes, success criteria, proposed design,
technical design, components, dependencies, monitoring, new APIs or behaviors, pros & cons, major
risks & mitigations, security, scope, out of scope, alternatives considered (including "do
nothing"), FAQ, open questions & feedback, and appendix.

Proposed design and technical design are deliberately separate: *what* the solution does should
survive a change of implementation, *how* it works should not have to.

## Use it without installing

The skill is plain markdown. Read [`skills/amazon-design-doc/SKILL.md`](skills/amazon-design-doc/SKILL.md),
the [template](skills/amazon-design-doc/references/template.md), and the
[worked examples](skills/amazon-design-doc/references/examples.md), or paste the output of
`npx amazon-design-doc print` wherever your tool takes custom instructions.

## Related

- [brag-document-skill](https://github.com/sdshah09/brag-document-skill) — the same idea applied to
  your own record: an agent skill that helps you build and maintain a brag document for
  performance reviews and promotion cases. Design docs are one of the things it mines for
  forgotten work.

## Credit

The template and all guidance come from
[Write Design Docs like Amazon](https://ericclemmons.com/blog/write-design-docs-like-amazon/) by
Eric Clemmons. This package packages it for agents.

## License

MIT — see [LICENSE](LICENSE).
