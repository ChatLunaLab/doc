# 消息转换器

## 类型: MessageTransformFunction

```typescript
export type MessageTransformFunction = (
    session: Session,
    element: h,
    message: Message,
    model?: string
) => Promise<boolean | void>
```

具体的消息转换器函数。

- **session**: [`Session`](https://koishi.chat/zh-CN/api/session.html) 会话对象
- **element**: [`h`](https://koishi.chat/zh-CN/api/context.html#h) Koishi 元素
- **message**: [`Message`](./message.md#接口message) 消息对象
- **model**: `string | undefined` 当前使用的模型名称

返回值为 `false` 则会让消息继续传递转换。

## 类: MessageTransformer

`MessageTransformer` 类实现了消息转换器的聚合。

可以通过 `ctx.chatluna.messageTransformer` 访问到该类的实例。

### messageTransformer.intercept()

- **type**: `string` 转换器指定的元素类型
- **transformer**: [`MessageTransformFunction`](#类型-messagetransformfunction) 消息转换器函数
- **priority**: `number` 优先级，数值越小越先执行，默认 `0`

添加一个消息转换器，并按照优先级顺序执行。返回值为注销该转换器的卸载函数。

### messageTransformer.transform()

- **session**: [`Session`](https://koishi.chat/zh-CN/api/session.html) 会话对象
- **elements**: [`h[]`](https://koishi.chat/zh-CN/api/context.html#h) Koishi 元素
- **model**: `string` 当前使用的模型名称
- **message**: [`Message`](./message.md#接口message) 消息对象，可选，默认将使用会话信息初始化
- **options**: `{ quote?: boolean; includeQuoteReply?: boolean }` 额外配置

将 Koishi 元素转换并合并进给定的 `Message` 对象中，返回转换后的消息。

> [!TIP]
> 当前支持的 `options` 字段包括：
>
> - `quote`: `boolean` 是否处于引用处理阶段。
> - `includeQuoteReply`: `boolean` 处理非引用消息时是否合并引用消息内容。

### messageTransformer.replace()

- **type**: `string` 转换器指定的元素类型
- **transformer**: [`MessageTransformFunction`](#类型-messagetransformfunction) 新的转换器函数

替换指定类型的转换器，实现热替换。返回值为注销替换后转换器的卸载函数。`type === 'text'` 时不允许调用。

### messageTransformer.has()

- **type**: `string` 转换器指定的元素类型

判断是否已注册对应类型的转换器，返回 `boolean`。
