# Agent 扩展框架 (Extension Agent)

此插件为 ChatLuna 提供完整的 Agent 能力支持，涵盖 MCP 协议接入、Skills 技能加载、Computer 文件与终端操作、Sub-Agent 子代理委托以及 Trigger 定时/被动唤醒。

所有功能均通过 Koishi 控制台内的 WebUI 进行管理。

## 配置

- 前往插件市场搜索 `chatluna-agent` 并安装。

![安装 chatluna-agent](/images/agent-install.png)

::: tip 提示
如果无法正常搜索到 `chatluna-agent`，则说明官方插件源没有正常更新。
前往 market 插件设置为其他源即可：

![market](/images/markethuanyuan.png)

以下是推荐的一些插件源：

- [https://koishi-registry.yumetsuki.moe/index.json](https://koishi-registry.yumetsuki.moe/index.json)
- [https://kp.itzdrli.cc](https://kp.itzdrli.cc)

:::

安装后启用插件即可。启用成功后，Koishi 控制台左侧会出现 ChatLuna Agent 管理入口。

![控制台入口](/images/agent-sidebar.png)

## 使用

> [!TIP] 提示
> 启用此插件时，请确保当前聊天房间的聊天模式为 `plugin` Agent 模式。
> 可以查看 [聊天模式](../../guide/chat-chain/chat-mode.md) 了解如何切换。

启用插件后，点击控制台左侧的 ChatLuna Agent 入口进入 WebUI。

后续的 MCP 服务器添加、工具权限调整、Computer 后端启用、子代理管理和 Trigger 任务创建均在此 WebUI 中完成。

### 总览

进入 WebUI 后默认显示总览页面，展示各个子系统的运行状态。

![总览页](/images/agent-overview.png)

总览页中每个位置对应一个子系统：

- **MCP**：已连接的服务器数量和可用工具数。
- **Computer**：当前可用的后端和活跃会话数。
- **Skills**：扫描到的技能总数和可见技能数。
- **Sub-Agent**：已启用的子代理数量。
- **Tools**：可用工具总数。
- **Trigger**：启用的任务数。

如果某个位置显示错误，你可以点击进入对应页面进行排查。

### MCP

MCP 页面用于管理 MCP 协议服务器。你可以在此添加、编辑、删除和重连 MCP Server，以及控制每个 MCP Tool 的启用状态。

![MCP 页面 - 服务器列表](/images/agent-mcp-list.png)

#### 添加 MCP 服务器

点击页面上的新增按钮，进入 MCP 服务器编辑界面。

![MCP 页面 - 新增服务器](/images/agent-mcp-add.png)

首先为服务器填写一个**名称**作为标识，例如 `exa`、`filesystem`、`github`。然后选择**连接类型**。

对于 `stdio` 类型，需要填写启动命令（`command`）、参数（`args`）、环境变量（`env`）和工作目录（`cwd`）。对于 `http` 或 `sse` 类型，需要填写服务器地址（`url`）和请求头（`headers`）。

**超时时间**用于控制该服务器下工具调用的默认超时秒数，默认为 60。

填写完成后保存，页面会自动发起连接，等待状态变为 `connected` 即可。

![MCP 页面 - 连接成功](/images/agent-mcp-connected.png)

连接成功后，该服务器暴露的工具会自动出现在工具列表中。日志中也会打印可用工具数量。

#### 管理 MCP 工具

在 MCP 页面的工具区域，可以看到每个 MCP Server 注册的工具列表。

![MCP 页面 - 工具列表](/images/agent-mcp-tools.png)

每个工具支持以下控制项：

- **启用/禁用**：关闭后该工具不会注册给模型。
- **超时**：覆盖服务器级别的超时时间，单位秒。
- **选择器**：填写关键词，只有对话中包含这些关键词时工具才会出现在候选列表中。留空表示始终可用。

#### 重连和删除

如果 MCP Server 状态显示为 `error` 或 `reconnecting`，可以点击重连按钮手动发起重连。

不再使用的 Server 可以直接删除，删除后其注册的工具也会被移除。

### Tools

Tools 页面展示所有注册到 ChatLuna 的工具，包括 Computer 工具、MCP 工具、Skills 工具、Sub-Agent 的 `task` 工具、Trigger 的 `trigger` 工具，以及其他插件注册的工具。

![Tools 页面](/images/agent-tools.png)

每个工具提供以下控制项：

- **启用**：工具总开关。
- **主会话**：是否允许主 ChatLuna 会话使用。
- **ChatLuna**：是否允许普通 ChatLuna 来源使用。
- **角色**：是否允许角色扮演来源使用，可以分别控制群聊和私聊。
- **权限等级**：调用该工具所需的最低 Koishi 用户权限。默认情况下，`bash`、`file_read`、`file_write`、`file_edit`、`trigger` 等工具需要 3 级权限。
- **子代理**：控制哪些子代理可以使用该工具。

![Tools 页面 - 编辑工具](/images/agent-tools-edit.png)

> [!TIP] 提示
> 如果 WebUI 中工具已经开启但模型始终不调用，请先检查当前会话是否处于 `plugin` 模式，然后确认当前用户的权限等级是否满足要求。

### Computer

Computer 页面用于启用和管理文件操作、搜索、Shell 执行和终端能力。

![Computer 页面](/images/agent-computer.png)

插件支持三种 Computer 后端：

- **Local**：直接在 Koishi 所在机器上运行，适合个人开发机调试。
- **E2B**：使用 E2B 云沙箱，适合需要隔离执行的场景。
- **Open Terminal**：连接外部终端服务。

#### 启用 Local 后端

![Computer 页面 - Local 后端](/images/agent-computer-local.png)

在 Computer 页面找到 Local 后端，打开启用开关。

将 `scopePath` 设置为你希望模型可以访问的项目目录路径。`sandboxMode` 支持 `read-only`（只读）和 `workspace-write`（允许工作区写入）两种模式。`approvalMode` 推荐保持 `on-request`，这样高危命令会先要求用户确认。

配置完成后保存即可。

::: warning 警告
Local 后端直接操作宿主机。不要在面向普通用户的群聊中随意开放，也不要打开 `dangerouslySkipPermissions`。
:::

#### 启用 E2B 后端

![Computer 页面 - E2B 后端](/images/agent-computer-e2b.png)

在 Computer 页面找到 E2B 后端，打开启用开关。

填写 API Key，支持 `env:E2B_API_KEY` 格式从环境变量读取。模板默认为 `base`，如需桌面能力，可另填 `desktopTemplate`。

配置完成后保存即可。

#### 启用 Open Terminal 后端

![Computer 页面 - Open Terminal 后端](/images/agent-computer-openterminal.png)

在 Computer 页面找到 Open Terminal 后端，打开启用开关。

填写服务地址（`baseUrl`）和 API Key，保存即可。

#### Computer 提供的工具

启用任一后端后，以下工具会自动注册：

- `file_read`：读取文件内容或列出目录。
- `file_write`：创建或覆盖文件。
- `file_edit`：对已有文件做精确字符串替换。
- `grep`：正则搜索文件内容。
- `glob`：按 glob 模式匹配文件。
- `bash`：执行 Shell 命令，也可管理后台任务。
- `file_publish`：把生成的文件发布给用户（需要 `chatluna-storage-service`）。

#### 终端和后台任务

在 Computer 页面中可以打开交互式终端用于调试，以及查看和管理由 `bash` 工具启动的后台任务。

![Computer 页面 - 终端](/images/agent-computer-terminal.png)

### Skills

Skills 页面用于管理 `SKILL.md` 技能文件。技能是一种可复用的任务说明，模型可以按需加载并按照技能内容执行任务。

![Skills 页面](/images/agent-skills.png)

#### 导入技能

点击导入按钮，可以从三种来源导入技能：

- **GitHub**：填写仓库或目录 URL。
- **ZIP**：上传压缩包。
- **文件夹**：选择本地目录内容。

![Skills 页面 - 导入](/images/agent-skills-import.png)

导入前可以预览识别到的技能列表和诊断信息，确认无误后执行导入。

#### 管理技能

技能列表中每个技能支持以下操作：

- **启用/禁用**：控制技能是否可用。
- **模式切换**：在 `off`、`description`（默认，只注入名称和描述）、`full`（每轮注入完整内容）之间切换。
- **编辑内容**：编辑本地导入的 `SKILL.md`。
- **导出**：导出为压缩包。
- **删除**：删除导入到 `data/chatluna/skills` 的本地技能。

![Skills 页面 - 编辑技能](/images/agent-skills-edit.png)

#### 在聊天中使用技能

用户可以在聊天中用斜杠前缀手动调用技能：

<chat-panel>
  <chat-message nickname="User">@Bot /code-review 帮我检查这段代码的问题</chat-message>
  <chat-message nickname="Bot">（加载 code-review 技能后按照技能说明开始审查）</chat-message>
</chat-panel>

模型也可以自动通过 `skill` 工具调用可见技能。

### Sub-Agent

Sub-Agent 页面用于管理子代理。子代理允许主模型把特定任务委托给专门的代理执行。

![Sub-Agent 页面](/images/agent-subagent.png)

#### 内置子代理

插件内置三个子代理，默认关闭。在 Sub-Agent 页面中找到并启用即可。

- **plan**：只读分析代理，用于制定实现方案。只能使用 `file_read`、`grep`、`glob`。
- **explore**：快速搜索代理，用于收集代码上下文。只能使用 `file_read`、`grep`、`glob`。
- **general**：通用实现代理，可以读写文件和执行命令。

![Sub-Agent 页面 - 启用内置子代理](/images/agent-subagent-builtin.png)

启用后，模型会在系统提示中看到可用子代理列表，并在需要时通过 `task` 工具自动委托任务。

#### 新建自定义子代理

![Sub-Agent 页面 - 新建子代理](/images/agent-subagent-create.png)

点击新建按钮，填写子代理的**名称**和**描述**。描述会展示给主模型，用于在多个子代理之间进行选择。

在**系统提示词**中编写子代理的工作说明，然后选择允许使用的**范围**（ChatLuna 会话、角色群聊、角色私聊）和**权限等级**。

如需使用固定模型，可以在模型名称字段中指定；留空则继承父模型。最后配置该子代理的 Skills、MCP、Tools、Computer 权限规则，保存即可。

#### 导入子代理

点击导入按钮，可以上传或粘贴带 YAML frontmatter 的 Markdown 文件。插件兼容三种格式：

- **ChatLuna 格式**：推荐格式。
- **Claude 格式**：来自 `~/.claude/agents` 的 Markdown 文件。
- **OpenCode 格式**：来自 `~/.config/opencode/agents` 的 Markdown 文件。

![Sub-Agent 页面 - 导入子代理](/images/agent-subagent-import.png)

导入前可以预览解析结果和诊断信息。

#### 在聊天中使用子代理

启用子代理后，在 `plugin` 模式会话中，模型会自动判断是否需要委托任务：

<chat-panel>
  <chat-message nickname="User">帮我查一下用户登录功能在哪些文件里实现的。</chat-message>
  <chat-message nickname="Bot">我会把这个代码探索任务委托给 explore 子代理。<br/>（explore 子代理开始搜索并返回结果）</chat-message>
</chat-panel>

### Trigger

Trigger 页面用于创建定时或被动触发任务。任务触发后会主动唤醒 ChatLuna，向模型发送预设消息并执行对话。

![Trigger 页面](/images/agent-trigger.png)

> [!TIP] 提示
> 使用 Trigger 功能需要启用 Koishi 数据库服务。

#### 创建任务

![Trigger 页面 - 创建任务](/images/agent-trigger-create.png)

点击新建任务按钮，选择目标 **bot**、**平台**以及要发送的**用户或群组**。

然后选择**触发器类型**（Provider），填写**任务名称**和**唤醒消息**（即触发后发送给模型的内容）。

**回复方式**支持三种模式：`channel`（回复到频道）、`user`（私发给用户）和 `silent`（不发送回复）。根据实际场景选择合适的回复方式，填写触发器参数后保存即可。

保存后可以点击「立即触发」按钮测试一次。

#### 内置触发器类型

- **cron**：使用标准 cron 表达式周期触发。例如 `0 9 * * 1-5` 表示工作日上午 9 点。
- **once**：在指定时间触发一次，触发后自动禁用。
- **keyword**：当消息文本包含配置的关键词时被动触发。
- **activity**：根据群聊活跃度（消息频率、参与人数等因素）达到阈值时触发。

![Trigger 页面 - Cron 配置](/images/agent-trigger-cron.png)

#### 管理任务

Trigger 列表中可以对每个任务进行以下操作：

- **启用/禁用**：暂停或恢复任务。
- **编辑**：修改消息、参数、目标和回复方式。
- **立即触发**：不等待触发条件，马上执行一次。
- **删除**：移除任务。

如果任务执行失败，可以在任务详情中查看 `lastError` 字段排查原因。

::: warning 警告
Trigger 可以主动让模型发送消息。在公开群聊中使用时，请配置合理的冷却时间，并在 Tools 页面收紧 `trigger` 工具的权限等级。
:::
