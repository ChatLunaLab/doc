# 服务 (Service)

服务是挂载在上下文 `ctx` 上、用于跨插件共享功能的对象。插件可以通过继承 `Service` 基类来定义服务，并在构造函数中调用 `super(ctx, name)` 将其实例绑定至 `ctx[name]`。

## 定义

通过继承 `Service` 基类即可声明自定义服务：

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

使用 `static inject` 声明服务自身所需的依赖，Cordis 会在相关依赖就绪后才完成该服务的实例化。为了在编写代码时获得完整的类型提示，可以通过模块补充将服务属性挂载到 `Context` 接口：

```ts
declare module 'cordis' {
  interface Context { greeter: GreeterService }
}
```

## 消费

插件可以通过声明依赖、按需获取或回调注入等多种方式消费已有服务：

```ts
export const inject = ['greeter']        // 必需
ctx.greeter.hello()
ctx.get('greeter')                        // 可选 → GreeterService | undefined
ctx.inject(['greeter'], (ctx) => { ... }) // 条件挂载
```

## 命名

跨包服务的属性名称建议使用 snake_case（例如 `ctx.chatluna_providers`、`ctx.chat_observer`）。若涉及跨包共享的 Symbol，应使用 `Symbol.for` 进行全局注册，以避免多包打包造成引用隔离。

## 继续

- [服务与依赖（指南）](/guide/plugin/service)
