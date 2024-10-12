# 介绍

嵌入模型（Embeddings） 可以将文本转换为向量，从而实现文本的语义表示。

ChatLuna 使用嵌入模型来将用户的输入，模型的输出等数据转换为向量。

目前，ChatLuna 通过 嵌入模型和 [向量数据库](../configure-vector-database/introduction.md) 来为用户提供 [长期记忆](guide/session-related/long-term-memory) 功能。

::: tip
在未来，我们可能还会基于嵌入模型和长期记忆库，实现基于资料的 QA 问答。
:::

嵌入模型的服务由多个插件提供，这其中某些模型适配器已经提供了相关服务，如 [OpenAI](./openai-embeddings.md) 与 [Google Gemini](../configure-model-platform/google-gemini.md) 。

因此，你可以直接使用这些插件来使用嵌入模型服务而无需安装嵌入模型服务插件。

如果你不想使用模型适配器自带的嵌入模型服务，你也可以使用 ChatLuna 提供的嵌入模型服务插件。

这里面提供了一些嵌入模型的适配器，你可以根据自己的需求选择合适的模型。

下面我们将介绍如何安装嵌入模型服务插件。

## 安装

前往 Koishi 的插件市场，搜索 `chatluna-embeddings-service`，并安装。

此插件还需要配置后才能使用，你可以在左侧的导航栏中选择你感兴趣的嵌入模型平台，然后按照其介绍进行配置。

## 支持平台

我们目前支持以下提供了嵌入模型的平台：

- [OpenAI](openai-embeddings)

- [Hugging Face](hugging-face-embeddings)

你可以点击上面的链接查看如何配置相应的嵌入模型。

## 使用

当你接入一个嵌入模型后，你需要将它设置为默认的嵌入模型。

你可以在 ChatLuna 主插件的配置项中 [选择](../useful-configurations#模型选项) 默认使用的嵌入模型。

也可使用指令设置默认嵌入模型，详见 [嵌入模型和向量数据库管理](../useful-commands.md#嵌入模型和向量数据库管理)。
