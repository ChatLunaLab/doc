# 插件与生命周期

::: tip
本节介绍插件在 Cordis 4 中的生命周期：加载流程、Fiber、副作用（effect）和卸载清理。
:::

## 插件树与上下文

一个运行实例在内部是一棵插件树，框架按依赖顺序逐层挂载插件：

- 插件挂载后获得专属的 `Context`。
- 子插件继承父插件的上下文，得到以它为父级的子 `Context`。
- 每个已加载的插件对应一个 Fiber 节点，插件的所有注册项（指令、事件、定时器、外部资源等）都记录在它上面。

## 入口 apply

插件在清单中启用、且 `inject` 声明的服务全部就绪后，框架调用它的 `apply`：

```ts
import type { Context } from 'cordis'

export const name = 'my-plugin'
export const inject = ['database']

export interface Config {
  retryTimes?: number
}

export function apply(ctx: Context, config: Config) {
  // 依赖就绪后同步执行
}
```

传入的 `config` 已经过 Schema 校验并填好默认值。`apply` 是**同步**的挂载点，注册指令、监听器、定时器和挂载子插件都应在其中完成。

::: warning
不要把 `apply` 声明为 `async` 来阻塞插件树挂载。异步初始化用 `ctx.effect` 启动。
:::

## 副作用与自动回收

`ctx.effect(fn)` 把副作用绑定到当前 Fiber：`fn` 立即同步执行，插件卸载或重载时，框架调用 `fn` 返回的清理函数。

`ctx.command`、`ctx.on`、定时器和 HTTP 路由等内置注册方法底层都已经用了 effect，卸载时自动注销。管理网络连接、文件句柄等外部资源时，用 `ctx.effect` 提供清理逻辑：

```ts
import type { Context } from 'cordis'

export function apply(ctx: Context) {
  ctx.effect(() => {
    const conn = openConnection()
    return () => conn.close()
  })
}

function openConnection() {
  return {
    close: () => {}
  }
}
```

回收顺序**自下而上**：先逐层回收子 Fiber，最后执行插件自己的清理函数。

## 子插件

- **直接加载**：`ctx.plugin(SubPlugin, config)` 在当前 Fiber 下挂载子插件，返回它的清理函数。
- **按依赖加载**：`ctx.inject(deps, SubPlugin)` 在 `deps` 全部就绪时挂载子插件树；依赖失效时自动卸载。

```ts
import type { Context } from 'cordis'

const SubPlugin = {
  name: 'sub-plugin',
  apply(ctx: Context) {
    // 子插件逻辑
  }
}

export function apply(ctx: Context) {
  ctx.inject(['database'], (subCtx) => {
    subCtx.plugin(SubPlugin)
  })
}
```

## 热重载

开发模式下源码变化时，框架先卸载旧的 Fiber（执行所有清理函数、清除全部注册项），再加载新模块、重新创建 Fiber 并调用 `apply`。

::: warning
`apply` 必须能被重复调用。**不要在模块顶层保存运行时状态**（例如模块级的 `let` 变量），可变状态应放在 Fiber 生命周期内或服务实例中，否则热重载会泄漏内存或残留脏状态。
:::

## 下一步

- [服务与依赖](./service)
- [事件系统](./events)
