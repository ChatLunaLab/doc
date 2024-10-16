# 总览

基于 Koishi 和 LangChain 强大的 API。ChatLuna 依托其编写了一套简单的 API，来方便开发者快速开发 ChatLuna 插件。

这里包含了官方或者社区，个人开发者维护的与 ChatLuna 相关的插件。

::: tip 提示
我们欢迎更多开发者参与到 ChatLuna 的生态建设中，一起丰富 ChatLuna 生态。
:::

## 聊天模式 / 插件模式工具

为 ChatLuna 提供其他聊天模式或是插件模式可用工具的插件。

- [koishi-plugin-chatluna-service-search](./plugin/search-service.md): 搜索服务插件，为 ChatLuna 提供浏览聊天模式和网页搜索能力（工具）。
- [koishi-plugin-chatluna-plugin-common](./plugin/common.md): ChatLuna 插件模式的基础工具合集。提供文件浏览，画图等工具。

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

其他非 ChatLuna 官方维护的插件。

::tip 提示
这里应该有一个列表，但是还没有人 PR 呢...
::
