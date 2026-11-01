# 提示词分区

::: tip
本节介绍如何通过 `ctx.prompt` 接口使用分区块 (Block) 组装提示词，以及变量插值规则和作用域限制。
:::

在与大语言模型交互时，提示词往往由多个不同职责的部分拼装而成。在 ChatLuna 中，提示词被拆分为若干相互独立的分区 (Zone) 并分块渲染。渲染系统最终会按顺序输出 `system`、`context` 以及 `input(message)` 三段内容供模型消费。

## 认识提示词分区

为了让不同插件注入的提示词井井有条，ChatLuna 将提示词按以下三个区进行组装：

- `system`：系统提示区，通常用于注入固定的全局人设与系统指令。
- `context`：上下文区，通常用于补充对话背景、动态状态或外部检索信息。
- `input`：用户输入区，承载用户的当前提问及直接输入。

在最终向模型发起请求前，渲染系统会严格按此结构拼接所有区块。

## 注册提示词区块

你可以通过 `ctx.prompt.block` 向指定的分区注册一个内容区块 (Block)。同一分区内的区块通过 `order` 字段决定执行顺序（数值越小排序越靠前）。

让我们先看一个注册静态人设区块的基础示例：

```ts
// 注册一个人设提示词区块
ctx.prompt.block({
  id: 'my-plugin.persona',
  zone: 'system',
  role: 'system',
  order: 0,
  content: '你是一个严谨的助手。',
})
```

上面的配置包含了以下字段：

- `id`：区块的唯一标识符。
- `zone`：目标分区，可选 `'system'`、`'context'` 或 `'input'`。
- `role`：提示词角色标识。
- `order`：在同区内的排序权重。
- `content`：区块的文本内容。如果包含变量，可使用 `template` 配合 `{name}` 语法实现插值。

## 注册与使用变量

静态文本往往无法满足复杂的交互需求。你可以通过 `ctx.prompt.variable(decl, provider)` 注册动态变量，并在区块模板中使用 `{name}` 语法进行插值替换。

变量提供者函数接收当前的渲染环境 `env` 并返回具体值：

```ts
// 注册一个不可变变量 username，仅允许在 context 分区使用
ctx.prompt.variable(
  {
    name: 'username',
    mutable: false,
    zones: ['context']
  },
  (env) => env.user?.name ?? '用户'
)
```

细心的小伙伴可能会发现，我们在声明变量时指定了 `zones` 与 `mutable`。为了保证提示词渲染的可控性与缓存效率，ChatLuna 施加了以下限制：

::: warning
- **可变变量禁止用于系统区**：若将 `mutable: true` 的可变变量注入到 `system` 分区，系统将在运行时抛出 `MutableVariableError`。包含动态变化的数据请放置在 `context` 或 `input` 分区。
- **分区越界限制**：若在区块模板中引用了未在其 `zones` 列表中声明的变量，系统将抛出 `VariableZoneError`。
:::

## 注入渲染环境

变量提供者函数需要依赖环境上下文取值。那么 `env` 中的数据又是从何而来的呢？你可以使用 `ctx.prompt.environment(contributor)` 往渲染环境中注入全局或会话级字段：

```ts
ctx.prompt.environment((env) => {
  // 向 env 注入自定义字段，供 variable provider 读取
  env.customField = 'value'
})
```

完成注入后，变量提供者函数在执行时即可直接从 `env` 获取对应的值并完成模板插值。

## 下一步

- [工具开发](./tools)
- [角色与预设](/manual/usage/characters)
