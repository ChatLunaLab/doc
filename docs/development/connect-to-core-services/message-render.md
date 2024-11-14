# 消息渲染

LLM 的默认输出都是文本。但在 Koishi 中，可以发送多种类型的消息元素（图片，语音等）。

为了让用户能够自由的选择消息元素的渲染方式，ChatLuna 提供了一个消息渲染 API，将这些文本渲染为 Koishi 的消息元素。

## 注册插件

所有需要接入功能到 ChatLuna 的插件，都得新建 `ChatLunaPlugin` 实例，并注册到 `ChatLuna` 服务中。

```typescript
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'

export function apply(ctx: Context, config: Config) {
    const plugin = new ChatLunaPlugin(ctx, config, 'your-plugin-name', false)

    ctx.on('ready', async () => {
        // 在 ready 事件中注册到 ChatLuna 服务
        plugin.registerToService()

        // 继续...
    })
}

```

> [!NOTE]
> 如果你的插件不需要注册模型适配器，`ChatLunaPlugin` 的构造函数需要传入 `false` 作为第四个参数。
> 该参数默认为 `true`，表示插件需要注册模型适配器。

## 继承 Renderer 类

继承 `Renderer` 类，实现你自己的消息渲染逻辑。

```typescript
import {
    Message,
    Renderer,
    RenderMessage,
    RenderOptions
} from 'koishi-plugin-chatluna'
import { h, Schema } from 'koishi'

export class RawRenderer extends Renderer {
    async render(
        message: Message,
        options: RenderOptions
    ): Promise<RenderMessage> {
        return {
            element: h.text(message.content)
        }
    }

    schema = Schema.const('raw').i18n({
        'zh-CN': '原始输出',
        'en-US': 'Raw text'
    })
}

```

`render` 方法接收两个参数：

- `message`: 当前的 [ChatLuna 消息对象](../api-reference/middleware/message)
- `options`: 当前的 [渲染选项](../api-reference/middleware/message-renderer')

返回值 `RenderMessage` 包含一个 `element` 属性，用于指定渲染后的消息元素。

对于 `Renderer` 类，`schema` 属性是必须的，用于指定渲染器的名称。

## 注册 Renderer

在 `ready` 事件中，调用 `renderer` 服务的 `addRenderer` 方法注册消息渲染器。

```typescript
ctx.on('ready', async () => {
    // 在 ready 事件中注册到 ChatLuna 服务
    plugin.registerToService()

    ctx.effect(() =>
        ctx.chatluna.renderer.addRenderer('raw', (_) => {
            return new RawRenderer(ctx, config)
        })
    )
})
```
