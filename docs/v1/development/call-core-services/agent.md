# Agent 与 Sub-Agent

ChatLuna 的高层 Agent API 都通过 `ctx.chatluna.createAgent()` 来用。你可以创建单个 Agent，也可以组合多个子 Agent 协同工作。

## 创建 Agent

用 `ctx.chatluna.createAgent()` 就能创建一个 Agent：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context } from "koishi";

const ctx = new Context();

// ---

import type {} from "koishi-plugin-chatluna/services/chat";

const agent = await ctx.chatluna.createAgent({
  name: "researcher",
  description: "一个负责搜索和整理资料的 Agent",
  model: "openai/gpt-5.4",
  embeddings: "openai/text-embedding-3-small",
  tools: ["web-search", "web-browser"],
  preset: "sydney",
  mode: "tool-calling",
  maxSteps: 8,
  handleParsingErrors: true,
});
```

常用参数说明：

- `model`（**必填**）：字符串，格式为 `平台/模型`，比如 `'openai/gpt-5.4'`。
- `tools`：可选。传一个工具名数组或 LangChain 工具数组；不传时默认激活所有可用工具。
- `preset` 或 `system`：二选一。用已有预设就传 `preset`，想自定义系统提示词就传 `system`。
- `mode`：可选，默认是 `'tool-calling'`。
- `maxSteps`：可选，限制最多调用多少轮工具。
- `handleParsingErrors`、`instructions`、`toolMask` 等参数一般只在更复杂的插件中才会用到。

## 调用 Agent

创建 Agent 之后，调用 `generate()` 就能生成回复：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, type Session } from "koishi";

const ctx = new Context();
const session = {} as Session;

import type {} from "koishi-plugin-chatluna/services/chat";

const agent = await ctx.chatluna.createAgent({
  name: "researcher",
  description: "一个负责搜索和整理资料的 Agent",
  model: "openai/gpt-5.4",
  embeddings: "openai/text-embedding-3-small",
  tools: ["web-search", "web-browser"],
  preset: "sydney",
  mode: "tool-calling",
  maxSteps: 8,
  handleParsingErrors: true,
});

// ---

const result = await agent.generate({
  prompt: "搜索 OpenAI 最近一周的重要新闻，并整理成 3 条摘要",
  session,
  conversationId: "conversation-id",
  history: [],
  variables: {
    topic: "OpenAI",
  },
});

console.log(result.output);
console.log(result.message);
```

返回值：

- `output`：最终的文本输出。
- `message`：LangChain 消息对象。
- `intermediateSteps`：只在创建 Agent 时设置了 `returnIntermediateSteps: true` 才会返回，包含中间步骤的详细信息。

## 流式调用

`stream()` 会返回一个流对象，方便前端或命令行边读边处理。流对象有三个属性：

- `text`：文本增量流（异步可迭代）。
- `steps`：Agent 事件流，比如可以监听到工具调用事件。
- `result`：一个 Promise，等整个生成结束后得到最终结果。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, type Session } from "koishi";

const ctx = new Context();
const session = {} as Session;

import type {} from "koishi-plugin-chatluna/services/chat";

const agent = await ctx.chatluna.createAgent({
  name: "researcher",
  description: "一个负责搜索和整理资料的 Agent",
  model: "openai/gpt-5.4",
  embeddings: "openai/text-embedding-3-small",
  tools: ["web-search", "web-browser"],
  preset: "sydney",
  mode: "tool-calling",
  maxSteps: 8,
  handleParsingErrors: true,
});

// ---

const stream = await agent.stream({
  prompt: "帮我总结这个仓库最近的变更",
  session,
  conversationId: "conversation-id",
  onStep(event) {
    if (event.type === "tool-call") {
      console.log(
        "call tool:",
        event.actions.map((item) => item.tool),
      );
    }
  },
});

for await (const chunk of stream.text) {
  process.stdout.write(chunk);
}

const result = await stream.result;
console.log(result.output);
```

如果你只想监听事件而不手动消费流，也可以在 `generate()` 里传入回调：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, type Session } from "koishi";

const ctx = new Context();
const session = {} as Session;

import type {} from "koishi-plugin-chatluna/services/chat";

const agent = await ctx.chatluna.createAgent({
  name: "researcher",
  description: "一个负责搜索和整理资料的 Agent",
  model: "openai/gpt-5.4",
  embeddings: "openai/text-embedding-3-small",
  tools: ["web-search", "web-browser"],
  preset: "sydney",
  mode: "tool-calling",
  maxSteps: 8,
  handleParsingErrors: true,
});

// ---

await agent.generate({
  prompt: "写一个简短总结",
  session,
  onToken(token) {
    process.stdout.write(token);
  },
  onStep(event) {
    console.log(event.type);
  },
});
```

## 任务交接与后台任务

主 Agent 和子 Agent 本质上没有区别，差别只在于调用方式。有两种方式把任务委派给子 Agent：

