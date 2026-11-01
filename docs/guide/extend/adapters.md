# 编写适配器

::: tip
适配器负责把聊天平台接入统一的通讯协议。在大多数情况下，我们直接使用现成的 Satori 适配器即可；只有当目标平台还没有现成实现时，才需要自己动手编写。
:::

在开始编写适配器之前，我们建议你先确认以下两件事：

- 平台是否已有官方或社区提供的 Satori 适配器包。
- 是否已有现成的 Koishi 插件可以直接复用。

如果这两者都没有满足需求，那么再自己动手实现也不迟。

<!-- 开发指南，可以使用代码 -->

## 适配器是什么

适配器的核心任务，就是继承并实现 `Bot` 子类。

简单来说，一个完整的适配器通常需要承担以下职责：

- 登录平台账号并维持连接状态。
- 接收平台事件，并将其转换为统一的会话对象。
- 将上层生成的回复消息发送回对应的平台。

通过这种抽象，上层的业务逻辑只依赖统一的标准接口，完全不需要关心底层各个平台的协议细节。

## 最小实现

我们先来看一个最简短的适配器实现示例：

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

上面的示例主要包含了这几个核心部分：

- **`static name`**：插件的唯一标识名称。
- **`static inject`**：声明插件的依赖服务，通常需要注入 `satori`。
- **`Config`**：向用户展示的配置模式结构，对于敏感信息可以使用 `role('secret')` 标记。
- **`online()`**：在机器人登录或连接成功后调用，通知系统当前账号已经就绪并可以开始投递消息。
- **发送方法**：实现 `sendMessage` 方法，负责发送消息并返回对应的消息 ID 数组。

## 接收消息

当来自平台的事件到达时，我们需要构造一个标准的会话对象，并通过 `dispatch` 将其分发出去：

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

调用 `dispatch` 之后，会话就会顺利进入 ChatLuna 的统一处理链路，依次完成去重、触发判定、消息路由以及引擎调度。

## 平台能力

每个平台的特性各不相同，因此我们需要在 `Bot` 上明确声明所支持的平台能力。

上层系统会依据你声明的能力自动进行功能降级，常见的平台能力包括：

- 编辑消息。
- 撤回消息。
- 消息引用。
- 私聊会话。

需要特别注意的是，声明了某项能力却没有实际实现，往往比不声明更糟糕：上层系统会误以为平台支持该功能并尝试调用，最终导致执行失败。

::: warning
平台能力声明必须与实际代码实现保持一致。

切勿伪造能力支持（例如假装支持消息编辑，实际却偷偷以撤回重发代替）。这种不规范的降级会导致用户在客户端看到重复甚至乱序的消息，还会直接破坏流式输出的渲染体验。
:::

## 凭据

平台凭据通常属于敏感信息，请务必在 `Config` 中使用 `role('secret')` 进行声明。

标记为 `role('secret')` 后，系统会自动对敏感字段加密存储，并在控制台界面中进行脱敏展示。同时，请不要在适配器内部私下读取环境变量或独立的本地配置文件——所有运行配置都应当统一由插件的 `Config` 注入。

## 安装与启用

适配器本质上也是标准的插件，用户可以直接通过插件市场安装，并在控制台中启用和配置。

如果你的适配器依赖了某些额外的原生模块，在部分环境安装时可能会遇到编译失败的问题。针对这类情况，在配置项校验或初始化阶段给出清晰的错误指引，要远比默默失败或直接崩溃来得友好得多。

## 测试

在正式发布适配器前，建议先准备一个专门的测试群组，并按照以下清单逐一验证功能：

- 验证基础的消息接收与发送功能是否正常。
- 验证引用消息、图片、富文本及表情等元素的转换是否完整。
- 验证网络中断后的自动断线重连机制。
- 验证关键凭据缺失时会主动提示并拒绝启用，而不是在启动阶段意外崩溃。

## 常见问题

**消息重复**
平台可能由于网络超时重新推送了相同事件，或者是适配器内部重复调用了 `dispatch`。建议仔细排查消息去重逻辑与事件监听的订阅机制。

**发送失败**
通常是由于能力声明与实际 API 不匹配、传入的频道 ID 无效或访问令牌过期所致。请通过控制台查看具体的投递失败日志以获取详细错误信息。

**用户显示为未知**
构建会话时的 `user` 字段信息不完整。检查事件解析过程，确保补齐了用户的唯一 ID 与昵称信息。

**消息格式错乱**
消息元素转换不够完整。建议检查各类型元素在转换过程中的分支处理，明确哪些元素需要降级展示、哪些元素被直接忽略。
