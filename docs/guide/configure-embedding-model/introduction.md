# 介绍

单独使用嵌入模型插件对ChatHub本体并没有意义，但是通过与向量数据库并用能实现基于文本语义相似性的对话处理。目前，ChatHub通过嵌入模型插件和[向量数据库](../configure-vector-database/introduction.md)插件为用户提供长期记忆功能。

## 使用

若你想在ChatHub上使用向量数据库。

### 安装相应插件

在koishi的插件市场搜索并安装`@dingyi222666/chathub-embeddings-service`。

### 启用插件

根据你要使用的嵌入模型进行简单配置后即可启用插件。

#### 目前支持的嵌入模型

- [openai-embeddings](openai-embeddings)

- [hugging-face-embeddings](hugging-face-embeddings)

启用插件后可在ChatHub本体[配置项](../useful-configurations)中选择[默认使用的嵌入模型](../useful-configurations#模型选项)。

也可以使用指令设置默认嵌入模型，详见[嵌入模型和向量数据库管理](../useful-commands.md#嵌入模型和向量数据库管理)。

::: tip
单独使用`嵌入模型`插件并不会为`ChatHub`带来任何变化，我们建议你同时安装并启用[向量数据库](../configure-vector-database/introduction.md)插件以体验全部功能。
:::
