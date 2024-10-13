# 长期记忆

长期记忆是 ChatLuna 一直在迭代和探索的一项功能。
经过了多次迭代，目前终于迎来了相对稳定和成熟的版本。

目前长期记忆具有以下特性：

- 基于模型和用户的对话历史，提取关键信息，并存储到向量数据库中。
- 跨不同房间的记忆，基于预设和用户区分。
- 即使清除房间内的聊天记录，长期记忆依然存在。

## 配置

确保你已经配置好了 [嵌入模型](../configure-embedding-model/introduction.md) 和 [向量数据库](../configure-vector-database/introduction.md)。

配置好了之后，前往 Koishi 控制面板，在主插件的配置页，打开 [长期记忆](../useful-configurations.md#longmemory) 开关即可。

开启后还需要设置长期记忆的 [提取模型](../useful-configurations.md#longmemoryextractmodel)。目前的长期记忆基于大语言模型来提取关键信息，因此需要设置一个模型。

推荐使用速度快的模型，如 `gpt-4o-mini`。

对于 [长期记忆存储轮次](../useful-configurations.md#longmemoryinterval)，我们推荐设置为 3-5 轮次，这样既能保证记忆的准确性，也不会出现太多的冗余记忆。

## 测试

即使你已经配置好了长期记忆，也需要通过测试来确保其正常工作。

我们可以设置 [长期记忆存储轮次](../useful-configurations.md#longmemoryinterval) 为 1，这样每条消息都会被存储到向量数据库中。

开启 [`isLog`](../useful-configurations.md#islog) 选项，这样则会打印出更多的日志信息。

然后进入一个房间，尝试发送多条消息。

稍等片刻，在 Koishi 日志中将会看到提取关键信息并存储到向量数据库中的日志。

![alt text](../../public/images/image-27.png)

清除房间内的聊天记录，再次发送消息，确保之前存储的记忆依然存在。

![alt](../../public/images/image-28.png)

这时候就可以正常使用长期记忆功能了。

## 已知问题

- 提取出来的文本内容可能会干扰模型的正常回复。
- 没有提供记忆的删除，修改，添加功能。
