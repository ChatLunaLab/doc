# 开发管理页面

ChatLuna 应用的 WebUI 使用 React，文档站使用 Vue/VitePress，两者属于不同工程。扩展管理页面时，需创建双面 `<domain>-webui` 插件包：服务端逻辑位于 `src/`，浏览器端代码位于 `client/`，两端通过共享的 wire types 保持契约一致。

## 创建页面骨架

使用 CLI 生成 WebUI 插件骨架：

```sh
chatluna new plugin text-inspector --webui --dir .
```

生成后，检查生成的 `package.json`、`tsconfig.json`、插件清单以及 client 构建配置。源码仓库中的平台模块仅通过集中 bundle 配置引入，不得在页面中额外安装另一份 React，也不得手写动态 CDN 加载脚本。所有运行时使用的值导入都必须在包依赖中显式声明。

## 共享协议定义

在 `src/types.ts` 中定义可序列化的快照状态与 action 契约。以下为只读文本检查器的类型定义示例：

```ts
export interface TextResult {
  length: number
}

export interface InspectorSnapshot {
  toolCount: number
}

declare module '@chatluna/ui-client/client' {
  interface States {
    'example.inspector': InspectorSnapshot
  }
  interface Actions {
    'example.inspect'(input: { text: string }): TextResult
  }
}
```

服务端与前端均需导入此文件，以确保接口变更能够在编译期被两端类型检查捕获。禁止将服务端 `Context`、`Error` 实例、函数或敏感私钥放入快照类型中。

## 服务端注册

在 `src/index.ts` 中声明入口资源、状态与动作：

```ts
import { Context, Schema } from '@chatluna/utils/cordis'
import type {} from '@chatluna/ui-server'
import type {} from '@chatluna/tool'
import type { InspectorSnapshot } from './types'

export const Config = Schema.object({})
export const name = 'chatluna-text-inspector-webui'
export const inject = ['chatluna_webui', 'tools']

export function apply(ctx: Context) {
  ctx.chatluna_webui.addEntry({
    baseUrl: import.meta.url,
    source: '../client/index.ts',
    bundle: '../dist/client.js',
  })

  ctx.chatluna_webui.state('example.inspector', {
    get: (): InspectorSnapshot => ({ toolCount: ctx.tools.list().length }),
  })

  ctx.chatluna_webui.action('example.inspect', {
    input: Schema.object({ text: Schema.string().required() }),
  }, ({ text }) => ({ length: Array.from(text).length }))
}
```

### 状态（State）设计约束

- `get` 方法返回当前数据的静态快照，而非无限事件生成器。
- 上述示例仅读取初始工具数量，不保证在工具动态增删时自动触发更新。在真实业务场景中，应在配置中使用 `refreshOn` 声明所属服务的变更事件，或在数据变更时显式调用 refresh。
- 状态更新默认采用 100 ms 合并刷新策略，并通过 hash 对数据去重。

### 动作（Action）设计约束

- `action` 的输入参数必须通过 `Schema` 进行校验。
- 执行成功且返回值为 `undefined` 时，HTTP 响应码为 204；有返回值时直接返回结果对象，无需自行包裹 `{ ok, data }` 包装层。
- 耗时操作必须包含取消机制、错误处理与进度反馈设计，避免请求无响应直至浏览器超时。

### 生命周期说明

所有在 `ctx.chatluna_webui` 上的注册项均绑定在当前 fiber 上。在插件卸载或 HMR 重载时，对应注册会自动撤销。不要脱离生命周期另起全局 WebSocket，也不要在 React 组件的 render 周期中重复注册服务端入口。

## 前端路由与多语言

### 路由注册

在 `client/index.ts` 中注册多语言资源与导航路由：

```ts
import type { Context } from 'cordis'
import zh from './locales/zh.yml'
import en from './locales/en.yml'

export default function apply(ctx: Context) {
  ctx.locale.register('example', { zh, en })
  ctx.slots.route({
    path: '/text-inspector',
    title: () => ctx.locale.bind('example')('title'),
    icon: 'search',
    group: 'system',
    page: async () => (await import('./page')).InspectorPage,
  })
}
```

- 路由的 `title` 属性支持传入字符串或函数。若导航标题需要随多语言环境动态切换，应接入对应 locale 注册机制，不可通过直接操作全局 DOM 节点来替换文字。
- `page` 接收返回具名组件或默认组件模块的异步加载函数，前端框架会处理该路由页面的懒加载。

### 语言资源文件

`client/locales/zh.yml`：

```yaml
title: 文本检查
inspect: 检查文本
placeholder: 输入要检查的文本
loading: 正在读取工具状态
failed: 读取失败
offline: 连接已断开；下方可能是上次收到的数据
tools: 工具数量
```

