# Agent Note: Documentation Validation Commands

Status: implemented

## Problem

The dual-version VitePress project had no checks covering navigation, source references, and version isolation. With dead links ignored in the VitePress configuration, a build could succeed despite missing local images, edit links, or version-specific search routes.

## Decision

- `scripts/check-docs.mjs v2|v1` resolves the selected VitePress configuration and checks Markdown and common HTML references, navigation/sidebar routes, images, and `<<<` include files. It resolves links against the actual rewritten public routes and rejects cross-version source-page leakage.
- `tests/docs.test.mjs` uses Node's built-in test runner to cover route normalization, Markdown/HTML extraction, missing includes/assets, both-version failures, and site launcher argument validation.
- `scripts/check-builds.mjs v2|v1` checks existing build output for CNAME, non-homepage sitemap routes, HTML pages and local assets, edit URLs, hashmap, version-specific local search indexes, and v1/v2 route isolation. Without a version argument it checks both existing output directories in sequence; it does not build them.
- Package scripts expose source checks as `lint`, TypeScript checks as `typecheck`, Node tests as `test:unit`, and output verification as `test:build`.

## Alternatives considered

- Rely only on VitePress builds: ignored-dead-link configuration cannot guarantee reference completeness.
- Extract all Markdown references with one regex: this can misread fenced code samples as site links; use Markdown tokens and inspect common href/src attributes only in HTML tokens.
- Add dependencies for all checks: the existing MarkdownIt and VitePress dependencies, Node `assert`, and `node:test` cover the required behavior.

## Consequences

- The source checker gets its page list from the active VitePress configuration, keeping version selection and rewrites aligned with the actual build.
- Source checks cover Markdown references and common HTML attributes, not general browser HTML/CSS/JavaScript validation. Built-output verification reads emitted files and should run after both builds succeed.
- Legacy root routes and v2 pages are validated separately, preventing archive debt from being reclassified as v2 routes or hidden through ignored links.
