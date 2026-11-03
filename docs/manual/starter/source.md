# 从源码运行

::: tip
本节介绍从 Git 仓库检出 ChatLuna v2 源码并在本地构建、启动和调试，适合开发插件或调试框架的用户。
:::

## 环境要求

- **Node.js**：24 或更高版本。
- **Yarn**：Yarn 4。仓库已通过 `packageManager` 声明，直接执行 `yarn` 即可，不需要 `corepack`。

## 构建与启动

```sh
git clone https://github.com/ChatLunaLab/v2.git
cd v2
yarn install
yarn build
yarn chatluna start
```

启动后在浏览器中访问 `http://127.0.0.1:5028` 打开 WebUI。

::: warning
首次启动前必须执行 `yarn build`。类型检查通过不代表 `lib/` 产物已经生成；修改跨包依赖或拉取新代码后，也需要重新构建。
:::

## 开发模式

```sh
yarn chatluna dev .
```

开发模式通过 oxc-node 即时转译并启用热重载，修改 `packages/`、`plugins/` 或 `external/` 下的代码后保存即生效。

::: warning
开发模式关闭了守护进程的崩溃恢复和安全模式，仅限本地开发。不要在调试时使用含有生产机密的清单，也不要把含有令牌或凭据的配置提交到仓库。
:::

## 清单结构

源码运行通过两份清单装配系统，二者运行在同一个进程中：

1. **根清单 `cordis.yml`**：装配命令行入口与加载器等基础设施。
2. **业务清单 `chatluna.yml`**：由根清单中 `@cordisjs/plugin-cli-cordis` 条目的 `path` 指向，装配 ChatLuna 业务插件和 `5028` 端口上的 WebUI。

启动时依次查找 `cordis.yml`、`cordis.yaml`、`chatluna.yml`、`chatluna.yaml` 作为入口；启动其他目录用 `start --dir`。清单所在目录即 `baseUrl`，清单中的相对路径（如 `./data/chatluna.db`）都相对于它解析，与当前工作目录无关。

修改清单后可以检查是否有效：

```sh
yarn chatluna doctor config --dir .
```

::: tip
注意区分两个控制台：ChatLuna WebUI 在 `5028` 端口，负责业务配置与交互；Cordis 框架控制台默认端口为 `6140`，默认关闭。
:::

## 下一步

- [快速上手](../quickstart) — 控制台的初始配置。
