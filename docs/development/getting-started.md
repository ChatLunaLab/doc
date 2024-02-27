# 为 ChatLuna 开发插件

本节将以一个简易的例子，来介绍如何为 ChatLuna 开发一个插件（模型适配器）。

## 前置条件

俗话说的好，凡事预则立，不预则废。开发插件当然是得准备好相关环境和知识，而不是直接就开始。你需要完成或了解下面的内容：

1. 基于 Koishi 官方的 [文档](https://koishi.chat/zh-CN/guide/develop/setup.html)，搭建好模版项目。
2. 模版项目里安装 ChatLuna 的主插件。
3. 了解并掌握编写 Koishi 插件的知识。

## 配置基础环境

一切准备就绪，现在就可以开始新建一个插件了！

阅读 此 [文档](https://koishi.chat/zh-CN/guide/develop/workspace.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E6%8F%92%E4%BB%B6)，新建一个插件。

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

执行完后记得修改 `peerDependencies` 字段，将 ChatLuna 的版本号和 `devDependencies` 里的版本号修改为一致。

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

下面让我们一步步来了解这些 API。

## 平台配置

对于一个模型适配器，通常是通过 API 连接到目标平台，这之间自然少不了各种配置，API KEY 等。那么平台配置这块就是实体化这些配置的地方。

### 定义 Schema 配置

Schema 配置能让用户在 Koishi 控制面板里进行配置，并在插件里使用。

ChatLuna 也提供了一套通用的 Schema，用于设置聊天限额，超时时间等。

这里我们直接使用默认的即可，顺便新增 `apiKeys` 字段，用于模拟密钥验证。

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

需要注意的是，ChatLuna 可以在一个模型平台里配置多份不同的 API KEY，以支持负载均衡或自动弹出无效配置。

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

导入 `ClientConfig` 类型，并新建一个 `ChatLunaPlugin` 实例。其中两个泛型，第一个为当前插件的 Schema 配置接口，第二个为 `ClientConfig` 或其他的子类型。

传入构建参数的三个值，第一个为当前插件的 `Context`，第二个为当前插件的 Schema 配置实例，在后面可用于解析 `ClientConfig`。第三个为当前的平台名，这也是识别不同平台的关键参数。

`ClientConfig` 默认已经提供了 apiKey 等字段，我们无需继承该接口，直接使用即可。

```ts
...
import { ClientConfig } from 'koishi-plugin-chatluna/lib/services/chat'; // [!code focus:1]

...
export function apply(ctx: Context) {
    const plugin = new ChatLunaPlugin<ClientConfig, Config>(  // [!code focus:5] 
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
    const plugin = new ChatLunaPlugin<ClientConfig, Config>( 
        ctx,
        config,
        'test',
    )

    ctx.on('ready', async () => { // [!code focus:18] 
        // 注意这句，需要把当前 Plugin 注册到 ChatLuna 服务里，才能进行后续操作
        await plugin.registerToService() 

        // 解析 ClientConfig
        await plugin.parseConfig((config) => 
            config.apiKeys.map((apiKey) => {
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

解析 `ClientConfig` 实际上是将 Schema 配置转换为 `ClientConfig` 数组。

完成后我们即可开始编写 `Client` 相关逻辑。

## Client 配置

在 ChatLuna 中， `Client` 即指 `BasePlatformClient` 及其子类。

ChatLuna 根据模型的不同用途，提供了几种 `Client`:

- `PlatformModelClient`: 用于和语言模型进行交互的 `Client`,可创建 `ChatLunaChatModel`，用于语言模型交互。
- `PlatformEmbeddingsClient`: 用于和嵌入模型进行交互的 `Client`,可创建 `ChatHubBaseEmbeddings`，用于嵌入模型交互。
- `PlatformModelAndEmbeddingsClient`: 前面两者的组合，可创建 `ChatHubBaseEmbeddings` 和 `ChatLunaChatModel`。

我们的测试插件，只需要继承 `PlatformModelClient` 即可。

新建 `client.ts`，编写相关代码。

### 基础模版实现

``` ts
import { Context } from "koishi";
import { PlatformModelClient } from "koishi-plugin-chatluna/lib/llm-core/platform/client";
import { ClientConfig } from "koishi-plugin-chatluna/lib/llm-core/platform/config";
import { ChatLunaChatModel } from "koishi-plugin-chatluna/lib/llm-core/platform/model";
import { ModelInfo } from "koishi-plugin-chatluna/lib/llm-core/platform/types";
import { Config } from ".";

export class TestClient extends PlatformModelClient<ClientConfig> {
    constructor(ctx: Context, private _config: Config, config: ClientConfig) {
        super(ctx, config);
    }
    // 模型平台名称，唯一识别码
    platform = "test";

    init(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getModels(): Promise<ModelInfo[]> {
        throw new Error("Method not implemented.");
    }

    refreshModels(): Promise<ModelInfo[]> {
        throw new Error("Method not implemented.");
    }

    protected _createModel(model: string): ChatLunaChatModel {
        throw new Error("Method not implemented.");
    }
}

```

`PlatformModelClient` 中泛型接收的参数为 `ClientConfig` 类型，也就是上文新建 `ChatLunaPlugin` 中的类型。

在构造方法中，我们传入了 `ctx` 和 `config` 参数，其中 `config` 即为当前平台的 `ClientConfig` 配置类型， `_config` 即为插件 `apply` 入口中的 `Config` 实例。

### init, getModels, refreshModels 实现

我们只是在编写测试插件，因此在 `init` 中，无须实现真正的耗时请求操作来获取模型列表，只需硬写入模型，模拟一般的模型平台，调用 `refreshModels` 即可。

先声明 `_models` 属性，模拟缓存的模型，然后在 `refreshModels` 里面直接覆写 `_models` 属性。

``` ts
...
import { ModelInfo } from "koishi-plugin-chatluna/lib/llm-core/platform/types";

...
export class TestClient extends PlatformModelClient<ClientConfig> {
    ...

    private _models: ModelInfo[] = [] // [!code focus:1] 

    ...

    async refreshModels(): Promise<ModelInfo[]> { // [!code focus:10] 
        return ["test"].map((name) => {
            return {
                // 模型名称
                name,
                // 模型类型，可选 llm 或 embeddings
                type: ModelType.llm,
            }
        })
    }
}
```

在 `init` 中直接调用 `refreshModels`，并且在 `getModels` 中返回 `_models`。

``` ts
...
import { ModelInfo } from "koishi-plugin-chatluna/lib/llm-core/platform/types";

...
export class TestClient extends PlatformModelClient<ClientConfig> {
   ...

    private _models: ModelInfo[] = []

   ...

    async init(): Promise<void> { // [!code focus:3] 
        this._models = await this.refreshModels()
    }

    async getModels(): Promise<ModelInfo[]> { // [!code focus:3] 
        return this._models
    }
}
```

### 插件入口中声明实例化 Client

在插件入口中，我们需要把实例化 `TestClient` 的函数，注册到 ChatLuna 服务中。

``` ts
...
import { TestClient } from "./client";

...
export function apply(ctx: Context) {
    const plugin = new ChatLunaPlugin<ClientConfig, Config>( 
        ctx, 
        config, 
        'test'  
    ) 

    ctx.on('ready', async () => { // [!code focus:1] 
        ...

        await plugin.registerClient( // [!code focus:6] 
            (_, clientConfig) => new TestClient(ctx, config, clientConfig)
        )

        await plugin.initClients()
    })
}

```

以下为 `plugin.registerClient` 的签名：

``` ts
ChatLunaPlugin<ClientConfig, Config>.registerClient(func: (ctx: Context, config: ClientConfig) => BasePlatformClient<ClientConfig, ChatLunaChatModel | ChatHubBaseEmbeddings>, platformName?: string): Promise<...> 
```

即提供一个函数，函数的参数为当前 `plugin` 的注册 ctx 和给定的 `ClientConfig` 配置，函数应该返回一个 `BasePlatformClient` 实例。

在 `plugin.initClients` 中，会调用 `registerClient` 注册的函数，基于上面 `parseConfig` 返回的 `ClientConfig` 数组，实例化 `TestClient`。

接下来我们需要实现 `Requester`，这是 ChatLuna 与 模型通信的类实现。

实现了 `Requester` 后，我们才能继续编写 `TestClient` 里的 `createModel` 方法。

## Requester 配置

新建 `requester.ts`，编写基础代码。

``` ts
import { Context, Logger } from "koishi";
import {
  ModelRequestParams,
  ModelRequester,
} from "koishi-plugin-chatluna/lib/llm-core/platform/api";
import { ClientConfig } from "koishi-plugin-chatluna/lib/llm-core/platform/config";
import { createLogger } from "koishi-plugin-chatluna/lib/utils/logger";
import { ChatGenerationChunk } from "langchain/schema";

let logger: Logger;

export class TestRequester extends ModelRequester {
  constructor(private ctx: Context, private _config: ClientConfig) {
        super();
        logger = createLogger(ctx, "[test]chatluna-test-adapter");
  }

  completionStream(
    params: ModelRequestParams
  ): AsyncGenerator<ChatGenerationChunk> {
    throw new Error("Method not implemented.");
  }

  async init(): Promise<void> {}
  async dispose(): Promise<void> {}
}

```

上面的代码我们新建了一个 `TestRequester` 类，继承了 `ModelRequester`。

在构造方法中，我们传入了 `ctx` 和 `config` 参数，其中 `config` 即为当前平台的 `ClientConfig` 配置类型， `_config` 即为插件 `apply` 入口中的 `Config` 实例。

并且在构造方法中，我们创建了一个 `logger`，用于打印日志。

对于 `init` 和 `dispose` 方法，由于我们并不是真正的在和模型进行通信，无需进行初始化或者释放资源操作。

### 实现 completionStream

`completionStream` 方法是 ChatLuna 与模型通信的核心方法，我们需要实现这个方法，用于向模型发送请求，并获取模型的响应。

还记得构造方法里的 `ClientConfig` 吗？我们需要在模拟模型请求之前，验证 `apiKey` 是否为 `chatluna_` 开头，来模拟和模型请求时的鉴权。

``` ts
...
import {
  ChatLunaError,
  ChatLunaErrorCode,
} from "koishi-plugin-chatluna/lib/utils/error";
...

export class TestRequester extends ModelRequester {
    ...

    async *completionStream( // [!code focus:8] 
        params: ModelRequestParams
    ): AsyncGenerator<ChatGenerationChunk> {
        if (!this._config.apiKey.startsWith("chatluna_")) {
            throw new ChatLunaError(ChatLunaErrorCode.API_KEY_UNAVAILABLE,
            new Error("API Key is not valid"));
        }
    }
  ...
}

```

我们实现了 API KEY 鉴权，并使用了 ChatLuna 内置的 `ChatLunaError` 类，来抛出一个错误，表示 API KEY 无效。

在为 ChatLuna 提供任何功能时，建议都使用 ChatLuna 内置的错误类，这样可以更友好的让用户了解到错误的原因。

然后我们简易的弄一个类似复读机的效果，实现 `completionStream` 方法。

``` ts
...
import { ChatGenerationChunk } from "langchain/schema"; // [!code focus:1] 
...

export class TestRequester extends ModelRequester {
   ...

    async *completionStream( //[!code focus:3] 
        params: ModelRequestParams
    ): AsyncGenerator<ChatGenerationChunk> {
        if (!this._config.apiKey.startsWith("chatluna_")) {
            throw new ChatLunaError(ChatLunaErrorCode.API_KEY_UNAVAILABLE,
            new Error("API Key is not valid"));
        }

        
        const { input: messages } = params; // [!code focus:17] 
        const input = messages[messages.length - 1].content as string;

        const response = input
            .replaceAll("你", "我")
            .replaceAll("?", "!")
            .replaceAll("不", " ")
            .replaceAll("吗", " ")
            .replaceAll("有", "没有")
            .replaceAll("？", "！");

        logger.debug(`[test] ${input} => ${response}`);    

        yield new ChatGenerationChunk({
            text: response,
            message: new AIMessageChunk(response),
        });
    }
}

```

上面实现一个类似复读机的效果，例如输入：`你好吗？` 则会返回 `我好！`。

至此，我们已经完成了 `TestRequester` 的实现，接下来我们需要在 `TestClient` 中使用它。

## 最后的实现：`createModel`

在 `TestClient` 中，我们需要在 `createModel` 方法中创建 `ChatLunaModel`，并传递 `TestRequester` 实例给它。

``` ts
...
import { TestRequester } from "./requester";
...

export class TestClient extends BasePlatformClient<ClientConfig, ChatLunaChatModel | ChatHubBaseEmbeddings> {
    ...

    protected _createModel(model: string): ChatLunaChatModel { // [!code focus:11] 
        return new ChatLunaChatModel({
            modelInfo: this._models[0],
            requester: new TestRequester(this.ctx, this.config),
            model,
            modelMaxContextSize: 10000000,
            timeout: this._config.timeout,
            maxRetries: this._config.maxRetries,
            llmType: "test",
    });
  }
}

```

在上面的代码中，我们在 `createModel` 方法中，创建了一个 `ChatLunaChatModel`，并将 `TestRequester` 实例传递给它。

其的 `llmType` 参数表示当前模型的类型，在这里我们使用上面 `platform` 字段的值。

对于其传递的 requester，也未必总是新建，可在 `init` 方法里就创建好，在 `createModel` 里传给 `ChatLunaChatModel` 该值。

至此，我们已经基本完成了一个模型适配器的实现。接下来可以运行 Koishi，在控制面板里配置我们的模型适配器了！

## 配置模型适配器
