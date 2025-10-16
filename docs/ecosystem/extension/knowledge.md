# 知识库 (Knowledge)

此插件为 ChatLuna 提供知识库能力。

## 配置

* 前往插件市场，安装 `chatluna-knowledge` 插件。

![alt text](../../public/images/image-59.png)

* 确保和长期记忆的前置操作一致，配置了 [嵌入模型](../../guide/configure-embedding-model/introduction.md) 和 [向量存储](../../guide/configure-vector-database/introduction.md)。

* 启用插件。

## 使用

参考下面的命令 [创建知识库](#创建知识库)，创建一个知识库并添加文档。

添加完成后选择你的默认知识库，在聊天模式或浏览模式下即可使用知识库能力。

![alt text](../../public/images/image-60.png)

对于 Agent 模式，需要填写 [基础工具合集](../plugin/common.md#knowledgeid) 里的 ID。

> [!TIP] 提示
> 如果你使用的是聊天模式或者浏览模式，可在预设中设置使用的知识库，支持设置多个知识库 ID。
> 请参考 [预设](../../guide/preset-system/write-preset.md#知识库)。

## 知识库引擎

知识库插件支持三种 RAG 引擎，各自使用不同的方法检索和处理知识。

### 标准 RAG (Standard)

标准 RAG 是最基础的检索增强生成引擎。

它的特点在于：

1. 基于向量相似度直接检索
2. 支持查询改写和上下文压缩
3. 配置简单，易于上手

适合中小规模的文档库，或者不需要复杂关联推理的场景。

### HippoRAG

HippoRAG 基于知识图谱和 Personalized PageRank (PPR) 算法。

从文档中提取实体和关系，构建知识图谱，通过图算法进行多跳推理和关联检索。

它的特点在于：

1. 构建知识图谱，使用 PPR 算法进行精确搜索
2. 支持同义边和实体桥接，增强实体间关联
3. 适合需要多跳推理的复杂查询

适合大规模文档库，或需要深度关联推理的场景。

### LightRAG

LightRAG 是基于外部服务的轻量级 RAG 引擎。

通过调用独立的 LightRAG 服务端处理知识图谱构建和检索。

它的特点在于：

1. 支持多种查询模式（本地、全局、混合等）
2. 将计算负载转移到独立服务
3. 可扩展性强，便于分布式部署

适合需要独立部署或者需要高性能处理的场景。

## 命令

> [!WARNING] 警告
> 目前支持直接解析 `txt` 、 `md` 、 `json` 、 `csv` 和部分纯文本代码格式的文件。
>
> 如需解析 `pdf` 、 `docx` 等文件，请查看插件的说明安装额外的依赖。
>
> 安装额外的依赖可能会导致你的 Koishi 实例出现无法更新，安装，卸载任何依赖的情况。
> 请在确认你有自行修复 Koishi 实例的能力后再进行操作。
> 或使用 [unstructured](https://github.com/Unstructured-IO/unstructured)，此方式较为安全。

### 创建知识库

创建一个新的知识库。可在创建时指定 RAG 类型和其他参数。

命令格式：

```powershell
chatluna.knowledge.create <name:string>
```

可选参数：

* `-t, --type <type:string>`: RAG 类型，可选 `standard`（标准）、`hippo_rag`（HippoRAG）、`light_rag`（LightRAG），默认为 `standard`
* `-d <desc:string>`: 知识库描述
* `-e <embeddings:string>`: 嵌入模型
* `-u <upload:string>`: 创建后立即上传文档的路径
* `-s <size:number>`: 文本块的切割大小（字符）
* `-o <overlap:number>`: 切块重叠大小
* `-c <chunk-type:string>`: 分割使用的方法

示例：

<chat-panel>
  <chat-message nickname="User">chatluna.knowledge.create my-kb -t standard -d "我的知识库"</chat-message>
  <chat-message nickname="Bot">已创建知识库 "my-kb" (ID: kb_xxxxx)</chat-message>
</chat-panel>

### 上传文档到知识库

上传文档到指定的知识库中。

命令格式：

```powershell
chatluna.knowledge.upload <knowledgeBase:string>
```

可选参数：

* `-s <size:number>`: 文本块的切割大小（字符）
* `-o <overlap:number>`: 切块重叠大小
* `-c <chunk-type:string>`: 分割使用的方法
* `-u <upload:string>`: 文档上传路径

示例：

<chat-panel>
  <chat-message nickname="User">chatluna.knowledge.upload my-kb -u C:\Users\dingyi\Downloads\论文txt版.txt</chat-message>
  <chat-message nickname="Bot">已对 C:\Users\dingyi\Downloads\论文txt版.txt 解析成 17 个文档块。正在保存至数据库</chat-message>
  <chat-message nickname="Bot">已成功上传到 faiss 向量数据库</chat-message>
</chat-panel>

### 删除知识库或文档

删除整个知识库或知识库中的特定文档。

命令格式：

```powershell
chatluna.knowledge.delete <target:string>
```

可选参数：

* `-k`: 删除整个知识库
* `-d <docs:string>`: 删除指定文档 ID（逗号分隔多个 ID）

示例（删除知识库）：

<chat-panel>
  <chat-message nickname="User">chatluna.knowledge.delete my-kb -k</chat-message>
  <chat-message nickname="Bot">警告: 即将删除知识库 "my-kb" 及其所有文档，此操作不可恢复！<br>&nbsp;&nbsp;回复大写 Y 以确认删除</chat-message>
  <chat-message nickname="User">Y</chat-message>
  <chat-message nickname="Bot">已成功删除知识库 "my-kb"</chat-message>
</chat-panel>

示例（删除特定文档）：

<chat-panel>
  <chat-message nickname="User">chatluna.knowledge.delete my-kb -d doc_001,doc_002</chat-message>
  <chat-message nickname="Bot">警告: 即将从知识库删除文档 doc_001, doc_002<br>&nbsp;&nbsp;回复大写 Y 以确认删除</chat-message>
  <chat-message nickname="User">Y</chat-message>
  <chat-message nickname="Bot">已成功删除文档 doc_001, doc_002</chat-message>
</chat-panel>

### 列出知识库或文档

列出所有知识库，或列出指定知识库中的文档。

命令格式：

```powershell
chatluna.knowledge.list [knowledgeBase:string]
```

可选参数：

* `-p <page:number>`: 页码，默认为 1
* `-l <limit:number>`: 每页数量，默认为 10
* `-d`: 列出知识库中的文档

示例（列出所有知识库）：

<chat-panel>
  <chat-message nickname="User">chatluna.knowledge.list</chat-message>
  <chat-message nickname="Bot">所有知识库列表<br>&nbsp;&nbsp;my-kb<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类型：(standard)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID: kb_xxxxx<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;描述: 我的知识库<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;创建时间: 2025-01-15<br>&nbsp;&nbsp;<br>&nbsp;&nbsp;提示: 使用 chatluna.knowledge.list &lt;知识库名&gt; --docs 查看知识库中的文档<br>&nbsp;&nbsp;第 1 / 1 页</chat-message>
</chat-panel>

示例（列出知识库信息）：

<chat-panel>
  <chat-message nickname="User">chatluna.knowledge.list my-kb</chat-message>
  <chat-message nickname="Bot">知识库信息：<br>&nbsp;&nbsp;名称：my-kb<br>&nbsp;&nbsp;ID：kb_xxxxx<br>&nbsp;&nbsp;类型：standard<br>&nbsp;&nbsp;描述：我的知识库<br>&nbsp;&nbsp;文档总数：5<br>&nbsp;&nbsp;向量存储类型：faiss<br>&nbsp;&nbsp;最后更新：2025-01-15<br>&nbsp;&nbsp;<br>&nbsp;&nbsp;提示: 使用 --docs 参数查看文档列表</chat-message>
</chat-panel>

示例（列出文档）：

<chat-panel>
  <chat-message nickname="User">chatluna.knowledge.list my-kb --docs</chat-message>
  <chat-message nickname="Bot">知识库 "my-kb" 中的文档<br>&nbsp;&nbsp;ID: doc_001<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;来源: C:\Users\dingyi\Downloads\论文.txt<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预览: 这是一篇关于人工智能的论文...<br>&nbsp;&nbsp;<br>&nbsp;&nbsp;提示: 使用 chatluna.knowledge.delete &lt;知识库名&gt; --docs &lt;文档ID&gt; 删除特定文档<br>&nbsp;&nbsp;第 1 / 1 页</chat-message>
</chat-panel>

## 渲染模板函数

模板函数 `knowledge` 支持在 ChatLuna 预设（主插件/伪装）中使用。

适用于非主插件下，需要检索知识库的场景。

阅读 [渲染模板](../../guide/preset-system/template.md) 以了解渲染模板的使用。

下面是语法：

```js
{knowledge(...knowledge_bases: string[])}
```

例如：

```js
{knowledge('my-kb', 'another-kb')}
```

会查询当前对话者在 `my-kb` 和 `another-kb` 两个知识库中的相关内容。

你只需要选择合适的位置插入到预设上下文中即可。

> [!TIP] 提示
> 知识库插件会自动注册 `knowledge_search` 工具到主插件的 Agent 模式中。
>
> 该工具允许 Agent 根据需要主动查询知识库，适合需要动态获取知识的场景。
>
> 如果你希望知识库内容始终作为上下文存在，请使用上面的渲染模板函数。

## 配置项

此处列举了插件的配置项。

### 基础配置

#### enableChatIntegration

* 类型: `boolean`
* 默认值: `true`

是否将知识库注入到主插件的房间聊天中。

#### defaultKnowledge

* 类型: `string`
* 默认值: `无`

默认使用的知识库 ID。

#### defaultRagType

* 类型: `'standard' | 'hippo_rag' | 'light_rag'`
* 默认值: `standard`

默认使用的 RAG 引擎类型。注意此项只针对新创建的知识库，具体的知识库类型请使用列出知识库指令。

#### chunkSize

* 类型: `number`
* 默认值: `500`
* 范围: `10-2000`

文本块的切割大小（字符）。切分越大，块包含的信息越多，越吃上下文。

#### chunkOverlap

* 类型: `number`
* 默认值: `0`
* 范围: `0-200`

文本块之间的最大重叠量（字符）。保留一些重叠可以保持文本块之间的连续性。

#### chunkType

* 类型: `'text' | 'markdown' | 'code'`
* 默认值: `code`

文本分块方法。可选按文本分割、按 markdown 分割或按代码分割。

#### minSimilarityScore

* 类型: `number`
* 默认值: `0.5`
* 范围: `0-1`，步进 `0.001`

文本搜索的最小相似度。只有相似度超过此值的结果才会被检索。

#### topK

* 类型: `number`
* 默认值: `30`
* 范围: `1-100`

搜索文档的数量。

### 标准知识库配置

#### standardModel

* 类型: `string`
* 默认值: `无`

运行标准知识库的模型。建议使用便宜速度快的模型。

#### standardMode

* 类型: `'fast' | 'regenerate' | 'contextual-compression'`
* 默认值: `fast`

标准知识库的运行模式。

* `fast`: 直接对问题查询
* `regenerate`: 重新生成问题查询，记忆用户的上下文
* `contextual-compression`: 上下文压缩查询

### HippoRAG 配置

#### hippoModel

* 类型: `string`
* 默认值: `无`

运行 HippoRAG 的模型。

#### hippoRetrievalTopK

* 类型: `number`
* 默认值: `20`
* 范围: `1-100`

HippoRAG 检索的 TopK 数量。

#### hippoLinkingTopK

* 类型: `number`
* 默认值: `10`
* 范围: `1-50`

HippoRAG 链接的 TopK 数量。

#### hippoPassageNodeWeight

* 类型: `number`
* 默认值: `0.05`
* 范围: `0-1`，步进 `0.01`

HippoRAG 段落节点权重。

#### hippoDamping

* 类型: `number`
* 默认值: `0.5`
* 范围: `0-1`，步进 `0.01`

HippoRAG 阻尼系数。

#### hippoSynonymyEdgeTopK

* 类型: `number`
* 默认值: `10`
* 范围: `1-50`

HippoRAG 同义边 TopK 数量。

#### hippoSynonymyEdgeSimThreshold

* 类型: `number`
* 默认值: `0.8`
* 范围: `0-1`，步进 `0.01`

HippoRAG 同义边相似度阈值。

### LightRAG 配置

#### lightragBaseUrl

* 类型: `string`
* 默认值: `http://localhost:9621`

LightRAG 服务器地址。

#### lightragApiKey

* 类型: `string`
* 默认值: `无`

LightRAG API 密钥（可选）。

#### lightragQueryMode

* 类型: `'local' | 'global' | 'hybrid' | 'naive' | 'mix'`
* 默认值: `global`

LightRAG 查询模式。

### unstructured 配置

用于配置 unstructured API。能支持更多的文件格式读取。

#### unstructuredApiEndpoint

* 类型: `string`
* 默认值: `http://127.0.0.1:8000`

unstructured API 的地址。

#### unstructuredApiKey

* 类型: `string`
* 默认值: `无`

unstructured API 的密钥。
