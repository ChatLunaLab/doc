# 系统命令

ChatLuna 中还包含其他的二级指令，用于辅助管理。

## 重启 ChatLuna

重启 ChatLuna 插件。遇到任何毛病，可以先重启一下。

以下为命令格式:

```powershell
chatluna.restart
```

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.restart</chat-message>
  <chat-message nickname="Bot">已成功重启 ChatLuna。</chat-message>
</chat-panel>

## 重置 Chatluna

重置 ChatLuna 插件，清除所有数据。

:::warning 警告
此命令需要被执行者最低 3 级权限。
:::

以下为命令格式:

```powershell
chatluna.wipe
```

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.wipe</chat-message>
  <chat-message nickname="Bot">您接下来将要操作的是清除 ChatLuna 的全部相关数据!这些数据包括:
  <br/>
1. 所有会话数据
<br/>
2. 其他缓存在数据库的数据
<br/>
3. 本地向量数据库的相关数据
<br/>

    请输入下列算式的结果以确认删除:11-241。

  </chat-message>
  <chat-message nickname="User">-230</chat-message>
  <chat-message nickname="Bot">已删除相关数据,即将重启完成更改。</chat-message>
</chat-panel>
