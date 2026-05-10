# 消息渲染器

消息渲染器负责把 ChatLuna `Message` 渲染为 Koishi 元素。

## 类：Renderer

```ts
export abstract class Renderer {
  constructor(protected readonly ctx: Context) {}

  abstract render(message: Message, options: RenderOptions): Promise<RenderMessage>

  abstract schema: Schema<string, string>
}
```

继承 `Renderer` 即可实现自定义输出模式。

## 接口：RenderOptions

```ts
export interface RenderOptions {
  voice?: {
    speakerId?: number
  }
  split?: boolean
  type: RenderType
  session?: Session
}
```

- `voice.speakerId`: 语音输出使用的发言人 ID。
- `split`: 是否分割消息。
- `type`: 渲染类型。
- `session`: 当前 Koishi 会话。

## 类型：RenderType

```ts
export type RenderType = 'raw' | 'voice' | 'text' | 'image' | 'mixed'
```

## 类：DefaultRenderer

`DefaultRenderer` 是渲染器聚合服务，可以通过 `ctx.chatluna.renderer` 获取。

### chatluna.renderer.render()

- **message**: `Message`
- **options**: `RenderOptions`
- 返回值: `Promise<RenderMessage[]>`

渲染 ChatLuna 消息。返回数组是因为 `additionalReplyMessages` 会被渲染为额外转发消息。

### chatluna.renderer.addRenderer()

- **type**: `string`
- **renderer**: `(ctx: Context, config: Config) => Renderer`
- 返回值: `() => void`

添加渲染器并刷新 `output-mode` Schema。

### chatluna.renderer.removeRenderer()

- **type**: `string`
- 返回值: `void`

删除渲染器并刷新 Schema。

### chatluna.renderer.getRenderer()

- **type**: `string`
- 返回值: `Renderer | undefined`

获取已注册渲染器。

### chatluna.renderer.updateSchema()

- 返回值: `void`

手动刷新 `output-mode` Schema。

### chatluna.renderer.rendererTypeList

- **类型**: `string[]`

当前已注册渲染器类型列表。
