# 消息转换器

`MessageTransformer` 负责把 Koishi 的消息元素转换为 ChatLuna 的 `Message`。

## 类型：MessageTransformFunction

```ts
export type MessageTransformFunction = (
  session: Session,
  element: h,
  message: Message,
  model?: string,
) => Promise<boolean | void>
```

返回 `false` 表示继续向子元素或后续转换器传递。

## 类型：BeforeMessageTransformFunction

```ts
export type BeforeMessageTransformFunction = (
  session: Session,
  elements: h[],
  message: Message,
  model?: string,
  options?: MessageTransformOptions,
) => Promise<void>
```

## 接口：MessageTransformOptions

```ts
export interface MessageTransformOptions {
  quote: boolean
  includeQuoteReply: boolean
}
```

## 类：MessageTransformer

可以通过 `ctx.chatluna.messageTransformer` 获取实例。

### messageTransformer.before()

- **transformFunction**: `BeforeMessageTransformFunction`
- **priority**: `number`
- 返回值: `() => void`

注册一个前置转换钩子，在正式处理元素前执行。

### messageTransformer.intercept()

- **type**: `string`
- **transformer**: `MessageTransformFunction`
- **priority**: `number`
- 返回值: `() => void`

注册某种 Koishi 元素类型的转换器。

### messageTransformer.transform()

- **session**: `Session`
- **elements**: `h[]`
- **model**: `string`
- **message**: `Message | undefined`
- **options**: `MessageTransformOptions | undefined`
- 返回值: `Promise<Message>`

把元素数组转换并合并到消息对象中。`message.content` 可以是字符串或多模态内容数组。

### messageTransformer.replace()

- **type**: `string`
- **transformer**: `MessageTransformFunction`
- 返回值: `() => void`

替换指定元素类型的转换器。`text` 类型不可替换。

### messageTransformer.has()

- **type**: `string`
- 返回值: `boolean`

判断某种元素类型是否有已注册转换器。
