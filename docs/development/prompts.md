# 扩展提示词

提示词服务 `ctx.prompt` 负责管理变量、块定义与纯渲染；Agent 负责将渲染结果与会话历史组装为模型请求。插件不应通过修改历史字符串、注入任意 system 消息或覆写 Agent messages 的方式实现提示词扩展。

---

## 核心概念：三个 Zone

渲染管线将提示词按生命周期和语义划分为三个区域（zone）：

| Zone | 请求中的位置 | 适合承载的内容 | 可变性约束 |
| --- | --- | --- | --- |
| `system` | 请求的稳定前缀；若包含 user/assistant 角色块，则作为历史消息前的 prelude | 身份设定、持久规则、稳定领域知识 | **仅允许不可变变量**（`mutable: false`） |
| `context` | 当前用户输入前的环境快照 | 当前时间、近期运行时状态、动态变化的事实 | 允许可变变量，但受变量自身 `zones` 声明限制 |
| `input` | 包装用户输入（每层一个包装器，且必须包含 `{prompt}` 占位符） | 针对输入的格式约束、少量与当前输入绑定的动态事实 | 允许可变变量，但受变量自身 `zones` 声明限制 |

### 可变性与安全边界

- 将当前时间等动态内容放入 `system` **不会**自动降级为静态原样文本，而是会抛出 `MutableVariableError`；调用 `check()` 可在渲染前诊断出 `variable.mutable` 问题。
- 该约束旨在减少稳定前缀的无谓变动，以利于模型服务端的提示词缓存，**并非提示注入防火墙**。
- `context` 中的内容同样会被模型完整读取，处理用户输入与外部引用文档时仍须建立明确的信任边界。

---

## 快速上手：注册变量与提示词块

以下示例演示如何在 Cordis 插件中声明配置项、注册一个不可变变量以及两个分别位于 `system` 与 `context` 的提示词块：

```ts
import { Context, Schema } from '@chatluna/utils/cordis'
import type {} from '@chatluna/prompt'

export interface Config {
  project: string
}

export const Config = Schema.object({
  project: Schema.string().default('Example project'),
})

export const name = 'chatluna-project-prompt'
export const inject = ['prompt']

export function apply(ctx: Context, config: Config) {
  // 1. 注册不可变变量：项目名称来自验证后的配置，生命周期内稳定
  ctx.prompt.variable({
    name: 'example_project',
    description: 'Configured project name.',
    mutable: false,
  }, () => config.project)

  // 2. 注册 system 块：使用模板语法引用变量
  ctx.prompt.block({
    id: 'example/project',
    zone: 'system',
    order: 20,
    content: 'You assist with {example_project}.',
    template: true,
  })

  // 3. 注册 context 块：接收 AssembleContext，提取动态时间
  ctx.prompt.block({
    id: 'example/request-context',
    zone: 'context',
    order: 20,
    content: ({ env }) => `Request time: ${new Date(env.now).toISOString()}`,
  })
}
```

### 编写细节说明

- **模板语法**：使用单层花括号 `{variable_name}`，不支持原生 JavaScript 表达式插值。
- **环境隔离**：`content` 函数接收 `AssembleContext`，其中的 `env` 仅代表当前请求的环境事实。插件不得修改 `env`，也不得将其保留到后续回合中使用。
- **生命周期绑定**：通过 `ctx.prompt` 注册的变量与块均自动绑定到当前插件上下文的 fiber。上下文卸载时会自动注销，无需手动维护全局表或监听注销事件。

---

## 声明变量：`variable()`

调用签名：`ctx.prompt.variable(declaration, provider)`

- `declaration`：定义变量契约。
- `provider`：提供运行时的变量取值。

### 声明配置项（Declaration）

| 字段 | 类型 / 形式 | 说明 |
| --- | --- | --- |
| `name` | `string` | 变量唯一标识。 |
| `description` | `string` | 变量语义描述。 |
| `mutable` | `boolean \| ((env: PromptEnvironment) => boolean)` | 是否可变。设为 `false` 的变量若在短时间内发生变化，系统将输出警告。禁止通过虚假声明将动态状态强行当作静态变量缓存。 |
| `zones` | `PromptZone[]` | 限制该变量允许生效的 zone。若在非声明 zone 内使用，将抛出 `VariableZoneError`。 |
| `args` | `readonly VariableArgument[]`（可选） | 每项包含 name、description?、optional?；声明后为函数形式变量。 |
| `example` | `string`（可选） | 展示示例。 |

### 变量提供者（Provider）

- 函数式变量提供者的签名接收 `{ env, args, zone }` 上下文对象。
- 变量返回值支持：文本、数值、布尔值、空值（`null`/`undefined`）或结构化数据，具体展示取决于引用该变量的模板契约。
- 对外部非可信输入必须按 `unknown` 验证，严禁使用类型断言跳过校验。

---

## 环境贡献与作用域

### 事实贡献：`environment()`

```ts
ctx.prompt.environment(contributor)
```

- 插件通过 `environment` 向管线提供所属平台、当前机器人、群组、发送者等上下文事实。
- 提示词服务使用 `environmentOf(base)` 将多方贡献合并为统一的运行时环境；变量的 `provider` 应直接读取合并后的 `env`，严禁跨插件读取其他模块的未验证配置。

### 作用域规则

- **全局范围**：在全局 `ctx` 上注册的变量与提示词块，对全局所有会话生效。
- **Agent 局部范围**：在特定 Agent 的子上下文 `ctx` 上注册时，仅在该 Agent 内部生效。
- **隔离性**：请求在组装提示词时，仅合并全局配置与当前 Agent 的局部配置，不会污染其他并行会话。
- 编写扩展辅助函数时，必须接收当前的 `ctx` 参数传递所有权，不得直接引用 `root` 上下文绕过作用域隔离。

