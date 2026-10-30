# 伪装推荐插件

本页面列出了搭配 ChatLuna 伪装插件使用时推荐安装的插件，按模板项目中的层级分类整理。

如果你通过 ChatLuna Koishi 模板部署，则下列大部分插件已被安装、配置完成，仅需关注 `chatluna-toolbox` 的配置。

**不要忘记在修改插件配置后，点击右上角的“重载配置”按钮**


## 基础

ChatLuna 核心组件，提供基本的对话能力。

### chatluna

ChatLuna 主插件，提供对话系统核心功能。

**推荐配置：**

- 在"对话行为选项"中启用 `attachForwardMsgIdToContext`（如需使用合并转发读取功能）

### chatluna-character

基于 Prompt 工程，尝试让大语言模型在群内伪装成群友对话。

**推荐配置：**

- 在对应会话配置的"上下文"中启用 `enableMessageId`（如需使用合并转发读取功能）
- 如果你在使用官方 Bot 进行私聊，请开启 Koishi 插件 `inspect`，并向 Bot 发送 `inspect`，将其中"用户 ID"的值填写至"应用到的私聊"配置中

### chatluna-storage-service

> 强烈建议安装

提供文件存储服务，同时可以防止 QQ 图床、文件的链接过期。

**推荐配置：**

- 将"存储后端类型"改为"本地文件存储"
- 将"Koishi 在公网或者局域网中的路径"改为你的环境中实际的路径，确保此路径可以被你的 NapCat 或 LLBot 正常访问：
  - **Linux Docker 部署：**
    - 若 Koishi 与你的 NapCat 或 LLBot 使用 Docker 部署在同一个容器中，请尝试保持默认地址 `http://127.0.0.1:5140`，不要修改
    - 若 Koishi 与你的 NapCat 或 LLBot 使用 Docker 部署在不同容器中、但使用同一个 Docker 网桥时，可以填写 `http://koishi:5140`，5140 为你的 Koishi 容器内端口
    - 不建议使用容器在宿主机的内网 IP 连接，因为容器的内网 IP 可能会在重启后重新分配，导致原有连接断开
  - **其他部署：**
    - 其他部署方案（如 Windows），请尝试保持默认地址 `http://127.0.0.1:5140`，不要修改

### chatluna-multimodal-service

> 使用 Gemini 或不支持图像输入的模型时推荐

提供图像描述服务、图像及文件（含视频）读取/描述工具。

**推荐配置：**

- 若使用 Gemini，可以启用 `enableImageReadTool`、`enableFileReadTool`
- 若使用不支持图像输入的模型（如 DeepSeek），可以启用 `enableContextImageDescription`、`enableImageReadTool`，并在图像描述服务设置中配置一个支持图像输入的模型以生成图像描述


## 扩展

增强 ChatLuna 功能的扩展插件。

### chatluna-plugin-common

提供一些通用的工具，包括预设中用到的群管工具。

**推荐配置：**

- 只启用"群管插件"，其他选项全部关闭
- 在"群管插件配置"中配置好：
  - "允许使用群管功能的成员 ID 列表"（可以要求 Bot 使用群管功能的人）
  - "允许使用群管功能的群 ID 白名单"

### chatluna-toolbox

提供戳一戳、贴表情、撤回消息等功能。

**推荐配置：**

- 在"原生工具"中启用"NapCat OneBot"或"LLBot OneBot"中你使用的协议
- "XML 工具"配置：
  - **非工具调用预设：** 启用除了 `injectXmlToolAsReplyTool` 和 `enableBanXmlTool` 之外的全部选项
  - **工具调用预设：** 启用除了 `enableBanXmlTool` 之外的全部选项
- 其他选项全部关闭

### chatluna-forward-msg

提供合并转发记录读取、发送功能。

**推荐配置：**

- 在"协议选择"中选择你使用的协议
- 在"图片描述服务"中选择一个多模态模型
- 在 `chatluna` 插件的"对话行为选项"中启用：`attachForwardMsgIdToContext`
- 在 `chatluna-character` 插件对应会话配置的"上下文"中启用：`enableMessageId`

### chatluna-long-memory

提供长期记忆功能。

**推荐配置：**

- 将所有"长期记忆引擎配置"改为 `Basic`
- "启用的记忆检索层"只勾选"群组层"

### memesluna

提供表情包发送功能，建议自行准备一张“拒绝”类型的表情包以应对不友好的用户。

### chatluna-llm-web-search

提供全网/X 平台搜索、URL 读取功能。

### chatluna-qweather

提供天气查询功能。

### chatluna-social-media-reader

提供 B 站、小红书视频/帖子读取功能。

### chatluna-google-reverse-image-search

提供高质量的以图搜图功能。


## 高级

提供 Agent、媒体生成、知识库等高级能力。

### chatluna-agent

提供丰富的 Agent 相关能力（MCP、Skill、子 Agent、沙盒终端等），可控制工具在任意会话中的权限、进行文件处理、使用子 Agent 节约时间与 token 开销。

**推荐配置：**

- 参考 [Agent 配置](../../ecosystem/plugin/extension-agent.md) 进行配置

### media-luna

提供丰富的媒体生成能力（包括文本生成图片、图片生成图片、音频生成、视频生成），搭配适当的配置可以实现用 AI 生成图片等需求。

该项目的 WebUI 有待改进。

### chatluna-vector-store-service

向量数据库服务，为知识库和长期记忆提供底层支持。

**推荐配置：**

- 参考 [向量数据库](../configure-vector-database/introduction.md) 进行配置


## 其他插件

增强 Koishi 的使用体验。

### sidebar-manager

帮助你折叠不需要的 Koishi 侧栏图标。

### logger-plus

更好的 Koishi 日志插件，提供日志暂停、筛选、向前滚动等功能。

### without-assignee

解决同平台适配器接入过一个以上的账号后，Bot 无法触发响应的问题。

### ffmpeg-path

提供完善的媒体转码服务，解决部分平台/ API 无法接收/发送不受支持的文件的问题。

### 语音服务（TTS）

提供 TTS 服务用于发送语音。

**推荐配置：**

- 语音服务请自行寻找合适的插件或尝试使用 `media-luna`
- 如果无需使用，也可以直接删去预设中 `voice` 相关描述
