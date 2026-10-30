# 编写第一个插件

ChatLuna 的扩展基于 Cordis 插件体系。编写扩展时，建议先通过最小插件理解配置声明、服务依赖与生命周期机制，再进一步增加工具、提示词或页面。不要直接修改 Agent 执行循环，也不要直接沿用 ChatLuna v1 的 LangChain 适配器接口。

## 1. 确定扩展接入点

在编写代码前，先根据需求选择对应的扩展接入机制：

| 需求 | 优先位置 |
| --- | --- |
| 向模型提供一个动作 | `tools` 注册 |
| 增加提示词变量或片段 | `prompt` 注册 |
| 接入另一种聊天执行方式 | `engines` |
| 为已有服务增加管理页面 | 双面 WebUI 插件 |
| 接入模型协议 | `provider` 注册与 SDK 适配 |
| 修改整个实例的通用能力 | 独立服务插件 |

在工程组织上：

- **官方仓库内**：`packages/<domain>/<name>` 用于存放可被其他模块依赖的公共库与底层服务；`plugins/<domain>/<name>` 存放由清单直接加载的叶子插件。其他包不能依赖叶子插件。
- **仓库外插件**：通常置于实例目录下的 `external/` 目录中，无需加入官方工作区（monorepo）。

## 2. 创建插件工程

在已有实例或源码工程目录中运行脚手架命令：

```sh
chatluna new plugin greeting --dir .
```

- 若需要管理页面，可追加 `--webui` 参数。
- 若需要生成服务骨架，可追加 `--service` 参数。

该命令会在 `external/greeting` 生成插件脚手架，并将插件挂载声明加入项目配置树。在启动实例前，请先核对生成的文件与清单差异。不要在生产实例中直接调试带有外部副作用的插件。

### 安装依赖与清单挂载的区别

全局 launcher 与实例运行时处于两个不同层级：

- `chatluna add` 用于安装底层 npm 依赖包。
- 清单（manifest）中的配置条目用于向运行时挂载插件。
- 对于本地已有插件，可通过 `chatluna link ./path/to/plugin --dir .` 进行接入。

请始终使用项目指定的包管理器进行操作，避免直接手动修改 `node_modules`。

## 3. 实现最小插件

以下是一个最小插件示例。该插件在挂载时输出一条日志，不访问网络，也不启动 Agent 循环：

```ts
import { Context, Schema } from '@chatluna/utils/cordis'

export interface Config {
  greeting: string
}

export const Config = Schema.object({
  greeting: Schema.string().default('Hello from greeting'),
})

export const name = 'chatluna-greeting'
export const inject = []

export function apply(ctx: Context, config: Config) {
  ctx.logger.info(config.greeting)
}
```

### 配置与标识约定

- **配置定义**：使用 Cordis Schema 提供默认值与输入类型校验。业务逻辑直接读取 `config` 传入的属性（如 `config.greeting`），不要再引入额外的 YAML 配置文件或通过读取全局环境变量作为第二套配置来源。
- **插件名称 (`name`)**：用于控制台诊断与日志标识，不强制等同于 npm 包名。
- **清单 ID (`id`)**：清单中的 `id` 是插件配置项的持久化唯一标识。不要在保存配置时动态生成随机 ID，否则会导致原有配置条目失效并产生重复条目。

## 4. 声明与使用服务依赖

当插件需要使用框架内其他服务（例如工具系统 `ctx.tools`）时，需显式声明依赖：

```ts
// 引入对应的模块扩展以获取类型提示
import type {} from '@chatluna/tool'

export const inject = ['tools']

export function apply(ctx: Context) {
  // 此处可安全访问 ctx.tools
}
```

### 服务依赖规则

- **必需依赖**：必须在 `inject` 列表中显式声明。不要通过 `ctx.get('tools')` 并行编写“若不存在则跳过”的兜底逻辑，这种写法会导致插件在关键依赖缺失时静默失效，排查困难。
- **可选依赖**：仅对非关键能力使用 `ctx.get(...)` 判断是否存在。
- **子功能按需挂载**：当插件的整块子逻辑强依赖某个服务时，使用 `ctx.inject(['service'], plugin)` 进行子级挂载，交由 Cordis 管理服务就绪等待与失效卸载。
- **上下文作用域隔离**：禁止手动 `new Context()` 尝试绕过限制获取服务；禁止跨越 root 上下文访问其他 fiber，也不得长期持有其他插件的 `ctx` 引用。辅助函数若需调用服务，应通过参数传入当前调用方的 `ctx`。

