# 讯飞星火

讯飞星火是科大讯飞推出的旗下规模最大、功能最强大的人工智能模型系列。

同时也推出了星火助手，提供知识库的体验。

## 安装

前往插件市场，搜索 `chatluna-spark-adapter`，安装即可

![images](../../public/images/plugin_market_spark.png)

## 配置

在配置之前，请先获取你的星火平台的 `APPID`，`APISecret` 和 `APIKey`。

::: tip 提示
未来我们可能会录制官方教程，敬请期待。
:::

获取到相关密钥后，转到星火适配器的配置页面，默认插件有一个空的适配项，填入你的 `APPID`，`APISecret` 和 `APIKey` 即可。

![images](../../public/images/plugin_spark_adapter_1.png)

记得点击右上角的保存按钮。

## 使用

在星火适配器的配置页面，点击运行按钮，如无误，你应该看不到任何错误 log，那即可转到 ChatLuna 的主插件页面。

在主插件页面，下划到 [模版房间选项](../useful-configurations.md#模版房间选项)，查看 [defaultModel](../useful-configurations.md#defaultmodel) 的选项里是否含有星火模型，如果有，则说明你已经成功地接入了星火平台

![images](../../public/images/plugin_spark_pic_1.png)
