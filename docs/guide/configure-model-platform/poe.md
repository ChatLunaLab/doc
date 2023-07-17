# koishi-plugin-chathub-poe-adapter

[![npm](https://img.shields.io/npm/v/@dingyi222666/koishi-plugin-chathub-poe-adapter/next)](https://www.npmjs.com/package/@dingyi222666/koishi-plugin-chathub-poe-adapter)

> 这是一个为 [ChatHub](https://github.com/ChatHubLab/chathub) 提供 [poe.com](https://poe.com) 支持的适配器插件

本章节将介绍如何使用本插件来实现与 Poe 的聊天互动。本章节包括以下内容：

- [如何使用？](#如何使用)
- [常见问题](#常见问题)
- [配置项](#配置项)

## 如何使用？

1. 在插件市场安装本插件（`chathub-poe-adapter`），并安装好本插件依赖的前置插件
2. 获取到 Poe 账号的 Cookie 里的 `p-b` 的值。这里介绍一下如何用 Chrome 浏览器获取这个值

    - 登录到 poe.com
    - 打开开发者工具，选择 Application (应用程序)
    - 在左侧选择 Cookie，找到 poe.com 的 Cookie，复制 p-b 的值

3. 在插件的设置中填写你的 `p-b` 的值（请求设置 -> cookie）
4. 国内环境需要设置代理，推荐在 `chathub` 主插件里设置代理（请求设置 -> isProxy，请求设置 -> proxyAddress）

## 常见问题

### 目前使用这个插件会对账号有风险吗？

根据上游反编译 API 的[问题反馈](https://github.com/ading2210/poe-api/issues/54)，有人遇到了账号被封的情况，我不能保证使用此插件后你的账号不会被封，请谨慎使用此插件。

## 配置项

介绍如何使用 `PoeAdapter` 插件的配置项，以及它们的含义和默认值。

### 全局设置

| 配置项 | 类型 | 必填 | 默认值 | 作用 |
| --- | --- | --- | --- | --- |
| chatConcurrentMaxSize | `number` | 否 | `1` | 设置当前适配器适配的模型的最大并发聊天数 |
| chatTimeLimit | `number` 或 `Computed<Awaitable<number>>` | 否 | `20` | 设置每小时的调用限额（次数） |
| timeout | `number` | 否 | `200000` | 设置请求超时时间（毫秒） |
| maxRetries | `number` | 否 | `3` | 设置模型请求失败后的最大重试次数 |

### 其他配置项的结构

- `请求设置`：用于设置请求 `Poe` 账号的相关参数。
- `对话设置`：用于设置聊天消息的相关参数。
- `其他设置`：用于设置其他一些可选的参数。

### 配置项的说明

下表列出了 `PoeAdapter` 插件的配置项的详细说明，包括它们的类型、描述、默认值和是否必填。

| 配置项 | 类型 | 描述 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| pbcookie | string | 已登录的 Poe 账号 的 Cookie 的 p-b 的值。这是用于请求 Poe 账号的必要参数。 | "" | 是 |
| formatMessages | boolean | 是否使用历史聊天消息。如果为 true，则会将历史聊天消息格式化为 Markdown 格式，方便查看和复制。如果为 false，则会将历史聊天消息原样显示。 | true | 否 |

---

总结：

本章节介绍了如何使用 `koishi-plugin-chathub-poe-adapter` 插件来实现与 Poe 的聊天互动。本章节包括了以下内容：

- 如何安装和配置本插件
- 如何解决一些常见问题
- 如何定制本插件的配置项

希望本章节对你有所帮助，如果你有任何问题或建议，请随时联系我们。谢谢！



