# Agent Note: v2 文档全面重写

Status: implemented

## Problem

第一轮 v2 文档产出了可用骨架，但章节布局、页面粒度与叙述风格与代码库贴合度不够：旧的 `guide/` 平铺页面与 `development/` 参考文档是为另一种结构写的；能力面（skills、MCP、子代理、机器）覆盖单薄；架构章缺少把 harness 讲清楚的流程图。用户否决了那一版，要求以源码为唯一依据全面重写，而不是沿用旧计划文档。

## Decision

- 以 v2 代码库为唯一事实来源；`docs/PLAN-*` 与 v1 站点对 v2 行为不作准。
- v2 文档重构为五个板块：
  - `manual/`：使用手册——starter（cli/docker/source）、quickstart、usage（webui/models/characters/rules/memory/capabilities/machines/subagents/automation/permissions/observability/adapters/commands）、recipe（instances/server）。
  - `guide/`：开发指南——develop（setup/config/first-plugin/publish）、plugin（lifecycle/service/events/schema）、extend（tools/prompts/webui/provider）。
  - `architecture/`：6 页，配 mermaid 流程图（overview/sessions/agents/models/context-cache/extensions）。
  - `api/`：service 服务页（conversations/agent/models/tools/permissions/presets）、cordis（context/events/service/schema）、cli/configuration/glossary/http。
  - `cookbook/`：排错、迁移、公网部署；`about/`：faq/contact/sponsor/about。
- 新树覆盖旧主题后删除旧 `guide/*.md` 与 `development/`，并把新页面里的链接全部改到新路径。
- 每批页面走 `gemini-3.8-flash` 编辑一遍（风格参照 koishi 手册与 dsh 子系统页），随后逐条对照源码核验 API 表述（如 cordis 导入路径是 `@chatluna/utils/cordis`）。
- 主题采用中国传统青色系（青鸾/菘蓝/青黛）；mermaid 用 `vitepress-plugin-mermaid`，并把 `elkjs/lib/elk.bundled.js` 加进 `optimizeDeps.include`，让 dev 下 CJS bundle 有 default 导出。
- 更新 `check-docs.mjs` 规范化目录链接（`/guide/` → `guide/index.html`），同步 `check-builds.mjs` 与 v1 `srcExclude` 到新结构。

## Alternatives considered

- 保留旧平铺 `guide/` 与新树并存：拒绝——同路由并存会漂移且干扰导航与搜索。
- 不过 Gemini 直接成稿：拒绝——用户明确要求按 koishi/dsh 风格迭代化简，保留草稿→编辑两段式。
- 用 vite alias 代替 optimizeDeps 修 elkjs：optimizeDeps 改动面更小，不碰 mermaid 自身代码路径。

## Consequences

- v2 文档覆盖了 harness 完整能力面，服务 API 表均按代码核对。
- 死链与产物检查同时护住两个站点；目录链接与 index 页在 lint 与 `test:build` 中都能正确解析。
- `optimizeDeps` 变更后需重启 dev server，mermaid 的 elk chunk 才能正常渲染。
- v1 站点与其公开路由不受影响。
