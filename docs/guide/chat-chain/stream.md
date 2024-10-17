# 流式输出

类似 ChatGPT 的打字机效果，ChatLuna 也进行了模拟，但并不是所有的 Koishi 聊天适配器都支持流式输出。所以我们有两种流式输出模式：

- 原生流式输出
  
  通过不断编辑消息内容来实现流式输出效果。原生且最接近 ChatGPT 的打字机效果。

- 分段流式输出
  
  通过将消息进行分段/分句，然后流式逐个发送内容。此模式虽没有完全实现打字机效果，但胜在能实现与打字机相似的响应速度（无需等待所有内容生成完毕）。

## 配置

开启流式输出非常简单，只需要在 ChatLuna 主插件配置中打开 [`streamResponse`](../useful-configurations.md#streamresponse) 开关即可。

:::tip 提示
开启流式输出后，请不要设置输出格式为其他模式（如 `image`）。这可能会导致意料之外的错误！
:::

## 使用

开启流式输出后将自动应用到所有输出。对于支持编辑消息的聊天适配器，将使用原生流式输出，类似如下效果：

![原生流式输出](https://s2.loli.net/2024/10/17/pcDjSIVMkB1aO6L.webp)

对于不支持编辑消息的聊天适配器，将使用分段流式输出，具体效果请自行体验。