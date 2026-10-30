# Prompt 渲染服务

`ChatLunaPromptRenderService` 负责将带有变量的 Prompt 模板渲染成最终可用于大语言模型的消息内容。

可以通过 `ctx.chatluna.promptRenderer` 访问到该服务的实例。

## 类：ChatLunaPromptRenderService

```typescript
export class ChatLunaPromptRenderService {
    registerFunctionProvider(name: string, handler: FunctionProvider): () => void
    registerVariableProvider(provider: VariableProvider): () => void
    setVariable(name: string, value: string): void
    getVariable(name: string): string | undefined
    removeVariable(name: string): void
    renderTemplate(
        source: string,
        variables?: Record<string, any>,
        options?: RenderOptions
    ): Promise<RenderResult>
    renderMessages(
        messages: BaseMessage[],
        variables?: Record<string, any>,
        options?: RenderOptions
    ): Promise<BaseMessage[]>
    renderPresetTemplate(
        presetTemplate: PresetTemplate,
        variables?: Record<string, any>,
        options?: RenderOptions
    ): Promise<Omit<RenderResult, 'text'> & { messages: BaseMessage[] }>
}
```

### chatluna.promptRenderer.registerFunctionProvider()

- **name**: `string` 函数名称
- **handler**: [`FunctionProvider`](#类型-functionprovider) 函数提供者

注册一个可在 Prompt 模板中调用的函数。返回值为注销该函数的卸载函数。

### chatluna.promptRenderer.registerVariableProvider()

- **provider**: [`VariableProvider`](#类型-variableprovider) 变量提供者

注册一个动态变量提供者。返回值为注销该提供者的卸载函数。

### chatluna.promptRenderer.setVariable()

- **name**: `string` 变量名称
- **value**: `string` 变量值

设置一个静态变量，在后续渲染过程中会被直接替换。

### chatluna.promptRenderer.getVariable()

- **name**: `string` 变量名称

读取已注册的静态变量值。

### chatluna.promptRenderer.removeVariable()

- **name**: `string` 变量名称

移除指定的静态变量。

### chatluna.promptRenderer.renderTemplate()

- **source**: `string` 模板源文本
- **variables**: `Record<string, any>` 额外变量集合，默认 `{}`
- **options**: [`RenderOptions`](#接口-renderoptions) 渲染配置

渲染单个模板字符串，返回 [`RenderResult`](#接口-renderresult)。`RenderResult.text` 为渲染后的文本，`RenderResult.variables` 为渲染过程中收集到的变量名称。

### chatluna.promptRenderer.renderMessages()

- **messages**: `BaseMessage[]` LangChain 消息数组
- **variables**: `Record<string, any>` 额外变量集合，默认 `{}`
- **options**: [`RenderOptions`](#接口-renderoptions) 渲染配置

依次渲染消息数组中的每条消息模板，返回新的 `BaseMessage[]` 实例，保留原有的 `additional_kwargs`。

### chatluna.promptRenderer.renderPresetTemplate()

- **presetTemplate**: `PresetTemplate` 预设模板
- **variables**: `Record<string, any>` 额外变量集合，默认 `{}`
- **options**: [`RenderOptions`](#接口-renderoptions) 渲染配置

渲染整份预设模板，返回对象包含渲染后的 LangChain 消息以及参与渲染的变量列表。

## 类型：VariableProvider

```typescript
export type VariableProvider = () => Record<string, unknown>
```

变量提供者用于在渲染时动态提供额外变量。

## 类型：FunctionProvider

```typescript
export type FunctionProvider = (
    args: string[],
    variables: Record<string, unknown>,
    configurable: RenderConfigurable
) => Promise<string> | string
```

函数提供者会在模板函数调用时被执行，参数为模板传入的参数、当前变量集合以及渲染配置。

## 接口：RenderOptions

```typescript
export interface RenderOptions {
    extensions?: {
        variableProviders?: VariableProvider[]
        functionProviders?: Record<string, FunctionProvider>
    }
    configurable?: RenderConfigurable
    maxDepth?: number
}
```

渲染时的配置。

### options.extensions.variableProviders

- **类型**: `VariableProvider[] | undefined`

附加的变量提供者。

### options.extensions.functionProviders

- **类型**: `Record<string, FunctionProvider> | undefined`

附加的函数提供者。

### options.configurable

- **类型**: [`RenderConfigurable`](#接口-renderconfigurable) | `undefined`

传入模板的配置信息，可在函数提供者中读取。

### options.maxDepth

- **类型**: `number | undefined`

嵌套渲染的最大深度，默认值为 `10`。

## 接口：RenderConfigurable

```typescript
export interface RenderConfigurable {
    [key: string]: unknown
}
```

用于在渲染期间向函数提供者传递附加的配置数据。

## 接口：RenderResult

```typescript
export interface RenderResult {
    text: string
    variables: string[]
}
```

渲染结果，包含最终文本与收集到的变量列表。

## 内置函数

默认内置的函数提供者如下，可直接在模板中使用：

- `time_UTC(offset?)`: 返回加上可选 UTC 偏移量后的时间（格式 `YYYY-MM-DD HH:mm:ss`）。
- `timeDiff(from, to)`: 返回两个时间的差值。
- `date()`: 返回当前日期（本地时区）。
- `weekday()`: 返回英文星期名称。
- `isotime()`: 返回当前时间的 `HH:mm:ss`。
- `isodate()`: 返回当前日期（ISO 格式）。
- `random(min?, max?)`: 当提供两个数字参数时在闭区间内取整随机数，否则从逗号分隔列表中随机选择一项。
- `pick(list)`: 从逗号分隔的列表中随机抽取一项，抽取后移除该项。
- `roll(expression)`: 掷骰子，返回表达式结果。
- `url(method, url, body?, timeout?)`: 发送网络请求并返回结果字符串。
