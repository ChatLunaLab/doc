# koishi-plugin-chathub-chatglm-adapter

[![npm](https://img.shields.io/npm/v/@dingyi222666/koishi-plugin-chathub-chatglm-adapter)](https://www.npmjs.com/package/@dingyi222666/koishi-plugin-chathub-chatglm-adapter)

> 这是一个为 [ChatHub](https://github.com/ChatHubLab/chathub) 提供 [ChatGLM](https://github.com/THUDM/ChatGLM-6B) 支持的适配器插件

本章节将介绍如何使用本插件来实现与 ChatGLM 的聊天互动。本章节包括以下内容：

- [如何使用？](#如何使用)
- [常见问题](#常见问题)
- [配置项](#配置项)

## 如何使用？

1. 你需要**自己搭建 ChatGLM 后端服务**，这个插件基于[这个](https://github.com/xusenlinzy/api-for-open-llm)后端服务，所以请按照这个项目的说明来搭建后端服务（如果有其他人已经搭建了这个后端服务，你也可以使用他们的后端服务）。
2. 在插件市场安装这个插件(`chathub-chatglm-adapter`)，并且安装好这个插件依赖的前置插件。
3. 在插件配置中填写你的后端服务（或者他人搭建的公开的）的访问地址，以及你的后端服务的访问 token。

::: warning 注意
**由于这个插件的网络请求依然是基于`core`插件的代理设置配置的，如果你是本地搭建的后端服务，注意不要让代理给代理了你的后端服务的请求地址（`localhost`，局域网）**
:::

## 常见问题

### 搭建后端服务的最低配置要求是什么？

最低要求是拥有 6GB 显存的消费级显卡（N卡优先），推荐使用 12G 显存的显卡。

如果你的本地配置不够，你可以自行尝试在 AutoDL 等平台上搭建后端服务。

对话的历史记录是保存在本地客户端上的，因此只需要运行起后端服务就可以了。

## 配置项

这是一个介绍 `koishi-plugin-chathub-chatglm-adapter` 插件的配置项的文档。这个插件的配置项可以分为三类：请求设置、模型设置和前置插件设置。下面我们分别介绍每一类配置项的含义和用法。

### 全局设置

| 配置项 | 类型 | 必填 | 默认值 | 作用 |
| --- | --- | --- | --- | --- |
| chatConcurrentMaxSize | `number` | 否 | `1` | 设置当前适配器适配的模型的最大并发聊天数 |
| chatTimeLimit | `number` 或 `Computed<Awaitable<number>>` | 否 | `20` | 设置每小时的调用限额（次数） |
| timeout | `number` | 否 | `200000` | 设置请求超时时间（毫秒） |
| maxRetries | `number` | 否 | `3` | 设置模型请求失败后的最大重试次数 |

### 请求设置

请求设置是指与 ChatGLM 后端服务进行通信时所需要的参数。这些参数包括：

- `apiEndPoint`: 这是一个字符串，表示请求 ChatGLM 自搭建后端的 API 地址。这个地址必须是有效的 URL，且不能包含查询参数或哈希值。例如：`https://example.com/api/chatglm`。这个参数是必填的。
- `apiKey`: 这是一个字符串，表示 ChatGLM 自搭建后端的身份验证 API key。这个 key 是用于验证请求者身份的密钥，一般由后端服务提供者提供。这个参数也是必填的，且应该保密，不要泄露给他人。

### 模型设置

模型设置是指与 ChatGLM 模型本身相关的参数。这些参数可以影响模型生成回复的效果和风格。这些参数包括：

- `maxTokens`: 这是一个数字，表示回复的最大 token 数（16~512，必须是 16 的倍数）。token 是模型内部用来表示文本的基本单位，一般来说，token 数越多，回复的长度越长。这个参数默认值为 256。
- `temperature`: 这是一个数字，表示回复温度，越高越随机（0~1）。温度是模型生成回复时使用的一个概率分布参数，一般来说，温度越高，回复越多样化和创新，但也可能出现不合理或不连贯的内容；温度越低，回复越保守和一致，但也可能出现重复或无聊的内容。这个参数默认值为 0.8。

---

总结：

本章节介绍了如何使用 `koishi-plugin-chathub-chatglm-adapter` 插件来实现与 ChatGLM 的聊天互动。本章节包括了以下内容：

- 如何安装和配置本插件
- 如何解决一些常见问题
- 如何定制本插件的配置项

希望本章节对你有所帮助，如果你有任何问题或建议，请随时联系我们。谢谢！
