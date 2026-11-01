# 路由 (Routing)

路由服务以 `ctx.routing`（来自 `@chatluna/routing`）的形式提供，负责解析场景规则，并向其他服务提供按主体（`subject`）生效的合并配置。

## 读取

你可以通过以下方法查询已注册的规则或获取解析结果：

| 方法 | 作用 |
| --- | --- |
| `resolve(input)` | 计算完整 `Resolution`（冻结快照） |
| `valuesAt(subject, ns)` | 取某个命名空间的值（已合并） |
| `explain(input)` | 返回解析过程与来源，用于诊断 |
| `rules()` / `rule(id)` | 规则列表与单条规则 |
| `revision` | 当前修订号 |

其中 `Resolution` 是只读的冻结快照，包含 `ruleIds`、`values`、`sources`、`suppressed`、`diagnostics` 与 `revision` 等字段。

## 写入

路由服务支持动态创建、更新与删除规则：

| 方法 | 作用 |
| --- | --- |
| `save(input, { revision?, by? })` | 新建或更新规则，返回新规则 |
| `remove(id, options)` | 删除规则 |

其中的 `revision` 用于实现乐观锁并发控制。当传入过期的旧修订号时，操作会抛出 `CONFLICT` 错误。

## 谓词

通过注册自定义谓词，你可以为场景匹配增加自定义判断条件：

```ts
ctx.routing.predicate('my:match', {
  evaluate: (args, input) => boolean,
})
```

谓词会在规则匹配阶段实时调用，其求值函数必须轻量且无副作用。当规则中包含内容相关的动态谓词时，系统会自动跳过解析结果缓存。

## 目录与对端

- `ctx.routing.directory`：可路由对象（群、频道等）的目录服务。
- `ctx.routing.peers`：对端实体资料的缓存。

## 与 schema 的关系

路由服务仅负责规则的取值与值合并，并不直接管理前端配置界面。配置项的展示结构由 `ctx.schemas.section` 统一声明和注册。

详细说明请参考[扩展路由命名空间](/guide/extend/routing)。

## 继续

- [路由与场景规则](/architecture/routing)
