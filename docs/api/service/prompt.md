# 提示词 (Prompt)

`ctx.prompt`（`@chatluna/prompt`）负责提示词分区、块注册、变量与环境装配。

## 块

| 方法 | 作用 |
| --- | --- |
| `block({ id, zone, role?, order?, content, template?, complete? })` | 注册一个提示词块 |
| `sourceOf(id)` | 查询块来源 |

`zone` 为 `system` / `context` / `input`；`content` 可以是字符串或函数；系统区的 `order` 必须在 -300..299。

## 变量

| 方法 | 作用 |
| --- | --- |
| `variable(declaration, provider)` | 注册变量 |
| `catalog()` | 列出所有变量与元数据 |

声明字段：`name`、`description`、`mutable`、`zones`、`args`、`example`。

可变变量不能出现在系统区；无法判断时渲染前会报诊断错误。

## 环境

| 方法 | 作用 |
| --- | --- |
| `environment(contributor)` | 注册环境贡献者 |
| `environmentOf(patch)` | 合并出一个完整环境 |

贡献者按注册顺序执行，合并结果；单个贡献者失败只记录警告。

## 渲染

| 方法 | 作用 |
| --- | --- |
| `render(request?)` | 装配整份提示词 |
| `render(source, { zone, env })` | 渲染一段模板 |
| `parse(source)` | 解析模板为 AST |
| `check(source, zone, ...)` | 静态检查变量用法 |

`render(request)` 返回 `system`、`prelude`、`contexts`、`input`、`values`、`sectionNames`。

## 模板

- `{name}` 求值；`{name arg1 arg2}` 带参数调用。
- 双花括号转义为字面量花括号。
- 支持 `if` / `else` / `elseif` / `for` / `while` / `repeat`。
- 解析失败不会抛异常：保留原文并给出诊断。

## 继续

- [提示词装配](/architecture/prompts)
- [提示词分区](/guide/extend/prompts)
