# 第一个插件

::: tip
本教程将指导你编写一个最小的插件 (Plugin) 并将其加载到运行中的 ChatLuna 实例。在开始前，请确保你已经拥有一个可运行的 ChatLuna 实例（通过命令行界面 (CLI) 或源码开发模式启动）。
:::

## 什么是插件

在 ChatLuna 中，插件是一个导出 `apply` 方法的 TypeScript/JavaScript 模块。当框架加载插件时，会调用该 `apply` 函数并传入上下文 (Context) 对象 `ctx`。插件通过 `ctx` 向框架注册各类功能与服务：

```ts
import type { Context } from 'cordis'

// 插件名称
export const name = 'hello-plugin'

// 插件入口函数
export function apply(ctx: Context) {
  ctx.logger.info('hello-plugin loaded')
}
```

## 编写插件代码

在你的实例目录下的 `external/hello/` 文件夹中创建 `index.ts` 文件，填入以下代码：

```ts
import type { Context } from 'cordis'

export const name = 'hello'
// 声明插件依赖的服务
export const inject = ['tools']

export function apply(ctx: Context) {
  // 注册一条聊天指令
  ctx.command('chatluna.hello', '打个招呼').action(() => {
    return '你好，我是你的第一个插件'
  })
}
```

通过 `inject` 属性，你可以声明该插件依赖的服务 (Service)。只有当声明的服务全部就绪后，框架才会执行 `apply` 函数，此时 `ctx.tools` 等依赖对象才具有确定值。

## 加载与验证插件

你可以通过以下两种方式之一将插件加载进实例：

1. **软链接方式**：在终端中运行命令：
   ```bash
   chatluna link ./external/hello
   ```
2. **直接放置**：确保文件已保存在实例根目录的 `external/` 文件夹中。

在开发模式下，保存代码后实例会自动执行热重载。你可以在控制台界面的「插件」页面中看到名为 `hello` 的插件已成功加载。

进入聊天窗口，发送以下指令测试插件运行状态：

```text
chatluna.hello
```

实例将回复：

```text
你好，我是你的第一个插件
```

## 自动清理机制

任何通过 `ctx` 显式注册的资源——包括指令、事件监听器和内置定时器——都会在插件被卸载或重载时由框架自动销毁，无需手动调用 `removeListener`。

对于无法直接通过 `ctx` 注册或需要显式释放的外部资源（如自定义定时器或持久网络连接），可以使用 `ctx.effect()` 注册清理回调函数 (Disposer)：

```ts
ctx.effect(() => {
  // 启动外部定时器
  const timer = setInterval(() => {
    ctx.logger.info('tick')
  }, 5000)

  // 返回清理函数：插件卸载时自动调用
  return () => {
    clearInterval(timer)
  }
})
```

## 插件的定义形态

除了具名导出函数以外，插件也可以采用对象或类的形态进行导出。当你需要向框架注册自定义服务时，通常使用类形态：

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

## 下一步

- [插件与生命周期](../plugin/lifecycle)
- [服务与依赖](../plugin/service)
- [工具开发](../extend/tools)
