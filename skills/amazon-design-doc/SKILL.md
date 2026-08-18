---
name: amazon-design-doc
description: Use when writing, reviewing, or improving a technical design doc, RFC, tech spec, architecture proposal, or one-pager - applies the Amazon design doc format (problem statement, use cases, success criteria, technical design, risks, alternatives considered) and its prose-over-bullets, no-weasel-words writing rules.
---

# Write Design Docs like Amazon

Based on [Eric Clemmons' template](https://ericclemmons.com/blog/write-design-docs-like-amazon/), written from
experience authoring design docs at AWS Amplify.

## When to use this

Writing a new design doc, RFC, or tech spec. Reviewing someone else's. Rewriting a doc that got
"looks fine" instead of real feedback — that usually means it was too vague to argue with.

Not for: READMEs, API reference docs, postmortems, or PRDs.

## The four writing rules

These matter more than the section list. Enforce them on every draft, including your own.

1. **6-8 pages of primary content.** Everything else goes in the Appendix. A doc nobody finishes
   is a doc nobody approves.
2. **No weasel words.** "Significantly faster", "many customers", "soon", "should scale" are
   banned. Use numbers, percentages, dates. If the data doesn't exist, go get it before writing
   the sentence.
3. **Data-point in the body, methodology in the Appendix.** The reader gets "TTFB drops from
   200ms to 50ms", not the benchmark harness.
4. **Prose, not bullets.** Bullets hide the reasoning that connects two facts. Write paragraphs
   and let the argument show. Reserve lists for genuinely enumerable things: glossaries,
   dependencies, components.

## How to write one

Work backwards from the customer, not forwards from the code. Draft in this order — it is not the
reading order, but it is the order that keeps the doc honest:

1. **Problem statement first**, before any solution exists in your head. If you can't state the
   problem in two paragraphs with numbers in them, you don't understand it yet.
2. **Use cases next**, phrased as business value and written from the customer's point of view.
   A representative handful, not an exhaustive edge-case sweep.
3. **Success criteria before the design.** Deciding what you'll measure before you decide what
   you'll build is what stops the design from justifying itself. Every metric needs a
   directional stat and a before/after: "adoption doubles" is meaningless until you learn it
   went from 1 user to 2.
4. **Then proposed design (what) and technical design (how)**, kept separate on purpose. The
   proposed design should survive a change of implementation.
5. **Then the adversarial sections** — breaking changes, pros & cons, risks, security,
   alternatives. Write these as if a skeptical senior engineer wrote them, because one is about
   to read them.

Read `references/template.md` for the full section-by-section template to fill in, and
`references/examples.md` for worked examples of the sections people get wrong.

## Reviewing a doc

Score against this and report what's missing, quoting the offending lines:

- Does the problem statement stand alone without the solution?
- Is every claim a number, a date, or a percentage? Flag each weasel word.
- Do success criteria have both relative and absolute values?
- Are breaking changes listed, including the workarounds customers built that will now break?
- Is "do nothing" addressed in alternatives considered? It **must** be.
- Is each decision marked as a 1-way or 2-way door?
- Are bullet points doing work that prose should do?

`FAQ` is a smell. If a question is common enough to FAQ, the answer belongs inline where the
question arises. Say so when you see one.

## Open questions from review

Record every item raised in the design review in `Open Questions & Feedback`. Address it by
updating the body of the document, then strike the original question through rather than
deleting it — the strikethrough is the receipt that it was handled.
