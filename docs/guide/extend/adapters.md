# 编写适配器

::: tip
适配器把聊天平台接入统一的通讯协议。大多数时候直接用现成的 Satori 适配器即可；只有平台既没有 Satori 适配器、也没有可复用的 Koishi 插件时，才需要自己写。
:::

<!-- 开发指南，可以使用代码 -->

适配器的核心是实现一个 `Bot` 子类，负责登录并保持连接、把平台事件转换为统一的会话对象、把回复发回平台。上层逻辑只依赖统一接口，不关心各平台的协议细节。

## 最小实现

```ts
import { Bot, type Element } from '@satorijs/core'

export class MyBot extends Bot<Context, { selfId?: string }> {
  static override readonly name = 'my-adapter'
  static override readonly inject = ['satori']

  static readonly Config = Schema.object({
    selfId: Schema.string().default('my-bot').label('机器人账号'),
    token: Schema.string().role('secret').label('访问令牌'),
  })

  constructor(ctx: Context, config: { selfId?: string; token?: string }) {
    super(ctx, config, 'my-platform')
    this.user = { id: config.selfId ?? 'my-bot', name: 'ChatLuna' }
    this.online()
  }

  override async sendMessage(
    channelId: string,
    content: Element[],
  ): Promise<string[]> {
    const id = await this.api.send(channelId, content)
    return [id]
  }
}
```

- **`static name`**：插件名。
- **`static inject`**：依赖的服务，通常是 `satori`。
- **`Config`**：配置结构，敏感字段用 `role('secret')` 标记。
- **`online()`**：登录或连接成功后调用，通知系统账号已就绪。
- **`sendMessage`**：发送消息并返回消息 ID 数组。

## 接收消息

平台事件到达时，构造会话并 `dispatch`：

```ts
const session = this.session({
  type: 'message',
  channel: { id, type: 0 },
  user: { id: userId, name },
  message: { id: messageId, elements },
})
session.content = text
this.dispatch(session)
```

之后会话进入 ChatLuna 的处理链路：去重、回复判定、路由和引擎调度。

## 平台能力

在 `Bot` 上声明平台支持的能力（编辑、撤回、引用、私聊等），上层会据此自动降级。

::: warning
能力声明必须与实现一致。声明了却没实现，比不声明更糟：上层会尝试调用并失败。也不要伪造能力，例如用撤回重发冒充编辑，这会让用户看到重复或乱序的消息，并破坏流式输出。
:::

## 凭据

平台凭据在 `Config` 中用 `role('secret')` 声明，系统会加密存储并在界面中脱敏显示。不要在适配器中私自读取环境变量或本地配置文件，所有配置都应通过 `Config` 注入。

## 安装与启用

适配器也是普通插件，用户通过插件市场安装、在插件配置页启用。依赖原生模块时，部分环境可能编译失败，在配置校验或初始化阶段给出清晰的提示，比直接崩溃友好得多。

## 测试

准备一个测试群，逐项验证：

- 基础的收发消息。
- 引用、图片、富文本和表情的转换。
- 断网后的自动重连。
- 缺少关键凭据时提示并拒绝启用，而不是启动时崩溃。

## 常见问题

**消息重复**：平台超时重推了同一事件，或适配器重复调用了 `dispatch`，检查去重逻辑和事件订阅。

**发送失败**：能力声明与实际 API 不符、频道 ID 无效或令牌过期，在控制台查看发送失败日志。

**用户显示为未知**：构造会话时 `user` 信息不全，补齐用户 ID 和昵称。

**消息格式错乱**：元素转换不完整，检查各类元素的转换分支，明确哪些降级显示、哪些忽略。
