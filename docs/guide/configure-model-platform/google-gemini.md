# Google gemini

## 介绍

Google gemini 是谷歌在 2023 年年底宣布推出其认为规模最大、功能最强大的人工智能模型。

Google 目前推出了免费的 `gemini-pro` 模型，快去试试吧！

本适配器不支持 `plugin` 聊天模式，不能让模型调用本地插件工具。

## 安装

前往插件市场，搜索 `chatluna-google-gemini-adapter`，安装即可。

![images](../../public/images/plugin_gemini_pic_1.png)

## 配置

在配置之前，请先前往 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取 Google AI Studio 平台的 `API KEY`。

如使用为其他代理平台（转发接口，API-ADAPTER），还需额外获取 API host 地址。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到 `API KEY` 后，转到 `gemini-adapter` 的配置页面。

默认插件有一个空的适配项，填入你的 `API KEY` 即可。

![images](../../public/images/plugin_gemini_config_1.png)

记得点击右上角的保存按钮。

## 使用

在 gemini 适配器的配置页面，点击运行按钮，如无误，你应该看不到任何错误 log，那即可转到 ChatLuna 的主插件页面。

在主插件页面，下划到 [模版房间选项](../useful-configurations.md#模版房间选项)，查看 [defaultModel](../useful-configurations.md#defaultmodel) 的选项里是否含有 `gemini` 模型，如果有，则说明你已经成功地接入了 Google 平台。

![images](../../public/images/plugin_gemini_config_2.png)

## 常见问题

### 1. 国内平台如何接入？

国内平台接入 Google 官方的接口，需要代理设置，前往主插件的配置页面，开启 [代理模式](../useful-configurations.md/#isproxy)，然后配置 [代理地址](../useful-configurations.md#proxyaddress)。
