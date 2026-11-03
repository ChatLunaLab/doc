# 常见问题

::: tip
使用和开发 ChatLuna v2 时的常见问题，涵盖架构、安装、平台与数据。
:::

**v2 与 v1 是什么关系？** v2 是基于 Cordis 4 的独立应用（Harness），不再作为 Koishi 插件运行。v1 作为 Koishi 插件仍在维护。v2 的插件树设计为可共存，便于将来与同样基于 Cordis 的 Koishi v5 协同运行。迁移配置与数据见 [从 v1 迁移](/cookbook/migration)。

**必须用命令行安装吗？** 不是。`chatluna` CLI 最快，也可以用 [Docker Compose](/manual/starter/docker) 或 [源码构建](/manual/starter/source)。启动后绝大多数配置都在 WebUI 中完成。

**支持哪些聊天平台？** 通过 Satori 适配器接入，按需安装：QQ（OneBot）、Telegram、Discord、飞书、KOOK，以及自带的 WebUI 聊天。配置见 [平台适配](/manual/usage/adapters)。

**支持哪些模型？** 模型统一用 `provider:model` 寻址，提供商配方按需安装。安装 `@chatluna/provider-aisdk` 即可接入 OpenAI、Anthropic、Gemini、DeepSeek 等 AI SDK 生态的服务；特定服务也可以用 native 驱动直连。配置见 [模型配置](/manual/usage/models)。

**一定要商业 API Key 吗？** 用云端商业模型就需要。本地模型（如 Ollama）只要暴露了兼容的接口端点，就可以直接接入，不需要云端 Key。

**和终端 Agent Harness 有什么区别？** ChatLuna 面向多用户 IM 平台，而不是 Claude Code、pi 这类单用户本地终端：会话按 `platform:channel:user` 隔离与调度；输出按平台限制渲染为富文本、图片或卡片；访问控制依托用户、群组身份与平台角色的多层权限。工具、技能、MCP、子代理都运行在这条多用户链路中。

**实例数据存在哪里？** 实例目录下的 `data/chatluna/`：会话日志、长期记忆（默认 Markdown 后端）、预设，以及调试轨迹 `traces.jsonl`。

::: tip
维护或迁移时完整备份整个实例根目录，即可保留所有状态与数据。
:::

**如何参与开发与反馈？** 阅读 [开发指南](/guide/)，在 GitHub 仓库 [ChatLunaLab/chatluna](https://github.com/ChatLunaLab/chatluna) 提交代码或缺陷报告，或加入 [讨论群](/about/contact)。

## 下一步

- [从 v1 迁移](/cookbook/migration)
- [平台适配](/manual/usage/adapters)
- [模型配置](/manual/usage/models)
