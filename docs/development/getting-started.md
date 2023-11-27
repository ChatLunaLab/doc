# 为 ChatLuna 开发插件

本节将以一个简易的例子，来介绍如何为 ChatLuna 开发一个插件（模型适配器）。

## 前置条件

在开发之前，当然不是从零开始。你需要完成以下任务：

1. 基于 koishi 官方的[文档](https://koishi.chat/zh-CN/guide/develop/setup.html)，搭建好模版项目。
2. 模版项目里需要安装 ChatLuna 的主插件。

## 配置基础环境

前置条件都完成了之后，我们就可以开始新建插件了！

阅读[此](https://koishi.chat/zh-CN/guide/develop/workspace.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E6%8F%92%E4%BB%B6),先新建一个插件。

接下来我们假设你创建的插件名叫`example`。

### 添加 ChatLuna 依赖

参考由 Koishi 编写的[文档](https://koishi.chat/zh-CN/guide/develop/workspace.html#%E6%B7%BB%E5%8A%A0%E4%BE%9D%E8%B5%96)，添加 ChatLuna 依赖到你的插件。

::: tabs code
```npm
npm install koishi-plugin-chatluna@next -D -P -w koishi-plugin-[name]
```
```yarn
yarn workspace koishi-plugin-[name] add koishi-plugin-chatluna@next -D -P
```
:::

执行完后记得修改 `peerDependencies` 字段，将 ChatLuna 的版本号改为和 `devDependencies` 一致。

如下：

```diff{json}
"peerDependencies": {
    "koishi": "^4.15.6",
-   "koishi-plugin-chatluna": "*"
+   "koishi-plugin-chatluna": "^1.0.0-beta.23"
},
"devDependencies": {
    "koishi-plugin-chatluna": "^1.0.0-beta.23"
}
```
