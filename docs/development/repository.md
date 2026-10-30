# 仓库开发与贡献

本文面向修改 ChatLuna v2 源码的开发者。编写第三方独立插件请先阅读[编写第一个插件](/development/plugins)。

仓库内的 `AGENTS.md` 构成当前的实现与验证契约，其约束效力优先于历史计划、过时的 README 以及其他版本的文档。

## 准备环境

开发环境要求：
- Node.js 24+
- Yarn 4（使用仓库声明的具体版本，禁止混用其他包管理器，禁止使用其他锁文件尝试修复安装依赖问题）

### 初始化命令

```sh
yarn install
yarn build
yarn typecheck
```

### 构建与产物注意事项

- 当包依赖通过编译产物（如 `lib/index.js`）进行解析时，`yarn typecheck` 成功并不代表产物已同步生成。
- 新增子包或修改包间依赖关系后，必须先执行 `yarn build` 再运行测试，以防止出现 `ERR_MODULE_NOT_FOUND` 或针对旧产物执行测试。
- 构建命令若输出错误日志，即使进程退出码为 `0`，也必须检查目标产物与控制台报错；退出码不可作为构建成功的唯一判定依据。

## 目录结构与命名规范

### 仓库目录职责

| 路径 | 用途 |
| --- | --- |
| `packages/domain/name` | 可作为依赖导入的服务、协议定义与共享库 |
| `plugins/domain/name` | 仅通过配置加载的叶子插件（禁止被其他包直接依赖） |
| `external/` | 本地测试或外部插件目录 |
| `tests/` | 跨模块行为验证与集成测试 |
| `scripts/` | 仓库布局、依赖关系、构建流程与门禁检查脚本 |
| `.agents/notes/` | 架构决策与变更说明规范文档 |

### 包命名规则

- `packages/domain/core` 对应的 npm 包名通常为 `@chatluna/domain`。
- 其他 domain 路径下的包命名为 `@chatluna/domain-name`。
- `packages/core/name` 下的包命名为 `@chatluna/name`。
- 严禁将单一业务能力分散到无法追踪的多个聚合包中；严禁直接 import `plugins/` 目录下的叶子插件包。

### 单包源码组织

- `index.ts`：作为入口与装配位置；将服务实现放在 `service.ts`，避免入口逐渐承载整个领域的实现。
- `service.ts`：承载复杂的运行时服务实现。
- `types.ts`：定义对外暴露的契约与类型接口。
- `utils.ts`：存放确有复用价值的纯逻辑工具函数。
- 严禁创建 `misc/`、`common/`、`shared/` 等职责不清的目录；禁止将仅有单一调用方的内部辅助函数提升为核心公共 API。

## 代码原则

- **编码风格**：与上下文既有代码风格保持一致。优先使用 `const`、提前返回（early return）与扁平清晰的对象字面量；不为运行时不可能出现的生命周期状态编写冗余防御代码；禁止将 `null`、`undefined`、空字符串（`""`）与 `false` 随意隐式归一。
- **配置与类型收窄**：
  - 配置与运行时校验统一采用 Cordis Schema。
  - 严禁在业务源码与测试中使用 `as` 强制断言或作为应用级 `any` 绕过检查。
  - 处理外部非可信输入时，先标注为 `unknown` 再通过条件判断或校验器完成类型收窄。
  - 需要使用跨包服务或监听跨包事件时，采用 TypeScript 模块扩展（module augmentation）扩展 `Context`，严禁将 `ctx` 强转为伪造的私有接口。
- **依赖声明**：
  - 产生实际运行时引用的包，在对应 package 的 `package.json` 中维护至 `dependencies` 或 `peerDependencies`。
  - 仅作为类型引用的依赖维护至 `devDependencies`。
  - 增删内部包依赖时，必须同步更新该包 `tsconfig.json` 的 `references` 配置。错误的包边界、目录配置与引用关系将被 CI 门禁拦截。

## 生命周期管理

- **依赖注入**：
  - 必需的服务依赖通过 `inject` 属性静态声明。
  - 整块可选的子系统或子能力，通过 `ctx.inject` 进行条件挂载。
  - 仅在部分方法中可选调用的依赖，通过 `ctx.get` 按需读取。
- **Context 作用域**：
  - 所有资源注册必须归属于当前插件分发的 `ctx` 实例。
  - 严禁自行 `new Context`，严禁穿透访问 root context，严禁将 context 引用保存在超出对应 fiber 生存周期的持久变量中。
- **资源释放**：
  - 插件声明的工具、提示词、路由、slots、事件监听与定时器必须在插件卸载时完全注销。
  - 接入外部第三方库生命周期时，使用 `ctx.effect` 并返回其对应的 disposer 清理函数。
- **错误处理**：
  - 仅在能够完成恢复、上报或能补充有效上下文信息的逻辑边界捕获错误。
  - 禁止捕获日志后不经增强原样重新 `throw`；禁止在发生错误时静默返回缺省默认数据掩盖异常。

## WebUI 开发约束

