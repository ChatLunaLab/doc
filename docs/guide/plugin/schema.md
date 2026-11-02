# 配置构型

::: tip
Cordis 模式 (Schema) 是插件 `Config` 的类型定义语言。它既负责运行时的配置项校验，也直接驱动 WebUI 表单界面的渲染。
:::

开发插件时，为用户提供清晰的配置项非常重要。在 ChatLuna 中，你需要使用 `@chatluna/schema` 提供的 `Schema` 对象来声明插件的配置规范。

编写 Schema 可以带来多重好处：它不仅在编写代码时提供 TypeScript 类型推导，还会在控制台中自动生成表单界面，并在运行时校验用户的输入。

## 声明基础类型

你可以通过 `Schema` 提供的一系列构造方法，直接声明字段的基础数据类型：

```ts
import { Schema } from '@chatluna/schema'

// 基础标量类型
const str = Schema.string()          // 字符串
const num = Schema.number()          // 数字
const nat = Schema.natural()         // 自然数（非负整数）
const bool = Schema.boolean()        // 布尔值
const literal = Schema.const('chat') // 字面量

// 复合与结构类型
const arr = Schema.array(Schema.string())           // 数组
const dict = Schema.dict(Schema.number())           // 键值表（Record）
const union = Schema.union([Schema.string(), num])  // 联合类型（满足其一）
const intersect = Schema.intersect([Schema.object({ a: str }), Schema.object({ b: num })]) // 交叉类型（合并）
const obj = Schema.object({ key: Schema.string() }) // 对象
```

除了常见的标量类型外，`Schema` 还支持声明数组、字典，以及由多个结构拼合而成的联合与交叉类型。你可以借助这些基础类型组合出更复杂的配置结构。

## 使用修饰器补充约束与元数据

只定义类型往往不够，通常还需要为配置项指定默认值、校验规则和界面描述。

`Schema` 提供了链式调用的修饰器方法，便于为字段补充各种约束与元数据：

```ts
import { Schema } from '@chatluna/schema'

export const Config = Schema.object({
  prefix: Schema.string()
    .default('!')              // 设置配置项的默认值
    .description('指令前缀')    // 对应 WebUI 表单中的项标签与提示说明
    .pattern(/^[^0-9]/),       // 正则校验

  token: Schema.string()
    .required()                // 必填项，未设置时校验失败
    .role('secret'),           // 声明为敏感字段

  timeout: Schema.natural()
    .default(3000)
    .role('ms'),               // 声明为毫秒单位输入

  prompt: Schema.string()
    .role('textarea'),         // 渲染为多行文本输入框
})
```

在上面的示例中，我们为字段添加了 `.default()`、`.description()` 以及 `.required()` 等修饰器。用户在控制台中修改配置时，这些约束会自动生效，防止出现无效或缺失的输入。

### 控件角色 (`role`)

`.role()` 修饰器用于控制字段在 WebUI 上的渲染形态与存储语义。常见的取值如下：

- `role('secret')`：在表单中展示为密码输入框，并在持久化存储时避免以明文直接暴露。
- `role('ms')`：在表单中展示为时间单位（毫秒）输入控件。
- `role('textarea')`：在表单中展示为多行文本输入框。

::: warning
包含 API Key、访问令牌等敏感凭据的字段，请务必显式声明 `.role('secret')`。若遗漏该声明，字段内容将作为普通文本展示与存储。
:::

## 组织嵌套与折叠配置

当插件功能较多、配置项随之增加时，将所有配置平铺在同一层级不易于阅读。

此时，你可以通过嵌套 `Schema.object` 对配置项进行分组。若某些配置组不需要默认展开，只需在对象末尾链式调用 `.collapse()`，即可在 WebUI 表单中将其收拢为可折叠的分组：

```ts
import { Schema } from '@chatluna/schema'

export const Config = Schema.object({
  server: Schema.object({
    host: Schema.string().default('127.0.0.1').description('服务器监听地址'),
    port: Schema.natural().default(8080).description('监听端口'),
  }).description('服务地址'),

  auth: Schema.object({
    token: Schema.string().role('secret').description('身份验证令牌'),
  })
    .collapse() // 在 WebUI 表单中折叠为独立的分组，保持界面整洁
    .description('身份认证'),
})
```

## 动态构型与复杂结构

除了静态的配置声明外，`Schema` 还支持 `computed` 与 `union` 等进阶用法。

当配置结构需要依据某些字段的取值动态改变时，可以使用函数式或联合构型来动态定义表单结构。对于绝大多数常规插件而言，使用静态的 `Schema.object({...})` 就已足够。

## 理解单一事实源机制

在 Cordis 架构中，Schema 扮演着插件配置「单一事实源 (Single Source of Truth)」的角色。你只需编写一次 Schema，框架就会自动处理好以下配套逻辑：

- **参数校验**：根据 Schema 定义自动校验传入插件实例的 `config` 参数。
- **表单驱动**：根据 Schema 结构自动在 WebUI 中生成对应的交互式表单界面。
- **文本提示**：将 `.description()` 定义的说明文本同步展示在表单提示与说明文档中。
- **安全保护**：通过 `.role('secret')` 指示系统对敏感配置启用遮蔽与保护机制。

## 下一步

掌握了 Schema 的声明方式后，你可以继续了解配置的读取与使用：

- [配置文件](../develop/config) — 查看如何在插件项目中引用并应用配置
- [工具开发](../extend/tools) — 了解如何使用 Schema 声明工具的输入参数结构
