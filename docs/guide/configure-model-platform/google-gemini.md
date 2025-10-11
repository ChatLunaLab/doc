# Google Gemini

Google Gemini 是谷歌推出的一系列的人工智能模型。

Google 为免费用户也提供了一定的免费调用额度。我们推荐你使用 `Gemini` 模型。

## 安装

前往插件市场，搜索 `chatluna-google-gemini-adapter`，安装即可。

![images](../../public/images/plugin_gemini_pic_1.png)

## 配置

在配置之前，请先前往 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取 Google AI Studio 平台的 API Key。

如使用的是其他代理平台（转发接口，API-Adapter），还需额外获取 API host 地址。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到 API Key 后，转到 `gemini-adapter` 的配置页面。

默认插件有一个空的适配项，填入你的 API Key 即可。

![images](../../public/images/plugin_gemini_config_1.png)

记得点击右上角的保存按钮。

## 使用

在 Gemini 适配器的配置页面，点击运行按钮，检查你的日志界面，是否看到错误日志。

如无误，则可以转到沙盒或者其他聊天平台，使用 `chatluna.model.test` 命令查看是否接入成功：

<chat-panel>
  <chat-message nickname="User">chatluna.model.test gemini/gemini-2.5-flash-lite</chat-message>
  <chat-message nickname="Bot">模型 gemini/gemini-2.5-flash-lite 测试成功！<br/>
响应时间：2255ms<br/>
示例回复：Hello! How can I assist you today?<br/>
  </chat-message>
</chat-panel>  

测试成功后，则代表你已成功接入 Gemini 平台，可以正常使用了。


## 常见问题

### 1. 国内平台如何接入？

国内平台(含香港) 接入 Google AI Studio 官方的接口，需要代理设置，前往主插件的配置页面，开启[代理模式](../useful-configurations.md/#isproxy) 并配置[代理地址](../useful-configurations.md#proxyaddress)。

> [!TIP] 提示
> 社区成员提供了免费的反向代理地址，使用反向代理地址无需开启代理模式，请在确认风险后使用。
>
> 使用方式：将默认的 https://generativelanguage.googleapis.com/v1beta 替换为以下地址。
>
> 地址: [https://gemini.api.2s.lol/v1beta](https://gemini.api.2s.lol/v1beta)
>
> 此地址并非 ChatLuna 官方认证的地址，请自行判断是否安全。
