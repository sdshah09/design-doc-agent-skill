# Worked Examples

The sections people get wrong, with examples adapted from the AWS Amplify Authenticator relaunch.

## Problem Statement

> The existing `@aws-amplify/ui-*` packages successfully reduced the level of effort to create
> cross-framework components for web, but led to certain technical limitations (fine-grained
> customizability of UI styling, password manager support) that prevented customers from using the
> `Authenticator` in production apps.
>
> The next major release of the `Authenticator` resolves long-standing customer issues with the
> existing `@aws-amplify/ui-*` packages and creates a foundation to ensure cross-framework (Angular,
> React, React Native, Vue) and cross-platform (Android, iOS, Flutter) feature parity and stability.

Note what it does: names the prior art, names the specific limitations, names who was blocked and
from what. No adjectives doing load-bearing work.

## Glossary

> - ***SSG*** — Static Site Generation. The page HTML is generated at *build time*, rather than
>   per-request.
> - ***Next.js*** — React framework developed by Vercel for full-stack web applications.

## Use cases

Show the customer's code, not yours:

> Customers can wrap their React pages in authentication with zero configuration of their
> underlying backend:
>
> ```jsx
> import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react"
>
> export default function App() {
>   const auth = useAuthenticator();
>
>   if (auth.state !== 'AUTHENTICATED') {
>     return <Authenticator />
>   }
>
>   return (
>     <>
>       <h1>Welcome {auth.user.username}!</h1>
>       <button onClick={auth.signOut}>Sign out</button>
>     </>
>   )
> }
> ```

## Success criteria

Each line has a direction and a before/after:

> - ***Performance*** — Time-to-first-byte (TTFB) will improve 4x, from 200ms to 50ms.
> - ***Cost*** — We'll reduce our DataDog bill by $12,000 each month, from $30,000 to $18,000.
> - ***Adoption*** — By Q2, 25% of our users (4,250) will be using this new version, based on NPM
>   downloads.
> - ***Stability*** — Our session error percentage will drop from 3% to 1%, eliminating crashes in
>   2,000 sessions a month.

"Doubling customers" sounds huge until you find out it's from 1 to 2. That is why the absolute
number is mandatory alongside the relative one.

## Components

> - ***Studio*** — The primary interface for UX Designers. It consumes UI Codegen as a dependency.
> - ***CLI*** — The primary interface for App Developers. It consumes UI Codegen as a dependency.
> - ***GitHub*** — The source control system-of-record for the open-source UI Codegen package.
> - ***Actions*** — The CI/CD system for building, testing, and deploying the UI Codegen package.
> - ***NPM*** — The primary distribution channel for the open-source UI Codegen package.

## Dependencies

> - ***LaunchDarkly*** — Feature flag service responsible for rolling this feature out to users.

## New APIs or behaviors

> - Queues go from delivering messages *exactly once* to *at least once*.
> - Introducing an `experimental: {...}` configuration object.

## Scope

> - Customers will be able to upgrade their dependency to this version without changing any code.
> - This API will use existing, local LLM models, without affecting our OpenAI quota.

## Out of scope

> - The API will not support batch editing, but is planned for Q2.
> - There are no changes to existing user Roles & Permissions.

## Weasel words to strike

| Instead of | Write |
| --- | --- |
| significantly faster | 4x faster, 200ms to 50ms |
| many customers | 4,250 customers (25% of monthly actives) |
| soon / in the near future | by 2026-Q2 |
| should scale | sustains 12k RPS at p99 < 80ms |
| more reliable | error rate drops from 3% to 1% |
| minimal effort | one dependency bump, no code changes |

## Design tools worth using

[Excalidraw](https://excalidraw.com/), [tldraw](https://www.tldraw.com/),
[Whimsical](https://whimsical.com/), [Stately](https://stately.ai/), Keynote.
Link to the original file from the doc, always.
