# 插件介绍

Koishi ChatHub 是一款由 [LangChain](https://github.com/hwchase17/langchainjs) 驱动开发的语言模型聊天服务插件，运行在 Koishi 上。

它能对接目前热门的语言模型或平台，如 OpenAI（API）、New Bing、ChatGLM 等，让用户与这些模型进行聊天。项目底层和 LLM 交互基于 [LangChain](https://github.com/hwchase17/langchainjs)，第三方 Koishi 插件开发者也可以调用此项目提供的 [LangChain Model](https://js.langchain.com/docs/modules/models/chat/) 和 LLM 进行交互。

## 特性

- 高扩展性：使用 LangChain 和 Koishi 提供的扩展 API，第三方插件开发者可以轻松扩展或调用此项目的服务，如调用模型、对接新模型等。
- 支持预设系统：可设置会话预设，调教模型。
- 黑名单系统：全局冷却时间和模型并发请求限制，以及按小时的模型调用额度限制，轻松管理模型的调用限额等。
- 支持语音/文字/图片/图文混合回复，也支持解析生成的 markdown，实现比较自然的分割成多条消息来发送。
- 上下文对话，长期记忆支持（需要适配器支持）。
- 三种聊天模式：`chat`、`browsing`、`plugin`，后两种模式可让模型调用外部提供的某些工具，使得模型能够获取到外部信息。
- 内容安全过滤：基于 Koishi 的 [censor](https://censor.koishi.chat/) 服务，防止模型返回不良内容。

## 下一步

- 快速开始：查看 [快速开始](/guide/getting-started) 以立即使用此插件。
- 指令列表：查看 [指令列表](/guide/useful-commands) 以了解可用命令或某个命令如何使用。
- 配置模型平台：查看 [配置模型平台](/guide/configure-model-platform) 以了解如何配置某个模型平台。
- 开发指南：若是第三方插件开发者，查看 [开发指南](/development/introduction) 以了解如何接入或使用 ChatHub 提供的相关 API。
- 帮助和贡献：若需要帮助我们完善或翻译文档，请在 Github 上 fork 后提交 PR。[项目地址](https://github.com/ChatHubLab/doc)
