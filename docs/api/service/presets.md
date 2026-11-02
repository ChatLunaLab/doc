# 预设 (Presets)

预设服务 (Preset Service) 由 `@chatluna/preset` 提供，并通过 `ctx.presets` 挂载。它负责管理 `data/chatluna/presets` 目录下的所有预设文件，包括通过加载器 (Loader) 解析内容、诊断运行状态、提供读写与预览，以及将预设渲染为提示词块。你可以通过预设来定义模型的人格特征、对话格式与附加行为。

::: tip
在 WebUI 的预设管理页面中，系统直接提供源文本编辑与模板补全功能，不会使用表单强制覆盖 Frontmatter 结构。
:::

## 加载器与预设记录

预设服务通过不同的加载器读取多种格式的源文件，并将它们解析为统一的数据结构。

### PresetLoader

每个预设加载器都需要声明以下字段与方法：

- `id`：加载器的唯一标识符。
- `kind`：加载器类型。
- `extensions`：该加载器支持的文件扩展名列表。
- `parse()`：将原始文件解析为预设记录的函数。
- `editable`：取值为 `source` 或 `none`，表示该预设是否允许直接编辑源文本。

系统内置了两类加载器：
1. `md`：基于 Frontmatter 与正文模板的 Markdown 加载器。
2. v1 兼容加载器：用于读取 ChatLuna 历史版本格式的预设文件。

你可以调用 `ctx.presets.listLoaders()` 列出当前运行时已注册的所有加载器。

### PresetRecord

解析完成后，系统会为每个预设维护一个 `PresetRecord` 记录对象，包含以下元数据：

- `revision`：源文件内容的 SHA-256 哈希值，用于版本追踪与并发控制。
- `diagnostics`：预设解析过程中的诊断信息列表。
- `status`：预设的健康状态，包含 `'ok'`（正常）、`'degraded'`（降级可用）和 `'error'`（解析失败或不可用）。
- `origin`：预设来源，取值为 `'managed'`（由目录管理的本地预设文件）或 `'plugin'`（由插件注册的代码预设）。

---

## 常用 API

`ctx.presets` 提供了管理与读取预设的完整接口：

| 方法 | 说明 |
| --- | --- |
| `list(kind?)` | 列出预设记录，支持按 `kind` 筛选 |
| `get(id)` | 获取指定 ID 的预设记录 (`PresetRecord`) |
| `source(id)` | 读取预设源文本，同时返回 `revision` 与文件路径 |
| `raw(id)` | 读取预设的原始字节 (`Uint8Array`) 与文件路径 |
| `preview({ id?, name?, text })` | 仅在内存中解析并返回 `PresetRecord`，不写入磁盘存储 |
| `create({ id, loader, text? })` | 新建预设文件 |
| `save(id, text, revision)` | 保存源文本修改，同时校验 `revision` |
| `import(name, bytes)` | 导入原始字节数据并保存为新预设 |
| `duplicate(id, target)` | 复制指定预设至新 ID `target` |
| `remove(id, revision)` | 删除指定预设，同时校验 `revision` |
| `rescan()` | 重新扫描 `data/chatluna/presets` 目录 |
| `blocks(record)` | 将预设记录渲染为提示词块；无需生成块时返回 `undefined` |
| `mount(scoped, preset)` | 将预设绑定并生效至指定的子上下文 (`scoped`) |
| `listLoaders()` | 列出当前所有已注册的 `PresetLoader` |

---

## 读取与预览预设

你可以通过预设 ID 获取解析后的记录，也可以在不保存文件的情况下直接测试文本解析效果。

### 获取与检查预设

```ts
// 枚举全部预设记录
const presets = ctx.presets.list()

// 获取特定预设
const preset = ctx.presets.get('assistant')

if (preset && preset.status === 'ok') {
  // 读取源文本
  const content = await ctx.presets.source('assistant')
}
```

### 内存预览

如果你需要在保存前验证用户输入的语法或 Frontmatter 格式，可以使用 `preview` 方法：

```ts
const record = await ctx.presets.preview({
  name: 'temp-preview',
  text: sourceText
})

// 检查解析诊断信息
if (record.diagnostics.length > 0) {
  // 处理警告或错误诊断
}
```

---

## 保存与并发控制

为了防止多端协同或 WebUI 并发修改导致内容相互覆盖，预设服务采用了基于 `revision` 的乐观并发控制机制。

调用 `save(id, text, revision)` 或 `remove(id, revision)` 时，必须传入此前读取预设时获得的 `revision`。如果磁盘上的文件已被其他操作更改，导致当前的哈希值与传入的 `revision` 不一致，系统会拒绝写入并抛出 `PresetConflictError`。

::: warning
当捕获到 `PresetConflictError` 时，请提示用户重新读取最新源文本并解决冲突，切勿跳过版本校验直接覆盖。
:::

```ts
try {
  await ctx.presets.save('assistant', updatedText, currentRevision)
} catch (err) {
  if (err.name === 'PresetConflictError') {
    // 处理并发冲突：重新拉取源文本后重试，或提示用户
  }
}
```

---

## 插件贡献预设

除了由用户在 `data/chatluna/presets` 目录下放置文件外，插件也可以直接通过 `ctx.presets.contribute()` 注入只读预设。

由插件贡献的预设具有以下特性：
- `origin` 标记为 `'plugin'`。
- 数据仅保存在运行时内存中，不会写入本地文件目录。
- `editable` 为 `none`，不允许通过 API 或 WebUI 执行 `save` 和 `remove` 操作。

---

## 预设渲染与挂载

预设最终需要被转换为会话上下文所需的提示词块：

```ts
// 1. 将预设渲染为 PromptBlock[]
const blocks = await ctx.presets.blocks(presetRecord)

// 2. 将预设绑定至子上下文环境
ctx.presets.mount(sessionContext, presetRecord)
```

---

## 下一步

- [角色与预设（手册）](/manual/usage/characters)
- [提示词装配](/guide/extend/prompts)
