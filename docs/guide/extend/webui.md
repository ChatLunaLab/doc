# WebUI 扩展

::: tip
本节介绍 `*-webui` 双面插件 (Dual-face Plugin) 的开发方式。双面插件的服务端代码位于 `src/`，负责注册 API 与配置段；浏览器端代码位于 `client/`，负责注册页面路由、UI 槽位与渲染组件。
:::

## 认识双面插件结构

一个 WebUI 插件包由运行在 Node.js 环境的服务端代码与运行在前端的浏览器端代码组成。标准目录结构如下：

```text
my-webui/
  src/index.ts        # 服务端：注册 API、Schema 段
  client/index.ts     # 浏览器端：注册路由、页面、槽位
```

## 向 WebUI 注册页面路由

在浏览器端代码 (`client/index.ts`) 中，你需要导出一个 `apply` 函数，并通过 `ctx.slots.route` 将组件绑定到指定路径。

```ts
// client/index.ts
import type { Context } from '@chatluna/utils/cordis'

export function apply(ctx: Context) {
  // 向 WebUI 注册自定义路由
  ctx.slots.route({
    path: '/my-page',
    // 异步加载页面组件
    page: async () => (await import('./page')).MyPage,
    title: '我的页面',
    icon: 'puzzle',
    group: 'capabilities',
    order: 30,
  })
}
```

路由配置项说明：

- `path`: 页面在浏览器中访问的路径。
- `page`: 异步加载页面组件的工厂函数。
- `title`: 显示在左侧导航栏及页面标题处的文案。
- `icon`: 导航项显示的图标名称。
- `group`: 导航分组标识符（例如 `'capabilities'`），决定该项归属于左侧导航栏的哪个分类。
- `order`: 数字类型，决定该项在当前分组中的排序位置。
- `hidden`: 可选布尔值。若设置为 `true`，该页面可以正常通过路径访问，但不会在左侧导航栏中显示（适用于详情页或子页面）。

## 构建页面组件

编写页面视图时，请遵循以下规范：

1. **复用通用组件**：使用 `@chatluna/ui-kit` 提供的基础控件，配合 `SchemaForm` 自动渲染表单，避免手动重复实现既有控件。
2. **本地状态持久化**：管理浏览器本地偏好设置时，使用 `@chatluna/ui-storage` 进行存取。

::: warning
请勿在前端代码中直接操作 `localStorage`。直接调用原生存储接口可能会绕过状态同步机制，请统一使用 `@chatluna/ui-storage` 提供的存储接口。
:::

## 注册配置 Schema 段

如果你的插件需要将其配置项展示在 WebUI 的设置页面或快捷设置中，可以在服务端通过 `ctx.schemas.section` 声明配置段，前端将自动生成对应表单：

```ts
// src/index.ts
import type { Context } from '@chatluna/utils/cordis'

export function apply(ctx: Context) {
  // 向 WebUI 注册 Schema 配置段
  ctx.schemas.section({
    surface: 'settings', // 目标展示区域
    id: 'my-plugin',     // 配置段唯一标识
    schema: configSchema // 对应的 Schema 定义
  })
}
```

配置项生效后，WebUI 会自动将其解析并渲染为可视化表单，无需手动编写表单布局与交互逻辑。

## 下一步

- [配置构型](../plugin/schema)
- [服务与依赖](../plugin/service)