- **双面渲染**：页面属于 server/client 同包的双面 WebUI 架构。
- **组件复用**：UI 实现需复用 `ui-kit`、`SchemaForm`、类型化插槽（typed slots）与 `catalog`。
- **偏好持久化与国际化**：浏览器端偏好设置统一使用 `ui-storage`；界面文案需同时提供 `zh` 与 `en` 国际化资源。
- **依赖管理**：仅允许通过集中 bundle 配置添加跨平台模块，防止页面打包引入多个不一致的运行时实例。
- **技术栈边界**：文档站使用的 Vue 组件与应用端 WebUI 的 React 组件完全独立。修改文档主题与文档页面时，禁止引入应用端 WebUI 的运行时依赖。

## 本地启动与调试

通过如下命令启动开发环境：

```sh
yarn chatluna dev .
```

- **开发模式特性**：该命令会启用源码直接加载与热重载（HMR），但不提供生产 supervisor 的完整进程恢复与安全模式隔离能力。
- **密钥安全**：本地配置文件覆盖与 API 密钥不得提交至版本控制中。禁止为了提供启动示例而将个人的 `chatluna.yml`、平台账号身份凭证或 provider token 提交到仓库。
- **测试环境隔离**：开发调试与集成测试需依赖真实服务时，使用隔离环境、mock/fake provider 与临时数据目录；禁止接入生产 adapter，禁止将测试消息直接发送到真实群聊环境中。
- **UI 校验标准**：WebUI 校验需结合类型检查、DOM 结构、用户交互行为与控制台日志，不得仅以单次页面截图判定验证通过。

## 验证与门禁检查

### 本地预提交检查顺序

在提交代码前，按顺序执行：

```sh
yarn lint
yarn typecheck
yarn test:unit
```

- 若包的编译产物可能已过期，执行测试前先运行 `yarn build`。
- 根据变更所影响的模块，按需追加 `integration`、`recovery`、`e2e` 或 `compat` 检查。
- 执行全局完整验证可调用 `yarn test`；当耗时较长时，应将其置于后台运行并等待输出结果，避免并发启动多套测试进程。

### 自动化门禁覆盖范围

CI 会强制执行以下检查门禁：
- `verify-layout`：检查单包与目录布局规范。
- `verify-refs`：校验 TypeScript 项目间的 references 映射一致性。
- `Agent Notes`：检查决策说明文档规范。
- WebUI client 构建检查。
- 测试覆盖率映射校验。

编写测试用例时，测试断言应针对真实行为而非对实现逻辑表达式的重复镜像。必要的 mock 必须限定在系统边界，禁止为了编写测试而大范围重写或替换全局环境对象。

## 双语 Agent Note 规范

任何非机械性修改（如格式化、简单类型修正以外的改动），必须在同一提交中追加或同步更新对应的中英文决策说明文档：

```text
.agents/notes/implemented/feature/2026-10-30-example.zh.md
.agents/notes/implemented/feature/2026-10-30-example.en.md
```

### 文档格式规范

**已实现决策（`implemented`）：**
- 文件的第一行必须为 `# Agent Note: <title>`。
- 留一空行后，声明状态：`Status: implemented`。
- 正文须按序包含以下四节：
  1. `Problem`
  2. `Decision`
  3. `Alternatives considered`
  4. `Consequences`

**草案与提案（`proposed`）：**
- 放置于 `.agents/notes/proposed/` 目录下。
- 文件同样以 `# Agent Note: <title>` 和 `Status: proposed` 开头。
- 正文使用二级标题，依次包含以下五节：
  1. `Problem`
  2. `Proposal`
  3. `Alternatives considered`
  4. `Acceptance criteria`
  5. `Risks`

### 维护原则

- Agent Note 必须与当前代码逻辑的事实保持一致。若后续变更推翻了原有架构决策，需新增关联决策说明，禁止使 `implemented` 目录下的文档保留已不存在的代码路径或过时默认值。
- `docs/adr` 与 `docs/legacy` 属于归档历史资料，新出现的架构决策严禁写入上述路径。

## 提交与评审流程

- **提交原子性**：每个完整的逻辑改动需将功能代码、测试用例以及 Agent Note 归入同一个 Git 提交中。
- **Commit 规范**：使用英文 Conventional Commits 格式编写提交说明（例如 `feat(core): ...`、`fix(webui): ...`）。
- **分支保护**：`cordis4` 为受保护主分支，必须通过 Pull Request 合并代码，PR 内容须严格填写仓库提供的模板。
- **权限边界**：执行 `git push`、创建 PR、部署操作与版本发布必须取得明确授权，获得提交代码（commit）许可并不意味着自动获得推送与发布权限。
- **变更核对**：提交前务必完整审查 `staged`、`unstaged` 以及 `untracked` 三类状态的改动，彻底排除构建产物、本地缓存及敏感凭证。
- **真实报告**：在 PR 中客观报告实际执行过的测试命令、失败详情及跳过特定检查的具体原因，禁止将“代码示例阅读正常”当作“通过完整集成测试”进行虚假陈述。
