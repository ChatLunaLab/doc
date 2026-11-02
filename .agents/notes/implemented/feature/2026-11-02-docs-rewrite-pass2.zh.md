# Agent Note: v2 文档二次重写（截图 + Koishi 定位修正）

Status: implemented

## Problem

第一轮重写（见 [2026-10-30-v2-docs-rewrite](../architecture/2026-10-30-v2-docs-rewrite.zh.md)）产出的页面在叙述与布局上可用，但内容描述的是更早的 v2：它早于真实 `@koishijs/core` 补丁上 Cordis 4、`@chatluna/koishi-loader`、角色引擎、OneBot 扩展、仪表盘与多后端记忆。介绍页把 Koishi 关系写成「等 v5 预备好」，方向已经过时；页面里大量 `<!-- 截图占位 -->` 也没有真实截图。

## Decision

- **Koishi 定位**：保留介绍页「为 Koishi v5 预备好」的原始框架，只加两段：v2 发布后会直接采用 Koishi v5 作为 IM 层；在此之前用打过补丁的 `@koishijs/core` + `@chatluna/koishi-loader` 跑一部分 Koishi 插件（兼容层，非完整保证）。
- **关系图**：两圆相交的 Venn 图反复出现文字压线，改成三个圆角块（ChatLuna | IM 对话 | Koishi）架在 Cordis 底座上的示意图；架构流程图从多回边改成单向 `适配器→路由→引擎→Agent 循环→渲染投递` 的线性图。
- **WebUI 页面表**：`webui.md` 的页面表/分组对照各 `*/webui/client/index.ts` 的 `ctx.slots.route` 逐一核对；`插件市场`=`/market`、`插件设置`=`/plugins`、最后一组叫「观测」不是「系统」、`/control`=「快捷设置」、`/expressions` 不存在。
- **截图**：复用 `/tmp/chatluna-ref/` 的 site-shots 实例（`127.0.0.1:5038`）+ CDP 截图管线（`tools/shoot.mjs`，spec 里带 token），把已截好的各页 PNG 拷到 `docs/public/webui/`，按页面替换占位注释。light 一套；home/ 已有 light+dark。
- **编辑流水线**：每批页面写完交给 `opencode run --model magpie/mikumikulove/gemini-3.8-flash` 做文字润色；prompt 内嵌一段真实 Koishi 中文手册节选作风格基准，helper 在 `/tmp/docs-rewrite/polish.sh`。
- **重写顺序**：manual → cookbook → api → guide → architecture（用户优先）。

## Alternatives considered

- 逐字保留 Venn 图继续微调坐标：拒绝——圆形天然放不下文字，块图更稳。
- 给每页都截图 light+dark 两套：暂缓——`webui/` 现在只有 light 一套；home/ 的关键页已有两套。
- 全部页面逐行人工重写：拒绝——大部分 manual 页面事实无误，先校订 + 润色即可，改动面集中在 architecture/api。

## Consequences

- `webui.md` 的页面表、分组名、设置页与「快捷设置」内容现在和源码一致；usage 各页都配了真实截图。
- 介绍页的 Koishi 表述落到「今天走兼容层，v5 发布后直接采用」，与 `koishi-loader` 的实际能力一致。
- gemini 润色会改动措辞但不改事实；提交前仍需对照源码抽查 API 表述。
