# ChatLuna 消息

ChatLuna 提供了在消息处理过程中的几个消息类型声明。用于在消息转换器或消息渲染器中使用。

## 接口：Message

```typescript
export interface Message {
    content: string
    conversationId?: string
    name?: string
    additional_kwargs?: Record<string, any>
    /**
     * @deprecated
     */
    additionalReplyMessages?: Message[]
}

```

### content

- **类型**: `string`

消息内容。

### conversationId

- **类型**: `string | undefined`

消息所属的对话 ID。

### name

- **类型**: `string | undefined`

消息的发送者名称。

### additional_kwargs

- **类型**: `Record<string, any> | undefined`

附加消息参数。

### additionalReplyMessages

- **类型**: `Message[] | undefined`

附加消息回复。

> [!WARNING]
> 该属性已弃用，即将被删除。

## 接口：RenderMessage

```typescript
export interface RenderMessage {
    element: h | h[]
}
```

### element

- **类型**: `h | h[]`

消息渲染后的 [Koishi 元素](https://koishi.chat/zh-CN/api/message/elements.html)。
