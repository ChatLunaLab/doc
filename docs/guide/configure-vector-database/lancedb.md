# LanceDB

LanceDB 是一个高性能的向量数据库，专为大规模机器学习和 AI 应用设计，支持高效的向量存储和最近邻搜索（ANN）。它无缝集成 AI 工作流，支持分布式架构和灵活的向量检索方式，适用于推荐系统、图像搜索、自然语言处理等场景。LanceDB 是开源项目，提供高扩展性和社区支持，帮助开发者优化 AI 模型的部署和查询性能。

## 安装

前往插件市场，搜索并安装 `chatluna-vector-store-service` 即可。注意在安装前，需要先安装 `lancedb` 的依赖。

类似 Faiss，注意 LanceDB 的依赖 `vector-db` 和 `apache-arrow` 被标记为该插件的可选依赖，你需要在安装前设置 `vector-db` 和 `apache-arrow` 安装。

## 使用

1. 安装 `chatluna-vector-store-service`，启用该插件。
2. 在主插件的[模型选项](../useful-configurations.md#模型选项)中找到 [defaultVectorStore](../useful-configurations.md#defaultvectorstore) 配置项，选择为 `lancedb` 即可。
