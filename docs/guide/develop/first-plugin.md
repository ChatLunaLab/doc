# 第一个插件

::: tip
本节编写一个最简单的插件并加载到运行中的实例。开始前请确保已有一个运行中的 ChatLuna 实例（通过 CLI 或源码开发模式启动均可）。
:::

## 什么是插件

插件就是一个导出了 `apply` 的模块。框架加载插件时调用 `apply` 并传入上下文 `ctx`，插件的所有注册和服务交互都通过它完成：

```ts
import type { Context } from 'cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  ctx.logger.info('hello-plugin loaded')
}
```

## 编写插件

在实例目录的 `external/hello/` 下新建 `index.ts`：

```ts
import type { Context } from 'cordis'

export const name = 'hello'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.command('chatluna.hello', '打个招呼').action(() => {
    return '你好，我是你的第一个插件'
  })
}
```

`inject` 声明插件依赖的服务，全部就绪后框架才执行 `apply`，此时才能安全访问 `ctx.tools`。

## 加载与验证

两种方式任选其一：

1. 软链接：`chatluna link ./external/hello`。
2. 直接放在实例根目录的 `external/` 下。

开发模式下保存代码会自动热重载。在控制台的「插件」页面能看到 `hello` 已加载。在聊天窗口发送：

```text
chatluna.hello
```

实例会回复：

```text
你好，我是你的第一个插件
```

## 自动清理

通过 `ctx` 注册的指令、监听器和内置定时器，在插件重载或卸载时会被自动清理。原生定时器、持久连接这类外部资源，用 `ctx.effect()` 返回清理函数：

```ts
ctx.effect(() => {
  const timer = setInterval(() => {
    ctx.logger.info('tick')
  }, 5000)
  return () => clearInterval(timer)
})
```

## 插件的形态

插件也可以用对象或类导出：

```ts
import type { Context } from 'cordis'

export default {
  name: 'hello',
  inject: ['tools'],
  apply(ctx: Context) {
    // 插件注册逻辑
  },
}
```

需要注册自定义服务时通常用类，见 [服务与依赖](../plugin/service)。

## 下一步

- [插件与生命周期](../plugin/lifecycle)
- [服务与依赖](../plugin/service)
- [工具开发](../extend/tools)