- `asTool()`：把子 Agent 包装成一个普通的工具，任务一次性完成，直接拿结果。
- `createTaskTool()`：把任务放到后台跑，支持跨轮继续、恢复和追加消息。

## 包装成工具

`agent.asTool()` 会返回一个 LangChain `StructuredTool`，其他 Agent 可以像调函数一样调用它。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context } from "koishi";

const ctx = new Context();

// ---

import type {} from "koishi-plugin-chatluna/services/chat";

const explore = await ctx.chatluna.createAgent({
  name: "explore",
  description: "搜索代码库并总结结构",
  model: "openai/gpt-5.4-mini",
  tools: ["read", "grep", "glob"],
  system: "你是一个擅长阅读代码库的子 Agent。",
});

const main = await ctx.chatluna.createAgent({
  name: "main",
  model: "openai/gpt-5.4",
  tools: ["web-search"],
  system: "你是主 Agent，负责根据任务选择合适的工具。",
});

const delegateTool = explore.asTool({
  name: "explore_repo",
  description: "将代码库探索任务委派给 explore Agent",
});
```

如果主 Agent 要直接调用这个工具，应该在创建主 Agent 前把它注册为平台工具，或者手动放入工具列表。

## 创建任务工具

任务需要后台执行或恢复时，用 `createTaskTool()`。它返回的工具支持四个动作：

- `run`：启动或继续执行任务。
- `status`：查看任务状态。
- `list`：列出当前对话下的所有任务。
- `message`：给后台任务发送追加消息。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context } from "koishi";

const ctx = new Context();

// ---

import type {} from "koishi-plugin-chatluna/services/chat";
import {
  createTaskTool,
  renderAvailableAgents,
} from "koishi-plugin-chatluna/llm-core/agent";

const planner = await ctx.chatluna.createAgent({
  name: "planner",
  description: "拆解任务并输出执行计划",
  model: "openai/gpt-5-nano",
  tools: ["web-search"],
  system: "你负责把任务拆解成简洁可执行的步骤。",
});

const researcher = await ctx.chatluna.createAgent({
  name: "researcher",
  description: "负责联网搜索和资料整理",
  model: "openai/gpt-5-nano",
  tools: ["web-search", "web-browser"],
  system: "你负责收集资料并给出结构化结论。",
});

const taskRuntime = createTaskTool({
  list() {
    return [
      {
        id: planner.id,
        name: planner.name,
        description: planner.description,
      },
      {
        id: researcher.id,
        name: researcher.name,
        description: researcher.description,
      },
    ];
  },
  async get(name) {
    if (name === planner.name) {
      return { agent: planner };
    }

    if (name === researcher.name) {
      return { agent: researcher };
    }
  },
  async refresh() {
    console.log("task state updated");
  },
});

const taskTool = taskRuntime.createTool();
```

## 注册任务工具并组装主 Agent

要让主 Agent 能通过工具调用这些子 Agent，先把任务工具注册到平台，然后在创建主 Agent 时启用它：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context } from "koishi";

const ctx = new Context();

// ---

import type {} from "koishi-plugin-chatluna/services/chat";
import {
  createTaskTool,
  renderAvailableAgents,
} from "koishi-plugin-chatluna/llm-core/agent";

const planner = await ctx.chatluna.createAgent({
  name: "planner",
  description: "拆解任务并输出执行计划",
  model: "openai/gpt-5-nano",
  tools: ["web-search"],
  system: "你负责把任务拆解成简洁可执行的步骤。",
});

const researcher = await ctx.chatluna.createAgent({
  name: "researcher",
  description: "负责联网搜索和资料整理",
  model: "openai/gpt-5-nano",
  tools: ["web-search", "web-browser"],
  system: "你负责收集资料并给出结构化结论。",
});

const taskRuntime = createTaskTool({
  list() {
    return [
      {
        id: planner.id,
        name: planner.name,
        description: planner.description,
      },
      {
        id: researcher.id,
        name: researcher.name,
        description: researcher.description,
      },
    ];
  },
  async get(name) {
    if (name === planner.name) {
      return { agent: planner };
    }

    if (name === researcher.name) {
      return { agent: researcher };
    }
  },
  async refresh() {
    console.log("task state updated");
  },
});

// ---

const taskTool = taskRuntime.createTool();

ctx.chatluna.platform.registerTool("task", {
  description: taskRuntime.buildToolDescription(),
  selector: () => true,
  createTool: () => taskRuntime.createTool(),
});

