## 你好！欢迎使用 koishi chathub

koishi chathub 是一个由 [LangChain](https://github.com/hwchase17/langchainjs) 驱动开发，运行在 koishi 上的语言模型聊天服务插件。

它能对接到目前热门的语言模型或者平台，如 OpenAI （API），New Bing，ChatGLM 等，让用户能和这些模型进行聊天。不仅如此我们还设计了一套扩展API，也能让其他的 Koishi 插件开发者能够扩展或调用此项目的服务，如对接新模型，调用新模型等。

由于项目是编写为 Koishi 的插件，因此基于 Koishi 丰富的 API 和生态，我们可直接接入到多种平台，如 QQ，Telegram，Discord 等。

项目底层和 LLM 交互基于 [LangChain](https://github.com/hwchase17/langchainjs)，因此第三方 Koishi 插件开发者也可以调用此项目提供的 [LangChain Model](https://js.langchain.com/docs/modules/models/chat/) 和 LLM 进行交互。

如果你是第三方插件开发者，你可以查看 [开发指南](development/start) 了解如何使用此项目提供的 API。

## 项目特性

- 高扩展性，基于 LangChain 和 Koishi，我们提供了一套扩展API，让第三方插件开发者可以轻松的扩展或调用此项目的服务。例如 调用模型，对接新模型等
- 支持预设系统，可设置对话的预设，调教模型。
- 黑名单系统，全局冷却时间和模型并发请求限制，以及按小时的模型的调用额度限制，轻松管理模型的调用限额等。
- 支持 语音/文字/图片/图文混合 回复，也支持解析返回的Markdown，实现比较自然的分割成多条消息来发送
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

### 前置插件

当你成功的安装了 Koishi 并且成功的接入了聊天平台后，你还不能立即开始安装此插件。

由于 Koishi 丰富的 API 与生态，一个插件为了实现一个功能，并不总是自己全部实现，而是通过调用其他插件的 API 来实现。这样做的好处是，插件开发者可以专注于自己的功能，而不用去实现一些基础的功能。

接下来就是安装此插件的前置插件。

#### （必须） 提供了 database 服务的插件

database 服务是此插件的必须服务依赖，它提供了对数据库的相关操作。

我们使用此服务来存储对话信息等持久化内容。

打开 Koishi 控制台，前往插件市场搜索`impl:database`，然后安装你偏好的数据库平台支持插件。

![搜索后的结果](/images/plugin_market_2.png)

对于大部分场景，我们推荐你使用`database-sqlite`，它轻量，并且无需额外配置，几乎是安装后开箱即用。

如果你需要使用其他的数据平台支持插件，并且你安装插件后不知道如何配置的话，你可能需要前往 [Koishi 论坛](https://forum.koishi.xyz/) 寻求如何配置相关的插件。

::: tip
在大部分的安装 Koishi 方式中，安装 Koishi 后很可能会内置`database-sqlite`插件，如果你不需要配置其他数据库的话，你可以跳过这一步。
:::

#### （必须）安装提供了 cache 服务的插件

cache 服务是此插件的必须服务依赖，它提供了对缓存键值对的相关操作。

我们使用此服务来存储某些短期配置项，如默认模型等。

打开 Koishi 控制台，前往插件市场搜索`impl:cache`，然后安装你偏好的缓存平台支持插件。

![搜索后的结果](/images/plugin_market_3.png)

对于大部分场景，我们推荐你使用`cache-database`，它几乎无需额外配置，只需要你按照上面的要求安装了提供 database 服务的插件，然后完全可以安装后开箱即用。

如果你需要使用其他的数据平台支持插件，并且你安装插件后不知道如何配置的话，你可能需要前往 [Koishi 论坛](https://forum.koishi.xyz/) 寻求如何配置相关的插件。

::: tip
我们需求的 cache 服务的相关版本为 `2.0.0.alpha.0`，请不要安装 `1.x` 版本，目前插件已不再兼容 `1.x` 版本。
:::

#### (可选) 安装 puppeteer 插件

puppetter 插件是此插件的可选服务依赖，它提供了 puppeteer 的相关服务，使得插件可以调用浏览器，实现很多操作。（如网页截图实现本地html渲染）

我们使用此服务来实现生成图片回复。

打开 Koishi 控制台，前往插件市场搜索 `impl:puppeteer`，然后安装puppeteer 插件。

安装完成后你需要配置此插件，具体的插件配置项可以查看[这里](https://puppeteer.koishi.chat/)，我们不在这里赘述。

#### （可选）安装提供了 censor 服务的插件

censor 服务是此插件的可选服务依赖，它提供了内容安全过滤的服务。

我们使用此服务来实现回复内容安全过滤。

打开 Koishi 控制台，前往插件市场搜索`category:censor`，然后安装你偏好的内容安全过滤平台支持插件。

安装完成后你需要配置相关插件才能使用，具体的插件配置项可以查看[这里](https://censor.koishi.chat/)，我们不在这里赘述。

::: tip
需要注意的是，有的插件虽然也提供 censor 服务， 但是它只对图像做审核，不会对文本内容做审核！因此你需要确保你安装的插件支持对文本内容的审核。
:::

#### （可选）安装提供了 vits 服务的插件

vits 服务是此插件的可选服务依赖，它提供了文本转语音的相关服务。

我们使用此服务来实现生成语音回复。

打开 Koishi 控制台，前往插件市场搜索`impl:vits`，然后安装你偏好的文本转语音平台支持插件。

![搜索后的结果](/images/plugin_market_5.png)

安装后你可能还需要配置相关插件才能使用，具体怎么使用可以查看插件的配置项的描述，或插件主页。（当然你也可以直接联系插件的作者问）

:::tip
我们推荐安装`open-vits`插件，这是可开箱即用的提供了 vits 服务的插件，插件由[ initialencounter ](https://github.com/initialencounter)编写，并且后端是由[ t4wefan ](https://github.com/t4wefan)免费提供的公益 vits 后端，感谢他们的插件和后端提供能让 vits 服务的使用没有门槛！
:::

### 安装 `chathub` 主插件

在安装和配置了这么多前置插件后，终于可以开始安装 chathub 的主插件了！

但请注意，安装完成后还需要安装其他插件哦。
