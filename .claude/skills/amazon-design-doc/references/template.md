# Design Doc Template

Copy this, fill it in, delete the guidance. Adjust to fit — this is a thorough template, not a
compliance checklist. Aim for 6-8 pages of primary content; push the rest to the Appendix.

---

## Problem Statement

An abstract of the whole document: define the problem, summarize the solution, state the goal.
Two paragraphs. Someone who reads only this section should be able to repeat back what you're
doing and why.

## Glossary

Terms, acronyms, and abbreviations. This doc outlives the meeting it was written for — help the
reader who finds it in a year, including you.

## Use cases

Written as impact or business value, not technical outcomes. Work backwards from the customer and
show their perspective — code samples of the API they'd write are excellent here. Representative,
not exhaustive.

## Breaking changes

Does this break customers, services, or anything else? Consider: 404'd URLs, HTTP request/response
shape changes, component prop changes, a nullable property becoming non-nullable, dependency
upgrades that break compilation, performance regressions, function signature changes, UI structure
that breaks E2E tests, and buggy behavior customers built workarounds for — those workarounds will
break.

## Success criteria

What you'll measure and **quantify** to show the problem is solved. Every metric gets a
directional stat and a before/after pair, in relative *and* absolute terms.

## Proposed design

*What* the solution does. Ideas, concepts, and tenets that stay true regardless of implementation.
The key features live here; the mechanism lives in the next section.

## Technical design

*How* you achieve it. Architecture diagrams, algorithms, data structures, interfaces. Describe the
happy path; include edge cases only when they shape the design. Link to the original source of
every diagram — you will want to edit it again.

## Components

Enumerate the humans, systems, processes, and components interacting here, C4-model style. Name
each one and state what it is and what it depends on.

## Dependencies

External or sibling systems this design relies on. Each one is a risk to be mitigated below.

## Monitoring

The technical counterpart to success criteria: how you'll track the health and stability of the
solution in production.

## New APIs or behaviors

*Public-facing* changes only — anything another service or person can depend on. These need
broader buy-in from stakeholders and senior technical staff, so surface them explicitly.

## Pros & cons

Show you've considered the impact of adopting this *and* of not adopting it. Does the development
cost delay other initiatives? Is it easy or difficult to maintain, and does that affect headcount?
Does it add complexity to on-call and operational load? Is this a 1-way or 2-way door decision?

## Major risks & mitigations

Go deeper on dependencies, cons, and components. Which dependencies are outside your control, and
what happens during their outage? Does this introduce a new technology or pattern, and how will
the team gain experience with it? Which assumptions are unvalidated, and what breaks if they're
wrong? What technical debt does this create, and how will you pay it off? (Feature flags are
excellent fodder here.)

## Security

A good design comes with a separate security review. Does the exposed surface area change? Is new
data gathered or stored — what type, stored where, and what's the blast radius if it leaks? Is the
design secure-by-default, or does it require extra steps to harden?

## Scope

The exact features and functionality required to deploy, including scale and SLA. Find the minimum
work that solves the use cases above without boiling the ocean.

## Out of scope

Incremental delivery and the corners you looked around but chose not to block on. Say when each
one lands, if it lands.

## Alternatives considered

"Do nothing" is an option that **must** be addressed. Include the alternatives that came close but
fell short — those are what justify the cost of writing this document and building the thing.

### Alternative #1

**Pros & cons** — tradeoffs and benefits, concisely.

**Reasons discarded** — why not this? What would have to change (release cadence, team structure,
support, expertise) to make it viable?

## FAQ

Questions that trend during pre-review feedback. Treat this section as a smell: don't bury the
lede. If people keep asking, answer it up top where the question arises.

## Open Questions & Feedback

Items from the design review. Every item must be addressed by updating the document. Keep the
original question and strike it through once resolved:

- ~~Missing Pros & Cons~~
- Have you considered *this other solution*?

## Appendix

Methodology and sources behind your data, prior art, resources, and attachments.
