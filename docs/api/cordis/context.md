# 上下文 (Context)

`Context`（上下文）是插件与框架交互的核心接口。插件拿到的 `ctx` 提供了注册能力、访问服务、挂载子插件与绑定副作用的全部入口。每个插件都有独立的 `Context`，挂载在自身的 fiber 上，随 fiber 回收。

## 注册能力

通过 `ctx`，你可以方便地注册指令、事件以及生命周期副作用：

```ts
ctx.command(name, desc)     // 注册指令
ctx.on(event, listener)     // 监听事件
ctx.emit(event, ...args)    // 触发事件
ctx.plugin(plugin, config)  // 挂子插件 → Disposable
ctx.effect(fn)              // 绑副作用 → 返回 disposer
ctx.setInterval / ctx.setTimeout
ctx.logger                  // 日志器
```

凡是通过 `ctx` 注册的资源都会绑定在当前 fiber 的生命周期中，当插件卸载时会自动回收，无需手动清理。

## 服务访问

除了注册能力，`ctx` 也是访问跨插件服务的标准入口：

```ts
ctx.tools            // inject 声明后直读
ctx.get('name')      // 可选服务，可能 undefined
ctx.inject(deps, fn) // 服务就绪才执行 fn
```

通过 `inject` 声明依赖可以确保服务就绪后才执行对应逻辑；而对于可选依赖，则可通过 `ctx.get()` 安全读取。

## 清单与作用域

- `ctx.scope`：当前插件的隔离作用域（`isolate` 控制）。
- `ctx.root`：根上下文。
- `ctx.fiber`：当前 fiber 句柄。

在编写插件时，不该持有超出 fiber 生命周期的 `ctx`、不该手动构造 `Context`，也不该销毁其他插件的 fiber。

## 继续

- [事件 (Events)](./events)
- [服务 (Service)](./service)
