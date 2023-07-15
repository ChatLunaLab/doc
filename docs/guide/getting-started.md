# ChatHub 快速上手指南

介绍如何进行 ChatHub 的初步安装、配置和使用，让你快速上手并体验与 AI 模型的对话。

## 01 安装 Koishi

在使用 ChatHub 之前，你需要确认 Node.js 版本在 v18 以上。

你可以使用 `node -v` 命令检查 Node.js 版本。

然后按照 [Koishi 官方文档](https://koishi.chat/zh-CN/) 安装 Koishi。

## 02 配置机器人接入

安装 Koishi 后，你需要使机器人接入实际的聊天平台，或者使用[沙盒环境测试](https://koishi.chat/zh-CN/manual/console/sandbox.html)。

若你选择使用沙盒环境测试，可直接进行[下一步](/guide/getting-started.html#_03-安装前置依赖插件)。

若你选择接入实际的聊天平台，请查看：

-  [查看如何接入 QQ](https://forum.koishi.xyz/t/topic/2502/1) 

-  [查看如何接入其他聊天平台](https://koishi.chat/zh-CN/manual/console/adapter.html) 


## 03 安装前置依赖插件

接下来需要安装 ChatHub 的必要前置依赖插件。

### 数据库插件

ChatHub 需要一个提供 `database` 服务的插件来存储会话信息等持久化数据。

我们推荐使用 `database-sqlite`，它轻量且开箱即用。

你也可以安装并配置其他数据库插件，如 MySQL、MongoDB 等。

### 缓存插件 

ChatHub 还需要一个提供 `cache` 服务的插件来存储某些短期配置。

我们推荐使用 `cache-database`，它几乎不需要配置。

需要注意，`cache` 服务版本需要 v2.0.0-alpha.0+。

### 可选依赖

- `puppeteer` 插件：用于网页截图和本地 HTML 渲染。

- `censor` 服务插件：用于回复内容过滤。注意，有的审核插件仅审核图片不审核文本。

- `vits` 服务插件：用于语音合成。我们推荐使用 `open-vits`。

## 04 安装 ChatHub 主插件

搜索并安装 `@dingyi222666/chathub` 插件，这是 ChatHub 的主插件。

注意，主插件本身不包含任何平台适配，后面还需要安装平台适配插件。

## 05 安装模型平台适配插件

搜索并安装你需要的模型平台的适配插件，例如 `@dingyi222666/chathub-adapter-openai`。

你可以同时安装多个平台的适配插件，并通过命令切换。

## 06 配置主插件

进入主插件配置页面，可选的重要配置：

- `isProxy`：是否使用代理，对国内用户推荐开启。

- `proxyAddress`：代理地址，格式为 `http：//host：port`。

- `msgCooldown`：全局冷却时间，避免请求过于频繁。

- `outputMode`：输出格式，支持语音、文本、图片等。

## 07 配置模型平台

以 OpenAI 为例，进入平台适配插件配置页面：

- `apiKey`：填写 OpenAI 的 API Key。

- `apiEndpoint`：OpenAI API 的基础地址，可配置反向代理地址。

配置好后启用相关插件即可。可以使用 `chathub.listmodel` 查看已启用的平台。

## 08 设置默认模型

使用 `chathub.setmodel` 命令设置默认聊天模型。

## 09 开始聊天

最后使用 `chathub.chat` 命令开始与选择的 AI 模型聊天。

通过以上步骤您已经完成了 ChatHub 的基本安装、配置和使用。

后续您可以自行学习更多高级功能的使用。
