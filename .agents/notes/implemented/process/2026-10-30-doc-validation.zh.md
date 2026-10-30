# Agent Note: 文档仓库验证入口

Status: implemented

## Problem

双版本 VitePress 项目原本没有能覆盖导航、源链接和版本隔离的检查命令。VitePress 配置忽略死链，构建输出也可能在缺少本地图片、编辑链接或版本专属搜索路由时仍以成功结束。

## Decision

- `scripts/check-docs.mjs v2|v1` 解析所选 VitePress 配置，并检查源页面中的 Markdown 与常见 HTML 引用、导航/sidebar 路由、图片资源和 `<<<` include 文件。校验通过实际 rewrite 得到的发布路由；v1、v2 不可混入彼此的源页面。
- `tests/docs.test.mjs` 使用 Node 内建测试框架覆盖路由归一化、HTML/Markdown 提取、include/资源缺失、双版本错误处理和 site launcher 参数验证。
- `scripts/check-builds.mjs v2|v1` 对现有构建产物检查 CNAME、非首页 sitemap 路由、HTML 页面与本地资源、edit URL、hashmap、版本专属本地搜索索引，以及 v1/v2 路由隔离。未传版本时依次检查两个现有构建目录，不会代替构建命令。
- package scripts 将源检查暴露为 `lint`，TypeScript 配置暴露为 `typecheck`，Node 测试暴露为 `test:unit`，构建产物核验暴露为 `test:build`。

## Alternatives considered

- 仅依赖 VitePress 构建：共享配置启用忽略死链时无法保证引用完整。
- 对 Markdown 使用单一正则提取全部链接：容易把代码围栏中的示例误判为站点引用；使用 Markdown token，并仅解析 HTML token 中的常见 href/src 属性。
- 为所有检查引入额外依赖：现有 MarkdownIt、VitePress、Node `assert` 与 `node:test` 已能覆盖这些检查。

## Consequences

- 检查脚本通过当前 VitePress 配置获取页面清单，因此版本选择和 rewrites 与实际构建保持一致。
- 源检查针对 Markdown 引用与常见 HTML 属性，不是通用浏览器 HTML/CSS/JavaScript 校验器。构建资源检查读取真实输出目录，因此应在两个站点 build 成功后调用。
- v1 的历史根路径与 v2 的页面集合分别核对，避免将归档债务转成 v2 路由或用忽略模式隐藏错误。
