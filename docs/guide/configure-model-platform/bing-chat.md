# koishi-plugin-chathub-newbing-adapter

[![npm](https://img.shields.io/npm/v/@dingyi222666/koishi-plugin-chathub-newbing-adapter/next)](https://www.npmjs.com/package/@dingyi222666/koishi-plugin-chathub-newbing-adapter)

> 这是一个为 [ChatHub](https://github.com/ChatHubLab/chathub) 提供 [New Bing](https://www.bing.com/chat) 支持的适配器插件。

本章节将介绍如何使用本插件来实现与 New Bing 的聊天互动。本章节包括以下内容：

- [如何使用？](#如何使用)
- [常见问题](#常见问题)
- [配置项](#配置项)

## 如何使用？ {#如何使用}

1. 在插件市场安装本插件(`chathub-newbing-adapter`)，并确保安装了本插件所依赖的前置插件。

2. 获取一个已经有 New Bing 访问权限的账号，并在 Bing 网站上登录，然后复制登录后的 Cookie (可以参考 [这里](/guide/configure-model-platform/bing-chat.html#请求设置))。

3. 在插件的设置中填写你的 Cookie（请求设置 -> cookie）。如果不填写 Cookie，也可以使用 New Bing 的免登录功能，但是可能有一些限制。

4. 如果你在国内环境使用，需要设置代理，请在`chathub`主插件的设置里设置代理(请求设置 -> isProxy，请求设置 -> proxyAddress)。

## 常见问题 {#常见问题}

**什么是 Sydney 模式？**

*Sydney 模式是一种通过某些方式突破 New Bing 的限制的模式，理论上可以实现：*

- *支持上下文对话，不再局限于 30 次限制（但是仍然是有限的，历史聊天记录容量太大就可能会清空对话）*
- *人格设定，设置系统 Pormpt，默认设置为 Sydney，但是开启此功能可能会有一定风险，请谨慎使用。*

## 配置项 {#配置项}

介绍 `BingChatAdapter` 的配置项，以及如何使用它们来定制你的聊天体验。

### 全局设置

| 配置项 | 类型 | 必填 | 默认值 | 作用 |
| --- | --- | --- | --- | --- |
| chatConcurrentMaxSize | `number` | 否 | `1` | 设置当前适配器适配的模型的最大并发聊天数 |
| chatTimeLimit | `number` 或 `Computed<Awaitable<number>>` | 否 | `20` | 设置每小时的调用限额（次数） |
| timeout | `number` | 否 | `200000` | 设置请求超时时间（毫秒） |
| maxRetries | `number` | 否 | `3` | 设置模型请求失败后的最大重试次数 |

### 请求设置

这些配置项用于设置 Bing 账号的 cookie，以及 New Bing 的 WebSocket Api EndPoint 和 新建会话 Api EndPoint。这些配置项是必须的，否则插件无法正常工作。

| 配置项 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| cookie | `string` | Bing 账号的 cookie，用于验证身份和获取对话信息。你可以按照以下步骤获取 cookie： 1. 在浏览器中打开 [bing.com](https://www.bing.com/) 并登录你的账号。 2. 打开开发者控制台，执行下面的 js 代码： `copy(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("_U=")));` 3. 这样 cookie 就会被复制到剪贴板上，然后在前面加上 `_U` 并粘贴到这里。 注意：这个 cookie 有时效性，可能需要定期更新。另外，有时候不用 cookie 也可以使用 New Bing 的功能，但是不保证稳定性。 | "" |
| webSocketApiEndPoint | `string` | New Bing 的 WebSocket Api EndPoint，用于建立实时通信。你可以在浏览器中打开 New Bing 的聊天页面，查看网络请求中的 WebSocket 连接，复制并粘贴到这里。注意：这个 EndPoint 可能会随着 New Bing 的更新而变化。 | "wss://sydney.bing.com/sydney/ChatHub" |
| createConversationApiEndPoint | `string` | New Bing 的新建会话 Api EndPoint，用于创建新的聊天会话。你可以在浏览器中打开 New Bing 的聊天页面，查看网络请求中的 POST 请求，复制并粘贴到这里。注意：这个 EndPoint 可能会随着 New Bing 的更新而变化。 | "https://edgeservices.bing.com/edgesvc/turing/conversation/create" |

### 对话设置

这些配置项用于设置对话的一些额外功能，如是否开启 Sydney 模式（破解对话 30 次回复数限制），是否显示额外信息（如剩余回复数，猜你想问）等。

| 配置项 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| sydney | `boolean` | 是否开启 Sydney 模式（破解对话 30 次回复数限制）。如果开启了 Sydney 模式，你可以无限次地和 Bing 聊天，而不受每个会话只能回复 30 次的限制。但是，这样做可能会让你的账号有风险，因为它可能会被 New Bing 的后台检测到。所以，请谨慎使用这个功能，并自行承担后果。 | false |
| showExtraInfo | `boolean` | 是否显示额外信息（如剩余回复数，猜你想问）。如果开启了显示额外信息，你可以在聊天界面上看到一些有用的信息，比如每个会话还能回复多少次（如果没有开启 Sydney 模式），以及 Bing 给出的一些猜你想问的问题（如果有的话）。这些信息可以帮助你更好地了解和控制你的聊天过程。 | false |

---

总结：

本章节介绍了如何使用 `koishi-plugin-chathub-newbing-adapter` 插件来实现与 New Bing 的聊天互动。本章节包括了以下内容：

- 如何安装和配置本插件
- 如何解决一些常见问题
- 如何定制本插件的配置项

希望本章节对你有所帮助，如果你有任何问题或建议，请随时联系我们。谢谢！
