# 介绍

[ChatLuna](https://github.com/ChatLunaLab/chatluna) 是一款强大的语言模型聊天服务插件，基于 [LangChain](https://github.com/langchain-ai/langchainjs) 开发，目前作为 [Koishi](https://koishi.chat/zh-CN/) 上的插件存在。ChatLuna 支持与多种主流大语言模型进行交互，如 OpenAI、Google Gemini 和 Claude 等。

ChatLuna 不仅为用户提供了模型聊天功能，还为其他 Koishi 插件开发者提供了便捷的 [LangChain Model](https://js.langchain.com/docs/concepts/#chat-models) 接口，方便他们与大语言模型进行交互和扩展开发。

## 特性

- 🔌 高度可扩展：轻松添加新的语言模型或调用现有服务。
- 🎭 灵活的预设系统：自定义会话预设，精确调整模型行为。
- 🔒 智能资源管理：支持全局冷却、并发限制和调用额度控制。
- 🖼️ 多媒体交互：支持语音、文字、图片及混合形式的回复。
- 🧠 上下文感知：支持聊天记录保存与长期记忆，提供个性化体验。
- 🔀 多种聊天模式：提供 chat、browsing 和 plugin 三种模式。browsing 可以联网感知消息，plugin 则可以让模型调用各种工具。
- 🛡️ 内容安全：集成 Koishi 的 censor 服务，过滤不良内容。

## 下一步

想要使用 ChatLuna，请阅读 [快速上手](/guide/getting-started) 指南。

要了解 ChatLuna 的所有可用指令及其用法，请参考 [指令列表](/guide/useful-commands)。

如需深入了解 ChatLuna 的配置选项，请查看 [配置说明](/guide/useful-configurations.html)。

要学习如何配置特定的语言模型平台，请参阅 [模型配置](/guide/configure-model-platform/introduction.html)指南。

对于第三方插件开发者，我们提供了详细的 [开发文档](/development/introduction)，帮助您集成和使用 ChatLuna 的 API。

如果您希望为 ChatLuna 的文档做出贡献，欢迎查看我们的 [贡献指南](https://github.com/ChatLunaLab/doc) 并提交 PR。
