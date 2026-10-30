# 贡献指南

ChatLuna 文档仓库包含 v2 主站与 v1 归档。请在 `v2` 分支上工作，不要直接改写 v1 内容来代替 v2 文档。

## 本地准备

要求 Node.js 24+ 与仓库声明的 Yarn 4。根目录执行：

```sh
yarn install
yarn dev
```

默认开发 v2；打开另一个终端窗口可运行 `yarn dev:v1` 查看 v1 归档。站点分别使用根路由，默认预览地址由 VitePress 显示。文档仍处于 alpha 阶段，代码接口与默认值可能随应用变化。

## 文档结构

- `docs/guide/`：安装、用户操作、故障处理与迁移。
- `docs/architecture/`：会话、Agent、模型、上下文缓存与扩展边界。
- `docs/development/`：插件、工具、提示词、WebUI、API 与仓库流程。
- `docs/reference/`：CLI、配置数据目录与术语速查。
- `docs/v1/`：v1 原文归档。公共主题和图片仍分别位于 `.vitepress/` 与 `public/`。

Markdown 的站内链接使用 VitePress 路由，如 `/guide/configuration`；输出 HTML 的链接需要 `.html`。两种版本根路径独立，不在 v2 路由上添加 `/v1/`。

## 内容与代码示例

说明行为和边界时以当前 `ChatLuna v2` 源码为准。对模型/provider、持久化、权限与网络边界的描述要指出其配置条件，不把可选插件的能力说成默认行为。代码示例使用真实 API 与 Schema，不要添加未经验证的假接口或个人凭据。

较长的技术文章应先形成信息完整的初稿，再经过独立编辑和源码核验。编辑结果不能替代事实检查；检查方法、默认值和失败边界应在提交前核对当前实现。

如果变更会影响 v1 归档，保留其根路由含义，并在单独 v1 build 中检查。除非明确在处理旧文档链接，不要借此重写历史文章的内容。

## 验证

提交前运行：

```sh
yarn lint
yarn typecheck
yarn test:unit
yarn build:all
yarn test:build
```

`lint` 检查两个版本的源链接、导航、图片与 Markdown includes。`typecheck` 检查主题与站点配置；`test:unit` 验证链接解析；`build:all` 分别构建 v2 与 v1；`test:build` 检查两份现有构建产物的路由隔离、CNAME、sitemap、搜索索引与 HTML 本地资源。若只改一个站点，仍建议从干净构建验证目标版本；共享主题改动要检查两个版本。

## 提交

使用英文 Conventional Commit subject。提交前检查 staged、unstaged 和 untracked 文件，排除 `chatluna.yml` 私人配置、数据、凭据、缓存和构建产物。未明确授权前，不推送、不创建 PR、不部署站点或更改 DNS。

若申请了本地预览服务，验证后将其停止。