# 文心一言

文心一言是百度推出的一款生成式AI产品，旨在通过大语言模型技术提供智能涌现的计算范式。该产品于2023年3月16日正式发布，并面向个人用户和企业用户开放测试。文心一言在文学创作、商业文案创作、数理推算、中文理解和多模态生成等方面展现了突出的能力。

我们支持对接百度公司提供的大部分可用的文心一言聊天大语言模型或嵌入模型。

由于 API 限制，我们无法获取到文心一言最新可用模型列表，所以当百度公司发布新模型时，我们滞后一段时间才会更新模型列表。

## 安装

前往插件市场，搜索 `chatluna-wenxin-adapter`，安装即可。

![wenxin](../../public/images/image-4.png)

## 配置

在配置之前，请先参考 [文心一言API接入指南](https://developer.baidu.com/article/detail.html?id=1089328) 获取 API Key、Secret Key。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到相关配置后，转到 `wenxin-adapter` 的配置页面。

默认插件有一个空的适配项，填入你的 API key 即可。

![alt text](../../public/images/image-6.png)

记得点击右上角的保存按钮。

## 使用

在文心一言适配器的配置页面，点击运行按钮，如无误，你应该看不到任何错误 log，那即可转到 ChatLuna 的主插件页面。

在主插件页面，查看 [defaultModel](../useful-configurations.md#defaultmodel) 的候选项里是否出现文心模型。如果有，说明文心适配器已经成功运行。

![alt text](../../public/images/image-7.png)

但我们仍未完全确认文心一言适配器是否可用。

因此我们可以执行 `chatluna.new test-wenxin-adapter -m wenxin/ERNIE-lite -p chatgpt`，创建一个使用文心适配器的新会话进行测试。

创建完成后，请尝试和模型对话。

只要能正常对话，就说明你成功的连接到了文心一言 API。

测试完成后，如需清理该测试上下文，可以执行 `chatluna.delete test-wenxin-adapter`。
