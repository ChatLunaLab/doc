# 模型 (Models)

`ctx.ai`（`@chatluna/ai-runtime`）是模型运行时：注册 provider、解析地址、绑定代次、跑协议守卫。`ctx.chatluna_providers`（`@chatluna/provider-registry`）是提供商 recipe 目录；`ctx.chatluna.*` 是动词面。

## 模型地址

- `provider:model`：精确地址。
- `@chat` / `@decide` / `@small` / `@medium` / `@large`：角色别名，由解析器选定。

## `ctx.ai`

| 方法 | 作用 |
| --- | --- |
| `provide(id, provider)` | 注册 provider → ProviderHandle |
| `model(modality, 'provider:model')` | 取模型句柄 |
| `bind({signal, scope})` | 绑定当前代次 |
| `caps(address)` | 查能力 |
| `providers()` / `models(provider, modality)` | 枚举 |

`bind` 后的调用固定代次，`Bound.call` 只能执行一次。

## 七个模态

`chat` · `embed` · `rerank` · `draw` · `speak` · `listen` · `decide`。每个 provider 可只实现部分。

## 动词

`@chatluna/ai-runtime/ops` 在 `ctx.chatluna` 上挂：`ask` `chat` `extract` `embed` `rerank` `draw` `speak` `listen` `decide` `decideOne` `judge`。返回 `Run`（可 await / 异步迭代 / 读 stream / abort）。单次调用不跑工具循环——要工具循环走 `ctx.agents`。

## 继续

- [模型与模态运行时](/architecture/models)
