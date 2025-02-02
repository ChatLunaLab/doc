# Claude

Claude 是 Anthropic 公司推出的大语言模型，旗下同时开放 `claude-3.5-Sonnet`,`claude-3-haiku` 等模型。

我们支持对接 Claude 里大部分可用的聊天大语言模型或嵌入模型。

由于 API 限制，我们无法获取到 Claude 的最新模型列表。所以当 Claude 发布新模型时，我们滞后一段时间才会更新模型列表。

## 安装

前往插件市场，搜索 `chatluna-claude-adapter`，安装即可。

![images](../../public/images/plugin_market_claude.png)

## 配置

在配置之前，请先前往 [Claude](https://console.anthropic.com/settings/keys) 获取 API key。

如使用的是其他代理平台（转发接口，API-Adapter），还需额外获取 API host 地址。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到 API key 后，转到 `claude-adapter` 的配置页面。

默认插件有一个空的适配项，填入你的 API key 即可。

![images](../../public/images/plugin_claude.png)

记得点击右上角的保存按钮。

## 使用

在 Claude 适配器的配置页面，点击运行按钮，如无误，你应该看不到任何错误 log，那即可转到 ChatLuna 的主插件页面。

在主插件页面，下划到 [模版房间选项](../useful-configurations.md#模版房间选项)，查看 [defaultModel](../useful-configurations.md#defaultmodel) 的选项里是否含有 Claude 模型，如果有，则说明 Claude 适配器已经成功的运行。

![images](../../public/images/plugin_claude_config.png)

但我们仍未完全确认 Claude 适配器是否可用。

因此我们需要新建一个房间，使用 `chatluna.room.create -m claude/claude-3-haiku-20240307 -p chatgpt -n test-claude-adapter` 指令来创建一个使用了 Claude 适配器的房间。

新建房间后请尝试和模型对话。

只要能正常对话，就说明你成功的连接到了 Claude，接入了 Claude 适配器。

别忘了在测试完成后调用 `chatluna.room.delete test-claude-adapter` 指令删除测试房间。

## 常见问题

### 1. 国内平台如何接入？

国内平台接入 Claude 官方的接口，需要代理设置，前往主插件的配置页面，开启 [代理模式](../useful-configurations.md/#isproxy)，并且配置 [代理地址](../useful-configurations.md#proxyaddress)。

> [!TIP] 提示
> 社区成员提供了免费的反向代理地址，请在确认风险后使用。
>
> 地址: [https://claude.chatluna.us.kg/v1](https://claude.chatluna.us.kg/v1)
>
> 此地址并非 ChatLuna 官方认证的地址，请自行判断是否安全。
