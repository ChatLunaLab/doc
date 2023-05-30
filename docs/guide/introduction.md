# 介绍

Koishi ChatHub 是一个由 [LangChain](https://github.com/hwchase17/langchainjs) 驱动开发，运行在 koishi 上的语言模型聊天服务插件。

它能对接到目前热门的语言模型或者平台，如 OpenAI （API），New Bing，ChatGLM 等，让用户能和这些模型进行聊天。不仅如此我们还设计了一套扩展API，也能让其他的 Koishi 插件开发者能够扩展或调用此项目的服务，如对接新模型，调用新模型等。

由于项目是编写为 Koishi 的插件，因此基于 Koishi 丰富的 API 和生态，我们可直接接入到多种平台，如 QQ，Telegram，Discord 等。

项目底层和 LLM 交互基于 [LangChain](https://github.com/hwchase17/langchainjs)，因此第三方 Koishi 插件开发者也可以调用此项目提供的 [LangChain Model](https://js.langchain.com/docs/modules/models/chat/) 和 LLM 进行交互。

如果你是第三方插件开发者，你可以查看 [开发指南](/development/introduction) 了解如何使用此项目提供的 API。

## 项目特性

- 高扩展性，基于 LangChain 和 Koishi，我们提供了一套扩展 API，让第三方插件开发者可以轻松的扩展或调用此项目的服务。例如 调用模型，对接新模型等
- 支持预设系统，可设置对话的预设，调教模型。
- 黑名单系统，全局冷却时间和模型并发请求限制，以及按小时的模型的调用额度限制，轻松管理模型的调用限额等。
- 支持 语音/文字/图片/图文混合 回复，也支持解析返回的 markdown，实现比较自然的分割成多条消息来发送
- 上下文对话，长期记忆的支持 （需要适配器支持）
- 三种聊天模式: `chat`,`browsing`,`plugin`

    后两种模式可让模型调用外部提供的某些工具，使得模型能获取到外部信息

- 内容安全过滤，基于 Koishi 的 [censor](https://censor.koishi.chat/) 服务, 防止模型返回不良内容

## 下一步

- 想要立即使用此插件，请阅读 [快速开始](/guide/getting-started) 以开始使用此插件。

- 想了解可用的命令或想了解某个命令如何使用，请查看 [命令列表](/guide/commands)。

- 想了解如何配置某个模型平台，请查看 [配置模型平台](/guide/configure-model-platform)。

- 是第三方插件开发者，想了解怎么接入或使用 ChatHub 提供的相关 API，请查看 [开发指南](/development/introduction) 了解如何使用此项目提供的 API。

- 需要帮助我们完善或翻译文档？我们的文档在 Github 开源，你可以 fork 后提交 PR 来帮助我们完善或翻译文档。
[项目地址](https://github.com/dingyi222666/koishi-chathub-doc)
