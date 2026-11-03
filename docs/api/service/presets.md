# 预设 (Presets)

::: tip
`ctx.presets` 由 `@chatluna/preset` 提供，管理 `data/chatluna/presets` 下的预设文件：通过加载器解析、诊断状态、读写与预览，并把预设渲染为提示词块。WebUI 的预设页面直接编辑源文本并提供补全，不会用表单覆盖 Frontmatter。
:::

## 加载器与预设记录

每个 `PresetLoader` 声明：

- `id`：加载器标识。
- `kind`：加载器类型。
- `extensions`：支持的文件扩展名。
- `parse()`：把原始文件解析为预设记录。
- `editable`：`source` 或 `none`，表示能否直接编辑源文本。

内置两类加载器：基于 Frontmatter 与正文模板的 `md` 加载器，以及读取 ChatLuna 旧版格式的 v1 兼容加载器。`ctx.presets.listLoaders()` 列出已注册的加载器。

解析后每个预设对应一个 `PresetRecord`：

- `revision`：源文件内容的 SHA-256，用于版本追踪和并发控制。
- `diagnostics`：解析诊断列表。
- `status`：`'ok'`、`'degraded'` 或 `'error'`。
- `origin`：`'managed'`（目录中的文件）或 `'plugin'`（插件注册）。

## 常用 API

| 方法 | 说明 |
| --- | --- |
| `list(kind?)` | 列出预设记录，可按 `kind` 筛选 |
| `get(id)` | 获取预设记录 |
| `source(id)` | 读取源文本，同时返回 `revision` 和文件路径 |
| `raw(id)` | 读取原始字节（`Uint8Array`）和文件路径 |
| `preview({ id?, name?, text })` | 只在内存中解析，不写盘 |
| `create({ id, loader, text? })` | 新建预设文件 |
| `save(id, text, revision)` | 保存修改，校验 `revision` |
| `import(name, bytes)` | 导入原始字节为新预设 |
| `duplicate(id, target)` | 复制为新 ID `target` |
| `remove(id, revision)` | 删除预设，校验 `revision` |
| `rescan()` | 重新扫描预设目录 |
| `blocks(record)` | 渲染为提示词块；无需生成时返回 `undefined` |
| `mount(scoped, preset)` | 把预设绑定到子上下文 `scoped` |
| `listLoaders()` | 列出已注册的加载器 |

## 读取与预览

```ts
const presets = ctx.presets.list()
const preset = ctx.presets.get('assistant')

if (preset?.status === 'ok') {
  const content = await ctx.presets.source('assistant')
}
```

保存前可以用 `preview` 检查语法和 Frontmatter：

```ts
const record = await ctx.presets.preview({
  name: 'temp-preview',
  text: sourceText,
})

if (record.diagnostics.length > 0) {
  // 处理警告或错误
}
```

## 保存与并发控制

`save` 和 `remove` 必须传入读取时得到的 `revision`。磁盘上的文件已被其他操作修改时，哈希不一致，系统拒绝写入并抛出 `PresetConflictError`。

```ts
try {
  await ctx.presets.save('assistant', updatedText, currentRevision)
} catch (err) {
  if (err.name === 'PresetConflictError') {
    // 重新读取源文本后合并，或提示用户
  }
}
```

::: warning
遇到 `PresetConflictError` 时，让用户重新读取并解决冲突，不要跳过版本校验直接覆盖。
:::

## 插件贡献预设

插件可以通过 `ctx.presets.contribute()` 注入只读预设：`origin` 为 `'plugin'`，只存在于内存中，`editable` 为 `none`，不能通过 API 或 WebUI 保存或删除。

## 渲染与挂载

```ts
const blocks = await ctx.presets.blocks(presetRecord)
ctx.presets.mount(sessionContext, presetRecord)
```

## 下一步

- [角色与预设（手册）](/manual/usage/characters)
- [提示词装配](/guide/extend/prompts)
