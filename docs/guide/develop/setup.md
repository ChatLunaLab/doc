# 环境搭建

::: tip
本节介绍如何搭建 ChatLuna v2 的开发环境。你可以根据自己的需求，选择检出完整的源码仓库，或是直接在已有运行实例中脚手架创建外挂插件。
:::

## 选择开发方式

工欲善其事，必先利其器。根据你的开发目标，开发环境通常分为以下两种方式：

| 开发目标 | 适用环境 | 环境要求 |
| --- | --- | --- |
| 修改框架核心、开发内置包或核心插件 | 检出 [ChatLuna v2 源码仓库](https://github.com/ChatLunaLab/v2) | Node.js 24+、Yarn 4 |
| 仅开发独立外挂插件 (External Plugin) | 已有运行中的 ChatLuna 实例 | 已就绪的运行环境 |

---

## 方式一：从源码工作区搭建

如果你需要修改框架本身，或者打算为官方仓库贡献代码，配置源码工作区是最合适的方式。

### 1. 检出与构建

确保本地已安装 Node.js 24+ 与 Yarn 4，随后执行以下命令：

```sh
# 克隆源码仓库
git clone https://github.com/ChatLunaLab/v2.git
cd v2

# 安装依赖
yarn install

# 编译项目
yarn build
```

### 2. 启动开发模式

构建完成后，在仓库根目录下运行：

```sh
yarn chatluna dev .
```

开发模式基于 `tsx` 与热模块替换（HMR，Hot Module Replacement）。当你修改 `packages/`、`plugins/` 或 `external/` 目录下的代码并保存时，框架会自动重载相关模块，无需手动重启。

---

## 方式二：在已有实例中脚手架插件

如果你只需要编写独立的外挂插件，并不需要克隆整个代码仓库，直接在已有的 ChatLuna 实例中创建会更加轻量快捷。

### 1. 生成插件骨架

在实例根目录下执行 `chatluna new plugin` 命令：

```sh
# 生成名为 my-plugin 的基础插件
chatluna new plugin my-plugin
```

该命令将在当前实例的 `external/my-plugin/` 目录下生成完整的插件结构。

### 2. 可选配置参数

创建时还可以传入选项来调整插件的形态：

- `--webui`：为插件生成独立的 WebUI 页面骨架
- `--service`：将插件配置为提供服务的扩展
- `--scope <scope>`：指定插件的 npm scope
- `--group <group>`：指定插件所属的分组

例如，创建一个带有 WebUI 和服务功能的插件：

```sh
chatluna new plugin my-plugin --webui --service
```

### 3. 加载外挂插件

脚手架生成的插件默认位于 `external/` 目录下，实例启动时会自动扫描并加载该目录下的插件。若插件位于其他路径，你可以通过以下命令将其链接到实例中：

```sh
chatluna link /path/to/my-plugin
```

---

## 验证开发环境

准备工作完成后，我们可以通过以下步骤验证开发环境是否正常工作：

1. 启动你的 ChatLuna 实例（或通过 `yarn chatluna dev .` 启动源码环境）。
2. 打开控制台，进入「插件」页面。
3. 检查列表中是否已出现你正在开发的插件。
4. 修改插件源文件并保存，观察终端日志与界面，确认热重载正常触发。

---

## 下一步

现在开发环境已经就绪，接下来你可以前往：

- [配置文件](./config)：了解 ChatLuna 的配置文件结构与配置项规范。
- [第一个插件](./first-plugin)：动手编写并运行你的第一个功能插件。
