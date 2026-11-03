# Hugging Face Embeddings

Hugging Face 平台是一个模型的开源分享相关平台。

用户可以基于 Hugging Face 平台分享或下载其他用户分享的模型。
甚至还可使用 Hugging Face 平台提供的 API 来直接使用这些模型。
Hugging Face 社区提供了大量的模型，其中就包括了一些嵌入模型。

在 ChatLuna 中也提供了 Hugging Face 的 API 接入，让我们可以直接使用 Hugging Face 平台所拥有的嵌入模型。

## 使用

1. 安装嵌入模型服务插件，详见 [介绍](introduction.md#安装)。

2. 开启嵌入模型插件的 启用 huggingface 选项。

3. [登录](https://huggingface.co/login) Hugging Face，获取 Hugging Face 提供的[API Key](https://huggingface.co/settings/tokens)。

4. 将获取的 API Key 填入 `huggingfaceApiKey` 配置项。

5. 设置你想使用的在 Hugging Face 平台上的嵌入模型，我们默认使用 `sentence-transformers/distilbert-base-nli-mean-tokens` 模型，你可以配置为其他模型。将模型名称填入 `huggingfaceEmbeddingModel` 配置项即可。

6. 启用嵌入模型服务插件。

7. 执行一次 `chatluna.embeddings.list` 指令，寻找有 `huggingface/` 前缀的嵌入模型。

8. 设置默认使用的嵌入模型为上一步找到的嵌入模型。如果你直接使用了默认的嵌入模型，那么就应该是 `huggingface/sentence-transformers/distilbert-base-nli-mean-tokens`。
