# koishi-plugin-chathub-copilothub-adapter

[![npm](https://img.shields.io/npm/v/@dingyi222666/koishi-plugin-chathub-copilothub-adapter)](https://www.npmjs.com/package/@dingyi222666/koishi-plugin-chathub-copilothub-adapter)

> 这是一个为 [ChatHub](https://github.com/ChatHubLab/chathub) 提供 [Copilot Hub](https://github.com/features/copilot) 支持的适配器插件
::: danger 注意
**本插件目前暂停维护，因为我没有相关的 API KEY 供测试，如果你在使用本插件时发现了 Bug，请联系我，并附上可供我测试用的 API KEY，谢谢。**
:::
本章节将介绍如何使用本插件来实现与 Poe 的聊天互动。本章节包括以下内容：

- [如何使用？](#如何使用)
- [常见问题](#常见问题)
- [配置项](#配置项)

## 如何使用？

1. 在插件市场安装本插件（`chathub-copilothub-adapter`），并确保安装了本插件依赖的前置插件。

2. 获取 Copilot Hub Bot 的 API KEY，并填写到插件的设置中（全局设置 -> apiKey）。

3. 如果需要设置代理的话，建议在 `chathub` 主插件里设置代理（请求设置 -> isProxy，请求设置 -> proxyAddress）。


## 常见问题

### 什么是“注入 Prompt”？

“注入 Prompt”指的是是否能像 OpenAI 的适配器一样能注入信息（并且开启后会尝试自维护上下文）。

需要注意的是这个功能并不一定有效，建议谨慎使用。

## 配置项

本文介绍了 `koishi-plugin-chathub-copilothub-adapter` 插件的配置项，以及它们的含义和用法。

### 全局设置

| 配置项 | 类型 | 必填 | 默认值 | 作用 |
| --- | --- | --- | --- | --- |
| chatConcurrentMaxSize | `number` | 否 | `1` | 设置当前适配器适配的模型的最大并发聊天数 |
| chatTimeLimit | `number` 或 `Computed<Awaitable<number>>` | 否 | `20` | 设置每小时的调用限额（次数） |
| timeout | `number` | 否 | `200000` | 设置请求超时时间（毫秒） |
| maxRetries | `number` | 否 | `3` | 设置模型请求失败后的最大重试次数 |

### 请求设置

#### apiKey

类型：`string`

必填：是

作用：设置 Copilot Hub Bot 的 API KEY，用于与 Copilot Hub 服务进行通信。

### 对话设置

#### formatMessage

类型：`boolean`

必填：否

默认值：`false`

作用：设置是否使用历史聊天消息作为 Prompt，以提高对话的连贯性和自然性。

---

总结：

本章节介绍了如何使用 `koishi-plugin-chathub-copilothub-adapter` 插件来实现与 Copilot Hub 的聊天互动。本章节包括了以下内容：

- 如何安装和配置本插件
- 如何解决一些常见问题
- 如何定制本插件的配置项

希望本章节对你有所帮助，如果你有任何问题或建议，请随时联系我们。谢谢！

