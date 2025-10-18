# 消息读取

ChatLuna 是在 Koishi 下的插件。Koishi 作为一个聊天机器人框架，自身也有一套消息元素的机制。

为了让 LLM 能够正确理解各种消息元素（如@提及、表情、图片等），ChatLuna 提供了一个消息转换机制，将这些元素转换为文本形式。

## 用法

在 `messageTransformer` 中添加消息转换器即可：

```typescript
const dispose = ctx.chatluna.messageTransformer.intercept(
    'at',
    async (session, element, message) => {
        const name = element.attrs['name']
        const id = element.attrs['id']

        if (name && id !== session.bot.selfId) {
            message.content += `[at:${name}:${id}]`
        }
    }
)   

ctx.effect(() => dispose)
```

在大部分情况下，将消息元素转换为文本，添加到 `message.content` 中即可。

## API 参考

`intercept` 方法接收两个参数:

- `type: string` - 消息元素的类型，支持的类型请参考 [Koishi 文档](https://koishi.chat/zh-CN/guide/basic/element.html#%E6%B3%A8%E5%86%8C%E5%85%A8%E5%B1%80%E7%BB%84%E4%BB%B6)。

- `handler: (session, element, message) => Promise<void>` - 处理函数，包含:
  - `session`: 当前的 [会话对象](https://koishi.chat/zh-CN/api/core/session.html)
  - `element`: 当前的 [消息元素对象](https://koishi.chat/zh-CN/api/message/elements.html)
  - `message`: 当前的 [ChatLuna 消息对象](../api-reference/middleware/message)

返回值 `() => void` 用于清理资源。

建议使用 `ctx.effect(() => dispose)` 确保资源被正确释放。
