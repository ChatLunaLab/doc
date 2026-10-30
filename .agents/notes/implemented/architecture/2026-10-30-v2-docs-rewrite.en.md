# Agent Note: v2 Documentation Full Rewrite

Status: implemented

## Problem

The first v2 documentation pass produced a coherent skeleton, but its section layout, page granularity, and voice didn't match the codebase well enough: the old `guide/` flat pages and `development/` reference docs were written for a different structure, coverage of capabilities (skills, MCP, subagents, machines) was thin, and the architecture section lacked the diagrams needed to understand the harness as a whole. The user rejected that pass and asked for a full rewrite grounded in the source code rather than the old plan documents.

## Decision

- Treat the v2 codebase as the only source of truth. Old `docs/PLAN-*` docs and the v1 site are not authoritative for v2 behavior.
- Restructure v2 docs into five sections:
  - `manual/` — user manual: starter (cli/docker/source), quickstart, usage (webui/models/characters/rules/memory/capabilities/machines/subagents/automation/permissions/observability/adapters/commands), recipe (instances/server).
  - `guide/` — developer guide: develop (setup/config/first-plugin/publish), plugin (lifecycle/service/events/schema), extend (tools/prompts/webui/provider).
  - `architecture/` — 6 pages with mermaid flowcharts (overview/sessions/agents/models/context-cache/extensions).
  - `api/` — service API pages (conversations/agent/models/tools/permissions/presets), cordis (context/events/service/schema), cli/configuration/glossary/http.
  - `cookbook/` — troubleshooting, migration, deployment; `about/` — faq/contact/sponsor/about.
- Delete the old flat `guide/*.md` and `development/` pages once the new tree covers their topics; fix every new-page link to the new paths.
- Run a per-batch editorial pass with `gemini-3.8-flash` using a style guide assembled from koishi manual and dsh subsystem pages; manually verify every API claim against source afterward (e.g. the cordis import is `@chatluna/utils/cordis`, not `@chatluna/cordis`).
- Theme on the Chinese-traditional blue palette (青鸾/菘蓝/青黛); mermaid via `vitepress-plugin-mermaid`, with `elkjs/lib/elk.bundled.js` added to `optimizeDeps.include` so its CJS bundle gets a default export in dev.
- Update `check-docs.mjs` to normalize directory links (`/guide/` → `guide/index.html`) and `check-builds.mjs` for the new index pages; keep the v1 `srcExclude` list in sync with the new v2 subtrees.

## Alternatives considered

- Keep the old flat `guide/` pages alongside the new tree: rejected — duplicate routes drift out of sync and confuse nav/search.
- Rewrite pages without the Gemini pass: rejected — the user asked for an iterative simplification pass against koishi/dsh style, so the two-step (draft → edit) pipeline stays.
- Alias elkjs instead of optimizeDeps: optimizeDeps is the narrower fix; mermaid's own code path is untouched.

## Consequences

- v2 docs now cover the harness's full capability surface (skills, MCP, subagents, machines, schedules, permissions) with code-derived API tables.
- Dead-link and build-output checks guard both sites; directory links and index pages resolve correctly in lint and `test:build`.
- Dev server needs a restart after the `optimizeDeps` change for mermaid's elk chunk to render.
- The v1 site and its public routes are unchanged.
