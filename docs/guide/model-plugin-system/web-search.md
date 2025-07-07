# 网络浏览

此工具基于 [search-service](../../ecosystem/plugin/search-service.md) 实现。

启用后可以让模型通过搜索服务，联网搜索信息。

## 配置

- 参考 [介绍](introduction.md) 中的配置方法，启用 plugin-common 插件。
- 前往 Koishi 的插件市场，安装 `chatluna-plugin-search-service` 插件。（阅读 [此插件的文档](../../ecosystem/plugin/search-service.md) 以了解更多配置信息）

配置了搜索服务插件后，就可以让模型调用网络浏览工具了。

## 测试

将当前房间设置为 Agent 模式（或浏览模式），询问模型最新信息。当模型回复的内容包含最新消息时，说明网络搜索工具配置成功。
