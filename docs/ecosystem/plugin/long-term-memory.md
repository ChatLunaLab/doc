# 长期记忆 (Long Term Memory)

在最新版本中，我们将长期记忆拆分成了独立的插件，以便更好的扩展相关功能。

## 配置

* 前往插件市场搜索 `chatluna-long-memory` 并安装。

![alt text](../../public/images/image-68.png)

::: tip 提示
如果无法正常搜索到 `chatluna-long-memory`，则说明官方插件源没有正常更新。
前往 market 插件设置为其他源即可：

![market](../../public/images/markethuanyuan.png)

以下是推荐的一些插件源：

- [https://koishi-registry.yumetsuki.moe/index.json](https://koishi-registry.yumetsuki.moe/index.json)
- [https://kp.itzdrli.cc]([https://kp.itzdrli.cc)

:::


## 使用

确保你已经配置好了 [嵌入模型](../configure-embedding-model/introduction.md) 和 [向量数据库](../configure-vector-database/introduction.md)。

配置完成后，前往 Koishi 控制面板，启用长期记忆插件即可。

开启后还需要设置长期记忆的 [提取模型](../useful-configurations.md#longmemoryextractmodel)。目前的长期记忆基于大语言模型来提取关键信息，因此需要设置模型。

推荐使用速度快的模型，如 `gpt-4o-mini` 。

对于 [长期记忆存储轮次](../useful-configurations.md#longmemoryinterval)，我们推荐设置为 3-5 轮次，这样既能保证记忆的准确性，也不会出现太多的冗余记忆。

## 配置项

### longMemorySimilarity

* 类型: `number`
* 默认值: `0.3`
* 最小值: `0.1`
* 最大值: `1.0`

长期记忆相似度阈值，取值范围在 0 到 1 之间。

### longMemoryInterval

* 类型: `number`
* 默认值: `3`
* 最小值: `1`
* 最大值: `10`

设置长期记忆的存储频率，即每隔多少轮对话存储一次长期记忆。

### longMemoryExtractModel

* 类型: `string`
* 默认值: ``

### longMemoryDuplicateCheck

* 类型: `boolean`
* 默认值: `true`

是否开启长期记忆的重复性检查。

### longMemoryDuplicateThreshold

* 类型: `number`
* 默认值: `0.5`

长期记忆的重复性检查阈值，取值范围在 0 到 1 之间。超过此阈值的记忆将被视为重复，不会被存储。

### longMemoryNewQuestionSearch

* 类型: `boolean`
* 默认值: `false`

是否开启新问题搜索。开启后在对话时，会生成新的问题，并搜索相关的记忆。

### longMemoryLayer

* 类型: (`global` | `preset-user` | `preset` | `user`)[]
* 默认值: `preset-user`

长期记忆的存储层级。

* global：全局层。此层记忆会被所有房间共享。
* preset: 此层记忆会被相同预设的所有房间共享。
* preset-user: 此层记忆会是长期记忆的主要检索层。用户聊天的记忆默认会被添加到此层。此层针对不同用户和预设都会区分。
* user: 此层记忆会同一用户的所有对话间共享。
