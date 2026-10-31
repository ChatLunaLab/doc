# 扩展路由命名空间

::: tip
插件想要「按群」「按用户」「按条件」可配置，不需要自己写一套设置存储。注册一个路由命名空间，剩下的继承、覆盖、优先级、界面都由路由系统负责。
:::

场景规则页里的每一个标签，背后都是一个命名空间。

工具策略、记忆、渲染、权限、子代理都是这么接进来的——你的插件也可以用同样的方式。

<!-- 开发指南，可以使用代码 -->

## 一个命名空间包含什么

- **名字**：读取时用的键。
- **结构**：一组字段与默认值。
- **界面位置**：出现在场景规则的哪个标签下。
- **生效方式**：告诉界面「这些值大概什么时候生效」。

## 注册

```ts
import { Schema } from '@chatluna/schema'
import type {} from '@chatluna/ui-schema-registry'

export const name = 'my-plugin-routing'
export const inject = ['schemas']

export function apply(ctx: Context) {
  ctx.schemas.section({
    surface: 'routing',
    key: 'myFeature',
    id: 'my-feature',
    title: '我的功能',
    tab: 'rules.capabilities',
    order: 60,
    schema: Schema.object({
      enabled: Schema.boolean().default(true).label('启用'),
      level: Schema.union(['low', 'high'] as const).default('low').label('强度'),
    }),
    applies: 'live',
    plugin: 'my-plugin',
  })
}
```

注册会被自动清理：插件卸载，标签消失。

### 字段说明

| 字段 | 含义 |
| --- | --- |
| `surface` | 固定为 `routing`（路由规则页）或 `settings`（快捷设置页） |
| `key` | 命名空间名，读取时用 |
| `id` | 唯一 id，用于界面折叠状态 |
| `title` | 标签标题 |
| `tab` | 挂在哪个大标签下 |
| `order` | 排序 |
| `schema` | 字段结构 |
| `applies` | `live` 或 `session`，给界面提示 |
| `plugin` | 来源标识 |

## 读取值

在真正执行的地方，通过 `valuesAt` 取合并后的结果：

```ts
const routing = ctx.get('routing')
const values = routing?.valuesAt(subjectOf(agent), 'myFeature')

const enabled = values?.['enabled'] ?? true
const level = values?.['level'] ?? 'low'
```

`valuesAt` 会自动完成继承与覆盖：先取全局，再按更具体的目标逐层合并。

::: warning
不要自己读配置文件或数据库。

自己解析规则会绕过优先级、锁、缓存和诊断，最终行为会和界面展示不一致。
:::

## subject 从哪来

大部分情况下，用现成的转换函数：

- 从会话或 Agent 推导出 subject。
- 需要指定路由时，把 `route` 一并带上。

如果你有自定义的身份维度，可以在 subject 上扩展字段，但要确保规则匹配逻辑认识它。

## 默认值写在两处

- **Schema 的 `.default()`**：界面展示与提交校验。
- **读取时的 `?? fallback`**：运行时兜底。

两处要一致。只写一处会出现「界面显示开启、运行时当成关闭」这种问题。

## 处理器与子字段

如果你的命名空间需要按目标动态计算，可以注册处理器：

```ts
ctx.routing.predicate('my-plugin:enabled', {
  evaluate: (_args, input) => input.subject?.guild === '...',
})
```

谓词返回 `true` 时，包含它的规则才会匹配当前会话。

谓词要快、要纯：它会在匹配过程中被反复调用。

## 缓存

路由结果会按 subject 缓存。

只有当规则里包含「内容相关」的谓词（例如需要读消息文本）时，才会跳过缓存。

如果你的取值依赖于消息内容，注册谓词时把它标记为内容相关，否则会读到过期的缓存。

## 优化界面

- 字段的 `description` 会显示为帮助文本，写清楚「什么时候该改」。
- 用 `role('ms')`、`role('slider')`、`role('element')` 这类角色让界面使用合适的控件。
- 相关字段放在同一个子对象里，界面会分组显示。

## 测试

- 注册两个命名空间，确认互不干扰。
- 建一条全局规则、一条群规则，确认群规则覆盖全局。
- 在群规则里只覆盖一个字段，确认其他字段仍沿用全局。
- 卸载插件，确认标签消失、读取返回 `undefined`。

## 常见问题

**标签不出现。**
检查 `inject` 是否包含 `schemas`，`surface` 是否是 `routing`，`tab` 是否是已存在的标签 id。

**读不到值。**
检查 `key` 与注册时是否一致；检查 subject 是否为空——空 subject 只能匹配全局规则。

**值没有按预期覆盖。**
检查规则目标是否更具体；检查是否有锁阻止了覆盖；用诊断接口看最终来源。

**改了规则没生效。**
值在什么时候被读取，决定了什么时候生效。缓存型字段需要等下一次读取，引擎型字段需要新会话。
