# 配置构型

::: tip
Cordis 模式（Schema）是插件 `Config` 的类型定义语言。它既负责运行时的配置项校验，也直接驱动 WebUI 表单界面的渲染。
:::

在 ChatLuna 插件开发中，你需要使用 `@chatluna/schema` 提供的 `Schema` 对象来声明插件的配置规范。编写良好的 Schema 能够同时提供类型推导、表单组件呈现和输入校验支持。

## 声明基础类型

你可以通过 `Schema` 的基础构造方法声明字段的底层数据类型：

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

## 使用修饰器补充约束与元数据

声明字段类型后，你可以链式调用修饰器方法，为字段指定默认值、校验规则和表单说明：

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

### 控件角色 (`role`)

`.role()` 修饰器用于控制字段在 WebUI 上的渲染形态与存储语义：

- `role('secret')`：表单展示为密码输入框，并在持久化落盘时避免以明文直接暴露。
- `role('ms')`：表单展示为时间单位（毫秒）输入控件。
- `role('textarea')`：表单展示为多行文本输入区域。

::: warning
包含 API Key、访问令牌等敏感凭据的字段，务必显式声明 `.role('secret')`。若遗漏该声明，字段内容将作为普通文本展示与存储。
:::

## 组织嵌套与折叠配置

当配置项较多时，可以通过嵌套 `Schema.object` 分组组织配置结构。通过在对象末尾链式调用 `.collapse()`，可以将其在表单中收拢为可折叠块：

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

`Schema` 支持 `computed` 与 `union` 等进阶形态。当插件配置的结构需要依据某些字段的取值动态改变时，可以使用函数式或联合构型来动态定义表单结构。

绝大多数常规插件使用静态的 `Schema.object({...})` 即可满足需求。

## 理解单一事实源机制

在 Cordis 架构中，Schema 是插件配置的单一事实源（Single Source of Truth）：

1. **清单校验**：框架根据 Schema 定义自动校验插件实例的 `config` 传入参数。
2. **表单驱动**：WebUI 根据 Schema 的结构自动生成对应的交互式输入界面。
3. **文本提示**：`.description()` 定义的说明文本会同步输出到表单项提示与文档说明中。
4. **安全保护**：`.role('secret')` 指示系统对敏感配置启用遮蔽与保护机制。

## 下一步

- [配置文件](../develop/config) — 查看如何在插件项目中引用并应用配置
- [工具开发](../extend/tools) — 了解如何使用 Schema 声明工具的输入参数结构
