# 房间

房间是 ChatLuna 的主要组成部分。

想象一下你在不同的群里都可以私人配置不同的房间，使用不同的预设，聊天模式。

多个用户可以在一个房间里一起~~调教~~模型。

~~这可能是目前最复杂的在 bot 上的聊天系统，但也是自由度最高的系统。~~

## 切换房间

切换你在当前环境里（群聊或私聊里）默认使用的房间。

切换后使用聊天命令等，会默认使用此的房间。

:::tip 提示
如执行其他指令（加入房间），将会自动切换在当前环境里默认使用的房间。
:::

以下为命令格式:

```powershell
chatluna.room.switch <room:text>
```

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.room.switch 测试</chat-message>
  <chat-message nickname="Bot">
    已切换到房间 测试
  </chat-message>
</chat-panel>

## 创建房间

创建新的房间，并将当前环境的默认房间切换为新创建的房间。

此命令是目前已知的 ChatLuna 里前三复杂的指令。

命令含有两种模式：如果没有携带任何子参数，则自动进入交互式创建。否则将直接基于子参数进行快速创建。

> [!TIP] 提示
> 快速创建最低只需要携带 `-n` 参数。对于缺失的必须参数(如模型),会自动使用模版房间的配置。

以下为命令格式:

```powershell
chatluna.room.create -n <name:string> -p <preset:string> -m <model:string> -c <chatMode:string> -w <password:string> -v <visibility:string>
```

以下为可选参数:

- `-n,--name`: 指定房间的名字。
- `-p,--preset`: 指定房间的预设。
- `-m,--model`: 指定房间的模型。
- `-c,--chatMode`: 指定房间的聊天模式。
- `-w,--password`: 指定房间的密码。

在这里我们分别介绍交互式创建和快速创建的例子。

交互式创建:

<chat-panel>
  <chat-message nickname="User">chatluna.room.create</chat-message>
  <chat-message nickname="Bot">
    请输入你需要使用的房间名,如:我的房间
  </chat-message>
  <chat-message nickname="User">测试</chat-message>
  <chat-message nickname="Bot">
    请输入你需要使用的模型,如:openai/gpt-3.5-turbo
  </chat-message>
  <chat-message nickname="User">openai/gpt-3.5-turbo</chat-message>
  <chat-message nickname="Bot">
    请输入你需要使用的聊天模式,如:chat
  </chat-message>
  <chat-message nickname="User">chat</chat-message>
  <chat-message nickname="Bot">
    请输入你需要使用的预设,如:chatgpt。如果不输入预设请回复 N(则使用默认 chatgpt 预设)。否则回复你需要使用的预设。
  </chat-message>
  <chat-message nickname="User">chatgpt</chat-message>
  <chat-message nickname="Bot">
   请输入你需要使用的可见性,如:private。如果不输入可见性请回复 N(则使用默认 private 可见性)。否则回复你需要使用的可见性。(目前支持 public, private)
  </chat-message>
  <chat-message nickname="User">房间创建成功,房间号为:2,房间名为:测试。</chat-message>
</chat-panel>

快速创建:

<chat-panel>
  <chat-message nickname="User">chatluna.room.create -p 丛雨</chat-message>
  <chat-message nickname="Bot">
    你目前已提供基础参数,是否直接创建房间?如需直接创建房间请回复 Y,如需进入交互式创建请回复 N,其他回复将视为取消。
  </chat-message>
  <chat-message nickname="User">Y</chat-message>
  <chat-message nickname="Bot">
    房间创建成功,房间号为:41,房间名为:未命名房间。
  </chat-message>
</chat-panel>

## 设置房间

设置当前环境的默认房间的配置。

此命令是目前已知的 ChatLuna 里前三复杂的指令。

和创建房间指令一样。命令含有两种模式：如果没有携带任何子参数，则自动进入交互式创建。否则将直接基于子参数进行创建。

以下为命令格式:

```powershell
chatluna.room.set -n <name:string> -p <preset:string> -m <model:string> -c <chatMode:string> -w <password:string> -v <visibility:string>
```

以下为可选参数:

- `-n,--name`: 指定房间的名字。
- `-p,--preset`: 指定房间的预设。
- `-m,--model`: 指定房间的模型。
- `-c,--chatMode`: 指定房间的聊天模式。
- `-w,--password`: 指定房间的密码。
- `-v,--visibility`: 指定房间的可见性。

如果你想更换当前环境默认房间的模型，可以只带上 `-m` 参数:

