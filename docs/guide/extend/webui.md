# WebUI 扩展

除了编写后台逻辑，有时你还需要为插件提供可视化界面。ChatLuna 支持通过双面插件 (Dual-face Plugin) 扩展 WebUI，让你既能编写后端服务，也能在控制台中注册专属页面。

::: tip
双面插件指的是同时包含两套代码的插件包：运行在 Node.js 服务端的代码位于 `src/`，负责注册 API 与配置段；运行在浏览器端的代码位于 `client/`，负责注册页面路由、UI 槽位与渲染组件。
:::

## 认识双面插件结构

一个典型的 WebUI 插件包由 Node.js 服务端代码和浏览器端代码组成。标准目录结构如下：

```text
my-webui/
  src/index.ts        # 服务端：注册 API、Schema 段
  client/index.ts     # 浏览器端：注册路由、页面、槽位
```

两部分代码各司其职：服务端负责数据与业务逻辑，浏览器端负责界面的展示与交互。

## 向 WebUI 注册页面路由

要在 WebUI 中添加新页面，你需要在浏览器端代码 (`client/index.ts`) 中导出一个 `apply` 函数，并通过 `ctx.slots.route` 将组件绑定到指定路径：

```ts
// client/index.ts
import type { Context } from 'cordis'

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

`ctx.slots.route` 接受的配置项说明如下：

- `path`：页面在浏览器中的访问路径。
- `page`：异步加载页面组件的工厂函数。
- `title`：显示在左侧导航栏及页面标题处的文案。
- `icon`：导航项显示的图标名称。
- `group`：导航分组标识符（例如 `'capabilities'`），决定该项归属于左侧导航栏的哪个分类。
- `order`：数字类型，决定该项在当前分组中的排序位置。
- `hidden`：可选布尔值。若设为 `true`，页面仍可通过路径正常访问，但不会显示在左侧导航栏中（适用于详情页或子页面）。

## 构建页面组件

编写页面视图时，遵循以下规范可以让页面与 WebUI 更好地融合：

- **复用通用组件**：使用 `@chatluna/ui-kit` 提供的基础控件，配合 `SchemaForm` 自动渲染表单，避免手动重复实现已有控件。
- **本地状态持久化**：管理浏览器本地偏好设置时，使用 `@chatluna/ui-storage` 进行存取。

::: warning
请勿在前端代码中直接操作 `localStorage`。直接调用原生存储接口可能会绕过状态同步机制，请统一使用 `@chatluna/ui-storage` 提供的存储接口。
:::

## 注册配置 Schema 段

如果你的插件需要将配置项展示在 WebUI 的「设置」页面或快捷设置中，可以在服务端通过 `ctx.schemas.section` 声明配置段，前端会自动生成对应的表单：

```ts
// src/index.ts
import type { Context } from 'cordis'

export function apply(ctx: Context) {
  // 向 WebUI 注册 Schema 配置段
  ctx.schemas.section({
    surface: 'settings', // 目标展示区域
    id: 'my-plugin',     // 配置段唯一标识
    schema: configSchema // 对应的 Schema 定义
  })
}
```

配置生效后，WebUI 会自动将其解析并渲染为可视化表单，无需手动编写表单布局与交互逻辑。

## 下一步

- [配置构型](../plugin/schema)
- [服务与依赖](../plugin/service)
