# Agent Note: v2 Documentation and Dual Sites

Status: implemented

## Problem

The repository previously maintained usage documentation for ChatLuna v1. ChatLuna v2 is an independent runtime based on Cordis 4 and needs complete documentation for users and extension developers. Existing v1 public routes must remain available on the separate `v1.chatluna.chat` host. Legacy relative links, new navigation, and ignored dead links also made it possible for builds to pass while references were broken.

## Decision

- Keep the existing Vue/VitePress stack and build two sites selected by `CHATLUNA_DOCS_VERSION`. Store v1 Markdown under `docs/v1/`, then rewrite away the source `v1/` prefix so the separate host retains root routes such as `/guide/`, `/development/`, `/ecosystem/`, and `/about/`.
- Give v2 and v1 separate output directories (`docs/.vitepress/dist` and `docs/.vitepress/dist-v1`), caches, sitemap hosts, and CNAME files. Share the existing theme and public assets. Check both versions for dead links.
- Make the v2 homepage explicitly identify ChatLuna v2 and link to installation, daily use, architecture, development, reference, troubleshooting, and v1. Label its interaction as illustrative; show message/mark entries and the request-reconstruction boundary without presenting fabricated tool activity as live execution.
- Organize v2 guides around installation, first setup, daily use, models, routing rules, presets, memory, tools/MCP, machines, subagents, automation, observability, security, troubleshooting, and migration. Keep architecture, development, HTTP/API, and configuration/CLI/glossary references in separate sections.
- Base new technical prose on current v2 source. Draft each substantial article, request a separate editing pass from `mikumikulove/gemini-3.8-flash`, then manually verify APIs, defaults, authorization boundaries, and deployment claims. Align WebUI/React examples with the current type contracts.
- Add source-level checks for VitePress navigation, Markdown and HTML links, images, and `<<<` includes, with unit tests. A separate built-output check validates each site's CNAME, sitemap, local HTML assets, edit links, route isolation, and local search index.

## Alternatives considered

- Publish v1 under `/v1/`: this would change the existing public root routes, so keep the separate host and root paths.
- Continue ignoring dead links: this misses broken archive references and sidebars, so check both sites strictly and repair the historical links found in this pass.
- Combine source checks and built-site checks into one opaque build step: source reference analysis and emitted resource validation cover different stages, so keep lint and `test:build` separate.
- Use a realistic animated tool-call sequence on the homepage: that risks implying real runtime data, so show a clearly labeled illustrative log and reconstructed request instead.

## Consequences

- v1 and v2 can be developed, previewed, and built independently, with separate search indexes and site metadata. The existing GitHub Pages workflow still needs a separate change before it deploys both hosts.
- v2 documentation can be checked with source-link validation, TypeScript checking, unit tests, and dual-build output validation. Runtime descriptions must continue to track application changes.
- Strict v1 link validation means maintaining legacy references; the repairs in this change do not alter v1 subject matter or its public root routes.
