# 配置文件

::: tip
本节介绍如何通过清单 (Manifest) 装配插件树，以及如何使用 Cordis Schema 为插件声明配置项 `Config`。
:::

## 编写与组织清单

ChatLuna 实例通过 YAML 清单文件装配插件运行树。默认情况下，整个实例由 `chatluna.yml` 文件完成装配。

清单的核心是一系列插件条目 (`entry`)。配置条目时，你可以声明以下字段：

- `id`：插件条目的唯一标识
- `name`：插件包名或本地模块路径
- `config`：传递给插件的配置对象
- 可选状态与控制字段：
  - `disabled`：是否停用该条目
  - `group`：所属分组
  - `label`：在控制台中显示的名称
  - `isolate`：隔离作用域配置

整个清单由 `@cordisjs/plugin-include` 解析，并严格按照插件间的依赖顺序进行挂载。如果你的项目采用了多清单架构，也可以在根清单 `cordis.yml` 中使用 `include` 引入其他清单文件。

::: warning
清单所在目录即为基准路径 (`baseUrl`)。配置项中出现的相对路径（例如 `./data/chatluna.db`）均相对于当前清单文件所在目录进行解析。请确保相对路径的基准位置符合预期，避免因工作目录变动导致文件路径错误。
:::

## 为插件定义配置构型

插件通常需要接受来自用户的配置。为了校验清单中传入的 `config` 字段，插件可以通过导出一个 `Config` 构型对象来定义配置规则。导出的 `Config` 由 Cordis `Schema` 构建，在插件加载时会自动完成类型校验并注入默认值，随后传递给 `apply(ctx, config)` 函数：

```ts
import type { Context } from 'cordis'
import { Schema } from '@chatluna/schema'

export const Config = Schema.object({
  prefix: Schema.string().default('!').description('指令前缀'),
  retries: Schema.natural().default(3).description('失败重试次数'),
})

export function apply(ctx: Context, config: typeof Config.static) {
  // config.prefix 与 config.retries 已完成校验并注入默认值
}
```

### Schema 支持的方法与修饰器

`Schema` 提供了基础类型定义与链式修饰方法，方便你清晰地描述配置结构：

- **基础类型**：`Schema.string()`、`Schema.natural()`、`Schema.boolean()`、`Schema.array()`、`Schema.dict()`、`Schema.union()`、`Schema.intersect()`、`Schema.object()`、`Schema.const()`。
- **修饰器**：
  - `.default(value)`：指定字段默认值
  - `.description(text)`：添加字段功能说明
  - `.required()`：标记该字段为必选项
  - `.role('secret')`：标记该字段为敏感数据

`Config` 构型不仅用于运行时配置校验，同时也是 WebUI 配置表单的元数据来源。只要声明好 Schema 构型，WebUI 就会自动生成对应的表单项，无需手动编写配置界面。

::: tip
请始终使用 `@chatluna/schema` 导出的 Cordis Schema。切勿在插件中引入 `zod` 或其他第三方校验库。
:::

## 管理敏感凭据与环境变量

API Key 或数据库密码等密钥切勿以明文形式直接写入清单文件。管理敏感信息时，请遵循以下规范：

1. **使用凭据引用**：使用 `$credential` 语法引用凭据库中的条目。
2. **读取环境变量**：通过系统环境变量注入密钥。
3. **标记敏感字段**：定义插件 `Config` 时，为包含密钥的字段添加 `.role('secret')` 修饰，运行时将按敏感数据规则进行遮蔽与保护。

## 下一步

- [配置构型](../plugin/schema) — 查看 Schema 构型的进阶用法与完整 API
- [第一个插件](./first-plugin) — 创建并运行你的第一个 ChatLuna 插件
