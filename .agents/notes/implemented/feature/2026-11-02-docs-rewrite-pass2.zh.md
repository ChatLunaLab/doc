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

## Progress

- Batch A（manual 收尾）：对照源码核对了 `starter/*`、`quickstart`、`recipe/*`。修正：create 默认模板是 `@chatluna/boilerplate`（原文写 `create-chatluna`）；dev 模式用 oxc-node 转译（原文写 tsx）；`chatluna.yml` 由根清单中 `@cordisjs/plugin-cli-cordis` 的 `path` 配置载入，不是 `include` 字段；场景规则目标选择器只有 所有聊天/群聊/私聊/群成员/更多条件（机器人目标不可新建）；内置引擎为 对话/编码/伪装；主人列表是 `platform:user` 字符串；`/bind <code>` 本身就完成主人绑定——WebUI 的「认领为主人」是给最近私聊账号的并行路径。向导文案逐条对照 `setup-webui/client/locales/zh.yml` 验证（三步、六位码、10 分钟、错 5 次作废、「忘了口令？」重置页存在）。
- Batch B（cookbook）：对照 `docs/MIGRATION-v1-to-v2.md`、启动器与实例 CLI 源码核对了 `cli`/`migration`/`troubleshooting`/`deployment`/`index`。修正：dev 转译器是 oxc-node（troubleshooting 重复了 tsx 旧说法）；主人绑定也支持手动填写用户 ID（migration 写成「必须私聊绑定码」）；migration 安装链接改指 `/manual/starter/` + `/manual/quickstart`。已核实：sessions.followup/steer 返回 202；doctor.providers 走 `CHATLUNA_BASE`；session 的 cut/mark/reconstructRequest 词汇；`MutableVariableError`；md 预设 `@include` 单行语法；MarkdownMemoryBackend 为 `md` 默认后端；旧 `routingRules`/`patch` 键启动即报错。
- Batch C（api）：对照源码逐页核对 `index`/`cli`/`configuration`/`glossary`/`http`/`cordis/*` 与全部 17 个 `service/*` 页。修正：`chatluna dev` 用 `@oxc-node/core` 转译（cli.md 两处仍写 `tsx`）；`askTimeout` 默认是 `60000 ms`（原文写 120000）；场景规则 `memory` 的字段是 `backends` 数组（原文写成单数 `backend: md`），解析顺序为服务级 `backends` 映射 → 场景规则（读合并、写第一个）；HTTP 页删掉不存在的 `/api/console` 与 `/api/console/onboarding` 路由（setup-webui 走 `chatluna_webui.state/action`），补上漏掉的 `POST /api/auth/logout`；`ctx.memory` 的方法名是 `backendIds`（原文写 `backendId`）；工具 `timeout` 的 180s 默认值只在加载 `@chatluna/background` 时生效且超时转后台，`background: false` 则超时中止。已核实：全部 `ctx.*` 服务名与 `super(ctx, ...)` 注册一致（含 patched `koishi`）、`ctx.ai` 的 provide/model/bind/caps/providers/models、ops 动词表 ask/chat/extract/embed/rerank/draw/speak/listen/decide/decideOne/judge、permissions 全部方法与 mode/effect/answer 词表、skills 排序 workspace 优先 + rank 600/400/300、prompt order 界 -300..299、trace `retentionDays` 90、`CHATLUNA_DB_PATH`、事件域清单。
- Batch D（guide）：对照源码核对 `develop/*`、`plugin/*`、`extend/*` 全部 18 页。修正：dev 转译器为 oxc-node（setup.md 残留 tsx）；事件示例换成真实事件名（`chatluna/agent-status`/`session-start`/`tool-before`/`before-memory-write`/`permission-check`/`skill-check`，删掉不存在的 `session/event`/`agent/pre-step`/`tools/pre-execute`，`schedule-fire` 是 serial 不是 bail）；`ctx.prompt.environment` 贡献者须返回补丁对象而非改写 env；`ctx.chatluna_storage.createTempFile` 签名是 `(buffer, filename, {mimeType})` 而非对象入参；`ctx.tools` 的注册方法名是 `define`（service/tools.md 误写 `defineTool`，`defineTool` 是 `@chatluna/tool` 导出的校验辅助）。已核实：`chatluna new plugin` 选项、`ctx.slots.route` 字段、`ctx.schemas.section` 声明、`ctx.engine.*` 挂载面（prompt/stopWhen/prepareStep/assemble/flow/output/state）、`ctx.model.extend`、manifest 由 `@cordisjs/plugin-include` 解析（EntryTree 子类）、ProviderRecipe 字段与 kind 取值、WebBot 示例模式。
- Batch E（architecture）：对照源码核对全部 26 页。修正：`ctx.chatluna_render`/`ctx.chatluna_deliver` 不存在——渲染与投递都挂在 `ctx.chat` 内部（`RenderRegistry` + `chat/before-send` waterfall + `markOwn`）；`ctx.censor` 不是服务而是 `chatluna-chat-censor` 插件（`ctx.on('chat/before-receive'|'chat/before-send')` + `ctx.chat.censor(matcher)` 注册第三方匹配器）；删掉不存在的 `chatluna/after-censor`/`chatluna/deliver-sent` 事件；`chat.commands` 命名空间不存在（`chat.tools` 是单独的，commands 是 `commands.list`/`commands.run` 函数，用 `commands.*` 权限门控）；`chatluna_user`/`chatluna_channel` 表不存在——真实会话表是 `chatluna_session`/`chatluna_session_header`/`chatluna_session_entry`；`memory` 的 `backend` 字段改成 `backends` 数组（读合并所有、写进第一个）；`allowQuoteReply` 默认 true；`chatluna.local.yaml` 局部覆盖改为 `plugin-include` 的 `config.patches`（merge/insert/move 语义，`chatluna dev` + `CHATLUNA_HOST`/`CHATLUNA_ALLOW_REMOTE` 通过它注入）；权限表删掉臆造的 `memory:read`/`memory:write`（真实 6 个动作：`fs:read`/`fs:write`/`exec`/`net:fetch`/`skill:read`/`skill:secrets`）；工具 search 单次返回上限写成 20 是混进了 limit 的 max bound——独立字段是 `mcp__*` 按需加载清单；角色引擎 frontmatter 只列 `mode`，`persona/style/example/context` 是 body directives 而不是 frontmatter 字段；群画像改述为 `chatluna-character-memory` 的真实机制（`memory` channel + `impression`/`nickname` person 变量，fork/reply/tool 三种 update 模式，favor 的 model vs memory 判定）。SDK 对话路径（`/api/sdk/conversations` 等）以版本+插件为前提保留警示。已核实：`isolate: { server: chatluna }` + 端口 5028/6140、`chatluna_config` 全部 16 个方法、快照保留 10 份默认路径、schedule judge/watch/cron 字段、tool `timeout` 180s + background、trace `retentionDays` 90。
