# 为 ChatLuna 开发插件

本节将以一个简易的例子，来介绍如何为 ChatLuna 开发一个插件（模型适配器）。

## 前置条件

俗话说的好，凡事预则立，不预则废。开发当然是要准备好相关环境和知识，而不是无目的的开发。你需要完成以下任务：

1. 基于 Koishi 官方的 [文档](https://koishi.chat/zh-CN/guide/develop/setup.html)，搭建好模版项目。
2. 模版项目里安装 ChatLuna 的主插件。
3. 学会并搭建好 Koishi 模版项目，了解并掌握编写 Koishi 插件的知识。

## 配置基础环境

一切准备就绪，现在就可以开始新建一个插件了！


阅读 [此](https://koishi.chat/zh-CN/guide/develop/workspace.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E6%8F%92%E4%BB%B6)文档，先新建一个插件。

### 添加 ChatLuna 依赖

参考由 Koishi 官方编写的 [文档](https://koishi.chat/zh-CN/guide/develop/workspace.html#%E6%B7%BB%E5%8A%A0%E4%BE%9D%E8%B5%96)，添加 ChatLuna 依赖到你的插件。

:::tabs code
== npm

```shell
npm install koishi-plugin-chatluna@next -D -P -w koishi-plugin-[name]
```

== yarn

```shell
yarn workspace koishi-plugin-[name] add koishi-plugin-chatluna@next -D -P
```

:::

执行完后记得修改 `peerDependencies` 字段，将 ChatLuna 的版本号改为和 `devDependencies` 里的版本号一致。

如下：

```json
"peerDependencies": {
    "koishi": "^4.15.6",
    "koishi-plugin-chatluna": "*" // [!code --]
    "koishi-plugin-chatluna": "^1.0.0-beta.23" // [!code ++]
},
"devDependencies": {
    "koishi-plugin-chatluna": "^1.0.0-beta.23"
}
```

### 添加 Koishi 元属性

在 `package.json` 里添加 `koishi` 字段，以声明插件的元属性。

```json
"koishi": {
    "description": {
        "zh": "你的插件描述"
    },
    "service": {
        "required": [
            "chatluna"
        ]
    }
}
```

注意 `service` 字段里需要声明依赖 `chatluna` 服务，以保证你的插件能正常工作。

### 声明依赖 ChatLuna 服务

打开新建插件的 `index.ts`，添加下面这几行，导入基本类，并且声明插件需要 ChatLuna 服务。

```ts
import { Context, Schema } from 'koishi'
import { // [!code ++]
   ChatLunaService, // [!code ++]
   ChatLunaPlugin, // [!code ++]
} from "koishi-plugin-chatluna/lib/services/chat"; // [!code ++]

export const name = 'example' 

export const inject = ['chatluna'] // [!code ++]

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
}

```

对于一个模型平台适配插件，其的主要组成部分包括 `Client`,`ModelRequester`,`Config`,`Plugin`。


下面让我们一步步来了解这些部分。

## 模型配置