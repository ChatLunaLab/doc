# 向量数据库

向量数据库是一种专门用于存储、检索和管理高维向量数据的数据库。目前在 ChatLuna 中用于存储长期记忆。

## 安装

前往 Koishi 插件市场，搜索 `chatluna-vector-database-service`，并安装。

此插件还需要配置后才能使用，你可以在安装后阅读插件的使用说明，按照其介绍进行配置相应的数据库。

## 支持的数据库

我们目前支持接入（使用）以下向量数据库：

- [Faiss](./faiss.md)
- [Redis](./redis.md)
- [Milvus](./milvus.md)
- [luna-vdb](./luna-vdb.md)

## 使用

配置好任一向量数据库后，还需要在向量适配器中选中配置好的向量数据库。

![alt text](../../public/images/image-52.png)

选择后，即可在主插件的配置项中 [选择](../useful-configurations#defaultvectorstore) 配置好了的向量数据库。

也可使用指令设置默认向量数据库，详见 [嵌入模型和向量数据库管理](../useful-commands.md#嵌入模型和向量数据库管理)。