---

## 检查与纯渲染 API

`ctx.prompt` 提供了从模板静态检查到整套渲染的完整 API：

### 辅助与单项检查 API

- `catalog()`：获取当前所有可用变量的目录，用于编辑器代码补全与描述说明。
- `sourceOf(id)`：根据块 ID 查询该块的注册来源与插件归属。
- `parse(source)`：解析一段模板字符串，提取其 AST 节点与变量依赖。
- `check(source, zone, env?)`：验证模板在指定 `zone` 下是否合法，检查引用的变量是否存在、区域是否匹配以及是否存在 `system` 引入可变变量的错误。
- `render(source, { zone, env })`：纯渲染单段模板字符串，异步返回 `{ text, diagnostics }`。

### 整套提示词渲染：`render(options)`

```ts
const result = await ctx.prompt.render()
```

需要自定义环境或附加块时，传入包含 `owner`、`env`、`blocks` 等可选字段的请求对象。

整套渲染调用返回的数据结构包含：
- `system`：渲染完成的系统提示词前缀。
- `prelude`：置于历史消息之前的角色块序列。
- `context` / `contexts`：渲染出的动态环境快照消息。
- `input`：用户输入包装器（类型为 `(raw: ChatMessage) => Promise<ChatMessage>` 的转换函数，**不是**已发送的用户消息本身）。
- `values`：各变量在当前上下文中的解析值字典。
- `sectionNames`：参与渲染的段落标识列表。
- `complete`：提示词完整性声明标识。

> **纯函数设计约束**：
> `render` 是纯计算接口，不调用 LLM API，也不修改会话历史。若排查问题时需要追溯“实际发往模型的原始请求”，应读取对应请求关联的 prompt mark 所重建的快照，严禁通过用当前模板重新执行 `render` 来冒充历史请求原文。

---

## 块排序、完整性声明与请求头机制

### 块排序机制

- 提示词块依赖 `order` 字段的数值进行显式排序；`id` 仅用于调试诊断、冲突识别与来源定位。
- 不同块之间的依赖或上下文位置必须通过明确的 `order` 声明，禁止依赖模块加载或字符串拼接的隐式执行顺序。

### `complete` 标记语义

- `complete` 用于向系统声明提示词的装配完整性。
- 设置 `complete: true` **不会**绕过安全过滤规则、其他必要插件扩展或工具权限校验。切勿为了强行覆盖某个基础预设而滥用此标记，应遵循对应渲染引擎与块的组合规则。

### 请求头与缓存分段

- **稳定请求头**：不变的 `system` 前缀、工具 Function Schema 及静态参数被归入请求头，利于服务侧命中 Prefix Cache。
- **动态输入流**：可变的 `context` 与经过 `input` 包装的用户消息按时序进入消息体。
- **缓存失效边界**：修改预设文本、切换模型或改动工具声明会在所属系统边界触发新的提示词 epoch。模型的 provider generation 与提示词的 prompt epoch 属于两个维度的生命周期，不能混用单一版本号来统管所有层级的缓存失效。

---

## 预设与角色边界

在扩展系统提示词之前，请根据以下场景区分“使用预设”与“开发插件”：

### 预设文件（Presets）

- 适用于仅调整人设、提示语或固定静态规则的场景，优先编写托管预设源文件（Markdown 格式）。
- 支持 section 指令以及独立成行的 `@include ./partial.md` 引用语法。**禁止**将包含指令写成 HTML 注释格式（如 `<!-- @include ... -->`）。

### 角色（Personas）

- 角色不仅包含提示词，还承载结构化状态机与完整的运行生命周期：`prepare` $\to$ `generate` $\to$ `deliver` $\to$ `settle`。
- 切勿直接将前端界面的临时状态表全量拼接入永久 `system` 块中。
- 仅当需要向整个执行流引入**全新环境事实**或**可复用模板能力**时，才使用插件注册新的 `ctx.prompt.variable` 与块。详细机制见[预设与角色](/guide/presets)。

---

## 测试与排错指南

### 测试要点

编写自动化测试时，建议覆盖以下测试维度：
1. **变量计算**：针对不同入参，测试提供者函数返回的值是否符合预期。
2. **Zone 校验**：断言变量在非法 zone 中引用时正确抛出 `VariableZoneError`。
3. **可变性校验**：断言在 `system` 中使用 `mutable: true` 变量时正确抛出 `MutableVariableError`。
4. **顺序排序**：断言不同 `order` 的多个块是否按照预期的正序组装。
5. **输入包装**：断言返回的 `input` 包装器能否正确包裹 `{prompt}` 并产出预期的 `ChatMessage`。
6. **生命周期与隔离**：验证插件卸载后块是否被移除、子上下文作用域是否串染、配置项热更新后是否正确重算或重新挂载。避免只断言最终文本中“是否包含某子字符串”。

### 排错路径

- **模板正确但历史发出的请求不符**：
  检查该会话发生时的具体 `revision`、`epoch` 以及已提交的上下文记录（entries），而非以当前代码重新 `render` 的结果为准。
- **动态信息未随请求刷新**：
  优先排查该项是否通过 `ctx.prompt.environment` 正确提供事实，以及该信息是否放置在 `context` zone 中。严禁为了“立即生效”而违规将可变信息直接转移到 `system` zone。
- **提示词过长或缓存命中率低**：
  参考[上下文与缓存](/architecture/context-cache)了解会话截断、压缩及缓存复用机制。
