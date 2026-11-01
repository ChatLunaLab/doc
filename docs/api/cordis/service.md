# 服务 (Service)

服务是挂到 `ctx` 上、跨插件共享的对象。用 `Service` 基类定义，`super(ctx, name)` 绑定到 `ctx.<name>`。

## 定义

```ts
import { Service } from 'cordis'
import type { Context } from 'cordis'

export default class GreeterService extends Service {
  static inject = ['database']
  constructor(ctx: Context) {
    super(ctx, 'greeter')
  }
}
```

`static inject` 声明该服务自己的依赖，就绪后才实例化。用模块增强把服务类型挂到 `Context`：

```ts
declare module 'cordis' {
  interface Context { greeter: GreeterService }
}
```

## 消费

```ts
export const inject = ['greeter']        // 必需
ctx.greeter.hello()
ctx.get('greeter')                        // 可选 → GreeterService | undefined
ctx.inject(['greeter'], (ctx) => { ... }) // 条件挂载
```

## 命名

跨包服务用 snake_case（`ctx.chatluna_providers`、`ctx.chat_observer`）。共享符号用 `Symbol.for` 跨包 bundle。

## 继续

- [服务与依赖（指南）](/guide/plugin/service)
