# 指令

本节介绍了主插件(`chatluna`)的用法（及其指令）。对于其他 chatluna 生态插件的指令，请参考对应的文档（？）。

## 对话

对话是用户和 ChatLuna 交互的主要方式，用户通过输入文本来和 ChatLuna 进行对话，ChatLuna 会根据用户的输入和当前用户所在的返回键的信息，选择好相应的模型，生成回复文本，并发送给用户。

### 直接对话

基于用户当前使用的房间，直接对话。

以下为命令格式：

```shell
chatluna.chat.text -r <room> <message>
```

以下为命令的可选参数：

- `-r,room`: 指定对话的房间，默认为用户在当前环境里使用的房间，可为房间名或房间ID。

以下为例子：

```shell
chatluna.chat.text 你好，GPT！

chatluna.chat.text -r 猫娘 你是猫娘吗？
```

### 语音回复对话

与上面的类似，但是不同的是 ChatLuna 会尝试调用 [vits](https://github.com/initialencounter/mykoishi/blob/master/Plugins/Tool/vits/readme.md) 服务，将模型生成的内容转换成语音发送。

以下为命令格式：

```shell
chatluna.chat.voice -r <room> <message>
```

以下为可选参数：

- `-r,--room`: 指定对话的房间，默认为用户在当前环境里使用的房间，可为房间名或房间ID。
- `-s,--speaker`: 指定使用的 vits 服务的目标音色的 ID。

以下为例子：

```shell
chatluna.chat.voice 你好，GPT！

chatluna.chat.voice -r 猫娘 你是猫娘吗？
```
