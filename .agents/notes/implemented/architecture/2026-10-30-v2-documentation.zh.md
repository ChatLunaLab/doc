# Agent Note: v2 双站点文档与验证

Status: implemented

## Problem

仓库原来维护 ChatLuna v1 使用文档。ChatLuna v2 是基于 Cordis 4 的独立运行时，需要面向用户和扩展开发者的完整文档。v1 原有根路由需要继续由独立的 `v1.chatluna.chat` 主机提供；旧站点的相对链接与新文档的导航也需要可检查，避免忽略失效链接后构建仍然成功。

## Decision

- 保留既有 Vue/VitePress 技术栈，以 `CHATLUNA_DOCS_VERSION` 构建 v2 与 v1 两个站点。v1 Markdown 源文件放在 `docs/v1/`，构建 rewrite 移除源文件中的 `v1/` 前缀，使旧版在独立主机上继续使用 `/guide/`、`/development/`、`/ecosystem/` 与 `/about/` 根路由。
- 两个版本分别输出到 `docs/.vitepress/dist` 与 `docs/.vitepress/dist-v1`，分别使用缓存目录、sitemap host 与 CNAME。公共主题和资源仍由两站点共享。v2 链接严格检查；v1 在迁移本批历史链接后也使用同一严格检查。
- v2 首页说明 ChatLuna v2，并提供安装、日常使用、架构、开发、参考、排错与 v1 导航。交互示例标注为示意数据，以日志序号展示 message/mark 记录以及请求重建边界，不将其表示成真实会话或重放执行。
- v2 指南覆盖安装、首次设置、日常使用、模型、规则、预设、记忆、工具/MCP、机器、子代理、自动化、观测、安全、排错与迁移；架构、开发、HTTP/API 与配置/CLI/术语参考分开组织。
- 新文档以当前 v2 源码为事实来源。每篇长文先起草，再单独请求 `mikumikulove/gemini-3.8-flash` 优化，随后人工对照源码复核并修正 API、默认值、授权边界与部署保证。WebUI/React 示例使用当前类型契约。
- 增加可直接检查 VitePress 源页面导航、Markdown 与 HTML 链接、图片和 `<<<` includes 的脚本及单元测试。构建产物校验另检查两站点的 CNAME、sitemap、HTML 本地资源、编辑链接、路由分离和本地搜索索引。

## Alternatives considered

- 将 v1 发布在 `/v1/` 下：会改变原来公开的根路由，因此采用独立域名并保留根路径。
- 继续允许 VitePress 忽略死链：无法发现侧边栏和归档内部的失效引用，因此两个站点均严格处理，并补齐本批发现的旧链接。
- 把文档源码检查与已构建站点检查合并成单一构建命令：源链接分析和输出资源检查覆盖不同阶段，分别提供 lint 与 `test:build` 命令。
- 用看起来真实的实时工具调用动画装饰首页：容易混淆演示与真实运行数据，因此只展示明确标注的示意日志与请求投影。

## Consequences

- v1 与 v2 可分别开发、预览和构建，搜索索引及站点元数据互相独立；现有 GitHub Pages 工作流仍需后续单独调整，才会部署两个主机。
- v2 文档可通过本地严格链接检查、TypeScript 检查、单元测试以及双构建产物校验验证。运行时文档描述仍需随应用架构演进更新。
- 严格 v1 链接检查要求维护归档中的旧链接；本次修复不改动 v1 内容主题或公开根路由。
