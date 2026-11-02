# 服务与依赖

服务 (Service) 与依赖注入 (Dependency Injection) 是插件间共享功能与状态的核心机制。插件既可以作为提供者向全局注册服务，也可以作为消费者按需声明依赖。

::: tip
本节将介绍服务与依赖注入的使用方法：如何定义并提供一个服务供其他插件使用，如何在插件中通过 `inject` 声明依赖，以及如何按需加载子树逻辑。
:::

## 声明服务类型

在编写或调用服务前，推荐使用 TypeScript 的模块增强 (Module Augmentation) 为 `Context` 接口声明服务属性，以获得完整的类型提示与代码补全：

```ts
import type GreeterService from './service'

declare module 'cordis' {
  interface Context {
    greeter: GreeterService
  }
}
```

声明完成后，后续通过 `ctx.greeter` 访问服务时，编辑器便能提供完整的类型推导与自动补全。

### 命名约定

跨包暴露的服务标识符统一遵循 `snake_case`（蛇形命名法），例如 `ctx.chatluna_providers`、`ctx.chat_observer`。

## 提供服务

服务是挂载到上下文 `ctx` 上的共享对象。继承 `cordis` 的 `Service` 基类即可快速定义并实现一个服务：

```ts
import { Service } from 'cordis'
import type { Context } from 'cordis'

export default class GreeterService extends Service {
  // 声明当前服务所依赖的其他前置服务
  static inject = ['database']

  constructor(ctx: Context) {
    // 调用 super 将当前实例绑定到 ctx.greeter
    super(ctx, 'greeter')
  }

  hello() {
    return 'hi'
  }
}
```

在构造函数中调用 `super(ctx, 'greeter')` 后，框架会自动将当前服务实例挂载到 `ctx.greeter`。其他插件即可通过 `inject: ['greeter']` 声明依赖并访问它。

如果你的服务本身也依赖其他前置服务（例如 `database`），直接在类上声明 `static inject` 即可。

## 消费服务

当插件需要使用外部服务时，可以在插件入口处通过 `inject` 声明依赖列表：

```ts
import type { Context } from 'cordis'

// 声明插件必需依赖的服务
export const inject = ['greeter', 'tools']

export function apply(ctx: Context) {
  // 框架保证所声明的服务全部就绪后，才会调用 apply 函数
  ctx.greeter.hello()
}
```

框架会解析所依赖的服务并注入到 `ctx` 上下文中。面对不同的依赖场景，可以按以下方式处理：

- **必需依赖**：写入插件的 `inject` 数组中。框架会等待所有依赖项全部就绪后再执行 `apply`。
- **可选依赖**：不要写入 `inject` 数组。在业务逻辑中直接调用 `ctx.get('service_name')` 获取服务实例；当服务未加载或未就绪时，该方法会返回 `undefined`。

::: warning
请不要绕过 `inject` 机制在代码中使用轮询等待服务出现。这种做法会破坏框架的生命周期管理，并可能导致未预期的执行时序问题。
:::

## 条件挂载子树

如果你希望某段逻辑或某个子功能仅在特定服务就绪时才生效，可以使用 `ctx.inject` 方法按需挂载上下文：

```ts
import type { Context } from 'cordis'

export function apply(ctx: Context) {
  // 仅在 database 服务就绪时执行回调
  ctx.inject(['database'], (ctx) => {
    // 依赖满足时的业务逻辑
    // 当 database 服务卸载或失效时，此子树内注册的资源会被自动回收
  })
}
```

通过 `ctx.inject` 传入的作用域具有完整的生命周期感知能力：当依赖的服务被卸载或失效时，该子上下文内注册的所有资源都会被框架自动清理回收。

## 下一步

- [插件与生命周期](./lifecycle)
- [事件系统](./events)
