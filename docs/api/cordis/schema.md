# 配置构型 (Schema)

`Schema` 是定义插件配置项 `Config` 的核心工具。通过声明配置结构，它能同时驱动运行时的配置校验、控制台 WebUI 的表单渲染以及配置文档生成。

## 构造器

构造器用于声明配置项的数据类型。你可以组合基础类型与复合类型构造器，定义出所需的配置结构：

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

声明类型后，你可以链式调用修饰器为字段补充默认值、校验规则与界面展示属性：

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

我们无需手动重复定义 TypeScript 接口——直接使用 `typeof Config.static` 即可取出对应的静态配置类型。

## 继续

想了解更多进阶用法与实战指南，请参考：

- [配置构型（指南）](/guide/plugin/schema)
