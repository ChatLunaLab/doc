# OpenAI Like

ChatLuna 为其他任意兼容 OpenAI 格式的 API 提供了一个统一的 `openai-like-adapter`。

`openai-like-adapter` 具有以下特性：

- 可以设置 `platform` 的名称。
- 支持同时启用多个模型适配器。（只需确保 `platform` 不同即可）

## 安装

前往插件市场，搜索 `chatluna-openai-like-adapter`，安装即可。

![openai-like-adapter](../../public/images/image-11.png)

## 配置

从你的 API 提供商获取 API Key 和 API Host 后即可转到下一步。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到 API key 后，转到 `openai-like-adapter` 的配置页面。

在 `openai-like-adapter` 配置页里可以更改平台名，你需要更改为与其他模型适配器都不一样的平台名，防止冲突。

当然，你也可以更改你喜欢的其他平台名。

完成后在请求设置里填入你的 API key 和 OpenAI 兼容的请求地址。一般 OpenAI 兼容的格式为 `https://xxx.com/api/v1`。

也就是在调用 OpenAI 库时的 `baseUrl`，但是注意后面需要添加 `v1` 后缀。

![alt text](../../public/images/image-20.png)

记得点击右上角的保存按钮。

## 使用

在 `openai-like-adapter` 适配器的配置页面，点击运行按钮，检查你的日志界面，是否看到错误日志。

如无误，则可以转到沙盒或者其他聊天平台，使用 `chatluna.model.test` 命令查看是否接入成功：

<chat-panel>
  <chat-message nickname="User">chatluna.model.test openai-like</chat-message>
  <chat-message nickname="Bot">模型 openai-like/gpt-4.1-nano 测试成功！<br/>
响应时间：2255ms<br/>
示例回复：Hello! How can I assist you today?<br/>
  </chat-message>
</chat-panel>  

> [!TIP] 提示
> 当测试指令只输入平台名时，ChatLuna 会自动选择一个此平台可用的模型进行测试。

测试成功后，则代表你已成功接入你设置的平台，可以正常使用了。
