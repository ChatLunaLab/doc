# 第一个插件

::: tip
本节将带你编写一个最简单的插件，并将其加载到运行中的 ChatLuna 实例。在开始前，请确保你已经拥有一个正在运行的 ChatLuna 实例（无论通过命令行界面还是源码开发模式启动）。
:::

## 什么是插件

插件是扩展 ChatLuna 功能的核心途径。本质上，一个插件就是一个导出了 `apply` 方法的 TypeScript 或 JavaScript 模块。

当框架加载插件时，会自动调用其导出的 `apply` 函数，并将上下文（Context）对象 `ctx` 作为参数传入。插件的所有功能注册与服务交互，都是通过这个 `ctx` 完成的：

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

现在让我们动手编写一个真正的插件。在实例目录的 `external/hello/` 文件夹下新建 `index.ts` 文件，填入以下代码：

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

代码中的 `inject` 属性值得留意。你可以借助 `inject` 显式声明插件所依赖的服务（Service）。只有当这些服务全部就绪后，框架才会执行 `apply` 函数，此时像 `ctx.tools` 这样的依赖对象才能安全可靠地被访问。

## 加载与验证插件

编写完代码后，你可以通过以下两种方式之一将插件加载进实例：

1. **软链接方式**：在终端中运行命令：
   ```bash
   chatluna link ./external/hello
   ```
2. **直接放置**：确保文件已保存在实例根目录的 `external/` 文件夹中。

在开发模式下，每次保存代码都会自动触发热重载。此时打开控制台，你可以在「插件」页面中看到名为 `hello` 的插件已成功加载。

接下来，进入聊天窗口发送如下指令测试插件的运行效果：

```text
chatluna.hello
```

如果一切正常，实例将回复：

```text
你好，我是你的第一个插件
```

## 自动清理机制

在插件开发中，资源的销毁往往令人头疼。但在 ChatLuna 中，只要是通过 `ctx` 显式注册的资源（包括指令、事件监听器以及内置定时器），都会在插件重载或卸载时被框架自动清理，无需手动调用 `removeListener`。

至于那些无法直接通过 `ctx` 注册的外部资源（例如原生定时器或持久网络连接），你可以使用 `ctx.effect()` 注册清理回调函数（Disposer）：

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

当插件被卸载时，框架会自动执行这个返回的清理函数，彻底杜绝资源泄漏隐患。

## 插件的定义形态

除了具名导出函数以外，插件也可以采用对象或类的形态进行导出。例如使用对象形式导出：

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

当你需要向框架注册自定义服务时，通常会更倾向于使用类形态。关于这一部分，我们将在后续章节展开介绍。

## 下一步

- [插件与生命周期](../plugin/lifecycle)
- [服务与依赖](../plugin/service)
- [工具开发](../extend/tools)
