# 配置构型

::: tip
`@chatluna/schema` 提供的 `Schema` 是插件 `Config` 的定义语言。写一次 Schema，就同时得到 TypeScript 类型、运行时校验和 WebUI 表单。
:::

## 基础类型

```ts
import { Schema } from '@chatluna/schema'

// 标量
const str = Schema.string()          // 字符串
const num = Schema.number()          // 数字
const nat = Schema.natural()         // 自然数（非负整数）
const bool = Schema.boolean()        // 布尔值
const literal = Schema.const('chat') // 字面量

// 复合
const arr = Schema.array(Schema.string())           // 数组
const dict = Schema.dict(Schema.number())           // 键值表（Record）
const union = Schema.union([Schema.string(), num])  // 联合类型（满足其一）
const intersect = Schema.intersect([Schema.object({ a: str }), Schema.object({ b: num })]) // 交叉类型（合并）
const obj = Schema.object({ key: Schema.string() }) // 对象
```

## 修饰器

用链式修饰器补充默认值、校验和界面描述：

```ts
import { Schema } from '@chatluna/schema'

export const Config = Schema.object({
  prefix: Schema.string()
    .default('!')              // 默认值
    .description('指令前缀')    // 表单中的标签与说明
    .pattern(/^[^0-9]/),       // 正则校验

  token: Schema.string()
    .required()                // 必填
    .role('secret'),           // 敏感字段

  timeout: Schema.natural()
    .default(3000)
    .role('ms'),               // 毫秒输入

  prompt: Schema.string()
    .role('textarea'),         // 多行文本
})
```

`.role()` 决定字段的控件和存储语义：

- `role('secret')`：密码输入框，持久化时不以明文暴露。
- `role('ms')`：毫秒时长输入控件。
- `role('textarea')`：多行文本输入框。

::: warning
API Key、访问令牌等凭据字段必须声明 `.role('secret')`，否则会作为普通文本展示和存储。
:::

## 分组与折叠

配置项较多时，用嵌套的 `Schema.object` 分组；不需要默认展开的分组加 `.collapse()`：

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
    .collapse()
    .description('身份认证'),
})
```

## 动态结构

配置结构需要随某些字段的取值变化时，可以使用 `computed` 与 `union` 等进阶用法。大多数插件用静态的 `Schema.object({...})` 就够了。

## 单一事实源

Schema 是插件配置的唯一来源，框架据此：

- 校验传入 `apply` 的 `config`。
- 在 WebUI 中生成表单。
- 把 `.description()` 显示为表单说明。
- 对 `.role('secret')` 字段启用遮蔽与保护。

## 下一步

- [配置文件](../develop/config) — 在插件项目中引用和应用配置。
- [工具开发](../extend/tools) — 用 Schema 声明工具参数。
