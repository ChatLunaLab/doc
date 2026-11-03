# 发布插件

完成插件开发后，你可以将它发布到 npm 注册表。发布后，其他用户即可在控制台的「市场」页面中搜索并安装该插件，或通过 `chatluna add` 命令行工具一键安装。

本节将介绍从准备包结构、导出插件入口到发布到 npm 的完整流程。

## 准备包结构与配置

一个标准的 ChatLuna 插件包目录结构如下：

```text
my-plugin/
  package.json      # 项目元数据与依赖配置
  src/index.ts      # 源码入口文件
  lib/              # 编译生成的产物目录
```

在插件根目录下创建并配置 `package.json`。该文件至少需要包含 `name`、`version`、`main`（指向编译产物）以及 `peerDependencies`：

```json
{
  "name": "@your-scope/chatluna-my-plugin",
  "version": "1.0.0",
  "main": "lib/index.js",
  "peerDependencies": {
    "@chatluna/core": "*"
  }
}
```

命名建议：
- 包名建议采用 `@your-scope/chatluna-xxx` 或 `chatluna-xxx` 格式，便于用户在市场中检索和识别。
- 请务必将 `@chatluna/*` 等框架核心包写入 `peerDependencies`，而不是 `dependencies`。宿主环境在运行时已提供框架核心，插件无需重复打包。

## 编写插件入口

在 `src/index.ts` 中导出插件的核心定义：

```ts
import type { Context } from '@chatluna/core'

// 插件名称
export const name = 'my-plugin'

// 依赖的服务 (Service) 声明
export const inject = []

// 插件配置定义
export const Config = {}

// 插件入口函数
export function apply(ctx: Context, config: typeof Config) {
  // 在这里使用 ctx 注册能力
}
```

入口文件只应导出插件元数据与入口（`name`、`inject`、`apply`、`Config`），切勿在模块顶层直接执行任何带有副作用的操作。所有的初始化逻辑都应交由 `apply` 函数处理，由框架在加载插件时统一调用。

## 发布到 npm

发布流程与普通的 npm 软件包一致。在项目根目录下完成代码编译后，运行以下命令发布至 npm 注册表：

```sh
npm publish --access public
```

发布完成后，用户即可在控制台的「市场」页面搜索并安装该插件，或在终端执行以下命令进行安装：

```sh
chatluna add my-plugin
```

## 开发与发布规范

为确保插件稳定运行并与框架生命周期协同，编写与发布插件时请遵循以下规范：

- **避免顶层副作用**：所有初始化操作和业务逻辑必须放在 `apply` 函数内执行，避免在模块导入时意外触发逻辑。
- **避免单例泄漏**：通过上下文 `ctx` 注册的资源会在插件卸载时由框架自动清理。不要将带有状态的实例保存在模块级单例变量中，否则可能导致插件重载后状态错乱。
- **声明依赖关系**：如果插件依赖特定的框架服务（Service），请在 `inject` 字段中声明。框架会在所有依赖服务就绪后再调用 `apply`，无需在 `apply` 函数内通过轮询等待服务就绪。

## 继续

- [插件与生命周期](../plugin/lifecycle)
