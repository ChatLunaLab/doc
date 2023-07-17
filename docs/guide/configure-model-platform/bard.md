# koishi-plugin-chathub-bard-adapter

[![npm](https://img.shields.io/npm/v/@dingyi222666/koishi-plugin-chathub-bard-adapter)](https://www.npmjs.com/package/@dingyi222666/koishi-plugin-chathub-bard-adapter)

> 这是一个为 [ChatHub](https://github.com/ChatHubLab/chathub) 提供 [Google Bard](https://bard.google.com/) 支持的适配器插件

本章节将介绍如何使用本插件来实现与 Google Bard 的聊天互动。本章节包括以下内容：

- [如何使用？](#如何使用)
- [常见问题](#常见问题)
- [配置项](#配置项)

## 如何使用？

1. 在插件市场安装本插件(`chathub-bard-adapter`)，并确保安装了本插件依赖的前置插件。
2. 按照以下步骤获取需要的 Cookie：

    1. 打开 [Google Bard](https://bard.google.com/) 网站。
    2. 打开浏览器的开发者工具（F12）。
    3. 找到 Network 选项卡，然后打开录制网络日志选项，按下 F5 刷新页面。
    4. 找到 `bard.google.com` 的请求，然后在右侧的 Headers 选项卡中找到 `cookie` 字段，复制其内容。

3. 在插件的设置中填写你的 Cookie（请求设置 -> Cookie）。
4. 国内环境需要设置代理，请在 `chathub` 主插件里设置里设置代理(请求设置 -> isProxy，请求设置 -> proxyAddress)。

## 常见问题

暂无

## 配置项

本文介绍了 `koishi-plugin-chathub-bard-adapter` 插件的配置项，以及如何使用它们。

### 全局设置

| 配置项 | 类型 | 必填 | 默认值 | 作用 |
| --- | --- | --- | --- | --- |
| chatConcurrentMaxSize | `number` | 否 | `1` | 设置当前适配器适配的模型的最大并发聊天数 |
| chatTimeLimit | `number` 或 `Computed<Awaitable<number>>` | 否 | `20` | 设置每小时的调用限额（次数） |
| timeout | `number` | 否 | `200000` | 设置请求超时时间（毫秒） |
| maxRetries | `number` | 否 | `3` | 设置模型请求失败后的最大重试次数 |

### cookie

类型：`string`

必填：`true`

描述：在 [bard.google.com](https://bard.google.com/) 登录后获取的 Cookie。

这个 Cookie 是用于向 Google Bard 发送请求和接收回复的凭证，如果没有它，插件将无法正常工作。

获取 Cookie 的方法请参考 [如何使用](#如何使用)。

### 请求设置

类型：`object`

必填：`false`

描述：这个对象包含了一些与请求相关的设置，例如代理、超时等。

这些设置是用于向 Google Bard 发送请求和接收回复的参数，如果不需要特殊处理，可以省略这个对象。

请求设置对象的属性如下：

#### isProxy

类型：`boolean`

必填：`false`

默认值：`false`

描述：是否使用代理服务器。

如果你在国内环境，可能需要使用代理服务器才能访问 Google Bard，这时你可以将这个属性设置为 `true`。

#### proxyAddress

类型：`string`

必填：`false`

默认值：`null`

描述：代理服务器的地址。

如果你设置了 `isProxy: true`，那么你需要提供一个代理服务器的地址，例如 `http://127.0.0.1:7890`。

注意，这个地址必须是一个有效的 URL 格式，否则会导致请求失败。

---

总结：

本章节介绍了如何使用 `koishi-plugin-chathub-bard-adapter` 插件来实现与 Google Bard 的聊天互动。本章节包括了以下内容：

- 如何安装和配置本插件
- 如何解决一些常见问题
- 如何定制本插件的配置项

希望本章节对你有所帮助，如果你有任何问题或建议，请随时联系我们。谢谢！