<chat-panel>
  <chat-message nickname="User">chatluna.room.set -m openai/gpt-3.5-turbo</chat-message>
  <chat-message nickname="Bot">
    你目前已设置参数,是否直接更新房间属性?如需直接更新请回复 Y,如需进入交互式创建请回复 N,其他回复将视为取消。
  </chat-message>
  <chat-message nickname="User">Y</chat-message>
  <chat-message nickname="Bot">
    房间 测试 已更新。
  </chat-message>
</chat-panel>

对于该命令，我们不推荐你使用交互式创建。

额外的，如果你对该房间设置了新的预设，那么该房间之前的聊天记录会自动清空。

## 删除房间

删除某个已经加入了的房间。

:::warning 警告
此命令只有房主能够执行。但如果执行者最低 3 级权限,那么也将会执行删除房间的操作。
:::

以下为命令格式:

```powershell
chatluna.room.delete <room:text>
```

以下为可选参数:

- `room`: 指定要删除的房间，默认为当前环境的默认房间。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.room.delete 测试</chat-message>
  <chat-message nickname="Bot">
    你确定要删除房间 测试 吗?这将会删除房间内的所有消息。并且成员也会被移除。如果你确定要删除,请输入 Y 来确认。
    <br/>
    输入 Y 确认删除房间。
  </chat-message>
  <chat-message nickname="User">Y</chat-message>
  <chat-message nickname="Bot">
    已删除房间 测试。
  </chat-message>
</chat-panel>

## 列出房间信息

列出在当前环境（群聊或私聊）里使用的房间的信息

以下为命令格式:

```powershell
chatluna.room.info [room:text]
```

以下为可选参数:

- `room`: 指定要查询的房间，默认为当前环境的默认房间。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.room.info</chat-message>
  <chat-message nickname="Bot">
   以下是查询到你当前使用的房间的信息:<br/>

<br/>房间名: ChatLuna 闲聊群 的模版克隆房间<br/>
房间ID: 1<br/>
房间预设: 猫娘<br/>
房间模型: bing/creative<br/>
房间可见性: template_clone<br/>
房间聊天模式: chat<br/>
房间创建者ID: 0<br/>
房间可用性:false<br/>
  </chat-message>
</chat-panel>

## 设置自动更新

设置当前环境的房间是否跟随控制模版的配置更新。

如果设置为 false，当修改主插件的里的模版房间配置（如模型等），将不会自动更新配置。

该选项只对模版控制房间生效。

以下为命令格式:

```powershell
chatluna.room.auto-update -r <room:string> <enable:boolean>
```

以下为可选参数:

- `-r,--room`: 指定要设置的房间，默认为当前环境的默认房间。
- `enable`: 指定是否开启自动更新权限，默认为 true。

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.room.auto-update true</chat-message>
  <chat-message nickname="Bot">
   已设置房间 测试 的模版克隆房间 的自动更新属性为 true
  </chat-message>
</chat-panel>

## 转移房主

将你在当前环境里默认使用的房间的房主转移给其他用户。

需要当前你默认使用的房间为房主。

::: tip 提示
如果执行者的 Koishi 权限大于3，那么他将可以直接转移房主。包括转移到自己身上。
:::

以下为命令格式:

```powershell
chatluna.room.transfer <user:user>
```

以下为可选参数:

- `user`: 指定转移房间房主的用户 ID。(需要 AT 目标用户)

以下为例子:

<chat-panel>
  <chat-message nickname="User">/chatluna.room.transfer @dingyi</chat-message>
  <chat-message nickname="Bot">
    你确定要把房间 测试 转移给用户 0 吗?转移后ta将成为房间的房主,你将失去房主权限。如果你确定要转移,请输入 Y 来确认。
  </chat-message>
  <chat-message nickname="User">Y</chat-message>
  <chat-message nickname="Bot">
    已将房间 测试 转移给用户 0。
  </chat-message>
</chat-panel>

## 邀请加入房间

邀请其他用户加入当前环境里默认使用的房间。

需要当前你默认使用的房间为管理员或房间权限。

::: tip 提示
如果执行者的 Koishi 权限大于3，那么他将可以直接邀请用户加入房间。包括邀请自己加入。
:::

以下为命令格式:

```powershell
chatluna.room.invite <...arg:user>
```

以下为可选参数:

- `user`: 邀请加入房间的用户 ID。(支持 AT 多个用户)

以下为例子:

