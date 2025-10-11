# 长期记忆 <Badge type="warning" text="实验性" />

长期记忆的命令功能目前仍为实验性功能，可能会出现破坏性更改。

在使用相关命令前，请先安装 [长期记忆插件](../../ecosystem/plugin/long-term-memory.md)。

## 搜索长期记忆

搜索在某个预设下的记忆列表。

以下为命令格式:

```powershell
chatluna.memory.search -t <type:string>  -l <limit:number> -p <page:number> <keyword:string> -v <layer:string>
```

以下为参数说明:

- `-t,--type`: 指定搜索的预设。
- `keyword`: 指定搜索的关键词。
- `-v,--view`: 指定记忆的具体层。目前支持: `preset-user`, `user`, `global`, `preset`。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.memory.search dingyi</chat-message>
  <chat-message nickname="Bot">以下是使用 dingyi 关键词在 猫娘 预设下搜索出的记忆列表:<br/>
记忆 ID: <br/>
记忆内容: sample<br/><br/>
记忆 ID: f6e7e741-ab94-41fe-9616-82ffc37ef061<br/>
记忆内容: 你非常喜欢 dingyi,dingyi 是你的主人<br/><br/>
当前为第 1 / 1 页
  </chat-message>

</chat-panel>

## 添加长期记忆

为某个预设添加一条长期记忆。

以下为命令格式:

```powershell
chatluna.memory.add -t <type:string> -v <layer:string> <content:string>
```

以下为参数说明:

- `-t,--type`: 指定添加记忆的预设。
- `content`: 指定添加的记忆内容。
- `-v,--view`: 指定记忆的具体层。目前支持: `preset-user`, `user`, `global`, `preset`。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.memory.add -t 猫娘 你和 dingyi 是好朋友</chat-message>
  <chat-message nickname="User">已添加记忆。</chat-message>
</chat-panel>

## 删除长期记忆

删除在某个预设下的记忆。

以下为命令格式:

```powershell
chatluna.memory.delete -t <type:string> -v <layer:string> <id:string>
```

以下为参数说明:

- `-t,--type`: 指定删除记忆的预设。
- `id`: 指定删除的记忆 ID。
- `-v,--view`: 指定记忆的具体层。目前支持: `preset-user`, `user`, `global`, `preset`。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.memory.delete -t 猫娘 f6e7e741-ab94-41fe-9616-82ffc37ef061</chat-message>
  <chat-message nickname="Bot">已删除记忆。</chat-message>
</chat-panel>

## 修改长期记忆

修改在某个预设下的记忆。

以下为命令格式:

```powershell
chatluna.memory.edit -t <type:string> -v <layer:string> <id:string>
```

以下为参数说明:

- `-t,--type`: 指定修改记忆的预设。
- `id`: 指定修改的记忆 ID。
- `-v,--view`: 指定记忆的具体层。目前支持: `preset-user`, `user`, `global`, `preset`。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.memory.edit -t 猫娘 f6e7e741-ab94-41fe-9616-82ffc37ef061</chat-message>
  <chat-message nickname="Bot">请发送你的新记忆内容。</chat-message>
  <chat-message nickname="User">你和 dingyi 是好朋友</chat-message>
  <chat-message nickname="Bot">已编辑记忆。</chat-message>
</chat-panel>

## 清除长期记忆

清除在某个预设下的所有记忆。

:::warning 警告
所有在该预设下的长期记忆都会被清除!
:::

以下为命令格式:

```powershell
chatluna.memory.clear -t <type:string> -v <layer:string>
```

以下为参数说明:

- `-t,--type`: 指定清除记忆的预设。
- `-v,--view`: 指定记忆的具体层。目前支持: `preset-user`, `user`, `global`, `preset`。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.memory.clear -t 猫娘</chat-message>
  <chat-message nickname="Bot">已清空记忆。</chat-message>
</chat-panel>
