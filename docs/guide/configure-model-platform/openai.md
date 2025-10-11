# OpenAI

OpenAI 是全球顶尖的人工智能研究实验室，旗下同时开放 `gpt-5`,`gpt-4.1` 等多模态模型。

我们支持对接 OpenAI 里大部分可用的聊天大语言模型或嵌入模型。

通过 `v1/models` API 动态获取 OpenAI 的模型列表，无需用户手动输入或等待适配器更新。

OpenAI 模型适配器还支持多模态和 Agent 模式。允许模型读取图片或者调用工具。

## 安装

前往插件市场，搜索 `chatluna-openai-adapter`，安装即可。

![images](../../public/images/plugin_market_openai.png)

## 配置

在配置之前，请先前往 [OpenAI](https://platform.openai.com/account/api-keys) 平台获取 API key。

如使用的是其他代理平台（转发接口，API-Adapter），还需额外获取 API Base 地址。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到 API key 后，转到 `openai-adapter` 的配置页面。

默认插件有一个空的适配项，填入你的 API key 即可。

![images](../../public/images/plugin_openai_adapter_1.png)

记得点击右上角的保存按钮。

## 使用

在 OpenAI 适配器的配置页面，点击运行按钮，检查你的日志界面，是否看到错误日志。

如无误，则可以转到沙盒或者其他聊天平台，使用 `chatluna.model.test` 命令查看是否接入成功：

<chat-panel>
  <chat-message nickname="User">chatluna.model.test openai/gpt-4.1-nano</chat-message>
  <chat-message nickname="Bot">模型 openai-like/gpt-4.1-nano 测试成功！<br/>
响应时间：2255ms<br/>
示例回复：Hello! How can I assist you today?<br/>
  </chat-message>
</chat-panel>  

测试成功后，则代表你已成功接入 OpenAI 平台，可以正常使用了。

## 常见问题

### 1. 国内平台如何接入？

国内平台接入 OpenAI 官方的接口，需要代理设置。前往主插件的配置页面，开启 [代理模式](../useful-configurations.md/#isproxy)，并配置 [代理地址](../useful-configurations.md#proxyaddress)。

> [!TIP] 提示
> 社区成员提供了免费的反向代理地址，使用反向代理地址无需开启代理模式，请在确认风险后使用。
>
> 使用方式：将默认的 https://api.openai.com/v1 替换为以下地址。
>
> 地址: [https://openai.api.2s.lol/v1](https://openai.api.2s.lol/v1)
>
> 此地址并非 ChatLuna 官方认证的地址，请自行判断是否安全。
