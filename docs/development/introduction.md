# 总览

::: tip 提示
当前开发文档按 ChatLuna core `1.4.0-alpha.12` 的公开 API 梳理。

如果某个页面示例使用了旧版包名或旧版 API，请优先以本节 API 参考和源码导出为准。
:::

此开发教程面向有 Koishi 插件开发经验的开发者。通过本教程，你将学会：

- 为你的 Koishi 插件调用 ChatLuna 的模型、嵌入、reranker、向量数据库和 Agent 能力。
- 编写 ChatLuna 插件，接入新的模型平台、嵌入平台、reranker 平台、向量数据库或工具。
- 使用会话服务、上下文管理器、提示词管线、消息转换器和渲染器定制 ChatLuna。
- 基于 ChatLuna API 开发自己的 Koishi 插件，让大语言模型能力服务更多场景。

## 需要的技能

ChatLuna 是一个 Koishi 插件，你需要对 Koishi 插件开发有一定了解。

我们假定你已经有了 Koishi 插件开发基础。如果你还不会开发 Koishi 插件，请阅读 [Koishi 插件开发指南](https://koishi.chat/zh-CN/guide)。

ChatLuna 基于 LangChain 定制了一套和 LLM 交互的框架。因此你也需要对 LangChain 有一定了解。

如果你还不会使用 LangChain，可阅读 [LangChain 文档](https://js.langchain.com/docs)。

## 让我们开始吧

继续向下，你将在每一页的底部看到前往下一节的链接。
