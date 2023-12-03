# 为 ChatLuna 开发插件

本节将以一个简易的例子，来介绍如何为 ChatLuna 开发一个插件（模型适配器）。

## 前置条件

俗话说的好，凡事预则立，不预则废。开发当然是要准备好相关环境和知识，而不是无目的的开发。你需要完成以下任务：

1. 基于 Koishi 官方的 [文档](https://koishi.chat/zh-CN/guide/develop/setup.html)，搭建好模版项目。
2. 模版项目里安装 ChatLuna 的主插件。
3. 了解并掌握编写 Koishi 插件的知识。

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

对于一个模型平台适配插件，其的主要组成部分包括 `Client`,`ModelRequester`,`ClientConfig`,`Plugin` 等。

下面让我们一步步来了解这些部分。

## 平台配置

对于一个模型适配器，通常是通过 API 连接到目标平台，这之间自然少不了各种配置，API KEY 等。那么平台配置这块就是实体化这些配置的地方。

### 定义 Schema 配置

Schema 配置能让用户在 Koishi 控制面板里进行配置，并在插件里使用。

ChatLuna 也提供了一套通用的 Schema，用于设置聊天限额，超时时间等。

这里我们直接使用默认的即可，顺便新增 `apiKeys` 字段，用于模拟 `apiKeys` 验证。

```ts
...
export const name = 'example' 

export const inject = ['chatluna'] 

export interface Config extends ChatLunaPlugin.Config {  //[!code focus:12]
    apiKeys: string[]
}

export const Config: Schema<Config> = Schema.intersect([
    ChatLunaPlugin.Config,

    Schema.object({
       apiKeys: Schema.array(Schema.string()).description('API Key'),
    }).description('请求设置'),
])

export function apply(ctx: Context) {
    // write your plugin here
}
```

需要注意的是，ChatLuna 支持一个平台使用多份配置，来实现负载均衡或自动弹出无效配置。

因此在声明 `apiKeys` 字段时我们使用了 `Schema.array(Schema.string())` 而不是 `Schema.string()`，这样可以让用户在控制面板里配置多个 API Key。

### 解析 ClientConfig

在 ChatLuna 中，对于每个模型平台，都需要一套 `ClientConfig`，也就是平台配置，其的接口定义如下：

```ts
export interface ClientConfig {
    apiKey: string;
    platform: PlatformClientNames;
    maxRetries: number;
    concurrentMaxSize: number;
    apiEndpoint?: string;
    timeout: number;
    chatLimit: Computed<Awaitable<number>>;
}
```

导入 `ClientConfig` 类型，并新建一个 `ChatLunaPlugin` 实例。其中两个泛型，第一个为当前插件的 Schema 配置接口，第二个为 `ClientConfig` 或其但的子类型。

传入构建参数的三个值，第一个为当前插件的 `Context`，第二个为当前插件的 Schema 配置实例，在后面可用于解析 `ClientConfig`。第三个为当前的平台名，这也是识别不同平台的关键参数。

`ClientConfig` 默认已经提供了 apiKey 等字段，我们无需继承该接口，直接使用即可。

```ts
...
import { ClientConfig } from 'koishi-plugin-chatluna/lib/services/chat'; // [!code focus]

...
export function apply(ctx: Context) {
    const plugin = new ChatLunaPlugin<BingClientConfig, Config>(  //[!code focus:5] 
        ctx, 
        config, 
        'test'  
    ) 
}
```

完成后我们监听 `ctx` 的 `ready` 参数，在里面解析 `ClientConfig`。

```ts
...
export function apply(ctx: Context) {
    const plugin = new ChatLunaPlugin<BingClientConfig, Config>( 
        ctx,
        config,
        'test',
    )

    ctx.on('ready', async () => { //[!code focus:18] 
        // 注意这句，需要把当前 Plugin 注册到 ChatLuna 服务里
        await plugin.registerToService() 

        // 解析 ClientConfig
        await plugin.parseConfig((config) => 
            return config.apiKeys.map((apiKey) => {
                return { 
                    apiKey, 
                    platform: 'test', 
                    chatLimit: config.chatTimeLimit, 
                    timeout: config.timeout, 
                    maxRetries: config.maxRetries, 
                    concurrentMaxSize: config.chatConcurrentMaxSize, 
                } 
            }) 
        ) 
    })
}
```
