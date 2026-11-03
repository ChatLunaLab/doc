# 上下文 (Context)

`Context`（上下文）是插件与框架交互的核心接口。插件接收到的 `ctx` 提供了注册能力、访问服务、挂载子插件与绑定副作用的全部入口。每个插件都有独立的 `Context`，挂载在自身的 fiber 上，随 fiber 一并回收。

## 注册能力

通过 `ctx`，你可以注册指令、监听事件以及管理生命周期的副作用：

```ts
ctx.command(name, desc)     // 注册指令
ctx.on(event, listener)     // 监听事件
ctx.emit(event, ...args)    // 触发事件
ctx.plugin(plugin, config)  // 挂子插件 → Disposable
ctx.effect(fn)              // 绑副作用 → 返回 disposer
ctx.setInterval / ctx.setTimeout
ctx.logger                  // 日志器
```

通过 `ctx` 注册的所有资源都会绑定到当前 fiber 的生命周期中。插件卸载时，这些资源会自动回收，无需手动清理。

## 服务访问

除了注册能力，`ctx` 也是访问跨插件服务的标准入口：

```ts
ctx.tools            // inject 声明后直读
ctx.get('name')      // 可选服务，可能 undefined
ctx.inject(deps, fn) // 服务就绪才执行 fn
```

通过 `inject` 声明依赖，可以确保所需服务就绪后再执行对应逻辑；对于可选依赖，则可以通过 `ctx.get()` 安全读取。

## 清单与作用域

- `ctx.scope`：当前插件的隔离作用域（由 `isolate` 控制）。
- `ctx.root`：根上下文。
- `ctx.fiber`：当前 fiber 句柄。

编写插件时，请注意不要持有超出 fiber 生命周期的 `ctx`，不要手动构造 `Context`，也不要销毁其他插件的 fiber。

## 继续

- [事件 (Events)](./events)
- [服务 (Service)](./service)
