# 群聊分析 (Group Analysis)

群聊分析插件，基于 ChatLuna 的 LLM 模型，提供群聊记录分析和用户画像生成能力。

## 配置

* 前往插件市场搜索 `chatluna-group-analysis` 并安装。

::: tip 提示
如果无法正常搜索到 `chatluna-group-analysis`，则说明官方插件源没有正常更新。
前往 market 插件设置为其他源即可。

以下是推荐的一些插件源:

* [https://koishi-registry.yumetsuki.moe/index.json](https://koishi-registry.yumetsuki.moe/index.json)
* [https://kp.itzdrli.cc](https://kp.itzdrli.cc)

:::

## 使用

确保你已经配置好了模型。

配置完成后，前往 Koishi 控制面板，启用群聊分析插件即可。

在数据库监听规则列表中添加需要监听的群组。

添加完成后，使用群分析命令即可生成群聊分析报告。

> [!TIP] 提示
> 群聊分析支持定时任务和手动触发两种方式。定时任务会按照 CRON 表达式自动生成报告。
>
> 用户画像支持主动查询和自动更新。自动更新会在用户消息累计达到阈值时触发。

## 命令

### 群分析

分析本群的近期聊天记录。

以下为命令格式：

```powershell
群分析 [days:number]
```

以下为参数说明：

* `days`: 分析的天数，默认为 1 天，最大为 7 天。

以下为例子：

<chat-panel>
  <chat-message nickname="User">群分析</chat-message>
  <chat-message nickname="Bot">[生成群聊分析报告图片]</chat-message>
</chat-panel>

<chat-panel>
  <chat-message nickname="User">群分析 3</chat-message>
  <chat-message nickname="Bot">[生成最近 3 天的群聊分析报告图片]</chat-message>
</chat-panel>

### 群分析.启用

启用本群的分析功能。

以下为命令格式：

```powershell
群分析.启用
```

以下为例子：

<chat-panel>
  <chat-message nickname="User">群分析.启用</chat-message>
  <chat-message nickname="Bot">已为当前群 测试群 (123456) 启用日常分析功能。</chat-message>
</chat-panel>

### 群分析.禁用

禁用本群的分析功能。

以下为命令格式：

```powershell
群分析.禁用
```

以下为例子：

<chat-panel>
  <chat-message nickname="User">群分析.禁用</chat-message>
  <chat-message nickname="Bot">已为当前群 测试群 (123456) 禁用日常分析功能。</chat-message>
</chat-panel>

### 群分析.清理

清理当前群分析的缓存数据。

以下为命令格式：

```powershell
群分析.清理
```

以下为例子：

<chat-panel>
  <chat-message nickname="User">群分析.清理</chat-message>
  <chat-message nickname="Bot">已清理当前群 测试群 (123456) 的分析缓存。</chat-message>
</chat-panel>

### 群分析.状态

查看当前群的分析功能状态。

以下为命令格式：

```powershell
群分析.状态
```

以下为例子：

<chat-panel>
  <chat-message nickname="User">群分析.状态</chat-message>
  <chat-message nickname="Bot">当前群 测试群 (123456) 分析功能状态: 已启用</chat-message>
</chat-panel>

### 用户画像

查看指定用户的画像。

以下为命令格式：

```powershell
用户画像 [user:user]
```

以下为参数说明：

* `user`: 目标用户，可以是 @ 用户或用户 ID。不带参数时查看当前用户。
* `-f`: 强制更新用户画像。

以下为例子：

<chat-panel>
  <chat-message nickname="User">用户画像</chat-message>
  <chat-message nickname="Bot">[生成当前用户的画像报告]</chat-message>
</chat-panel>

<chat-panel>
  <chat-message nickname="User">用户画像 @某用户</chat-message>
  <chat-message nickname="Bot">[生成指定用户的画像报告]</chat-message>
</chat-panel>

## 渲染模板函数

模板函数 `group_message_fetch` 和 `group_user_persona` 支持在 ChatLuna 预设（主插件/伪装）中使用。

适用于需要获取群聊历史消息或用户画像的场景。

阅读 [渲染模板](../../guide/preset-system/template.md) 以了解渲染模板的使用。

下面是语法：

```js
{group_message_fetch(limit)}
```

例如：

```js
{group_message_fetch(100)}
```

会查询当前群组最近 100 条历史消息。

```js
{group_user_persona(userId)}
```

例如：

```js
{group_user_persona('123456789')}
```

会查询指定用户的画像信息。

你只需要选择合适的位置插入到预设上下文中即可。

> [!TIP] 提示
> 群分析插件也注册了 `group_message_fetch` 和 `group_user_persona` 工具到 ChatLuna 工具。
>
> 这允许 Agent 在需要的时候调用这些工具，获取用户的准确画像。

## 配置项

### 基础配置

#### listenerGroups

* 类型: `GroupListener[]`
* 默认值: `[]`

数据库监听规则列表。决定哪些群组启用分析功能。

##### listenerGroups.platform

平台名称。

##### listenerGroups.selfId

机器人 ID。

##### listenerGroups.channelId

频道 ID。

##### listenerGroups.guildId

群组 ID。

##### listenerGroups.enabled

* 类型: `boolean`
* 默认值: `true`

是否在此频道启用监听。

#### cronSchedule

* 类型: `string`
* 默认值: `无`

定时发送分析报告的 CRON 表达式。留空则禁用。例如 "0 22 * * *" 表示每天 22 点。

#### cronAnalysisDays

* 类型: `number`
* 默认值: `1`

定时任务分析的默认天数。

#### registerTools

* 类型: `boolean`
* 默认值: `true`

是否注册用户画像和群聊分析工具到 ChatLuna。

### 消息存储配置

#### alwaysPersistMessages

* 类型: `boolean`
* 默认值: `false`

启用后，无论平台能力如何都会将监听到的消息写入数据库。

#### retentionDays

* 类型: `number`
* 默认值: `7`
* 范围: `1-`

数据库中缓存消息的最长保留时间（天）。

### 分析渲染配置

#### maxMessages

* 类型: `number`
* 默认值: `2000`

单次分析的最大消息数量。

#### minMessages

* 类型: `number`
* 默认值: `100`
* 范围: `10-1000`

进行分析所需的最小消息数量。

#### maxUsersInReport

* 类型: `number`
* 默认值: `10`

报告中显示的最大活跃用户数量。

#### userTitleAnalysis

* 类型: `boolean`
* 默认值: `true`

是否启用用户称号分析（需要消耗更多 Token）。

#### outputFormat

* 类型: `'image' | 'pdf' | 'text'`
* 默认值: `image`

默认输出格式。

#### theme

* 类型: `'light' | 'dark' | 'auto'`
* 默认值: `auto`

渲染模板的主题。auto 会在 19:00-06:00 期间自动切换到暗色模式。

#### wordsFilter

* 类型: `string[]`
* 默认值: `[]`

过滤词列表。消息内含有此词语时将不会记入统计消息。

#### userFilter

* 类型: `string[]`
* 默认值: `[]`

用户过滤列表。在群分析中忽略这些用户 ID 的消息。

#### personaUserFilter

* 类型: `string[]`
* 默认值: `[]`

用户画像过滤列表。这些用户 ID 将无法分析用户画像（包括自动分析和手动命令调用）。

#### maxTopics

* 类型: `number`
* 默认值: `5`

最多生成的话题数量。

#### maxUserTitles

* 类型: `number`
* 默认值: `6`

最多生成的用户称号数量。

#### maxGoldenQuotes

* 类型: `number`
* 默认值: `3`

最多生成的金句数量。

### LLM 配置

#### model

* 类型: `string`
* 默认值: `无`

使用的 LLM 模型。

#### temperature

* 类型: `number`
* 默认值: `1.5`
* 范围: `0-2`

生成的温度。

### 用户画像配置

#### personaAnalysisMessageInterval

* 类型: `number`
* 默认值: `50`
* 范围: `0-`

跨群用户画像分析的触发阈值，新消息累计达到该条数时尝试更新画像。设置为 0 则关闭自动画像分析。

#### personaCacheLifetimeDays

* 类型: `number`
* 默认值: `3`
* 范围: `0-`

用户画像缓存结果的保留天数。超过此时长后再次请求会重新生成画像。

#### personaLookbackDays

* 类型: `number`
* 默认值: `2`
* 范围: `1-7`

画像分析回溯的天数窗口（建议保持在 1-4 天）。

#### personaMaxMessages

* 类型: `number`
* 默认值: `400`
* 范围: `100-1500`

单次用户画像分析最多提取的历史消息数量。

#### personaMinMessages

* 类型: `number`
* 默认值: `20`
* 范围: `10-`

触发用户画像分析所需的最少历史消息数量。

### 高级配置

#### promptTopic

* 类型: `string`
* 默认值: 见下方

话题分析的提示词模板。用于指导模型生成话题分析报告。

#### promptUserTitles

* 类型: `string`
* 默认值: 见下方

用户称号分析的提示词模板。用于指导模型为用户分配称号和 MBTI 类型。

#### promptGoldenQuotes

* 类型: `string`
* 默认值: 见下方

金句分析的提示词模板。用于指导模型挑选群聊中的金句。

#### promptUserPersona

* 类型: `string`
* 默认值: 见下方

跨群用户画像分析的提示词模板。用于指导模型生成用户画像报告。
