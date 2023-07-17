# koishi-plugin-chathub-lmsys-adapter

[![npm](https://img.shields.io/npm/v/@dingyi222666/koishi-plugin-chathub-lmsys-adapter/next)](https://www.npmjs.com/package/@dingyi222666/koishi-plugin-chathub-lmsys-adapter)

> 这是一个适用于 [ChatHub](https://github.com/ChatHubLab/chathub) 的 [lmsys(Large Model Systems Organization)](https://lmsys.org/) 适配器插件，可以让你轻松地使用一些开源的对话模型。

本章节将介绍如何使用本插件来实现与 lmsys 的聊天互动。本章节包括以下内容：

- [如何使用？](#如何使用)
- [常见问题](#常见问题)
- [配置项](#配置项)

## 如何使用？

1. 在插件市场安装本插件(`chathub-lmsys-adapter`)，并确保安装了本插件所依赖的前置插件。
2. 如果你在国内环境，需要设置代理，请在`chathub`主插件的设置里开启代理(请求设置 -> isProxy，请求设置 -> proxyAddress)。
3. 完成后，你可以在设置里选择你想要的模型作为默认模型，然后就可以开始和模型聊天了。

## 常见问题

### 什么是 lmsys？

lmsys 是一个提供大规模对话模型服务的组织，它支持一些开源的对话模型，如 GPT-3、GPT-Neo、GPT-J 等。你可以在 [lmsys 官网](https://lmsys.org/) 了解更多信息。

### 如何获取 lmsys 的 API 密钥？

你需要在 [lmsys 官网](https://lmsys.org/) 注册一个账号，并申请一个 API 密钥。你可以在 [lmsys 文档](https://docs.lmsys.org/) 查看如何申请和使用 API 密钥。

### 如何选择不同的对话模型？

你可以使用 [`chathub.listmodel`](/guide/useful-commands#模型列表) 或 [`模型列表`](/guide/useful-commands#模型列表) 查看可用的模型列表。

接下来，你可以使用 [`chathub.setmodel`](/guide/useful-commands#设置模型) 或 [`切换模型`](/guide/useful-commands#设置模型) 命令设置聊天模型。

例如，如果你想要使用 vicuna 模型，你可以输入 `切换模型 lmsys/vicuna`。


## 配置项

介绍 `koishi-plugin-chathub-lmsys-adapter` 插件的配置项，以及它们的含义和作用。

### 全局设置

| 配置项 | 类型 | 必填 | 默认值 | 作用 |
| --- | --- | --- | --- | --- |
| chatConcurrentMaxSize | `number` | 否 | `1` | 设置当前适配器适配的模型的最大并发聊天数 |
| chatTimeLimit | `number` 或 `Computed<Awaitable<number>>` | 否 | `20` | 设置每小时的调用限额（次数） |
| timeout | `number` | 否 | `200000` | 设置请求超时时间（毫秒） |
| maxRetries | `number` | 否 | `3` | 设置模型请求失败后的最大重试次数 |

### 对话设置

#### formatMessages

- 类型：`boolean`
- 默认值：`true`
- 描述：是否使用历史聊天消息作为对话模型的上下文。如果为 `true`，则会将用户和模型之间的最近几条消息拼接成一个字符串，作为对话模型的输入。如果为 `false`，则只会将用户的当前消息作为对话模型的输入。

---

总结：

本章节介绍了如何使用 `koishi-plugin-chathub-lmsys-adapter` 插件来实现与 lmsys 的聊天互动。本章节包括了以下内容：

- 如何安装和配置本插件
- 如何解决一些常见问题
- 如何定制本插件的配置项

希望本章节对你有所帮助，如果你有任何问题或建议，请随时联系我们。谢谢！
