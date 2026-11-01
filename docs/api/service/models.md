# 模型 (Models)

在 ChatLuna 中，模型的统一调度由 `ctx.ai`（`@chatluna/ai-runtime`）负责，承担了注册 provider、解析模型地址、绑定代次及执行协议守卫等核心工作。与之配合的还有提供商 recipe 目录 `ctx.chatluna_providers`（`@chatluna/provider-registry`），以及面向常用操作的动词面 `ctx.chatluna.*`。

## 模型地址

在调用模型时，你可以通过以下两种形式指定目标模型：

- `provider:model`：精确地址。
- `@chat` / `@decide` / `@small` / `@medium` / `@large`：角色别名，由解析器选定。

## `ctx.ai`

通过 `ctx.ai` 提供的服务接口，你可以直接管理提供商并获取模型句柄：

| 方法 | 作用 |
| --- | --- |
| `provide(id, provider)` | 注册 provider → ProviderHandle |
| `model(modality, 'provider:model')` | 取模型句柄 |
| `bind({signal, scope})` | 绑定当前代次 |
| `caps(address)` | 查能力 |
| `providers()` / `models(provider, modality)` | 枚举 |

通过 `bind` 后的调用会固定代次，且每个 `Bound.call` 只能执行一次。

## 七个模态

运行时共划分了七个模态：`chat` · `embed` · `rerank` · `draw` · `speak` · `listen` · `decide`。每个 provider 可按需只实现其中的一部分。

## 动词

`@chatluna/ai-runtime/ops` 在 `ctx.chatluna` 上挂载了高频操作动词：`ask` `chat` `extract` `embed` `rerank` `draw` `speak` `listen` `decide` `decideOne` `judge`。它们均返回 `Run`（支持 await、异步迭代、读取 stream 以及 abort）。这些动词单次调用不跑工具循环——如果需要工具循环，请使用 `ctx.agents`。

## 继续

- [模型与模态运行时](/architecture/models)
