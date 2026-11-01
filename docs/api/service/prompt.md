# 提示词 (Prompt)

`ctx.prompt` 由 `@chatluna/prompt` 提供，负责提示词的分区、块注册、变量管理与环境装配。

## 块

| 方法 | 作用 |
| --- | --- |
| `block({ id, zone, role?, order?, content, template?, complete? })` | 注册一个提示词块 |
| `sourceOf(id)` | 查询块来源 |

提示词块通过 `zone` 划分所属分区，取值为 `system`、`context` 或 `input`；内容 `content` 可以是字符串或函数。系统区的 `order` 必须在 `-300..299` 之间。

## 变量

| 方法 | 作用 |
| --- | --- |
| `variable(declaration, provider)` | 注册变量 |
| `catalog()` | 列出所有变量与元数据 |

变量声明包含 `name`、`description`、`mutable`、`zones`、`args` 和 `example` 字段。

可变变量不能出现在系统区；若在渲染前无法判断合法性，系统将产生诊断错误。

## 环境

| 方法 | 作用 |
| --- | --- |
| `environment(contributor)` | 注册环境贡献者 |
| `environmentOf(patch)` | 合并出一个完整环境 |

环境贡献者按注册顺序依次执行并合并结果。若单个贡献者执行失败，系统仅记录警告，不会中断环境构建。

## 渲染

| 方法 | 作用 |
| --- | --- |
| `render(request?)` | 装配整份提示词 |
| `render(source, { zone, env })` | 渲染一段模板 |
| `parse(source)` | 解析模板为 AST |
| `check(source, zone, ...)` | 静态检查变量用法 |

调用 `render(request)` 时，将返回包含 `system`、`prelude`、`contexts`、`input`、`values` 和 `sectionNames` 的装配结果。

## 模板

- 使用 `{name}` 获取变量值；使用 `{name arg1 arg2}` 进行带参调用。
- 使用双花括号转义为字面量花括号。
- 支持 `if`、`else`、`elseif`、`for`、`while` 和 `repeat` 等控制流语法。
- 模板解析失败时不会抛出异常，而是保留原文并给出诊断信息。

## 继续

- [提示词装配](/architecture/prompts)
- [提示词分区](/guide/extend/prompts)
