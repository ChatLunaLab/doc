# Agent 工具

Agent 工具是 ChatLuna 的核心功能之一，专为 Agent 模式设计。开发者可以创建并注册自定义工具到 ChatLuna 中，让模型能够在 Agent 模式下调用这些工具，大幅扩展模型的能力。

## 配置

前往 Koishi 的插件市场，搜索 `chatluna-plugin-common`，并安装。

此插件需要进行一些配置后才能使用。

你可以在下面的介绍中选择你喜欢的模型工具，按照其介绍进行配置。

::: tip 提示
建议在主插件中开启 [`showThoughtMessage`](../useful-configurations.md#showThoughtMessage) 选项。可以让 Agent在调用工具时，显示调用过程。
:::

## 可用工具

目前 ChatLuna 支持以下的模型工具：

- [MCP 支持](mcp.md)
- [联网搜索](web-search.md)
- [网页浏览](web-browser.md)
- [URL 请求](./specify-api-request.md)
- [OpenAPI 请求](request-web.md)
- [文件读写](file-io.md)
- [Koishi 命令执行](command-execution.md)
- [定时任务](cron.md)
- [文生图](draw.md)
- [思考工具](thinking.md)
- [TODO 工具](todo.md)
- [群管工具](group.md)
- [主动记忆](active-memory.md)
- [简易音频生成](simple-audio-generation.md)

你可以点击上面的链接查看如何配置相应的模型工具。
