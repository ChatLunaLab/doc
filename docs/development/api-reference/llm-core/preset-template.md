# 预设模板

ChatLuna 通过预设模板（Preset）来定义对话的初始 prompt、LoreBook、作者注等信息。

## 函数：loadPreset()

```typescript
import { loadPreset } from 'koishi-plugin-chatluna/llm-core/prompt'

const rawPreset = `...`
const preset = loadPreset(rawPreset)
```

- **rawText**: `string` 预设的原始 YAML/文本内容
- 返回值: [`PresetTemplate`](#接口presettemplate)

将原始文本解析为 `PresetTemplate`。解析失败时会抛出异常并记录日志。

## 接口：PresetTemplate

```typescript
export interface PresetTemplate {
    version?: string
    triggerKeyword: string[]
    rawText: string
    messages: BaseMessage[]
    formatUserPromptString?: string
    path?: string
    loreBooks?: {
        scanDepth?: number
        items: RoleBook[]
        tokenLimit?: number
        recursiveScan?: boolean
        maxRecursionDepth?: number
        insertPosition?:
            | 'before_char_defs'
            | 'after_char_defs'
            | 'before_example_messages'
            | 'after_example_messages'
    }
    authorsNote?: AuthorsNote
    knowledge?: KnowledgeConfig
    config: {
        maxOutputToken?: number
        longMemoryPrompt?: string
        loreBooksPrompt?: string
        longMemoryExtractPrompt?: string
        longMemoryNewQuestionPrompt?: string
        postHandler?: PostHandler
        reActInstruction?: string
    }
}
```

- **triggerKeyword**: 激活预设的关键字列表。
- **messages**: LangChain `BaseMessage` 组成的提示消息数组。
- **loreBooks**: 可选的 LoreBook 配置，包含关键字映射和扫描策略。
- **authorsNote**: 作者注信息，会在对话中按设定频率插入。
- **knowledge**: 关联的知识库配置。
- **config**: 预设的附加配置，包含输出上限、记忆相关提示等。

## 类：PresetService

`PresetService` 负责维护本地预设文件，可通过 `ctx.chatluna.preset` 获取实例。

### preset.loadPreset()

- **file**: `string` 预设文件路径
- 返回值: `Promise<void>`

加载指定路径的预设文件并加入内存列表，若重复加载则会忽略。

### preset.loadAllPreset()

- 返回值: `Promise<void>`

扫描预设目录（默认 `data/chathub/presets`）下的 `.txt` 或 `.yml` 文件并全部加载。

### preset.watchPreset()

- 返回值: `void`

监听预设目录文件变动，自动同步新增、修改与删除。

### preset.init()

- 返回值: `Promise<void>`

初始化预设服务，等价于依次调用 `loadAllPreset()` 与 `watchPreset()`。

### preset.getPreset()

- **triggerKeyword**: `string` 关键字
- **throwError**: `boolean` 出错时是否抛出异常，默认 `true`
- 返回值: `ComputedRef<PresetTemplate | undefined>`

按照关键字查找预设，返回响应式的 `ComputedRef`。未找到且允许静默时返回 `undefined`。

### preset.getDefaultPreset()

- 返回值: `ComputedRef<PresetTemplate>`

返回默认预设。若存在 `triggerKeyword` 包含 `sydney` 的预设则优先使用，否则返回列表中的第一个预设，若数据为空会抛出错误。

### preset.getAllPreset()

- **concatKeyword**: `boolean` 是否将关键字拼接成单个字符串，默认 `true`
- 返回值: `ComputedRef<string[]>`

以响应式数组形式返回所有已加载的预设关键字。

### preset.addPreset()

- **preset**: [`PresetTemplate`](#接口presettemplate)
- 返回值: `void`

将预设加入内存列表并更新 Koishi Schema，若关键字或路径重复则忽略。

### preset.resetDefaultPreset()

- 返回值: `Promise<void>`

将内置默认预设复制到 `data/chathub/presets` 目录，用于恢复初始状态。

### preset.resolvePresetDir()

- 返回值: `string`

返回当前使用的预设目录绝对路径。

## 事件

预设目录发生变化时，`PresetService` 会自动更新内存中的预设列表并刷新 Koishi Schema 中的 `preset` 枚举项。
