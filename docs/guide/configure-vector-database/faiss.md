# Faiss

## 介绍

Faiss 是一个由 Meta 的基础人工智能研究小组开发，用于高效相似性搜索和稠密向量聚类的库。它包含可以在任何大小的向量集合中进行搜索的算法，甚至可以处理可能无法完全放入 RAM 的数据集。该库还包含用于评估和参数调优的辅助代码。Faiss 使用 C++ 编写，并为 Python/numpy 提供了完整的封装。

## 安装

前往插件市场，搜索并安装`chatluna-vector-store-service`即可。Faiss 数据库的依赖`faiss-node`已标记为该插件的依赖，您无需在安装后进行其他的操作。

## 配置

在配置之前，您需要确保安装 ChatLuna 与`chatluna-vector-store-service`，并确保该插件已经启用。然后在 ChatLuna 的[模型选项](../useful-configurations.md#模型选项)中找到 [defaultVectorStore](../useful-configurations.md#defaultvectorstore) 配置项，并选择数据库为`faiss`即可。