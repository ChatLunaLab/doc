# hugging-face-embeddings模型

ChatHub默认使用的hugging-face-embeddings模型为`sentence-transformers/distilbert-base-nli-mean-tokens`

## 使用

- 安装嵌入模型插件，详见[介绍](introduction.md#安装相应插件)。

- 勾选嵌入模型插件的huggingface配置项。

- [登录](https://huggingface.co/login)huggingface并获取你访问huggingface的[`API Key`](https://huggingface.co/settings/tokens)。

- 将获取的`API Key`填入huggingfaceAapiKey配置项。

- 启用插件，并将`huggingface/sentence-transformers/distilbert-base-nli-mean-tokens`设置为默认使用的嵌入模型。

::: tip
使用hugging-face-embeddings模型一般不会产生费用。
:::