## 5. 生命周期管理与资源回收

在 Cordis 体系中，所有资源的分配都必须绑定其所有者：

- 框架原生 API（如 `ctx.on`、`ctx.tools.define`、`ctx.prompt.block`、WebUI 路由入口与 slots 挂载等）会自动绑定当前插件的生命周期。
- 优先使用已有的生命周期 API 管理定时器等资源。接入外部文件 watcher、系统监听或持久连接时，用 `ctx.effect()` 返回该资源真正的 disposer；不要为了展示清理而再包装框架已经管理的注册。

### 卸载与热重载 (HMR)

插件的一次挂载必须对应一次完整的注册。在插件被卸载后，不得残留任何重复路由、工具定义、后台定时器或未释放的连接。

热重载（HMR）会暴露出生命周期泄漏问题：若插件初次加载正常，但修改保存两次后出现重复触发或并发异常，通常是因为资源未随上下文 fiber 正常注销，此时应当检查清理函数，而不是引入模块级 `Set` 做临时去重。

> **注意**：
> - 基础服务卸载可能导致依赖该服务的所有下游插件级联停用。
> - 框架的生命周期隔离并不意味着任意热重载都能对正在运行中的活跃会话完全透明，也不会自动中断或撤销已向远端发出的外部请求。

## 6. 目录结构与依赖规范

- **入口职责**：`index.ts` 仅负责插件入口导出、配置绑定与服务装配。较复杂的业务服务应拆分至 `service.ts`。
- **类型与纯函数**：对外暴露的类型契约置于 `types.ts`；可复用的无副作用函数置于 `utils.ts`。不要为单次使用的逻辑设计过度封装的中间层。
- **包依赖声明**：
  - 存在运行时值导入的包，声明在 `dependencies` 或 `peerDependencies` 中。
  - 仅导入 TypeScript 类型的包，声明在 `devDependencies` 中，并同步更新 `tsconfig.json` 的 `references` 配置。
- **类型扩展**：自定义的跨包服务或新增事件必须通过 TypeScript 模块扩展（`declare module`）补充到上下文接口中，禁止使用 `as unknown as CustomContext` 等类型断言强行转换 `ctx`。
- **Schema 统一**：插件的配置声明与输入校验仅使用 Cordis 提供的 Schema，不要混入其他独立的 schema 校验库。

## 7. 验证与调试

### 验证顺序

调试插件时，建议遵循以下顺序：

1. **业务功能测试**：验证核心逻辑与输入校验，网络请求或工具测试时避免使用生产环境凭据或向实际平台群组发送消息。
2. **生命周期测试**：验证在依赖服务缺失时插件是否正确进入等待状态、插件卸载时已注册的资源是否彻底清除、重复加载/热更时逻辑是否保持幂等、异常失败时是否输出包含上下文的有效错误日志。

### 运行检查

- **在官方源码仓库中**：提交前依次运行以下检查命令：
  ```sh
  yarn lint
  yarn typecheck
  yarn test:unit
  ```
  如果上游包产物已过期，可先执行 `yarn build`。
- **在独立插件项目中**：按该项目脚手架生成的对应 npm 脚本进行类型检查与单元测试，不要假设独立工程具备官方 monorepo 的全局构建命令。

### 本地开发运行

执行以下命令启动开发模式：

```sh
chatluna dev .
```

`chatluna dev` 会启用源码加载与 HMR，但此模式下不提供生产环境 supervisor 进程的自动恢复与安全模式。

如果编译通过但插件功能未生效，请按顺序检查：
1. 实例正在读取的配置清单路径是否正确。
2. 插件条目在清单中是否被标记为禁用。
3. 插件声明的 `inject` 依赖是否已全部加载成功。
4. 插件的 `apply` 函数在执行时是否存在未捕获的报错。

## 下一步

- 编写模型可用函数：参考[模型工具开发](/development/tools)
- 介入上下文组装：参考[提示词扩展](/development/prompts)
- 扩展可视化界面：参考[管理页面开发](/development/webui)
- 参与框架核心贡献：参考[仓库开发规范](/development/repository)
