# 常见问题

本节整理了在使用和开发 ChatLuna v2 过程中经常遇到的问题，涵盖架构设计、安装部署、平台适配与数据管理等方面。

## ChatLuna v2 与 v1 的关系是什么？

ChatLuna v2 是基于 Cordis 4 框架构建的独立应用程序（Harness），不再作为 Koishi 插件运行。两者的定位与关联如下：

- **v1 维护状态**：作为 Koishi 插件的 v1 版本仍处于维护状态。
- **未来兼容**：v2 已预先设计了可共存的插件树架构，便于后续与同样基于 Cordis 的 Koishi v5 协同运行。
- **版本迁移**：如果你需要将现有的配置与数据从旧版本迁移过来，请参阅 [从 v1 迁移](/cookbook/migration)。

## 是否必须使用命令行安装？

并不是。虽然使用 `chatluna` CLI 命令行工具是初始化最快捷的方式，但你也可以根据自己的运行环境选择其他部署途径：

- 使用 [Docker Compose 部署](/manual/starter/docker)
- 通过 [源码构建安装](/manual/starter/source)

完成基础服务的安装与启动后，绝大多数插件与功能配置都可以直接在 WebUI 控制台中完成。

## 支持接入哪些聊天平台？

ChatLuna v2 通过 Satori 适配器（Adapter）连接各个即时通讯平台，你可以按需安装对应的适配器插件：

- **QQ**（通过 OneBot 协议）
- **Telegram**
- **Discord**
- **飞书**
- **KOOK**
- **内置 WebUI 聊天**（随应用自带）

具体的适配器安装与连接参数配置，请参阅 [平台适配](/manual/usage/adapters)。

## 支持调用哪些大语言模型？

ChatLuna v2 统一采用 `provider:model` 格式的寻址规范来定位模型资源。模型提供商配方（Provider Recipe）支持按需安装与扩展：

- **AI SDK 生态**：安装 `@chatluna/provider-aisdk` 即可接入 OpenAI、Anthropic、Gemini、DeepSeek 等兼容 AI SDK 的模型服务。
- **原生驱动**：针对特定服务，也可以使用对应的 native 驱动直连接入。

具体的配置语法与参数说明，请参阅 [模型配置](/manual/usage/models)。

## 一定要配置商业 API Key 吗？

不一定，这取决于你所使用的模型服务类型：

如果你使用云端商业模型提供商，ChatLuna 需要通过你填写的服务商 API Key 发起调用与鉴权。

::: tip
如果你选择运行本地模型（如 Ollama 等），只要其服务对外暴露了兼容的模型接口端点，同样可以直接接入 ChatLuna，此时无需填写云端商业 API Key。
:::

## 机器人与终端 Agent Harness 有何区别？

ChatLuna 专为多用户即时通讯（IM）平台设计，不同于 Claude Code、pi 等面向单用户本地终端环境的 Agent Harness：

- **多维路由**：会话严格按 `platform:channel:user` 复合维度进行隔离与调度，确保不同上下文互不干扰。
- **消息渲染**：根据各聊天平台的消息格式限制，自动将输出转换为平台支持的富文本、图片或卡片完成投递。
- **权限判定**：依托用户标识、群组身份、平台角色等多层级权限体系进行访问控制。

工具、技能、MCP、子代理等 Agent 能力均深度嵌入在这套面向多用户的 IM 通信链路中运作，而非孤立运行于本地终端。

## 实例数据保存在哪里？

实例运行过程中产生的数据统一保存在实例目录下的 `data/chatluna/` 路径中：

- **会话日志**：多渠道的对话记录
- **长期记忆**：记忆数据（默认使用 Markdown 后端持久化存储）
- **预设文件**：角色与系统预设（Presets）
- **调试轨迹**：执行轨迹记录文件 `traces.jsonl`

::: tip
在日常维护或迁移环境时，你只需要完整备份整个实例根目录，即可保留所有状态与数据。
:::

## 如何参与开发与反馈？

你可以通过以下渠道参与 ChatLuna 项目的建设与讨论：

- 阅读 [开发指南](/guide/)，了解应用生命周期与插件编写规范。
- 访问 GitHub 仓库 [ChatLunaLab/chatluna](https://github.com/ChatLunaLab/chatluna)，提交代码贡献或缺陷报告。
- 加入官方 [讨论群](/about/contact) 交流使用经验。

## 下一步

- 了解如何 [从 v1 迁移](/cookbook/migration) 至 v2 架构
- 配置聊天渠道：参阅 [平台适配](/manual/usage/adapters)
- 配置模型推理接入：参阅 [模型配置](/manual/usage/models)
