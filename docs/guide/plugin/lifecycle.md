# 插件与生命周期

在 Cordis 生态中，理解生命周期是编写健壮插件的基础。一个插件从加载、运行到卸载，都受到清晰且严谨的生命周期机制管理。

::: tip
本节介绍插件 (Plugin) 在 Cordis 4 框架中的生命周期 (Lifecycle)：加载流程、纤维 (Fiber)、副作用 (Effect) 机制以及卸载清理逻辑。
:::

## 理解插件树与上下文

在 Cordis 4 中，一个运行实例在内部被维护为一棵插件树 (Plugin Tree)。框架依据依赖拓扑顺序，由浅入深依次挂载各个插件：

- **专属上下文**：插件挂载后会获得一个专属的上下文 (`Context`) 实例。
- **上下文继承**：挂载在当前插件下的子插件，会自动继承当前上下文，获得以其为父级的子 `Context`。
- **内部 Fiber 节点**：每个已加载的插件在框架内部对应一个 Fiber 节点。当前插件的所有注册项（包括指令、事件、定时器与外部资源等）均记录在该 Fiber 上。

## 编写插件入口 apply

当清单中的插件被启用，且该插件通过 `inject` 声明的所有依赖服务 (Service) 均已就绪时，框架才会调用插件导出的 `apply` 函数：

```ts
import type { Context } from 'cordis'

export const name = 'my-plugin'
export const inject = ['database']

export interface Config {
  retryTimes?: number
}

export function apply(ctx: Context, config: Config) {
  // apply 在依赖就绪后同步执行
}
```

进入 `apply` 时，传入的 `config` 已经过 `Config` Schema 校验并填充了默认值，你可以直接读取。

需要注意的是，`apply` 必须是**同步执行**的挂载点。注册指令、事件监听器、定时器以及挂载子插件都应当在 `apply` 执行期间完成。

::: warning
严禁将 `apply` 声明为 `async` 函数去阻塞插件树挂载流程。若插件需要执行异步初始化逻辑，应使用 `ctx.effect` 启动异步任务。
:::

## 注册副作用与自动回收

插件在运行期间往往会创建各种资源，妥善管理这些副作用是保证框架稳定运行的关键。

调用 `ctx.effect(fn)` 可以向当前 Fiber 绑定一个副作用处理函数。传入的 `fn` 会立即同步执行；当插件被卸载或重载时，框架会自动调用 `fn` 返回的清理函数 (Disposer)。

框架内置的绝大部分注册方法（包括 `ctx.command`、`ctx.on`、定时器及 HTTP 路由注册）底层均已封装了 effect 机制。在插件卸载时它们都会被自动注销，无需手动清理。

当你需要管理外部持久资源（如网络连接、文件句柄）时，使用 `ctx.effect` 提供显式清理逻辑即可：

```ts
import type { Context } from 'cordis'

export function apply(ctx: Context) {
  ctx.effect(() => {
    // 建立外部资源连接
    const conn = openConnection()

    // 返回清理函数：插件卸载或重载时自动执行
    return () => {
      conn.close()
    }
  })
}

function openConnection() {
  return {
    close: () => {}
  }
}
```

Fiber 的资源回收遵循严格的**自下而上**顺序：卸载一个插件时，属于该插件的所有子 Fiber 会优先被逐层回收，最后再执行该插件自身的清理函数。

## 动态加载子插件

除了直接加载插件，你还可以通过当前上下文动态派生子插件树：

- **直接加载**：调用 `ctx.plugin(SubPlugin, config)` 在当前 Fiber 下挂载子插件，该方法会返回该子插件的 Disposer 函数。
- **依赖挂载**：调用 `ctx.inject(deps, SubPlugin)`。仅当 `deps` 中声明的服务全部就绪时，子插件树才会被挂载；一旦声明的依赖服务失效或被卸载，该子插件树会自动被卸载回收。

```ts
import type { Context } from 'cordis'

const SubPlugin = {
  name: 'sub-plugin',
  apply(ctx: Context) {
    // 子插件逻辑
  }
}

export function apply(ctx: Context) {
  // 当 database 服务可用时动态挂载子插件
  ctx.inject(['database'], (subCtx) => {
    subCtx.plugin(SubPlugin)
  })
}
```

## 适配热重载

在开发模式下，当插件源码发生变更时，框架会执行热重载 (Hot Reload)：

1. 卸载当前旧代码对应的 Fiber，触发其所有清理函数，清除全部挂载在 `ctx` 上的注册项。
2. 加载新代码模块，重新创建 Fiber 并再次调用 `apply`。

::: warning
在编写插件时，请务必保证 `apply` 具备幂等性，假设其随时可能被重复调用。**切勿在模块顶层作用域保留运行时业务状态**（例如模块级 `let` 变量）。所有可变状态都必须保存在 `ctx` 的 Fiber 生命周期内部或挂载至服务实例中，否则热重载时会导致内存泄漏或残留脏状态。
:::

## 下一步

- [服务与依赖](./service)
- [事件系统](./events)
