# 对话

对话是用户和 ChatLuna 交互的主要方式。

默认情况下，这些命令都会作用在当前活跃会话上；如果你想明确指定目标，可以使用会话参数 `-c`。

> [!TIP] 提示
> ChatLuna 支持多种触发方式，例如 At 响应、昵称响应等。阅读 [配置项](../useful-configurations.md) 以了解更多。

## 直接对话

向当前会话发送一条消息。

```powershell
chatluna.chat <message:text> -c <conversation:string> -p <preset:string> -t <type:string>
```

以下为命令的可选参数:

- `message`：要发送的消息内容
- `-c,--conversation`：指定目标会话；不传时使用当前活跃会话
- `-p,--preset`：指定目标预设通道
- `-t,--type`：指定输出模式

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.chat Hello,GPT</chat-message>
  <chat-message nickname="Bot">
    Hello! How can I assist you today?
  </chat-message>
</chat-panel>

## 语音回复对话

和普通对话类似，但会把模型回复渲染为语音后发送。

```powershell
chatluna.voice <message:text> -c <conversation:string> -s <speakerId:number>
```

以下为可选参数:

- `-c,--conversation`：指定目标会话。不传时使用当前活跃会话
- `-s,--speaker`：指定使用 vits 服务的目标音色 ID

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.voice Hello,GPT</chat-message>
  <chat-message nickname="Bot">
    [假装是一条语音消息]
  </chat-message>
</chat-panel>

## 停止对话

如果模型长时间未响应，可以手动中断当前会话中的正在进行请求。

以下为命令格式:

```powershell
chatluna.stop -c <conversation:string>
```

- `-c,--conversation`：指定要停止的目标会话；不传时使用当前活跃会话

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.stop</chat-message>
  <chat-message nickname="Bot">
    已成功停止当前对话。
  </chat-message>
</chat-panel>

## 回滚对话

用于删除当前会话里最近几轮对话，并重新生成最新一轮回复。

:::tip 提示
请求报错后，最近一次失败请求通常不会写入历史。此时调用回滚命令，一般会基于上一次请求成功后的用户消息重新生成回复。
:::

```powershell
chatluna.rollback [content:text] -c <conversation:string> -i <rounds:string>
```

以下为可选参数:

- `content`：可选，覆盖回滚后重新发送的用户消息内容
- `-c,--conversation`：指定目标会话；不传时使用当前活跃会话
- `-i`：指定需要回滚的轮数

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.rollback 你好</chat-message>
  <chat-message nickname="Bot">
    [假装是模型生成的消息]
  </chat-message>
</chat-panel>

## 清空上下文

如果你想开始一段新对话，请使用 [`chatluna.new`](./conversation.md#创建新会话)。

对于 `chatluna.clear`，它只是 `chatluna.new` 的别名，效果和 `chatluna.new` 一致。
