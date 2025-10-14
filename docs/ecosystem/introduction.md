# 总览

基于 Koishi 和 LangChain 强大的 API。ChatLuna 提供了一套强大简洁的 API，帮助各位开发者基于 ChatLuna 开发自己的插件。

这里包含了官方或者社区，个人开发者维护的与 ChatLuna 相关的插件。

::: tip 提示
ChatLuna 插件同时也是 Koishi 插件。
:::

## 聊天模式 /  Agent 模式工具

为 ChatLuna 提供其他聊天模式或 Agent 模式可用工具的插件。

- [koishi-plugin-chatluna-service-search](./plugin/search-service.md): 搜索服务插件，为 ChatLuna 提供浏览聊天模式和网页搜索能力（工具）。
- [koishi-plugin-chatluna-plugin-common](./plugin/common.md): ChatLuna Agent 模式的基础工具合集。提供文件浏览，画图等工具。
- [koishi-plugin-chatluna-long-memory](./plugin/long-term-memory.md): ChatLuna 长期记忆插件。提供基于向量数据库的长期记忆能力。
- [koishi-plugin-chatluna-mcp-service](./plugin/mcp-client.md): ChatLuna MCP 协议端插件。提供 MCP 工具接入能力。
- [koishi-plugin-chatluna-image-service](./plugin/image-service.md): ChatLuna 图片服务插件。为不支持图片多模态的模型提供多模态图片识别能力。

## 回复渲染器

为 ChatLuna 提供其他回复渲染的能力的插件。

- [koishi-plugin-chatluna-image-renderer](./renderer/image.md): ChatLuna 的图片渲染器。

## 能力扩展

为 ChatLuna 扩展提供某些能力的插件。

- [koishi-plugin-chatluna-knowledge](./extension/knowledge.md): ChatLuna 知识库实现。对聊天模式和浏览模式提供知识库支持。
- [koishi-plugin-chatluna-character-card](./extension/character-card.md): 让 ChatLuna 兼容加载 SillyTavern 的角色卡。

## 其他插件

基于 ChatLuna API 的其他插件。

- [koishi-plugin-chatluna-character](./other/character.md): 让大语言模型进行角色扮演，伪装成群友。
- [koishi-plugin-chatluna-translator](./other/translator.md): 由 ChatLuna 中的大语言模型驱动提供的翻译服务。
- [koishi-plugin-chatluna-preset-market](./other/preset-market.md): 为 ChatLuna 提供一站式预设仓库服务搜索，下载的插件。

## 非官方插件

其他非 ChatLuna 官方维护的，但使用了或者扩展了 ChatLuna 能力的 Koishi 插件。

:::tip 提示
这里应该有一个列表，但是还没有人 PR 呢...
:::

## 其他资源

其他 ChatLuna 相关的资源。

- [ChatLuna 插件开发指南](./plugin/development.md): 为 ChatLuna 开发插件的指南。
- [ChatLuna 预设编辑器](https://preset.chatluna.chat): ChatLuna 预设编辑器。编辑你自己的预设！也可以浏览他人的预设。
