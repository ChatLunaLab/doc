# 消息转换器

## 类型: MessageTransformFunction

```typescript
export type MessageTransformFunction = (
    session: Session,
    element: h,
    message: Message
) => Promise<boolean | void>
```

具体的消息转换器函数。

- **session**: [`Session`](https://koishi.chat/zh-CN/api/session.html) 会话对象
- **element**: [`h`](https://koishi.chat/zh-CN/api/context.html#h) Koishi 元素
- **message**: [`Message`](./message.md#接口message) 消息对象

返回值为 `false` 则会让消息继续传递转换。

## 类: MessageTransformer

`MessageTransformer` 类实现了消息转换器的聚合。

可以通过 `ctx.chatluna.messageTransformer` 访问到该类的实例。

### messageTransformer.intercept()

- **type**: `string` 转换器指定的元素类型
- **transformer**: [`MessageTransformFunction`](#类型-messagetransformfunction) 消息转换器函数

添加一个消息转换器。

### messageTransformer.transform()

- **session**: [`Session`](https://koishi.chat/zh-CN/api/session.html) 会话对象
- **elements**: [`h[]`](https://koishi.chat/zh-CN/api/context.html#h) Koishi 元素
- **message**: [`Message`](./message.md#接口message) 消息对象

将 Koishi 元素添加进给定的 `Message` 对象中。