const main = await ctx.chatluna.createAgent({
  name: "main",
  model: "openai/gpt-5",
  tools: ["web-search", "task"],
  system: "你是主 Agent，必要时把任务委派给更适合的子 Agent。",
});
```

## 后台任务示例

下面演示通过 `createTaskTool()` 启动一个后台任务：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, type Session } from "koishi";

const ctx = new Context();
const session = {} as Session;
const modelRef = await ctx.chatluna.createChatModel("openai/gpt-5-nano");

// ---

import type {} from "koishi-plugin-chatluna/services/chat";
import {
  createTaskTool,
  renderAvailableAgents,
} from "koishi-plugin-chatluna/llm-core/agent";
import type { ChatLunaToolRunnable } from "koishi-plugin-chatluna/llm-core/platform/types";

const planner = await ctx.chatluna.createAgent({
  name: "planner",
  description: "拆解任务并输出执行计划",
  model: "openai/gpt-5-nano",
  tools: ["web-search"],
  system: "你负责把任务拆解成简洁可执行的步骤。",
});

const researcher = await ctx.chatluna.createAgent({
  name: "researcher",
  description: "负责联网搜索和资料整理",
  model: "openai/gpt-5-nano",
  tools: ["web-search", "web-browser"],
  system: "你负责收集资料并给出结构化结论。",
});

const taskRuntime = createTaskTool({
  list() {
    return [
      {
        id: planner.id,
        name: planner.name,
        description: planner.description,
      },
      {
        id: researcher.id,
        name: researcher.name,
        description: researcher.description,
      },
    ];
  },
  async get(name) {
    if (name === planner.name) {
      return { agent: planner };
    }

    if (name === researcher.name) {
      return { agent: researcher };
    }
  },
  async refresh() {
    console.log("task state updated");
  },
});

// ---

const runConfig = {
  configurable: {
    session,
    conversationId: "conversation-id",
    source: "chatluna",
    model: modelRef.value,
  },
} as ChatLunaToolRunnable;

const result = await taskRuntime.runTask(
  {
    action: "run",
    agent: "researcher",
    prompt: "搜索 Anthropic 最近发布的模型更新，并整理成中文摘要",
    background: true,
  },
  runConfig,
);

console.log(result);
```

启动之后，随时可以查询状态、恢复任务或继续发送消息：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, type Session } from "koishi";

const ctx = new Context();
const session = {} as Session;
const modelRef = await ctx.chatluna.createChatModel("openai/gpt-5-nano");

// ---

import type {} from "koishi-plugin-chatluna/services/chat";
import {
  createTaskTool,
  renderAvailableAgents,
} from "koishi-plugin-chatluna/llm-core/agent";
import type { ChatLunaToolRunnable } from "koishi-plugin-chatluna/llm-core/platform/types";

const planner = await ctx.chatluna.createAgent({
  name: "planner",
  description: "拆解任务并输出执行计划",
  model: "openai/gpt-5-nano",
  tools: ["web-search"],
  system: "你负责把任务拆解成简洁可执行的步骤。",
});

const researcher = await ctx.chatluna.createAgent({
  name: "researcher",
  description: "负责联网搜索和资料整理",
  model: "openai/gpt-5-nano",
  tools: ["web-search", "web-browser"],
  system: "你负责收集资料并给出结构化结论。",
});

const taskRuntime = createTaskTool({
  list() {
    return [
      {
        id: planner.id,
        name: planner.name,
        description: planner.description,
      },
      {
        id: researcher.id,
        name: researcher.name,
        description: researcher.description,
      },
    ];
  },
  async get(name) {
    if (name === planner.name) {
      return { agent: planner };
    }

    if (name === researcher.name) {
      return { agent: researcher };
    }
  },
  async refresh() {
    console.log("task state updated");
  },
});

// ---

const runConfig = {
  configurable: {
    session,
    conversationId: "conversation-id",
    source: "chatluna",
    model: modelRef.value,
  },
} as ChatLunaToolRunnable;

await taskRuntime.runTask({ action: "list" }, runConfig);
await taskRuntime.runTask({ action: "status", id: "task-id" }, runConfig);
await taskRuntime.runTask(
  { action: "message", id: "task-id", message: "补充关注安全公告" },
  runConfig,
);
await taskRuntime.runTask(
  { action: "run", id: "task-id", prompt: "继续整理成周报格式" },
  runConfig,
);
```

## 在系统提示词中注入可用子 Agent

用 `renderAvailableAgents()` 可以把可委派的子 Agent 列表转成提示词片段，方便注入到系统提示词里：

```ts
const msg = renderAvailableAgents([
  {
    id: planner.id,
    name: planner.name,
    description: planner.description,
  },
  {
    id: researcher.id,
    name: researcher.name,
    description: researcher.description,
  },
]);

console.log(msg.content);
```

生成的内容和插件在 `<available_sub_agents>` 区域展示的格式一致。

## 选择 `asTool` 还是 `createTaskTool`

- **用 `asTool()` 的情况**：一次性交接，任务完成就应该返回结果，不需要后台执行或事后恢复。
- **用 `createTaskTool()` 的情况**：任务耗时较长、需要在后台持续运行，或者后续还要追加输入、恢复上下文。

## 底层 API

如果你想自己控制 Prompt、工具筛选和 Runnable 的组合方式，可以直接用底层 API：

- `createAgentRunner()`
- `createToolsRef()`
- `createAgentConfig()`

不过绝大多数插件开发场景，直接用 `ctx.chatluna.createAgent()` 就足够了。
