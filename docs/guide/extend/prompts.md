# 提示词分区

::: tip
本节介绍如何通过 `ctx.prompt` 接口使用区块 (Block) 组装提示词，以及变量插值规则和作用域限制。
:::

在与大语言模型交互时，提示词通常由不同职责的多个部分组合而成。ChatLuna 将提示词拆分为若干相互独立的分区 (Zone) 并分块渲染，最终按顺序输出 `system`、`context` 以及 `input(message)` 三段内容供模型使用。

## 认识提示词分区

为了让不同插件注入的提示词保持有序，ChatLuna 将提示词划分为三个分区：

- `system`：系统提示区，通常用于注入固定的全局人设与系统指令。
- `context`：上下文区，通常用于补充对话背景、动态状态或外部检索信息。
- `input`：用户输入区，承载用户的当前提问与直接输入。

向模型发起请求前，渲染系统会按此结构依次拼接所有区块。

## 注册提示词区块

你可以通过 `ctx.prompt.block` 向指定分区注册内容区块 (Block)。同一分区内的区块通过 `order` 字段决定排列顺序，数值越小越靠前。

下面是一个注册静态人设区块的基础示例：

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

上述配置包含以下字段：

- `id`：区块的唯一标识符。
- `zone`：目标分区，可选 `'system'`、`'context'` 或 `'input'`。
- `role`：提示词的角色标识。
- `order`：同分区内的排序权重。
- `content`：区块的文本内容。如果包含变量，可以使用 `template` 配合 `{name}` 语法进行插值。

## 注册与使用变量

静态文本往往无法满足复杂的交互需求。你可以通过 `ctx.prompt.variable(decl, provider)` 注册动态变量，并在区块模板中使用 `{name}` 语法进行插值。

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

声明变量时可以指定 `zones` 与 `mutable`。为了保证提示词渲染的可控性与缓存效率，ChatLuna 做了以下限制：

::: warning
- **可变变量禁止用于系统区**：若将 `mutable: true` 的可变变量注入到 `system` 分区，系统会在运行时抛出 `MutableVariableError`。包含动态变化的数据请放入 `context` 或 `input` 分区。
- **分区越界限制**：若在区块模板中引用了未在其 `zones` 列表中声明的变量，系统会抛出 `VariableZoneError`。
:::

## 注入渲染环境

变量提供者函数依赖环境上下文取值。如果你需要向 `env` 中提供数据，可以使用 `ctx.prompt.environment(contributor)` 注入全局或会话级字段：

```ts
ctx.prompt.environment(() => ({
  // 返回一个补丁对象，其中的字段会合并进渲染环境，供 variable provider 读取
  customField: 'value'
}))
```

各贡献者返回的补丁对象会按注册顺序依次合并到环境中；单个贡献者执行失败时仅会记录警告，不会中断环境构建。注入完成后，变量提供者函数在执行时即可直接从 `env` 中获取对应字段并完成模板插值。

## 下一步

- [工具开发](./tools)
- [角色与预设](/manual/usage/characters)
