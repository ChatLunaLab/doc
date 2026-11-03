# 服务与依赖

::: tip
服务与依赖注入是插件之间共享功能和状态的机制：插件可以注册服务供他人使用，也可以通过 `inject` 声明需要的服务。
:::

## 声明服务类型

用模块增强为 `Context` 声明服务属性，获得类型提示：

```ts
import type GreeterService from './service'

declare module 'cordis' {
  interface Context {
    greeter: GreeterService
  }
}
```

跨包暴露的服务名统一使用 `snake_case`，例如 `ctx.chatluna_providers`、`ctx.chat_observer`。

## 提供服务

继承 `cordis` 的 `Service` 基类：

```ts
import { Service } from 'cordis'
import type { Context } from 'cordis'

export default class GreeterService extends Service {
  static inject = ['database']

  constructor(ctx: Context) {
    super(ctx, 'greeter')
  }

  hello() {
    return 'hi'
  }
}
```

`super(ctx, 'greeter')` 把实例挂载到 `ctx.greeter`，其他插件通过 `inject: ['greeter']` 使用它。服务自身依赖的服务写在 `static inject` 中。

## 使用服务

```ts
import type { Context } from 'cordis'

export const inject = ['greeter', 'tools']

export function apply(ctx: Context) {
  ctx.greeter.hello()
}
```

- **必需依赖**：写进 `inject`，框架等它们全部就绪后才执行 `apply`。
- **可选依赖**：不写进 `inject`，用 `ctx.get('service_name')` 获取，未就绪时返回 `undefined`。

::: warning
不要绕过 `inject` 去轮询等待服务出现，这会破坏生命周期管理，导致难以预料的时序问题。
:::

## 条件挂载子树

某段逻辑只在特定服务就绪时生效时，用 `ctx.inject`：

```ts
import type { Context } from 'cordis'

export function apply(ctx: Context) {
  ctx.inject(['database'], (ctx) => {
    // database 就绪时执行；它卸载时，这里注册的资源自动回收
  })
}
```

## 下一步

- [插件与生命周期](./lifecycle)
- [事件系统](./events)
