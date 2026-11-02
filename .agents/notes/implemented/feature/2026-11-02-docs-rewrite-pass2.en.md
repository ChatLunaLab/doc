# Agent Note: v2 Docs Second Rewrite (Screenshots + Koishi Positioning)

Status: implemented

## Problem

The pages from the first rewrite (see [2026-10-30-v2-docs-rewrite](../architecture/2026-10-30-v2-docs-rewrite.en.md)) read well but describe an earlier v2: they predate the patched `@koishijs/core` on Cordis 4, `@chatluna/koishi-loader`, the character engine, OneBot extras, the dashboard and multi-backend memory. The introduction framed the Koishi relationship as "waiting for v5", which is now stale, and many `<!-- 截图占位 -->` slots had no real screenshots.

## Decision

- **Koishi positioning**: keep the introduction's original "为 Koishi v5 预备好" framing, add two facts: ChatLuna will adopt Koishi v5 as its IM layer once it ships; until then a patched `@koishijs/core` plus `@chatluna/koishi-loader` runs a subset of Koishi plugins (a compat layer, not a full guarantee).
- **Relationship diagram**: the overlapping-circle venn kept clipping text, so it was replaced with three rounded blocks (ChatLuna | IM 对话 | Koishi) on a Cordis base. The architecture flowchart was simplified from a multi-back-edge graph to a linear `adapter → routing → engine → agent loop → render/deliver` path.
- **WebUI page table**: `webui.md`'s table and group labels were checked against each `*/webui/client/index.ts` `ctx.slots.route`: `插件市场`=`/market`, `插件设置`=`/plugins`, the last group is `观测` not `系统`, `/control`=「快捷设置」, and `/expressions` does not exist.
- **Screenshots**: reuse the `/tmp/chatluna-ref/` site-shots instance (`127.0.0.1:5038`) and its CDP capture pipeline (`tools/shoot.mjs`, token carried in the spec). Captured per-page PNGs are copied into `docs/public/webui/` and substituted for the placeholder comments. One light set for now; `home/` already has light+dark.
- **Editorial pipeline**: each finished batch is polished by `opencode run --model magpie/mikumikulove/gemini-3.8-flash`; the prompt embeds a real Koishi zh manual excerpt as the style baseline, helper at `/tmp/docs-rewrite/polish.sh`.
- **Rewrite order**: manual → cookbook → api → guide → architecture (users first).

## Alternatives considered

- Keep tweaking the venn's coordinates: rejected — circles cannot host that much text; blocks are stable.
- Light+dark screenshot pairs for every page: deferred — `webui/` currently only has the light set; the key pages in `home/` already have both.
- Hand-rewrite every page line by line: rejected — most manual pages are factually fine and only need verification plus polish; the heavier edits concentrate in architecture/api.

## Consequences

- `webui.md`'s page table, group names, settings page and 快捷设置 contents now match the source; every usage page carries a real screenshot.
- The introduction's Koishi wording lands on "compat layer today, adopt Koishi v5 directly once it ships", matching `koishi-loader`'s real capability.
- The gemini pass rewrites phrasing, not facts; API claims still need spot-checking against source before committing.

## Progress

- Batch A (manual leftovers): verified `starter/*`, `quickstart`, `recipe/*` against source. Corrections: default create template is `@chatluna/boilerplate` (was `create-chatluna`); dev mode transpiles via oxc-node (was tsx); `chatluna.yml` is loaded via the `path` config of `@cordisjs/plugin-cli-cordis`, not an `include` field; routing target picker offers 所有聊天/群聊/私聊/群成员/更多条件 (bot targets are not pickable); built-in engines are 对话/编码/伪装; owners config uses `platform:user` strings; `/bind <code>` completes owner binding by itself — the WebUI「认领为主人」button is a parallel path for recent DM senders. Setup wizard texts verified verbatim against `setup-webui/client/locales/zh.yml` (3 steps, 6-digit code, 10 min, 5 misses, 忘了口令？ reset page exists).
- Batch B (cookbook): verified `cli`/`migration`/`troubleshooting`/`deployment`/`index` against `docs/MIGRATION-v1-to-v2.md`, the launcher and instance CLI sources. Corrections: dev mode transpiler is oxc-node (troubleshooting repeated the tsx claim); owner binding also accepts manual user ID (migration overstated "私聊绑定码 only"); migration install link now points at `/manual/starter/` + `/manual/quickstart`. Confirmed: 202 on sessions.followup/steer, `CHATLUNA_BASE` for doctor.providers, session cut/mark/reconstructRequest vocabulary, `MutableVariableError`, md-preset `@include` single-line syntax, MarkdownMemoryBackend as the `md` default, old `routingRules`/`patch` keys rejected at startup.
