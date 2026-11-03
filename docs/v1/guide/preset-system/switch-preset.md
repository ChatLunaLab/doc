# 使用预设

本节将介绍如何管理和使用预设。

## 如何使用预设?

在此之前，你需要将你的预设文件放入 Koishi 的数据目录中。

1. 前往 [presets](https://github.com/ChatLunaLab/awesome-chatluna-presets/tree/main/presets) 文件夹，浏览并下载你喜欢的预设文件。

   你也可以从其他任意地方获取预设文件。

2. 找到你的 Koishi 数据目录，将下载的预设文件放入 `<Koishi 数据目录>/data/chathub/presets` 文件夹中。

3. 查看下面的章节，了解如何切换预设。

### 对于当前会话

1. 使用 `chatluna.preset.list` 查看已经添加的预设。
2. 使用 `chatluna.use.preset <preset>` 把当前会话切换到你想使用的预设。

### 对于新建会话的默认值

1. 执行一次 `chatluna.preset.list`，确认目标预设已经可用。
2. 前往 Koishi 控制台，找到 ChatLuna 的配置项，在 [`defaultPreset`](../useful-configurations.md#defaultpreset) 中选择你需要的预设。

这个默认值会用于后续自动创建的新会话，或你执行 `chatluna.new` 时创建的新会话。
