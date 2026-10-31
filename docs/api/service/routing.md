# 路由 (Routing)

`ctx.routing`（`@chatluna/routing`）解析场景规则，并向其他服务提供按 subject 生效的配置值。

## 读取

| 方法 | 作用 |
| --- | --- |
| `resolve(input)` | 计算完整 `Resolution`（冻结快照） |
| `valuesAt(subject, ns)` | 取某个命名空间的值（已合并） |
| `explain(input)` | 返回解析过程与来源，用于诊断 |
| `rules()` / `rule(id)` | 规则列表与单条规则 |
| `revision` | 当前修订号 |

`Resolution` 包含 `ruleIds`、`values`、`sources`、`suppressed`、`diagnostics`、`revision`。

## 写入

| 方法 | 作用 |
| --- | --- |
| `save(input, { revision?, by? })` | 新建或更新规则，返回新规则 |
| `remove(id, options)` | 删除规则 |

`revision` 用于乐观锁：传入旧修订号会得到 `CONFLICT`。

## 谓词

```ts
ctx.routing.predicate('my:match', {
  evaluate: (args, input) => boolean,
})
```

谓词在匹配时调用，必须快且纯。包含内容相关谓词时，结果缓存会被跳过。

## 目录与对端

- `ctx.routing.directory`：可路由对象（群、频道等）的目录。
- `ctx.routing.peers`：对端资料缓存。

## 与 schema 的关系

规则的界面与此处无关：界面由 `ctx.schemas.section` 注册，路由只负责取值与合并。

详见[扩展路由命名空间](/guide/extend/routing)。

## 继续

- [路由与场景规则](/architecture/routing)
