# DeepSeek

DeepSeek 是一家专注于通用人工智能底层模型与技术研究的公司，成立于 2023 年，由知名私募巨头幻方量化创立。公司致力于探索人工智能的本质，发布了多个开源大模型，包括 DeepSeek-V3 通用大语言模型等。

我们可以安装 `deepseek-adapter` 适配器来使用该公司提供的模型。

## 安装

前往插件市场，搜索 `chatluna-deepseek-adapter`，安装即可。

::: tip 提示
如果无法正常搜索到 `chatluna-deepseek-adapter`，则说明官方插件源没有正常更新。
前往 market 插件设置为其他源即可：

![market](../../public/images/markethuanyuan.png)

以下是推荐的一些插件源：

- [https://koishi-registry.yumetsuki.moe/index.json](https://koishi-registry.yumetsuki.moe/index.json)
- [https://kp.itzdrli.cc]([https://kp.itzdrli.cc)

:::

## 配置

在配置之前，请先前往 [DeepSeek](https://platform.deepseek.com/api_keys) 获取 API key。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到 API key 后，转到 `deepseek-adapter` 的配置页面。

在请求设置里填入你的 API key 和 请求地址。请求地址应为 `https://api.deepseek.com/v1`。

![deepseek](../../public/images/image-12.png)

记得点击右上角的保存按钮。

## 使用

在 Deepseek 适配器的配置页面，点击运行按钮，检查你的日志界面，是否看到错误日志。

如无误，则可以转到沙盒或者其他聊天平台，使用 `chatluna.model.test` 命令查看是否接入成功：

<chat-panel>
  <chat-message nickname="User">chatluna.model.test deepseek/deepseek-chat</chat-message>
  <chat-message nickname="Bot">模型 deepseek/deepseek-chat 测试成功！<br/>
响应时间：5255ms<br/>
示例回复：Hello! How can I assist you today?<br/>
  </chat-message>
</chat-panel>  

测试成功后，则代表你已成功接入 Deepseek 平台，可以正常使用了。
