# 预设

ChatLuna 内置了一套预设的 API，可以使用这些 API 来使用 ChatLuna 的预设。

## API

### formatPresetTemplateString(template, variables)

```typescript
import { formatPresetTemplateString } from 'koishi-plugin-chatluna/llm-core/preset'

const template = `{user} 说：{message}`
const formatted = formatPresetTemplateString(template, { user: 'Alice', message: 'Hello, world!' })
```

- **template**: `string` 预设模板字符串
- **variables**: `Record<string, string>` 变量对象
- 返回值: `string` 格式化后的预设模板字符串

将预设模板字符串中的变量替换为实际值。

### formatMessages(messages, variables)

```typescript
import { formatPresetTemplate } from 'koishi-plugin-chatluna/llm-core/preset'
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'

const messages = [
    new SystemMessage('Hello, world!'),
    new HumanMessage('{user} 说：{message}')
]

const formatted = formatMessages(messages, { user: 'Alice', message: 'Hello, world!' })
```

- **messages**: `BaseMessage[]` 消息数组
- **variables**: `Record<string, string>` 变量对象
- 返回值: `BaseMessage[]` 格式化后的消息数组

将 LangChain 的消息数组中的变量替换为实际值。

### loadPreset(preset)

```typescript
import { loadPreset } from 'koishi-plugin-chatluna/llm-core/preset'

const rawPreset = `...`

const preset = await loadPreset(rawPreset)
```

- **preset**: `string` 预设名称
- 返回值: `PresetTemplate` 预设对象

从预设字符串中加载预设。

### formatPresetTemplate(preset, variables)

```typescript
import { formatPresetTemplate } from 'koishi-plugin-chatluna/llm-core/preset'

const preset = await loadPreset(rawPreset)
const formatted = formatPresetTemplate(preset, { user: 'Alice', message: 'Hello, world!' })
```

- **preset**: `PresetTemplate` 预设对象
- **variables**: `Record<string, string>` 变量对象
- 返回值: `BaseMessage[]` 格式化后的消息数组

将预设模板中的变量替换为传入的变量对象。

返回值是 LangChain 的消息数组。

### 类: PresetService

`PresetService` 类用于管理预设。

可以通过 `ctx.chatluna.preset` 访问到该类的实例。

#### preset.loadAllPreset()

- 返回值: `Promise<void>`

从预设的默认路径中加载所有预设。

#### preset.getPreset()

- **triggerKeyword**: `string` 加载预设的关键字
- **loadForDisk**: `boolean` 是否从磁盘加载，默认为 `false`
- **throwError**: `boolean` 是否在出错时抛出异常，默认为 `true`
- 返回值: `Promise<PresetTemplate>` 预设对象

从关键词中获取预设。

#### preset.addPreset()

- **preset**: `PresetTemplate` 预设对象
- 返回值: `void`

添加预设到预设服务。（内存中）

#### preset.getAllPreset()

- 返回值: `string[]` 所有预设的关键字

获取所有预设的关键字。
