# Agent 与 Sub-Agent

ChatLuna 提供了一套更高层的 Agent API，用于组装 Agent，甚至是多 Agent 服务。

## 创建 Agent

使用 `ctx.chatluna.createAgent()` 来快速创建 Agent。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
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

<br>

常用的参数：

- `model`: 必填，通常直接写 `platform/model`
- `tools`: 可选，传工具名数组或 Langchain 的工具数组。不传数组则默认激活全部可用的工具。
- `preset` 或 `system`: 二选一；想复用已有预设就传入 `preset`，想快速写一个 Agent 就直接传 `system`（用于指定 Agent 的 System Prompt）
- `mode`: 可选，默认 `tool-calling`
- `maxSteps`: 可选，限制最多调用多少轮工具

其他像 `handleParsingErrors`、`instructions`、`toolMask` 这些参数，通常只在更复杂的插件装配里才需要。

## 调用 Agent

创建完成后，直接使用 `generate()` 即可。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()


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

// ---cut---

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

返回结果包含：

- `output`: 最终文本输出
- `message`: 最终消息对象
- `intermediateSteps`: 工具调用的步骤。创建 Agent 时设置了 `returnIntermediateSteps: true` 才会返回。

## 流式调用

`stream()` 会返回一个更适合前端或 CLI 的对象：

- `text`: 文本增量流
- `steps`: Agent 事件流
- `result`: 最终结果 Promise

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()


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

// ---cut---
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

如果你只想监听而不消费流，也可以直接使用：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()


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

// ---cut---
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

## Agent 作为工具

`agent.asTool()` 可以把一个 Agent 直接包装成 LangChain `StructuredTool`。

这种方式更适合一次性交接：主 Agent 把某个任务完整交给子 Agent，然后拿回最终结果。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---

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

如果你希望主 Agent 直接能调用这个工具，通常会在创建主 Agent 前先把它注册成平台工具，或在你自己的代码中构造工具列表。

## 主 Agent + Sub-Agent

推荐的使用方式是：

- 主 Agent 和 Sub-Agent 都 Agent
- 使用 `asTool()` 做一次性交接和 `handoff`
- 当需要长期执行任务、多轮对话跟进、后台执行时，采用 `createTaskTool()`

也就是说，主 Agent 和 Sub-Agent 的区别主要在“如何被调用”，而不是底层实现不同。

## 任务工具与 Sub-Agent 教程

当你希望：

- 主 Agent 把工作交给某个专门 Agent，任务可以后台运行
- 之后还能恢复对话

就应该使用 `createTaskTool()`。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
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

如果你希望主 Agent 直接通过工具调用这些 Sub-Agent，通常会先把 `task` 工具注册到平台，再在主 Agent 里启用它：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()


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

// ---cut---
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

`createTaskTool()` 创建出的工具默认支持以下动作：

- `run`: 启动或续跑一个任务
- `status`: 查看某个任务状态
- `list`: 查看当前对话下的任务列表
- `message`: 给后台任务继续发送消息

后台模式示例：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()


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

// ---cut---
const result = await taskRuntime.runTask(
  {
    action: "run",
    agent: "researcher",
    prompt: "搜索 Anthropic 最近发布的模型更新，并整理成中文摘要",
    background: true,
  },
  {
    configurable: {
      session,
      conversationId: "conversation-id",
      source: "chatluna",
      model: modelRef.value,
    },
  } as any,
);

console.log(result);
```

后续你可以继续：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()


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

// ---cut---
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

## 在系统提示词中注入可用 Sub-Agent

如果你需要把可委派的子 Agent 列表注入到系统提示词里，可以使用 `renderAvailableAgents()`：

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

这和 extension-agent 里展示 `<available_sub_agents>` 的方式是一致的。

## asTool 和 task 的场景

### 使用 `asTool()`

- 只需要子 Agent 一次性交接
- 子 Agent 执行完成后直接返回结果
- 不需要复杂的后台运行和任务状态管理

### 使用 `createTaskTool()` 

- 子 Agent 的任务可能比较长
- 希望后台继续执行
- 后续还需要继续恢复执行

## 底层 API

如果你需要完全控制 Prompt、工具筛选、Runnable 组合方式，底层 API 仍然可用：

- `createAgentRunner()`
- `createToolsRef()`
- `createAgentConfig()`

不过对于大部分插件开发场景，建议优先使用高层的 `ctx.chatluna.createAgent()`。
