# 上下文 (Context)

`Context` 是插件与框架之间的接口：插件拿到的 `ctx` 提供注册能力、访问服务、挂子插件、绑副作用的全部入口。每个插件有自己的 `Context`，挂在它的 fiber 上，随 fiber 回收。

## 注册能力

```ts
ctx.command(name, desc)     // 注册指令
ctx.on(event, listener)     // 监听事件
ctx.emit(event, ...args)    // 触发事件
ctx.plugin(plugin, config)  // 挂子插件 → Disposable
ctx.effect(fn)              // 绑副作用 → 返回 disposer
ctx.setInterval / ctx.setTimeout
ctx.logger                  // 日志器
```

凡 `ctx` 注册的都绑在当前 fiber 生命周期，卸载自动回收。

## 服务访问

```ts
ctx.tools            // inject 声明后直读
ctx.get('name')      // 可选服务，可能 undefined
ctx.inject(deps, fn) // 服务就绪才执行 fn
```

## 清单与作用域

- `ctx.scope`：当前插件的隔离作用域（`isolate` 控制）。
- `ctx.root`：根上下文。
- `ctx.fiber`：当前 fiber 句柄。

插件不该持有超出 fiber 的 `ctx`、不该手动构造 Context、不该销毁别的 fiber。

## 继续

- [事件 (Events)](./events)
- [服务 (Service)](./service)
