# 配置构型 (Schema)

`Schema` 是插件 `Config` 的定义语言，同时驱动清单校验、WebUI 表单与文档。

## 构造器

| API | 类型 |
| --- | --- |
| `Schema.string()` | string |
| `Schema.number()` / `Schema.natural()` | number |
| `Schema.boolean()` | boolean |
| `Schema.const(v)` | 字面量 |
| `Schema.array(inner)` | T[] |
| `Schema.dict(inner)` | Record<string, T> |
| `Schema.object({...})` | object |
| `Schema.union([a,b])` | a \| b |
| `Schema.intersect([a,b])` | a & b |
| `Schema.tuple([a,b])` | [a, b] |

## 修饰器

| 方法 | 作用 |
| --- | --- |
| `.default(v)` | 默认值 |
| `.required()` | 必填 |
| `.description(s)` | 说明/表单提示 |
| `.role(r)` | 控件角色：`secret` / `ms` / `textarea` 等 |
| `.collapse()` | 表单折叠成组 |
| `.pattern(re)` | 正则校验 |
| `.min/.max` | 数值边界 |
| `.hidden()` | 表单隐藏 |

`Config` 的类型用 `typeof Config.static` 取出。

## 继续

- [配置构型（指南）](/guide/plugin/schema)
