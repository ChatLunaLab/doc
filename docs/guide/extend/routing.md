# 扩展路由命名空间

::: tip
插件需要「按群」「按用户」或按条件差异化配置时，不必自己实现配置存储。注册一个路由命名空间，继承、覆盖、优先级和界面渲染都由路由系统处理。工具策略、记忆、渲染、权限和子代理都是这样接入场景规则的。
:::

<!-- 开发指南，可以使用代码 -->

场景规则页面中的每个配置标签都对应一个命名空间，它包含：

- **名字**：读取配置时使用的键。
- **结构**：字段类型与默认值。
- **界面位置**：显示在哪个大标签下。
- **生效方式**：告诉界面修改后大约何时生效。

## 注册

在 `inject` 中声明 `schemas`，然后调用 `ctx.schemas.section()`：

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

插件卸载时，对应的标签会自动移除。

| 字段 | 含义 |
| --- | --- |
| `surface` | `routing`（场景规则页）或 `settings`（快捷设置页） |
| `key` | 命名空间名称，读取配置时使用 |
| `id` | 唯一 ID，用于记录界面折叠状态 |
| `title` | 标签标题 |
| `tab` | 挂载的大标签 |
| `order` | 排序 |
| `schema` | 字段结构 |
| `applies` | `live` 或 `session`，用于界面提示 |
| `plugin` | 来源插件 |

## 读取值

```ts
const routing = ctx.get('routing')
const values = routing?.valuesAt(subjectOf(agent), 'myFeature')

const enabled = values?.['enabled'] ?? true
const level = values?.['level'] ?? 'low'
```

`valuesAt` 先取全局默认值，再按当前上下文中更具体的目标逐层合并。

::: warning
不要自己读配置文件或数据库来解析规则，那会绕过优先级裁决、配置锁、缓存和诊断，导致运行时行为与控制台显示不一致。
:::

`valuesAt` 的第一个参数 `subject` 通常直接从会话或 Agent 推导；需要指定路由上下文时一并传入 `route`。也可以在 `subject` 上扩展自定义字段，前提是规则匹配逻辑能识别它。

## 默认值写在两处

默认值会同时出现在 Schema 的 `.default()`（界面显示与表单校验）和读取时的 `?? fallback`（运行时兜底）中。两处必须一致，否则会出现「界面显示已开启，运行时却按关闭处理」的问题。

## 谓词

规则需要按目标动态判断时，注册谓词处理器：

```ts
ctx.routing.predicate('my-plugin:enabled', {
  evaluate: (_args, input) => input.subject?.guild === '...',
})
```

返回 `true` 时，含有该条件的规则才匹配。谓词在单次解析中可能被频繁调用，应保持轻量、无副作用。

## 缓存

路由结果默认按 `subject` 缓存，只有规则中含有「内容相关」的谓词（例如读取消息文本）时才跳过缓存。谓词依赖消息内容时，注册时务必标记为内容相关，否则会读到旧结果。

## 界面

- 字段的 `description` 显示为帮助文本，写清楚什么时候该改。
- 用 `role('ms')`、`role('slider')`、`role('element')` 选择合适的控件。
- 把相关字段放进同一个子对象，界面会自动分组。

## 测试

1. 注册两个命名空间，确认读写互不干扰。
2. 建一条全局规则和一条群规则，确认群规则覆盖全局。
3. 群规则只覆盖一个字段，确认其他字段沿用全局。
4. 卸载插件，确认标签消失，读取返回 `undefined`。

## 常见问题

**标签不出现**：检查 `inject` 是否包含 `schemas`、`surface` 是否为 `routing`、`tab` 是否是已存在的标签 ID。

**读不到值**：检查 `key` 是否与注册时一致，以及 `subject` 是否为空。空 `subject` 只能匹配全局规则。

**没有按预期覆盖**：检查规则目标是否更具体、是否有配置锁，可以用诊断接口查看值的来源。

**改了规则不生效**：取决于何时读取。缓存型字段要等下一次读取，引擎型字段需要新开会话。
