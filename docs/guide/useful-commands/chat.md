# 对话

对话是用户和 ChatLuna 交互的主要方式。

用户通过输入文本或图片，触发 ChatLuna 的对话。

ChatLuna 会根据用户的输入和当前用户所在的房间的信息，创建相应的模型并生成回复文本。最后发送给用户。

> [!TIP] 提示
> ChatLuna 支持多种响应的模式，包括：At 响应，昵称响应，房间响应等。阅读 [配置项](../useful-configurations.md) 以了解更多。

## 直接对话

基于用户当前使用的房间，直接进入对话。

以下为命令格式:

```powershell
chatluna.chat.text -r <room:string> <message:text>
```

以下为命令的可选参数:

- `-r,room`: 指定对话的房间，默认为用户在当前环境里使用的房间。可键入房间名或房间 ID。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.chat.text Hello,GPT</chat-message>
  <chat-message nickname="Bot">
    Hello! How can I assist you today?
  </chat-message>
</chat-panel>

## 语音回复对话

与上面的聊天命令类似。

不同的是，ChatLuna 会尝试调用 [vits](https://github.com/initialencounter/mykoishi/blob/master/Plugins/Tool/vits/readme.md) 服务。
把模型生成的内容渲染成语音后发送。

以下为命令格式:

```powershell
chatluna.chat.voice -s <speakerId:number> -r <room:string> <message:text>
```

以下为可选参数:

- `-r,--room`: 指定对话的房间，默认为用户在当前环境里使用的房间，可为房间名或房间 ID。
- `-s,--speaker`: 指定使用 vits 服务的目标音色 ID。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.chat.voice Hello,GPT</chat-message>
  <chat-message nickname="Bot">
    [假装是一条语音消息]
  </chat-message>
</chat-panel>

## 停止对话

如果你遇到模型长时间未响应或者其他问题，可以调用此指令，手动停止对话。

以下为命令格式:

```powershell
chatluna.chat.stop -r <room:string>
```

以下为可选参数:

- `-r,--room`: 指定对话的房间，默认为用户在当前环境里使用的房间，可为房间名或房间 ID。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.chat.stop</chat-message>
  <chat-message nickname="Bot">
    已成功停止当前对话。
  </chat-message>
</chat-panel>

## 回滚对话

用于重新生成房间的最新一条的回复消息。

:::tip 提示
请求错误后，最新的聊天消息并没有保存。调用此命令，将重新生成上一次请求成功后模型的回复消息。
:::

以下为命令格式:

```powershell
chatluna.chat.rollback -r <room:string> -i <rounds:string> [content:text]
```

以下为可选参数:

- `-r,--room`: 指定对话的房间，默认为用户在当前环境里使用的房间。可为房间名或房间 ID。
- `content`: 指定需要回滚的聊天消息内容。这将作为回滚时用户的消息内容。(不是模型的回复，是用户的消息)
- `-i,--rounds`: 指定需要回滚的轮数。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.chat.rollback 你好</chat-message>
  <chat-message nickname="Bot">
    [假装是模型生成的消息]
  </chat-message>
</chat-panel>

## 清空上下文

如果你需要清空当前房间的上下文，可以使用此命令。

以下为命令格式:

```powershell
chatluna.chat.clear [room:text]
```

请参考 [清除聊天记录](./room.md#清除聊天记录)。
