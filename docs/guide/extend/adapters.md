# 编写适配器

::: tip
适配器负责把一个聊天平台接进统一协议。大多数情况直接用现成的 Satori 适配器，只有平台没有现成实现时才需要自己写。
:::

自己写适配器之前，先确认两件事：

- 平台有没有官方的 Satori 适配器包。
- 有没有 Koishi 插件可以直接复用。

两者都没有，才值得动手。

<!-- 开发指南，可以使用代码 -->

## 适配器是什么

一个适配器实现 `Bot` 的子类：

- 登录平台、维持连接。
- 接收事件、转换成统一会话。
- 把消息发回平台。

上层只依赖统一接口，不关心平台细节。

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

### 关键点

- **`static name`**：插件名。
- **`static inject`**：通常需要 `satori`。
- **`Config`**：对用户展示的配置结构，敏感字段用 `role('secret')`。
- **`online()`**：登录成功后调用，告诉系统可以开始投递。
- **发送方法**：返回消息 id 数组。

## 接收消息

平台事件到达后，构造统一会话并 `dispatch`：

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

会话之后会进入 ChatLuna 的处理链路：去重、判定、路由、引擎。

## 平台能力

在 Bot 上声明支持哪些能力，上层据此降级：

- 编辑消息。
- 撤回消息。
- 引用。
- 私聊。

声明了但没实现，比不声明更糟：上层会尝试使用，然后失败。

::: warning
能力声明要与实现一致。

伪造能力（例如声明支持编辑但实际是重新发送）会导致用户看到重复消息，也会让流式输出错乱。
:::

## 凭据

敏感配置用 `role('secret')` 声明，系统会加密保存并在界面上脱敏。

不要在适配器里自己读环境变量或配置文件——配置统一从插件 `Config` 进入。

## 安装与启用

适配器通过插件市场安装，通过控制台启用。

如果适配器依赖额外的原生模块，安装时可能失败；在配置里给出清晰的错误提示，比静默失败好得多。

## 测试

- 用一个测试群验证收消息、发消息。
- 验证引用、图片、表情的转换。
- 验证断线重连。
- 验证凭据缺失时拒绝启用，而不是启动后崩溃。

## 常见问题

**消息重复。**
平台重推事件，或者适配器重复 dispatch。检查去重与事件订阅。

**发送失败。**
能力声明不匹配、频道 id 错误、令牌过期。看投递失败日志。

**用户显示为未知。**
会话里的 user 信息不完整。补上 id 与昵称。

**消息格式错乱。**
元素转换不完整。检查哪些元素被降级、哪些被忽略。
