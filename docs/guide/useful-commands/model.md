# 模型指令

ChatLuna 提供了一些使用的模型指令，用于查看和设置模型。

> [!TIP] 提示
> ChatLuna 的模型相关指令，不支持禁用，添加和删除某个模型。
>
> 模型的添加和禁言依赖模型平台的配置。
>
> 阅读 [模型平台](../configure-model-platform/introduction.md) 了解更多。

## 列出大语言模型列表

列出当前 ChatLuna 可用的大语言模型列表。

以下为命令格式:

```powershell
chatluna.model.list -l <limit:number> -p <page:number>
```

以下为可选参数:

- `-l,--limit`: 指定返回大语言模型名称的数量上限，默认为 5。
- `-p,--page`: 指定返回大语言模型名称的页数，默认为 1。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.model.list -l 10 </chat-message>
  <chat-message nickname="Bot">以下是目前可用的模型列表:<br/>

<br/>spark/纳西妲<br/>
spark/v1.5<br/>
spark/v2<br/>
spark/v3<br/>
zhipu/ChatGLM-Pro<br/>
zhipu/ChatGLM-Std<br/>
zhipu/ChatGLM-Lite<br/>
zhipu/ChatGLM-Lite-32K<br/>
wenxin/ERNIE-Bot<br/>
wenxin/ERNIE-Bot-turbo<br/>

<br/>你可以使用 chatluna.room.set -m &lt;model&gt; 来设置默认使用的模型<br/>

<br/>当前为第 1 / 2 页
</chat-message>
</chat-panel>

## 搜索大语言模型

搜索当前 ChatLuna 里可用的大语言模型。

以下为命令格式:

```powershell
chatluna.model.search <keyword:string> -l <limit:number> -p <page:number>
```

以下为可选参数:

- `-l,--limit`: 指定返回大语言模型名称的数量上限，默认为 5。
- `-p,--page`: 指定返回大语言模型名称的页数，默认为 1。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.model.search gpt-4o-mini</chat-message>
  <chat-message nickname="Bot">以下是目前搜索到的模型列表:<br/>

<br/>openai-like/gpt-4o-mini<br/>
openai/gpt-4o-mini<br/>
openai/gpt-4o-mini-2024-07-18<br/>

<br/>你可以使用 chatluna.room.set -m &lt;model&gt; 来设置默认使用的模型<br/>

<br/>当前为第 1 / 1 页
</chat-message>
</chat-panel>

## 列出嵌入模型列表

列出当前 ChatLuna 可用的嵌入模型列表。

以下为命令格式:

```powershell
chatluna.embeddings.list -l <limit:number> -p <page:number>
```

以下为可选参数:

- `-l,--limit`: 指定返回嵌入模型名称的数量上限，默认为 5。
- `-p,--page`: 指定返回嵌入模型名称的页数，默认为 1。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.embeddings.list -l 10 </chat-message>
  <chat-message nickname="Bot">以下是目前可用的嵌入模型列表:<br/>

<br/>wenxin/text-embedding<br/>
openai/text-embedding-ada-002<br/>

<br/>你可以使用 chatluna.embeddings.set -m &lt;model&gt; 来设置默认使用的嵌入模型<br/>

<br/>当前为第 1 / 1 页
</chat-message>
</chat-panel>

## 列出向量数据库列表

列出当前 ChatLuna 可用的向量数据库列表。

以下为命令格式:

```powershell
chatluna.vectorstore.list -l <limit:number> -p <page:number>
```

以下为可选参数:

- `-l,--limit`: 指定返回向量数据库名称的数量上限，默认为 5。
- `-p,--page`: 指定返回向量数据库名称的页数，默认为 1。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.vectorstore.list -l 10</chat-message>
  <chat-message nickname="Bot">以下是目前可用的向量数据库列表:<br/>

<br/>faiss<br/>
redis<br/>

<br/>你可以使用 chatluna.vectorstore.set -m &lt;model&gt; 来设置默认使用的向量数据库(如果没有任何向量数据库,会使用存储在内存里的向量数据库(临时的))<br/>

<br/>当前为第 1 / 1 页
</chat-message>
</chat-panel>

## 设置默认嵌入模型

设置当前 ChatLuna 使用的嵌入模型。

设置后如使用到嵌入模型,则优先使用设置的嵌入模型。

:::warning 警告
此命令需要被执行者最低 3 级权限。
:::

:::tip 提示
此命令配置的效果和配置项里的 [`defaultEmbeddings`](../useful-configurations.md#defaultembeddings) 相同。也可通过控制面板配置此项，无需执行命令。
:::

以下为命令格式:

```powershell
chatluna.embeddings.set <embeddings:string>
```

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.embeddings.set openai/text-embedding-ada-002</chat-message>
  <chat-message nickname="Bot">已将默认嵌入模型设置为 openai/openai/text-embedding-ada-002&nbsp;(将自动重启插件应用更改)
  </chat-message>
</chat-panel>

## 设置默认向量数据库

设置当前 ChatLuna 使用的向量数据库。

设置后如使用到向量数据库，则优先使用设置的向量数据库。

:::warning 警告
此命令需要被执行者最低 3 级权限。
:::

:::tip 提示
此命令配置的效果和配置项里的 [`defaultVectorStore`](../useful-configurations.md#defaultvectorstore) 相同。因此也可以通过控制面板配置此项，无需执行此命令。
:::

以下为命令格式:

```powershell
chatluna.vectorstore.set <vectorstore:string>
```

以下为例子:

<chat-panel>
  <chat-message nickname="User">/chatluna.vectorstore.set faiss</chat-message>
  <chat-message nickname="Bot">已将默认向量数据库设置为 faiss,&nbsp;(将自动重启插件应用更改)
  </chat-message>
</chat-panel>
