# 聊天模式

聊天模式是 ChatLuna 中一个非常重要的模块，每个房间都可以选择不同的聊天模式，不同的聊天模式下，可以使用不同的工具，Prompt 等，多样的聊天模式可以满足不同的聊天场景。

## 可用模式

ChatLuna 中内置了以下几种聊天模式：

- **chat**: 默认，也是最基本的聊天模式，支持预设的全部功能（世界书，作者注释等），并且也支持长期记忆。

- **plugin**: 基于 LangChain 的 Agent 提供的聊天模式。此模式下虽然不支持长期记忆的预设的部分功能，但是可以让模型调用多样化的工具，大幅扩展模型的能力。

不仅如此，ChatLuna 团队还维护以下聊天模式：

- **browsing**: 基于聊天模式增强的网页浏览模式，模型可以从外部获取最新信息。

下面我们介绍如何配置和使用这些聊天模式。

## 配置

### chat

chat，也就是最主要的聊天模式。ChatLuna 的主插件已经内置此模式，无需额外配置。

### plugin

plugin 模式也是 ChatLuna 主插件中内置的聊天模式。

plugin 模式基于 LangChain 的 `Agent` 和 `Tool`，需要有相关的工具才能让模型调用它们。

但 ChatLuna 主插件中并没有内置可供 plugin 使用的工具，因此你需要安装 [`chatluna-plugin-common`](../../ecosystem/introduction.md) 插件，来为 plugin 模式提供一些工具。

### browsing

浏览模式是官方维护的聊天模式，但由于体积原因，默认没有集成到 ChatLuna 主插件中。

你需要额外安装 `chatluna-search-service`，才能使用此聊天模式。

阅读 [此文档](../../ecosystem/introduction.md) 了解如何安装和配置 `chatluna-search-service`。

## 使用

使用聊天模式与预设类似，分为两种场景。

### 普通房间

使用 [`chatluna.room.set -t <chatmode>`](../useful-commands.md#设置房间) 命令，对当前你所在的房间切换为你想要使用的聊天模式即可。

### 模版克隆房间

前往 Koishi 控制台，找到 ChatLuna 主插件的配置项，在 [`defaultChatMode`](../useful-configurations.md#defaultchatmode) 选项里选择你需要使用的聊天模式即可即可。
