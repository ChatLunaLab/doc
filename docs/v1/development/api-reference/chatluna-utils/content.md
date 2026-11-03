# 内容与消息工具

本页收录 ChatLuna 暴露的内容处理、LangChain 消息和 Koishi 元素转换工具。

## 字符串与内容工具

导入路径：`koishi-plugin-chatluna/utils/string`

### fuzzyQuery()

- **source**: `string`
- **keywords**: `string[]`
- 返回值: `boolean`

判断文本是否包含任一关键词。

### getMessageContent()

- **message**: `MessageContent`
- 返回值: `string`

从 LangChain `MessageContent` 中提取文本。

### getNotEmptyString()

- **...texts**: `string[]`
- 返回值: `string`

返回第一个非空字符串。

### getMimeTypeFromSource()

- **sourceUrl?**: `string`
- **fileName?**: `string`
- 返回值: `string | null`

按 URL 或文件名推断 MIME。

### getImageMimeType()

- **ext?**: `string`
- 返回值: `string`

按扩展名推断图片 MIME，失败时返回 `image/jpeg`。

### getImageType()

- **buffer**: `Buffer`
- **pure?**: `boolean`
- **checkIsImage?**: `boolean`
- 返回值: `string`

按文件头判断图片类型。

### sanitizeToolLogString()

- **input**: `string`
- 返回值: `string`

清理 base64 data URL、长 data 字段和 thought signature。

### sanitizeToolLogValue()

- **value**: `unknown`
- 返回值: `unknown`

递归清理对象/数组中的敏感或超长字段。

### formatToolCall()

- **tool**: `string`
- **arg**: `unknown`
- **log**: `string`
- 返回值: `string`

格式化工具调用日志。

### getCurrentWeekday()

- 返回值: `string`

### getTimeInUTC()

- **offset**: `number`
- 返回值: `string`

### getTimeDiffFormat()

- **time1**: `Date | number`
- **time2**: `Date | number`
- 返回值: `string`

### getTimeDiff()

- **time1**: `Date | number`
- **time2**: `Date | number`
- 返回值: `number`

### selectFromList()

- **args**: `SelectFromListArgs`
- **isPick**: `boolean`
- 返回值: `string`

### rollDice()

- **formula**: `string`
- 返回值: `number`

### fetchUrl()

- **url**: `string`
- **method?**: `string`
- **body?**: `string`
- **textLength?**: `number`
- 返回值: `Promise<string>`

请求 URL 并截断返回文本。

### gzipEncode()

- **text**: `string`
- **encoding?**: `BufferEncoding`
- 返回值: `Promise<Buffer | string>`

### gzipDecode()

- **data**: `Buffer | string`
- **inputEncoding?**: `BufferEncoding`
- 返回值: `Promise<string>`

### bufferToArrayBuffer()

- **buffer**: `Buffer`
- 返回值: `ArrayBuffer`

### hashString()

- **text**: `string`
- **length?**: `number`
- 返回值: `Promise<string>`

### getSystemPromptVariables()

- **session**: `Session`
- **config**: `ChatLunaConfig`
- **conversation**: `ConversationRecord`
- 返回值: `Record<string, string>`

生成系统提示词变量。

### formatUserPromptString()

- **config**: `ChatLunaConfig`
- **presetTemplate**: `PresetTemplate`
- **session**: `Session`
- **prompt**: `string`
- **conversation**: `ConversationRecord`
- 返回值: `string`

渲染用户输入模板。

## LangChain 消息工具

导入路径：`koishi-plugin-chatluna/utils/langchain`

### markChatLunaUserMessage()

- **msg**: `BaseMessage`
- 返回值: `void`

### isChatLunaUserMessage()

- **msg**: `BaseMessage`
- 返回值: `boolean`

### isMessageContentImageUrl()

- **content**: `MessageContent`
- 返回值: `boolean`

### isMessageContentText()

- **content**: `MessageContent`
- 返回值: `boolean`

### isMessageContentFileUrl()

- **content**: `MessageContent`
- 返回值: `boolean`

### isMessageContentAudio()

- **content**: `MessageContent`
- 返回值: `boolean`

### isMessageContentVideo()

- **content**: `MessageContent`
- 返回值: `boolean`

### isMessageContentComplex()

- **content**: `MessageContent`
- 返回值: `boolean`

### truncateMessageContentUrls()

- **content**: `MessageContent`
- 返回值: `MessageContent`

导出的多模态内容类型：

- `MessageContentFileUrl`
- `MessageContentAudio`
- `MessageContentVideo`

## Koishi 元素工具

导入路径：`koishi-plugin-chatluna/utils/koishi`

### forkScopeToDisposable()

- **scope**: `ForkScope`
- 返回值: `PromiseLikeDisposable`

把 Koishi fork scope 转成 disposer。

### checkAdmin()

- **session**: `Session`
- 返回值: `Promise<boolean>`

检查 `chatluna:admin` 权限，失败时回退到 `authority >= 3`。

### transformToMarkdown()

- **source**: `string`
- **platform?**: `string`
- 返回值: `h[]`

把 Markdown 渲染成 Koishi 元素。

### transformMessageContentToElements()

- **content**: `MessageContent`
- 返回值: `h[]`

把 LangChain 多模态内容转 Koishi 元素。

### pickForwardMessageId()

- **element**: `h`
- 返回值: `string | null`

提取转发消息 ID。

### isForwardMessageElement()

- **element**: `h`
- 返回值: `boolean`

判断是否为转发消息元素。

### normalizeForwardMessageId()

- **value**: `string`
- 返回值: `string | null`

规范化转发消息 ID。

## 其他内容工具

### getBase64EncodedSize()

导入路径：`koishi-plugin-chatluna/utils/base64`

- **rawBytes**: `number`
- 返回值: `number`

计算原始字节 base64 编码后的大小。

### gzipEncode()

导入路径：`koishi-plugin-chatluna/utils/compression`

- **data**: `Buffer | string`
- **encoding?**: `BufferEncoding`
- 返回值: `Promise<Buffer | string>`

### gzipDecode()

导入路径：`koishi-plugin-chatluna/utils/compression`

- **data**: `Buffer | string`
- **encoding?**: `BufferEncoding`
- 返回值: `Promise<string>`

### bufferToArrayBuffer()

导入路径：`koishi-plugin-chatluna/utils/compression`

- **buffer**: `Buffer`
- 返回值: `ArrayBuffer`

### deepAssign()

导入路径：`koishi-plugin-chatluna/utils/object`

- **target**: `object`
- **...sources**: `object[]`
- 返回值: `void`

深度合并对象。
