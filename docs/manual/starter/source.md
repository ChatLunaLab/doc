# 从源码运行

::: tip
本节介绍如何从 Git 仓库检出 ChatLuna v2 源码，并在本地完成构建、启动与调试。适合需要开发插件或调试框架底层代码的用户。
:::

检出仓库后，你可以直接修改 `packages/`、`plugins/` 以及 `external/` 目录下的源码。

## 环境要求

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**：24 或更高版本
- **Yarn**：Yarn 4（仓库已通过 `packageManager` 字段声明，直接执行 `yarn` 即可，无需通过 `corepack` 调用）

## 获取与构建源码

克隆代码仓库后，需要先安装依赖并构建项目：

```sh
# 克隆仓库并进入目录
git clone https://github.com/ChatLunaLab/v2.git
cd v2

# 安装依赖
yarn install

# 构建产物
yarn build
```

::: warning
初次启动前必须执行 `yarn build`。即使 TypeScript 类型检查通过，也不代表 `lib/` 产物已编译生成。在修改跨包依赖或拉取远程最新代码后，都需要重新执行 `yarn build`。
:::

## 启动服务

完成构建后，运行以下命令启动服务：

```sh
yarn chatluna start
```

服务启动后，在浏览器中访问 `http://127.0.0.1:5028` 即可打开 ChatLuna WebUI，继续进行配置。

## 进入开发模式

如果你需要对代码进行实时修改与调试，请使用开发模式启动：

```sh
yarn chatluna dev .
```

`dev` 模式会通过 oxc-node 进行即时转译，并启用热重载 (HMR)。修改 `packages/`、`plugins/` 或 `external/` 目录下的代码并保存后，变更将即时生效，无需手动重启进程。

::: warning
开发模式会主动关闭监管进程 (Supervisor) 的崩溃恢复与安全模式，仅限本地开发使用。切勿在本地调试中使用包含生产机密的清单文件，也不要将包含个人 Token 或敏感凭据的配置文件提交至代码仓库。
:::

## 理解清单结构

源码运行默认通过清单 (Manifest) 来装配系统：

1. **根清单 (`cordis.yml`)**：负责装配基础设施（命令行入口与加载器）。
2. **业务清单 (`chatluna.yml`)**：由根清单中 `@cordisjs/plugin-cli-cordis` 条目的 `path` 配置指向并载入，负责装配 ChatLuna 业务插件以及运行在 `5028` 端口上的 WebUI 服务。

整个系统运行在同一个实例进程中，并不会针对两份清单分别启动独立进程。

### 清单查找与基准路径

- **查找顺序**：程序会依次在目录中寻找 `cordis.yml`、`cordis.yaml`、`chatluna.yml`、`chatluna.yaml` 作为入口清单。若要启动其他目录下的实例，可以使用 `start` 命令的 `--dir` 选项指定路径。
- **基准路径 (`baseUrl`)**：清单文件所在的目录即为 `baseUrl`。清单配置中的所有相对路径（例如 `./data/chatluna.db`）均以此目录为基准进行解析，与执行启动命令时所在的当前工作目录无关。

## 诊断配置

修改清单文件后，你可以运行配置诊断命令来检查当前目录下的清单是否有效：

```sh
yarn chatluna doctor config --dir .
```

::: tip
请注意区分系统中的两个控制台入口，两者的端口和访问路径不能互相混淆或替代：
- **ChatLuna WebUI**：运行在 `5028` 端口，提供 ChatLuna 业务层面的配置与交互。
- **Cordis 框架控制台**：默认端口为 `6140`，默认处于关闭状态。
:::

## 下一步

- 前往 [快速上手](../quickstart) 查看控制台初始配置与功能接入步骤。
