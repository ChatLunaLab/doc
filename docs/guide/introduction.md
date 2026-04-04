# 介绍

[ChatLuna](https://github.com/ChatLunaLab/chatluna) 是基于 [LangChain](https://github.com/langchain-ai/langchainjs) 构建的 Koishi 大语言模型聊天插件。它可以统一接入 OpenAI、Google Gemini、Claude 以及生态中的其他模型适配器。

除了面向最终用户的聊天能力，ChatLuna 也向 Koishi 插件开发者暴露了可复用的模型服务接口。长期记忆、知识库、渲染器、Agent 工具等特性都是基于这套 API 扩展的。

## 特性

- 扩展 API：轻松添加新的语言模型，工具，渲染器或调用现有模型。基于扩展 API，我们开发了长期记忆，知识库等插件。
- 预设系统：为不同的群或房间配置不同的预设。预设支持强大的渲染模板，世界书，等操作。
- 资源管理：支持全局冷却、并发限制和调用次数控制。
- 多模态：支持图片多模态，并可渲染模型回复，支持文本、图片、语音等多种格式。
- 上下文管理：支持默认的短期聊天记录保存。并可额外安装长期记忆或知识库插件，实现更复杂的知识管理。
- 多种聊天模式：提供 chat、browsing 和 agent 三种模式。browsing 可以联网感知消息，agent 模式则可让模型调用各种工具。
- 内容安全：支持 koishi 的 censor 服务，过滤不良内容

## 接下来阅读

- 从 [快速上手](/guide/getting-started) 开始完成基础安装
- 通过 [会话系统](/guide/session-related/conversation) 了解新的对话系统。
- 通过 [会话指令](/guide/useful-commands/conversation) 查看对话系统的命令。
- 如需配置具体模型平台，请阅读 [模型平台介绍](/guide/configure-model-platform/introduction)
- 如需进行二次开发，请阅读 [开发文档](/development/introduction)
