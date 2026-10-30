# Agent API

ChatLuna 的 Agent API 位于 `koishi-plugin-chatluna/llm-core/agent`。

## 接口：CreateAgentOptions

```ts
export interface CreateAgentOptions {
  id?: string
  name?: string
  description?: string
  llm: ComputedRef<ChatLunaChatModel>
  embeddings: ChatLunaBaseEmbeddings
  tools: ComputedRef<ChatLunaTool[]>
  prompt: ChatLunaChatPrompt
  mode?: 'tool-calling' | 'react'
  maxSteps?: number
  handleParsingErrors?: boolean | string | ((e: Error) => string)
  instructions?: ComputedRef<string | undefined>
  returnIntermediateSteps?: boolean
  toolMask?: ToolMask
}
```

## 接口：ChatLunaAgent

```ts
export interface ChatLunaAgent {
  id: string
  name: string
  description: string
  generate(input: AgentGenerateOptions): Promise<AgentRunnerOutput>
  stream(input: AgentGenerateOptions): Promise<AgentStream>
  asTool(options?: AgentToolOptions): StructuredTool
}
```

## createAgent()

- **options**: `CreateAgentOptions`
- 返回值: `ChatLunaAgent`

创建高层 Agent。

## createAgentTool()

- **agent**: `ChatLunaAgent`
- **options**: `CreateAgentToolOptions | undefined`
- 返回值: `StructuredTool`

把 Agent 包装成 LangChain 工具，供其他 Agent 或主流程调用。

## createPromptPreset()

- **name**: `string`
- **system**: `string | undefined`
- **preset**: `ComputedRef<PresetTemplate> | undefined`
- 返回值: `ComputedRef<PresetTemplate>`

创建一个最小可用的预设引用。

## createAgentRunner()

- **options**: `CreateAgentRunnerOptions`
- 返回值: `ComputedRef<AgentRunner>`

根据 llm、tools 和 prompt 创建运行器。

## createAgentExecutor

`createAgentExecutor` 是 `createAgentRunner` 的别名。

## createToolsRef()

- **options**: `CreateToolsRefOptions`
- 返回值: `{ update(session, messages, toolMask?): boolean; tools: ComputedRef<StructuredTool[]> }`

根据会话历史和 `ToolMask` 选择当前可用工具。

## AgentGenerateOptions

```ts
export interface AgentGenerateOptions {
  prompt: string | HumanMessage
  session?: Session
  conversationId?: string
  history?: BaseMessage[]
  variables?: Record<string, any>
  signal?: AbortSignal
  maxToken?: number
  messageQueue?: MessageQueue
  toolMask?: ToolMask
  subagentContext?: SubagentContext
  source?: 'chatluna' | 'character'
  onStep?: (event: AgentEvent) => Promise<void> | void
  requestId?: string
  onToken?: (token: string) => Promise<void> | void
  onChunk?: (chunk: BaseMessageChunk) => Promise<void> | void
  callbacks?: Callbacks
}
```

## AgentEvent

`AgentEvent` 包含：

- `tool-call`
- `tool-result`
- `human-update`
- `round-decision`
- `done`

## ToolMask

```ts
export interface ToolMask {
  mode: 'all' | 'allow' | 'deny'
  tools?: string[]
  allow: string[]
  deny: string[]
  toolCallMask?: ToolMask
}
```

## 相关页面

- [Call Agent](../../call-core-services/agent.md)
- [Tool Mask 和 Platform Service](./platform-service.md)
