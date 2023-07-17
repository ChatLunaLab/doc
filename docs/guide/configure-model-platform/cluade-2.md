# koishi-plugin-chathub-claude2-adapter

[![npm](https://img.shields.io/npm/v/@dingyi222666/koishi-plugin-chathub-claude2-adapter/next)](https://www.npmjs.com/package/@dingyi222666/koishi-plugin-chathub-claude2-adapter)

> 这是一个为 [ChatHub](https://github.com/ChatHubLab/chathub) 提供 [Claude 2](https://claude.ai/chats) 支持的适配器插件

本章节将介绍如何使用本插件来实现与 Claude 2 的聊天互动。本章节包括以下内容：

- [如何使用？](#如何使用)
- [常见问题](#常见问题)
- [配置项](#配置项)

## 如何使用？

1. 在插件市场安装本插件(`chathub-cluade2-adapter`)，并安装好本插件依赖的前置插件。
2. 获取到已经有 Claude 2 访问权限账号的在 Claude 网站的 Cookie。只需要获取到 Cookie 里面 `sessionKey` 的值然后填入进去就行了。
3. 在插件的设置中填写你的 Cookie。
4. 国内环境需要设置代理，请在`chathub`主插件里设置里设置代理(请求设置 -> isProxy，请求设置 -> proxyAddress)。

## 常见问题

### 国内环境怎么使用？

由于国内网络环境的限制，你可能无法直接访问 Claude 2 的服务。为了解决这个问题，你有以下两种方法：

- 在 Koishi 的全局设置里设置代理。这样，Koishi 就会通过代理来访问 Claude 2 的服务。请注意，这种方法需要你本地开启代理，并且可能会影响 Koishi 的其他功能。
- 在`chathub`主插件的设置里设置代理(请求设置 -> isProxy，请求设置 -> proxyAddress)。

## 配置项

介绍 `koishi-plugin-chathub-claude2-adapter` 插件的配置项，以及它们的含义和默认值。

### 全局设置

| 配置项 | 类型 | 必填 | 默认值 | 作用 |
| --- | --- | --- | --- | --- |
| chatConcurrentMaxSize | `number` | 否 | `1` | 设置当前适配器适配的模型的最大并发聊天数 |
| chatTimeLimit | `number` 或 `Computed<Awaitable<number>>` | 否 | `20` | 设置每小时的调用限额（次数） |
| timeout | `number` | 否 | `200000` | 设置请求超时时间（毫秒） |
| maxRetries | `number` | 否 | `3` | 设置模型请求失败后的最大重试次数 |

### 请求设置

- `cookie`: Claude 账号的 Cookie，用于访问 Claude 2 的 API。这是一个敏感信息，不应该泄露给他人。默认值为空字符串。
- `isProxy`: 是否使用代理访问 Claude 2 的 API。这是一个布尔值，如果为 true，则需要设置 `proxyAddress` 属性。默认值为 false。
- `proxyAddress`: 代理服务器的地址，用于访问 Claude 2 的 API。这是一个字符串，格式为 `http://host:port`。默认值为空字符串。

### 对话设置

- `formatMessages`: 是否使用历史聊天消息作为对话上下文。这是一个布尔值，如果为 true，则会将历史聊天消息拼接成一段文本，作为对话的输入。默认值为 false。

---

总结：

本章节介绍了如何使用 `koishi-plugin-chathub-claude2-adapter` 插件来实现与 Claude 2 的聊天互动。本章节包括了以下内容：

- 如何安装和配置本插件
- 如何解决一些常见问题
- 如何定制本插件的配置项

希望本章节对你有所帮助，如果你有任何问题或建议，请随时联系我们。谢谢！