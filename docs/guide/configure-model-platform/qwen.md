# 通义千问

通义千问，是由阿里云推出的大语言模型，旗下同时开放 `qwen-3` 等模型。

我们支持对接通义千问里大部分可用的聊天大语言模型或嵌入模型。

由于 API 限制，我们无法获取到通义千问的最新模型列表。模型列表会滞后一段时间更新。

## 安装

前往插件市场，搜索 `chatluna-qwen-adapter`，安装即可。

![images](../../public/images/plugin_market_qwen.png)

## 配置

在配置之前，请先参考 [首次调用通义千问 API](https://help.aliyun.com/zh/model-studio/getting-started/first-api-call-to-qwen?spm=5176.12818093_-1363046575.console-base_help.dexternal.3bd416d0aMZwE0#f92b9b9cc7huw) 开通 API 服务。并前往[控制台](https://bailian.console.aliyun.com/?spm=a2c4g.11186623.0.0.6a822562V5KcWo&apiKey=1#/api-key)获取 API key。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到 API key 后，转到 `qwen-adapter` 的配置页面。

默认插件有一个空的适配项，填入你的 API key 即可。

![images](../../public/images/plugin_qwen.png)

记得点击右上角的保存按钮。

## 使用

在 qwen 适配器的配置页面，点击运行按钮。检查你的日志界面，是否有看到错误日志。

如无误，则可以转到沙盒或者其他聊天平台，使用 `chatluna.model.test` 命令查看是否接入成功：

<chat-panel>
  <chat-message nickname="User">chatluna.model.test qwen/qwen-turbo</chat-message>
  <chat-message nickname="Bot">模型 qwen/qwen-turbo 测试成功！<br/>
响应时间：2255ms<br/>
示例回复：Hello! How can I assist you today?<br/>
  </chat-message>
</chat-panel>  

测试成功后，则代表你已成功接入通义千问平台，可以正常使用了。
