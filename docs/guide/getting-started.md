## koishi-plugin-chathub 文档

koishi-plugin-chathub 是一个由 [LangChain](https://github.com/hwchase17/langchainjs) 驱动开发，运行在 koishi 上的语言模型聊天服务插件。

它能对接到目前热门的语言模型或者平台，如 OpenAI （API），New Bing，ChatGLM 等，让用户能和这些模型进行聊天。不仅如此我们还设计了一套扩展API，也能让其他的 Koishi 插件开发者能够扩展或调用此项目的服务，如对接新模型，调用新模型等。

由于项目是编写在 Koishi 上的，因此基于 Koishi 丰富的 API 和生态，我们可直接接入到多种平台，如 QQ，Telegram，Discord 等。

项目底层和 LLM 交互基于 [LangChain](https://github.com/hwchase17/langchainjs)，因此第三方 Koishi 插件开发者也可以调用此项目提供的 [LangChain Model](https://js.langchain.com/docs/modules/models/chat/) 和 LLM 进行交互。

如果你是第三方插件开发者，你可以查看 [开发指南](guide/getting-started) 了解如何使用此项目提供的 API。

## 项目特性

- 高扩展性，基于 LangChain 和 Koishi，我们提供了一套扩展API，让第三方插件开发者可以轻松的扩展或调用此项目的服务。例如 调用模型，对接新模型等
- 支持预设系统，可设置对话的预设，调教模型。
- 黑名单系统，全局冷却时间和模型并发请求限制，以及按小时的模型的调用额度限制，轻松管理模型的调用限额等。
- 支持 语音/文字/图片/图文混合 回复，也支持解析返回的markdown，实现比较自然的分割成多条消息来发送
- 上下文对话，长期记忆的支持 （需要适配器支持）
- 三种聊天模式: `chat`,`browsing`,`plugin`

    后两种模式可让模型调用外部提供的某些工具，使得模型能获取到外部信息

- 内容安全过滤，基于 Koishi 的 [censor 服务](https://censor.koishi.chat/), 防止模型返回不良内容

## 部署

接下来我们将会介绍如何快速部署此插件。

### 安装 Koishi

::: tip
在安装 Koishi 前，你需要检查你的 Node 版本。Koishi 本身要求最低在 Node 14 上运行。但本项目的依赖库需求的最低版本为 Node 18。因此如果你需要使用本项目，你需要确保你的 Node 版本在 18 以上。

你可以使用 `node -v` 来检查你的 Node 版本。

还需要注意的是，截止目前 `1.0.0-alpha.0` 版本，我们需求的最低Koishi版本为 `4.13.0`。因此你需要确保你的 Koishi 版本在 `4.13.0` 以上。
:::

首先你需要安装 Koishi，你可以参考 [Koishi 官方文档](https://koishi.chat/zh-CN/manual/starter/) 来安装 Koishi。

当你成功的安装了 koishi 后，并且成功的运行了 Koishi，你可以继续下一步。

### 配置 Koishi

安装好 Koishi 后，你还不能直接开始安装此插件，你需要接入真实聊天平台才能在真实环境下和插件聊天。点击 [这里](https://koishi.chat/zh-CN/manual/console/adapter.html) 查看如何接入聊天平台。

当然你可以选择暂时不接入，这样你仍然可以在[沙盒](https://koishi.chat/zh-CN/manual/console/sandbox.html)里使用此插件。

（这只是测试环境，我们推荐你在配置好任何插件后先在沙盒环境里测试插件是否正常运行）

### 安装插件

当你成功的安装了 Koishi 并且成功的接入了聊天平台后，你可以开始安装此插件了。

打开 Koishi 的控制台，在插件市场里搜索 `@dingyi222666/chathub`，然后安装列表上的第一个插件。
