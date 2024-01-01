# Claude 2

## 介绍

Anthropic 公司 在 2023 年 8 月 发布了其最新的人工智能模型 Claude 2，这一模型在性能上有所提升，响应更长，支持百万 token。Claude 2的发布标志着 Anthropic 在人工智能领域的又一重要突破。

本适配器不支持 `plugin` 聊天模式，不能让模型调用本地插件工具。

## 安装

前往插件市场，搜索 `chatluna-claude2-adapter`，安装即可。

![images](../../public/images/plugin_claude2_pic_1.png)

## 配置

在配置之前，请先确认你已经注册了 Claude 2账号，邀请该账号具有 Claude 2的访问权限并且目前可使用你的浏览器直接或通过代理正常访问。

如果你的 Koishi 部署在国内环境，请你为 ChatLuna 设置插件代理。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

打开 `Google Chrome` 浏览器（其他基于 Chromium 内核的浏览器也类似），然后键入 `https://claude.ai/chats` 打开 Claude 官网。

登录后，你应该能见到类似这样的界面。

![images](../../public/images/plugin_claude2_cookie_1.png)

按 `f12`，打开开发者工具，并转到网络选项卡。

![images](../../public/images/plugin_claude2_cookie_2.png)

点击上方的红色监听按钮取消监听，在点击一次监听按钮然后立即按 `f5` 刷新网页。等待几秒后点击监听按钮取消监听。

此时滚动鼠标，将监听列表拉至最上，可以看到 `chats`，并且请求类型为 `fetch` 的请求，点开它。

![images](../../public/images/plugin_claude2_cookie_3.png)

打开后会自动为我们进入标头选项卡。里面含有 `常规`，`响应标头`，`请求标头` 三大项，我们将前两项折叠，从 `请求标头` 内寻找 `cookie`。

![images](../../public/images/plugin_claude2_cookie_4.png)

在 `请求标头` 内找到 `cookie` 项，滚动鼠标以全选 cookie，将其复制。此时你已经复制了使用 Claude 2 适配器所需 cookie。

![images](../../public/images/plugin_claude2_cookie_5.png)

让我们回到插件的配置页。当你新建插件后，插件默认会提供一个 cookie 配置项（即 cookies[0]），将我们刚才复制的 cookie 粘贴进去。

不过还未足够。用你登录了 Claude 2 的账号的浏览器打开[https://ja3.zone/check](https://ja3.zone/check)。

复制网页里的 `User-Agent` 值，粘贴到插件的 `userAgent` 配置项。
然后复制网页里的 `JA3 fingerprint` 值，粘贴到插件的 `JA3Fingerprint` 配置项。

![images](../../public/images/plugin_claude2_pic2.png)

记得点击右上角的保存按钮。

## 使用

在 claude 2 适配器的配置页面，点击运行按钮，如无误，你应该看不到任何错误 log，那即可转到 ChatLuna 的主插件页面。

在主插件页面，下划到 [模版房间选项](../useful-configurations.md#模版房间选项)，查看 [defaultModel](../useful-configurations.md#defaultmodel) 的选项里是否含有 `claude2` 模型，如果有，则说明你已经成功地接入了 Claude 平台。

![images](../../public/images/plugin_claude2_config_2.png)