<chat-panel>
  <chat-message nickname="User">/chatluna.room.invite @dingyi</chat-message>
  <chat-message nickname="Bot">
    已邀请用户 0 加入房间 测试
    </chat-message>
</chat-panel>

## 离开房间

退出加入某个房间。

::: tip 提示
如果执行者为该房间的房主，这将导致该房间被删除。
:::

以下为命令格式:

```powershell
chatluna.room.leave [room:text]
```

以下为例子:

<chat-panel>
  <chat-message nickname="User">/chatluna.room.leave</chat-message>
  <chat-message nickname="Bot">
    已退出房间 测试。您可能需要重新加入或者切换房间。
  </chat-message>
</chat-panel>

## 踢出房间

将某用户踢出当前环境里默认使用的房间。

需要当前你默认使用的房间为管理员或房间权限。

以下为命令格式:

```powershell
chatluna.room.kick <...arg:user>
```

以下为可选参数:

- `user`: 踢出房间的用户 ID。(需要 AT 目标用户)

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.room.kick @dingyi</chat-message>
  <chat-message nickname="Bot">
    已将以下用户踢出房间 测试:0
    </chat-message>
</chat-panel>

## 修改用户权限

修改某用户在当前环境里默认使用的房间的权限。

需要当前你默认使用的房间为管理员或房间权限。

以下为命令格式:

```powershell
chatluna.room.permission <user:user>
```

以下为可选参数:

- `user`: 指定修改权限的用户 ID。(需要 AT 目标用户)

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.room.permission @dingyi</chat-message>
  <chat-message nickname="Bot">
   你确定要为用户 0 设置房间 test 的权限吗?目前可以设置的权限为 member 和 admin。如果你确定要设置,请输入设置权限的值或首字母大写,其他输入均视为取消。
    </chat-message>
    <chat-message nickname="User">admin</chat-message>
    <chat-message nickname="Bot">
    已为用户 0 设置房间 test 的权限为 admin
    </chat-message>
</chat-panel>

## 禁言用户

禁言某用户在当前环境里默认使用的房间。

执行一次为禁言操作，反之则为取消禁言操作。禁言操作没有时间限制。

需要当前你默认使用的房间为管理员或房间权限。

以下为命令格式:

```powershell
chatluna.room.mute <...arg:user>
```

以下为可选参数:

- `user`: 禁言房间的用户 ID。(需要 AT 目标用户)

以下为例子:

<chat-panel>
  <chat-message nickname="User">chatluna.room.mute @dingyi</chat-message>
  <chat-message nickname="Bot">
    已将用户 2960586094 在房间 测试 禁言或解除禁言。
    </chat-message>
</chat-panel>

## 列出房间列表

列出你目前在当前环境里已经加入了的房间列表。

以下为命令格式:

```powershell
chatluna.room.list -l <limit:number> -p <page:number>
```

以下为可选参数:

- `-l,--limit`: 指定返回的房间数量上限，默认为 3。
- `-p,--page`: 指定返回的房间页数，默认为 1。

以下为例子:

<chat-panel>
  <chat-message nickname="User">/chatluna.room.list -l 10</chat-message>
  <chat-message nickname="Bot">
   以下是查询到你加入的房间列表:<br/>

<br/>房间名: ChatLuna 闲聊群 的模版克隆房间<br/>
房间ID: 1<br/>
房间预设: 猫娘<br/>
房间模型: bing/creative<br/>
房间可见性: template_clone<br/>
房间聊天模式: chat<br/>
房间创建者ID: 0<br/>
房间可用性:false<br/>

<br/>房间名: 测试<br/>
房间ID: 2<br/>
房间预设: chatgpt<br/>
房间模型: openai/gpt-3.5-turbo<br/>
房间可见性: public<br/>
房间聊天模式: chat<br/>
房间创建者ID: 0<br/>
房间可用性:true<br/>

<br/>你可以使用 chatluna.room.switch &lt;name/id&gt; 来切换当前环境里你的默认房间。<br/>

<br/>当前为第 1 / 1 页
  </chat-message>
</chat-panel>

## 清除聊天记录

清除当前房间的聊天记录。

相当于重置模型记忆，开始新的会话。有助于获取不同的对话风格。

以下为命令格式:

```powershell
chatluna.room.clear [room:text]
```

以下为例子:

<chat-panel>
  <chat-message nickname="User">/chatluna.room.clear 测试</chat-message>
  <chat-message nickname="Bot">
    已清除房间 测试 的聊天记录。
  </chat-message>
</chat-panel>
