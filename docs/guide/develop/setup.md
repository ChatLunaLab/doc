# 环境搭建

::: tip
开发 ChatLuna v2 插件有两种方式：检出完整的源码仓库，或直接在已有实例中创建外挂插件。
:::

| 开发目标 | 环境 | 要求 |
| --- | --- | --- |
| 修改框架核心、开发内置包或核心插件 | [ChatLuna v2 源码仓库](https://github.com/ChatLunaLab/v2) | Node.js 24+、Yarn 4 |
| 只开发独立的外挂插件 | 已有的 ChatLuna 实例 | 实例能正常运行 |

## 源码工作区

需要修改框架本身或为官方仓库贡献代码时：

```sh
git clone https://github.com/ChatLunaLab/v2.git
cd v2
yarn install
yarn build
yarn chatluna dev .
```

开发模式基于 oxc-node 即时转译和热重载（HMR），修改 `packages/`、`plugins/` 或 `external/` 下的代码保存后自动重载，无需重启。

## 在已有实例中创建插件

只写外挂插件时，不必克隆整个仓库。在实例根目录执行：

```sh
chatluna new plugin my-plugin
```

插件骨架生成在 `external/my-plugin/`。可选参数：

- `--webui`：同时生成 WebUI 页面骨架。
- `--service`：生成提供服务的插件。
- `--scope <scope>`：指定 npm scope。
- `--group <group>`：指定所属分组。

```sh
chatluna new plugin my-plugin --webui --service
```

`external/` 下的插件会在实例启动时自动加载；在其他路径时，用 `chatluna link /path/to/my-plugin` 链接进来。

## 验证

1. 启动实例（源码环境下运行 `yarn chatluna dev .`）。
2. 在控制台的「插件」页面确认插件已出现。
3. 修改插件源码并保存，确认热重载正常触发。

## 下一步

- [配置文件](./config) — 配置文件的结构与规范。
- [第一个插件](./first-plugin) — 编写并运行第一个插件。
