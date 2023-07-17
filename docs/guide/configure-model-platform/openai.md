# koishi-plugin-chathub-openai-adapter

[![npm](https://img.shields.io/npm/v/@dingyi222666/koishi-plugin-chathub-openai-adapter/next)](https://www.npmjs.com/package/@dingyi222666/koishi-plugin-chathub-openai-adapter)

> 这是一个为 [ChatHub](https://github.com/ChatHubLab/chathub) 提供 [OpenAI GPT 3.5 / GPT 4](https://platform.openai.com/) 支持的适配器插件

本章节将介绍如何使用本插件来实现与 ChatGPT 的聊天互动。本章节包括以下内容：

- [如何使用？](#如何使用)
- [常见问题](#常见问题)
- [配置项](#配置项)

## 如何使用？

1. 首先，你需要获取你的 OpenAI API Key，这是一个用于访问 OpenAI 服务的密钥。你可以在 [OpenAI 的平台网站](https://platform.openai.com/) 注册或登录一个 OpenAI 账号，然后点击页面右上角的你的头像，选择“查看 API 密钥”。在弹出的页面中，点击“创建新的密钥”按钮，就可以生成一个新的 API Key。请注意，这个密钥只会显示一次，所以请及时复制并妥善保存它。
2. 在 Koishi 的插件市场中安装本插件（`chathub-openai-adapter`），并确保已经安装了本插件所依赖的前置插件（`chathub` 和 `openai`）。
3. 在 Koishi 的插件配置中填写你的 API Key（请求设置 -> apiKey）。

## 常见问题

### 国内环境怎么使用？

由于国内网络环境的限制，你可能无法直接访问 OpenAI 的服务。为了解决这个问题，你有以下三种方法：

- 在 Koishi 的全局设置里设置代理。这样，Koishi 就会通过代理来访问 OpenAI 的服务。请注意，这种方法需要你本地开启代理，并且可能会影响 Koishi 的其他功能。
- 在`chathub`主插件的设置里设置代理(请求设置 -> isProxy，请求设置 -> proxyAddress)。
- 在本插件的请求设置中设置反向代理（请求设置 -> apiEndPoint）。这样，Koishi 就会通过反向代理来访问 OpenAI 的服务。请注意，这种方法需要你自己搭建或者找到一个可用的反向代理，并且可能会增加请求延迟。

## 配置项

本插件的配置项分为两类：请求设置和模型设置。请求设置用于设置请求 OpenAI API 的相关参数；模型设置用于设置使用 OpenAI GPT 3.5 / GPT 4 模型时的相关参数。

### 全局设置

| 配置项 | 类型 | 必填 | 默认值 | 作用 |
| --- | --- | --- | --- | --- |
| chatConcurrentMaxSize | `number` | 否 | `1` | 设置当前适配器适配的模型的最大并发聊天数 |
| chatTimeLimit | `number` 或 `Computed<Awaitable<number>>` | 否 | `20` | 设置每小时的调用限额（次数） |
| timeout | `number` | 否 | `200000` | 设置请求超时时间（毫秒） |
| maxRetries | `number` | 否 | `3` | 设置模型请求失败后的最大重试次数 |

### 请求设置

- `apiKey`：OpenAI 的 API Key，是一个用于访问 OpenAI 服务的密钥。这个配置项是必填的。
- `apiEndPoint`：请求 OpenAI API 的地址，默认为 `https://api.openai.com/v1`。如果你无法直接访问 OpenAI 的服务，你可以设置一个反向代理来替代这个地址。

### 模型设置

- `maxTokens`：回复的最大 Token 数（16~4096，必须是16的倍数）（注意如果你目前使用的模型的最大 Token 为8000及以上的话才建议设置超过 512 token）。默认为 256。
- `temperature`：回复温度，越高越随机（0~1，每步0.1）。默认为 0.8。
- `presencePenalty`：重复惩罚，越高越不易重复出现过至少一次的 Token（-2~2，每步0.1）。默认为 0.2。
- `frequencyPenalty`：频率惩罚，越高越不易重复出现次数较多的 Token（-2~2，每步0.1）。默认为 0.2。

---

总结：

本章节介绍了如何使用 `koishi-plugin-chathub-openai-adapter` 插件来实现与 ChatGPT 的聊天互动。本章节包括了以下内容：

- 如何安装和配置本插件
- 如何解决一些常见问题
- 如何定制本插件的配置项

希望本章节对你有所帮助，如果你有任何问题或建议，请随时联系我们。谢谢！