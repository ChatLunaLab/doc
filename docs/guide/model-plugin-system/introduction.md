# 模型工具

模型工具是 ChatLuna 的核心功能之一，专为插件模式设计。开发者可以创建并注册自定义工具到 ChatLuna 中，使模型能够在插件模式下调用这些工具，从而扩展模型的能力。

## 配置

前往 Koishi 的插件市场，搜索 `chatluna-plugin-common`，并安装。

此插件还需要配置后才能使用，你可以在下面的介绍中选择你喜欢的模型工具，按照其介绍进行配置。

::: tip 提示
建议在主插件中开启 [`showThoughtMessage`](../useful-configurations.md#showThoughtMessage) 选项。可以让模型在调用工具时，显示调用过程。
:::

## 可用工具

目前 ChatLuna 支持以下的模型工具：

- [联网搜索](web-search.md)
- [网络浏览](web-browser.md)
- [网络请求](request-web.md)
- [文件读写](file-io.md)
- [群管](guild-manager.md)
- [定时任务](cron.md)
- [文生图](draw.md)
- [代码执行](code-interpreter.md)
- [主动记忆](active-memory.md)

你可以点击上面的链接查看如何配置相应的模型工具。
