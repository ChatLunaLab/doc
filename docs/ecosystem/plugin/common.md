# 基础工具合集 (Plugin Common)

此插件为 ChatLuna 的 Agent 模式提供了一些基础的工具。

## 配置

- 前往插件市场搜索 `chatluna-plugin-common` 并安装。

![alt text](../../public/images/image-55.png)

## 使用

具体可启用工具和使用方法，请参考 [模型工具介绍](../../guide/model-plugin-system/introduction.md)。

## 配置项

此处列举了 `chatluna-plugin-common` 插件的配置项。

### 插件功能配置

#### request

- 类型：`boolean`
- 默认值：`true`

是否启用网络请求工具。开启后，模型可以调用 `request_get` 和 `request_post` 工具进行网络的 GET 和 POST 请求。

另外可以参考 [request 插件配置](#request-插件配置) 配置请求工具的相关选项。

#### fs

- 类型：`boolean`
- 默认值：`false`

是否启用文件读写工具。开启后，模型可以调用 `file_write` 和 `file_read` 工具读写文件。

另外可以参考 [fs 插件配置](#fs-插件配置) 配置文件读写的作用域。

#### group

- 类型：`boolean`
- 默认值：`false`

是否启用群组工具。开启后，模型可以禁言或者取消禁言指定用户。（需要当前用户有群内管理员权限，并且调用的用户也具备下面的管理员权限）

在 [群组管理](#群管插件配置) 下填写管理员账号。

#### command

- 类型：`boolean`
- 默认值：`false`

是否启用指令工具。开启后，模型可以根据 [指令配置](#指令插件配置) 配置的指令，执行对应的 Koishi 指令。

如果不在下面的 [指令插件配置](#指令插件配置) 中配置指令，则默认注册 Koishi 可用的全部指令。

#### chat

- 类型：`boolean`
- 默认值：`true`

是否启用聊天工具。开启后，模型可以调用 `chat` 工具。该工具会等待用户的输入，返回给模型。

#### think

- 类型：`boolean`
- 默认值：`false`

是否启用思考工具。开启后，模型可以调用 `think` 工具。该工具会基于模型输入的内容，调用其他模型进行思维链推理，返回推理结果。一定程度上提升模型输出的质量。

#### todos

- 类型：`boolean`
- 默认值：`true`

是否启用待办事项工具。开启后，模型可以调用 `todos` 工具。该工具可让 Agent 生成多步骤的待办事项，自动拆解任务。

#### cron

- 类型：`boolean`
- 默认值：`true`

是否启用定时任务工具。开启后，模型可以调用 `cron` 工具。

另可参考 [定时任务插件配置](#定时任务插件配置) 配置定时任务工具。

#### send

- 类型：`boolean`
- 默认值：`true`

是否启用发送消息工具。开启后，模型可以调用 `send` 工具。该工具会发送消息给用户。

#### draw

- 类型：`boolean`
- 默认值：`false`

是否启用文生图工具。开启后，模型可以调用 `draw` 工具。该工具会基于模型输入的内容，调用 Koishi 上的文生图插件，生成图片。

另可参考 [画图插件配置](#画图插件配置) 配置文生图工具。

#### music

- 类型：`boolean`
- 默认值：`false`

是否启用音乐播放工具。开启后，模型可以调用 `music` 工具，播放音乐。

在启用此工具前，需要确保 Koishi 的 `@dgck81lnn/music` 插件已启用。

另可参考 [音乐生成插件配置](#音乐生成插件配置) 配置音乐工具。

#### actions

- 类型：`boolean`
- 默认值：`false`

是否启用 OpenAPI 工具调用功能。开启后，模型可以调用自定义的 OpenAPI 工具。

另可参考 [OpenAPI 工具调用插件配置](#openapi-工具调用插件配置) 配置 OpenAPI 工具。需要启用 request 工具才能请求。

### request 工具配置

#### requestMaxOutputLength

- 类型：`number`
- 默认值：`58600`

request 插件最大输出长度。

#### requestSelector

- 类型：`string[]`
- 默认值：`['请求', 'request', 'get', 'post', '获取', '调用', 'api', 'http']`

触发 request 工具的关键词。为空时始终选中。

#### requestHeaders

- 类型：`{ matcher: string, headers: Record<string, string> }[]`
- 默认值：`[]`

根据域名匹配设置请求头。

##### requestHeaders.matcher

- 类型：`string`
- 默认值：``

域名匹配模式(支持通配符,如 `*.example.com`, `api.github.com`)。

##### requestHeaders.headers

- 类型：`Record<string, string>`
- 默认值：`{}`

该域名匹配时应用的请求头。

### fs 插件配置

#### fsScopePath

- 类型：`string`
- 默认值：``

文件读写的作用域。留空则为系统任意路径。

#### fsSelector

- 类型：`string[]`
- 默认值：`['文件', 'file', '读取', '写入', '查找', '搜索', 'read', 'write', 'search', '路径', 'path']`

触发 fs 工具的关键词。为空时始终选中。

#### fsIgnores

- 类型：`string[]`
- 默认值：`['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/.yarn/**', '**/coverage/**', '**/.next/**', '**/.nuxt/**', '**/out/**', '**/.cache/**', '**/.vscode/**', '**/.idea/**', '**/temp/**', '**/tmp/**']`

默认忽略的文件夹表达式。

### 指令工具配置

#### commandWithSend

- 类型：`boolean`
- 默认值：`true`

是否默认发送指令的执行结果。

#### commandList

- 类型：`{ command: string, description: string, selector: string[], confirm: boolean }[]`
- 默认值：`[]`

需要注册的指令列表。不填写则默认注册所有一级指令。

##### commandList.command

- 类型：`string`
- 默认值：``

需要执行的 Koishi 指令。

##### commandList.description

- 类型：`string`
- 默认值：``

指令的描述。此描述面向模型，用于模型理解指令的作用。

##### commandList.selector

- 类型：`string[]`
- 默认值：`[]`

指令的触发条件。当聊天内容包含这些关键词时，此指令才会注册给模型。

##### commandList.confirm

- 类型：`boolean`
- 默认值：`true`

执行指令时是否需要二次确认。

### 群管插件配置

#### groupScopeSelector

- 类型：`string[]`
- 默认值：`[]`

允许使用群管功能的成员 ID 列表。

#### groupWhitelist

- 类型：`string[]`
- 默认值：`[]`

允许使用群管功能的群 ID 白名单。为空时在所有群可用。

### 定时工具配置

#### cronScopeSelector

- 类型：`string[]`
- 默认值：`[]`

允许使用命令类型定时任务的成员 ID 列表。为空时所有人都可以创建提醒任务,但无法创建命令任务。

### 画图工具配置

#### drawPrompt

- 类型：`string`
- 默认值：`1girl, solo, female only, full body, masterpiece, highly detailed, game CG, spring, cherry blossoms, floating sakura, beautiful sky, park, extremely delicate and beautiful girl, high school girl, black blazer jacket, plaid skirt, short_hair, blunt_bangs, white_hair/pink_eyes, two-tone hair, gradient hair, by Masaaki Sasamoto, best quality, masterpiece, highres, red-eyeshadow, lipstick.`

画图工具的参考 Prompt，用于给模型提供参考。建议只填写 70 词以内的高质量提示词。

#### drawCommand

- 类型：`string`
- 默认值：`nai {prompt}`

画图时实际执行的指令。`{prompt}` 为调用时的 prompt。

#### drawSelector

- 类型：`string[]`
- 默认值：`['画', 'image', 'sd', '图', '绘', 'draw', '生成', 'generate', '创作', 'create']`

触发绘画工具的关键词。为空时始终选中。

### 音乐工具配置

#### musicSelector

- 类型：`string[]`
- 默认值：`['音乐', 'music', '歌曲', 'song', '音频', 'audio', '创作', 'create', '生成', 'generate']`

触发音乐生成工具的关键词。为空时始终选中。

### OpenAPI 工具调用插件配置

#### actionsList

- 类型：`{ name: string, description: string, openAPISpec: string, headers: Record<string, string>, selector: string[] }[]`
- 默认值：`[]`

可用 OpenAPI 工具列表。

##### actionsList.name

- 类型：`string`
- 默认值：``

工具名称。请使用纯英文的名称。

##### actionsList.description

- 类型：`string`
- 默认值：``

工具描述。

##### actionsList.openAPISpec

- 类型：`string`
- 默认值：``

OpenAPI 规范文件内容。

##### actionsList.headers

- 类型：`Record<string, string>`
- 默认值：`{}`

工具请求头。

##### actionsList.selector

- 类型：`string[]`
- 默认值：`[]`

触发工具的关键词。