`client/locales/en.yml`：

```yaml
title: Text inspector
inspect: Inspect text
placeholder: Enter text to inspect
loading: Loading tool state
failed: Failed to load
offline: Disconnected; data below may be from the previous connection
tools: Tool count
```

## 组件接入与数据交互

在 `client/page.tsx` 中消费状态、调用 Action 并渲染界面：

```tsx
import { useState } from 'react'
import { Button, Input } from '@chatluna/ui-kit'
import { useAction, useLive, useTranslate } from '@chatluna/ui-client/client'
import type {} from '../src/types'

export function InspectorPage() {
  const t = useTranslate('example')
  const snapshot = useLive('example.inspector')
  const inspect = useAction('example.inspect')
  const [text, setText] = useState('')

  return (
    <main className="space-y-4 p-6">
      <h1>{t('title')}</h1>
      {snapshot.status === 'loading' && <p>{t('loading')}</p>}
      {snapshot.error !== undefined && <p role="alert">{t('failed')}: {snapshot.error}</p>}
      {snapshot.status === 'offline' && <p role="status">{t('offline')}</p>}
      {snapshot.data !== undefined && <p>{t('tools')}: {snapshot.data.toolCount}</p>}
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label={t('placeholder')}
        placeholder={t('placeholder')}
      />
      <Button
        disabled={inspect.pending || inspect.offline}
        onClick={() => void inspect({ text })}
      >
        {t('inspect')}
      </Button>
      {inspect.data !== undefined && <output>{inspect.data.length}</output>}
    </main>
  )
}
```

### 客户端 Hook 行为规范

- **`useLive`**：
  - 核心状态包括 `loading`、`ready` 和 `offline`。
  - 页面保留有旧快照数据并不代表当前网络连接仍然健康。界面逻辑应同时覆盖首次加载、请求出错、连接离线以及展示陈旧数据等各种边界状态。
- **`useAction`**：
  - 返回对象包含 `pending`、`data`、`offline` 状态，并内置错误 toast 处理。
  - 调用该 Hook 返回的执行函数时，内部会自行捕获失败并结算为 `undefined`，因此 `await action(...)` 没有抛出异常并不代表业务执行成功。若需明确感知成功回调，应配置 `onSuccess` 参数，或直接使用遇到异常会抛出 reject 的 `callAction`。

## 表单、目录与本地偏好

- **表单渲染**：对于配置项输入，使用 `@chatluna/ui-schema-form/client` 提供的 `SchemaForm`，避免为服务端已有的 Schema 重复编写输入控件。
- **列表展示**：列表类视图应复用 `ui-catalog` 提供的搜索、分组、排序与视图布局能力，基础按钮与输入框直接使用 `ui-kit`。
- **本地偏好存储**：仅限浏览器端使用的界面偏好配置必须接入 `@chatluna/ui-storage`，禁止直接调用原生 `localStorage`。业务数据与共享状态必须写入服务端对应服务，浏览器端存储不具备跨设备持久化能力。

## 权限与重试机制

- **权限范围**：WebUI 采用实例所有者的统一访问口令，不提供多用户账号体系。在 action context 中获取的 `user` 是基于请求凭据或网络地址派生的标识，不能等同于 IM 平台的用户 ID。执行敏感的管理操作时，需经由 `requireActionLevel` 等既有桥接逻辑校验权限级别，再调用目标底层服务。
- **请求重试与幂等**：客户端在未收到响应时，可携带相同的幂等 key 重试。需要注意，服务端幂等记录缓存在内存中，设置有生存期限且在服务重启后失效，不提供持久化的 exactly-once 保证。涉及外部资金、消息外发或应用安装等不可逆操作，仍须在业务逻辑层设计防重逻辑。

## 验证清单

在发布或合并前，按以下清单进行检查验证：

1. **类型完备性**：`server` 与 `client` 的协议类型均已声明并正常推断。
2. **多语言覆盖**：所有文本均提取至语言包，无硬编码中文/英文。
3. **打包产物**：检查入口静态构建产物配置，确保组件懒加载正常。
4. **生命周期**：验证插件热重载（HMR）、挂载及卸载时状态与路由能正常回收。
5. **异常与弱网**：断网或错误状态下提示正确，禁用态（`disabled`）表现正常。
6. **无障碍与适配**：支持键盘无障碍操作，并在窄屏移动端布局下正常可用。

测试时切勿仅凭页面截图推断请求成功，应同时配合 DOM 变化、交互响应与服务端输出日志进行综合验证。管理页面的实时快照协议与对话场景中的 durable SSE 机制不同，详细交互规范可参考 [HTTP 和实时协议](/development/api-reference)。
