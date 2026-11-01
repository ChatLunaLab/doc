import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig, type DefaultTheme } from "vitepress";
import timelinePlugin from "vitepress-markdown-timeline";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import math from "markdown-it-mathjax3";
import { BiDirectionalLinks } from "@nolebase/markdown-it-bi-directional-links";
import UnoCSS from "unocss/vite";
import { InlineLinkPreviewElementTransform } from "@nolebase/vitepress-plugin-inline-link-preview/markdown-it";
import {
  GitChangelog,
  GitChangelogMarkdownSection,
} from "@nolebase/vitepress-plugin-git-changelog/vite";
import {
  PageProperties,
  PagePropertiesMarkdownSection,
} from "@nolebase/vitepress-plugin-page-properties/vite";
import { ThumbnailHashImages } from "@nolebase/vitepress-plugin-thumbnail-hash/vite";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { transformHeadMeta } from "@nolebase/vitepress-plugin-meta/vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import unoConfig from "./uno.config";

const legacy = process.env.CHATLUNA_DOCS_VERSION === "v1";
const hostname = legacy ? "https://v1.chatluna.chat" : "https://chatluna.chat";

export default withMermaid(defineConfig({
  lang: "zh-CN",
  title: legacy ? "ChatLuna v1" : "ChatLuna v2",
  srcExclude: legacy
    ? ["index.md", "manual/**", "guide/**", "architecture/**", "api/**", "cookbook/**", "about/**", "development/**", "reference/**"]
    : ["v1/**"],
  rewrites: legacy ? { "v1/:path*": ":path*" } : {},
  outDir: legacy ? ".vitepress/dist-v1" : ".vitepress/dist",
  cacheDir: legacy ? ".vitepress/cache-v1" : ".vitepress/cache",
  base: "/",
  description: legacy ? "ChatLuna v1 使用与开发文档" : "ChatLuna v2：为 IM 平台深度设计的 Agent Harness",
  ignoreDeadLinks: false,
  lastUpdated: true,
  cleanUrls: false,
  head: [["link", { rel: "icon", href: "/logo.png" }]],

  themeConfig: {
    outline: {
      label: "本页目录",
      level: "deep",
    },

    nav: nav(),
    sidebar: legacy ? {
      "/guide/": sidebarGuide(),
      "/development/": sidebarDevelopment(),
      "/ecosystem/": sidebarEcosystem(),
      "/about/": about(),
    } : {
      "/manual/": sidebarManual(),
      "/guide/": sidebarDevGuide(),
      "/architecture/": sidebarArchitecture(),
      "/api/": sidebarApi(),
      "/cookbook/": sidebarCookbook(),
      "/about/": sidebarV2About(),
    },
    editLink: {
      pattern: legacy
        ? ({ relativePath }) => `https://github.com/ChatLunaLab/doc/edit/v2/docs/${relativePath.startsWith("v1/") ? "" : "v1/"}${relativePath}`
        : "https://github.com/ChatLunaLab/doc/edit/v2/docs/:path",
      text: "在 GitHub 上编辑此页",
    },

    socialLinks: [
      {
        icon: "github",
        link: legacy ? "https://github.com/ChatLunaLab/chatluna" : "https://github.com/ChatLunaLab/v2",
      },
    ],
    footer: {
      message: "在 CC-BY-SA-4.0 许可下发布",
      copyright: `Copyright © 2023-${new Date().getFullYear()} dingyi`,
    },
    lastUpdatedText: "上次更新时间",
    returnToTopLabel: "返回顶部",
    sidebarMenuLabel: "目录",
    docFooter: { prev: "上一篇", next: "下一篇" },
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },
  },
  sitemap: { hostname },
  async buildEnd(site) {
    await writeFile(join(site.outDir, "CNAME"), new URL(hostname).hostname + "\n");
  },
  markdown: {
    theme: {
      light: "github-light",
      dark: "one-dark-pro",
    },
    math: true,
    config(md) {
      md.use(tabsMarkdownPlugin);

      md.use(timelinePlugin as any);

      md.use(math);
      md.use(BiDirectionalLinks());

      md.use(InlineLinkPreviewElementTransform);
    },
    image: {
      lazyLoading: true,
    },
    codeTransformers: [transformerTwoslash()],
    // Explicitly load these languages for types hightlighting
    languages: ["js", "jsx", "ts", "tsx", "bash", "shell", "lua"],
  },
  vite: {
    ssr: {
      noExternal: ["@nolebase/*", "vue-demi", "@unlazy/*"],
    },
    optimizeDeps: {
      // mermaid's elk chunk imports this CJS bundle via subpath; pre-bundle it
      include: ["elkjs/lib/elk.bundled.js"],
    },
    plugins: [
      UnoCSS(unoConfig),
      ThumbnailHashImages(),
      GitChangelog({
        maxGitLogCount: 2000,
        repoURL: () => "https://github.com/ChatLunaLab/doc",
      }),
      GitChangelogMarkdownSection({
        exclude: (id) => id.endsWith("index.md"),
        sections: {
          disableChangelog: false,
          disableContributors: true,
        },
      }),
      PageProperties(),
      PagePropertiesMarkdownSection({
        excludes: ["index.md"],
      }),
    ],
  },
  async transformHead(context) {
    let head = [...context.head];

    const returnedHead = await transformHeadMeta()(head, context);
    if (typeof returnedHead !== "undefined") head = returnedHead;

    return head;
  },
}));

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "指南",
      items: [
        { text: "插件介绍", link: "/guide/introduction" },
        {
          text: "快速上手",
          link: "/guide/getting-started",
          collapsed: true,
        },
      ],
    },
    {
      text: "配置",
      items: [
        {
          text: "常用指令与配置项",
          collapsed: true,
          items: [
            { text: "对话", link: "/guide/useful-commands/chat" },
            { text: "会话", link: "/guide/useful-commands/conversation" },
            { text: "预设", link: "/guide/useful-commands/preset" },
            { text: "模型", link: "/guide/useful-commands/model" },
            {
              text: "长期记忆",
              link: "/guide/useful-commands/memory",
            },
            { text: "系统", link: "/guide/useful-commands/system" },
            {
              text: "配置项",
              link: "/guide/useful-configurations",
            },
          ],
        },
        {
          text: "模型平台",
          collapsed: true,
          items: [
            {
              text: "介绍",
              link: "/guide/configure-model-platform/introduction",
            },
            {
              text: "OpenAI",
              link: "/guide/configure-model-platform/openai",
            },
            {
              text: "DeepSeek",
              link: "/guide/configure-model-platform/deepseek",
            },
            {
              text: "Google Gemini",
              link: "/guide/configure-model-platform/google-gemini",
            },
            {
              text: "Claude",
              link: "/guide/configure-model-platform/claude",
            },
            {
              text: "通义千问",
              link: "/guide/configure-model-platform/qwen",
            },
            {
              text: "Dify",
              link: "/guide/configure-model-platform/dify",
            },
            {
              text: "智谱（ChatGLM）",
              link: "/guide/configure-model-platform/zhipu",
            },
            {
              text: "讯飞星火",
              link: "/guide/configure-model-platform/spark",
            },
            {
              text: "文心一言",
              link: "/guide/configure-model-platform/wenxin",
            },
            {
              text: "混元大模型",
              link: "/guide/configure-model-platform/hunyuan",
            },

            {
              text: "Moonshot",
              link: "/guide/configure-model-platform/moonshot",
            },
            {
              text: "OpenAI Like",
              link: "/guide/configure-model-platform/openai-like",
            },
            {
              text: "Ollama",
              link: "/guide/configure-model-platform/ollama",
            },
            {
              text: "RWKV",
              link: "/guide/configure-model-platform/rwkv",
            },
          ],
        },
        {
          text: "嵌入模型",
          collapsed: true,
          items: [
            {
              text: "介绍",
              link: "/guide/configure-embedding-model/introduction",
            },
            {
              text: "OpenAI Embeddings",
              link: "/guide/configure-embedding-model/openai-embeddings",
            },
            {
              text: "Gemini Embeddings",
              link: "/guide/configure-embedding-model/gemini-embeddings",
            },
            {
              text: "通义千问 Embeddings",
              link: "/guide/configure-embedding-model/qwen-embeddings",
            },
            {
              text: "智谱 Embeddings",
              link: "/guide/configure-embedding-model/zhipu-embeddings",
            },
            {
              text: "Hugging Face Embeddings",
              link: "/guide/configure-embedding-model/hugging-face-embeddings",
            },
          ],
        },
        {
          text: "向量数据库",
          collapsed: true,
          items: [
            {
              text: "介绍",
              link: "/guide/configure-vector-database/introduction",
            },
            {
              text: "Faiss",
              link: "/guide/configure-vector-database/faiss",
            },
            {
              text: "Milvus",
              link: "/guide/configure-vector-database/milvus",
            },
            {
              text: "Redis",
              link: "/guide/configure-vector-database/redis",
            },
            {
              text: "luna-vdb",
              link: "/guide/configure-vector-database/luna-vdb",
            },
          ],
        },
        {
          text: "Agent 工具",
          collapsed: true,
          items: [
            {
              text: "介绍",
              link: "/guide/model-plugin-system/introduction",
            },
            {
              text: "MCP 支持",
              link: "/guide/model-plugin-system/mcp",
            },
            {
              text: "联网搜索",
              link: "/guide/model-plugin-system/web-search",
            },
            {
              text: "网页浏览",
              link: "/guide/model-plugin-system/web-browser",
            },
            {
              text: "URL 请求",
              link: "/guide/model-plugin-system/request-web",
            },
            {
              text: "OpenAPI 请求",
              link: "/guide/model-plugin-system/specify-api-request",
            },
            {
              text: "文件读写",
              link: "/guide/model-plugin-system/file-io",
            },
            {
              text: "定时任务",
              link: "/guide/model-plugin-system/cron",
            },
            {
              text: "Koishi 命令执行",
              link: "/guide/model-plugin-system/command-execution",
            },
            {
              text: "文生图",
              link: "/guide/model-plugin-system/draw",
            },
            {
              text: "思考工具",
              link: "/guide/model-plugin-system/thinking",
            },
            {
              text: "TODO 工具",
              link: "/guide/model-plugin-system/todo",
            },
            {
              text: "群管（禁言）工具",
              link: "/guide/model-plugin-system/group",
            },
            {
              text: "主动记忆",
              link: "/guide/model-plugin-system/active-memory",
            },
            {
              text: "简易音频生成",
              link: "/guide/model-plugin-system/simple-audio-generation",
            },
          ],
        },
      ],
    },
    {
      text: "进阶",
      items: [
        {
          text: "预设系统",
          collapsed: true,
          items: [
            {
              text: "介绍",
              link: "/guide/preset-system/introduction",
            },
            {
              text: "渲染模板",
              link: "/guide/preset-system/template",
            },
            {
              text: "编写预设",
              link: "/guide/preset-system/write-preset",
            },
            {
              text: "使用预设",
              link: "/guide/preset-system/switch-preset",
            },
            {
              text: "分享预设",
              link: "/guide/preset-system/share-preset",
            },
          ],
        },
        {
          text: "会话配置",
          collapsed: true,
          items: [
            {
              text: "黑名单",
              link: "/guide/session-related/blacklist",
            },
            {
              text: "长期记忆",
              link: "/guide/session-related/long-term-memory",
            },
            {
              text: "聊天限额",
              link: "/guide/session-related/chat-limit",
            },
            {
              text: "并发限制和重试",
              link: "/guide/session-related/concurrency-limit-and-retry",
            },
            {
              text: "会话系统",
              link: "/guide/session-related/conversation",
            },
          ],
        },
        {
          text: "聊天链",
          collapsed: true,
          items: [
            {
              text: "介绍",
              link: "/guide/chat-chain/introduction",
            },
            {
              text: "聊天模式",
              link: "/guide/chat-chain/chat-mode",
            },
            {
              text: "渲染输出",
              link: "/guide/chat-chain/output-mode",
            },
            {
              text: "文本审核",
              link: "/guide/chat-chain/text-censor",
            },
            {
              text: "流式输出",
              link: "/guide/chat-chain/stream",
            },
          ],
        },
      ],
    },
    {
      text: "最佳实践",
      items: [
        {
          text: "伪装推荐插件",
          link: "/guide/best-practice/character-recommended-plugins",
        },
        {
          text: "知识库客服 Bot",
          link: "/guide/best-practice/knowledge-base-and-customer-service-bot",
        },
      ],
    },
    {
      text: "FAQ",
      items: [
        {
          text: "错误码表",
          link: "/guide/faq/error_code",
        },
        {
          text: "常见问题",
          link: "/guide/faq/common-question",
        },
      ],
    },
  ];
}

function sidebarDevelopment(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "总览",
      link: "/development/introduction",
    },
    {
      text: "起步",
      items: [
        {
          text: "使用 ChatLuna API",
          link: "/development/getting-started",
        },
        {
          text: "扩展 ChatLuna 能力",
          link: "/development/extend-chatluna-api",
        },
      ],
    },
    {
      text: "调用服务",
      items: [
        {
          text: "大语言模型",
          link: "/development/call-core-services/language-model",
        },
        {
          text: "嵌入模型",
          link: "/development/call-core-services/embedding-model",
        },
        {
          text: "Reranker 模型",
          link: "/development/call-core-services/reranker-model",
        },
        {
          text: "向量数据库",
          link: "/development/call-core-services/vector-database",
        },
        {
          text: "模型工具",
          link: "/development/call-core-services/model-tool",
        },
        {
          text: "Agent 与 Sub-Agent",
          link: "/development/call-core-services/agent",
        },
        {
          text: "预设",
          link: "/development/call-core-services/preset",
        },
      ],
    },
    {
      text: "接入服务",
      items: [
        {
          text: "大语言模型",
          link: "/development/connect-to-core-services/language-model",
        },
        {
          text: "嵌入模型",
          link: "/development/connect-to-core-services/embedding-model",
        },
        {
          text: "Reranker 模型",
          link: "/development/connect-to-core-services/reranker-model",
        },
        {
          text: "向量数据库",
          link: "/development/connect-to-core-services/vector-database",
        },
        {
          text: "模型工具",
          link: "/development/connect-to-core-services/model-tool",
        },
        {
          text: "消息读取",
          link: "/development/connect-to-core-services/message-read",
        },
        {
          text: "消息渲染",
          link: "/development/connect-to-core-services/message-render",
        },
      ],
    },
    {
      text: "API 参考",
      items: [
        {
          text: "ChatLuna 服务 （ChatLuna Service）",
          link: "/development/api-reference/chatluna-service",
        },
        {
          text: "ChatLuna 插件 (ChatLuna Plugin)",
          link: "/development/api-reference/chatluna-plugin",
        },
        {
          text: "ChatLuna 事件 (ChatLuna Events)",
          link: "/development/api-reference/chatluna-events",
        },
        {
          text: "会话服务 (Conversation Service)",
          link: "/development/api-reference/conversation-service",
        },
        {
          text: "会话运行时 (Conversation Runtime)",
          link: "/development/api-reference/conversation-runtime",
        },
        {
          text: "ChatLuna 大语言模型核心",
          collapsed: true,
          items: [
            {
              text: "预设 (Preset Template)",
              link: "/development/api-reference/llm-core/preset-template",
            },
            {
              text: "平台服务 (Platform Service)",
              link: "/development/api-reference/llm-core/platform-service",
            },
            {
              text: "平台客户端 (Platform Client)",
              link: "/development/api-reference/llm-core/platform-client",
            },
            {
              text: "模型请求器 (Requester)",
              link: "/development/api-reference/llm-core/requester",
            },
            {
              text: "重排序 (Reranker)",
              link: "/development/api-reference/llm-core/reranker",
            },
            {
              text: "代理 (Agent)",
              link: "/development/api-reference/llm-core/agent",
            },
            {
              text: "上下文管理 (Context Manager)",
              link: "/development/api-reference/llm-core/context-manager",
            },
          ],
        },
        {
          text: "ChatLuna 中间件相关",
          collapsed: true,
          items: [
            {
              text: "消息 (ChatLuna Message)",
              link: "/development/api-reference/middleware/message",
            },
            {
              text: "消息渲染器 (Message Renderer)",
              link: "/development/api-reference/middleware/message-renderer",
            },
            {
              text: "Prompt 渲染服务 (Prompt Renderer)",
              link: "/development/api-reference/middleware/prompt-renderer",
            },
            {
              text: "消息转换器 (Message Transformer)",
              link: "/development/api-reference/middleware/message-transformer",
            },
          ],
        },
        {
          text: "ChatLuna 辅助工具",
          collapsed: true,
          items: [
            {
              text: "日志 (logger)",
              link: "/development/api-reference/chatluna-utils/logger",
            },
            {
              text: "请求工具 (request)",
              link: "/development/api-reference/chatluna-utils/request",
            },
            {
              text: "SSE 工具 (sse)",
              link: "/development/api-reference/chatluna-utils/sse",
            },
            {
              text: "错误 (Error)",
              link: "/development/api-reference/chatluna-utils/error",
            },
            {
              text: "Schema 工具 (Schema)",
              link: "/development/api-reference/chatluna-utils/schema",
            },
            {
              text: "运行时工具 (Runtime)",
              link: "/development/api-reference/chatluna-utils/runtime",
            },
            {
              text: "内容与消息工具 (Content)",
              link: "/development/api-reference/chatluna-utils/content",
            },
          ],
        },
      ],
    },
  ];
}

function sidebarEcosystem(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "总览",
      link: "/ecosystem/introduction",
    },
    {
      text: "聊天模式 / Agent 模式工具",
      items: [
        {
          text: "搜索服务 (Search Service)",
          link: "/ecosystem/plugin/search-service",
        },
        {
          text: "基础工具合集 (Plugin Common)",
          link: "/ecosystem/plugin/common",
        },
        {
          text: "长期记忆 (Long Term Memory)",
          link: "/ecosystem/plugin/long-term-memory",
        },
        {
          text: "Agent 扩展框架 (Extension Agent)",
          link: "/ecosystem/plugin/extension-agent",
        },
        {
          text: "多模态服务 (Multimodal Service)",
          link: "/ecosystem/plugin/multimodal-service",
        },
      ],
    },
    {
      text: "回复渲染器",
      items: [
        {
          text: "图片渲染器 (Image Renderer)",
          link: "/ecosystem/renderer/image",
        },
      ],
    },
    {
      text: "能力扩展",
      items: [
        {
          text: "知识库 (Knowledge)",
          link: "/ecosystem/extension/knowledge",
        },
        {
          text: "角色卡兼容 (Character Card)",
          link: "/ecosystem/extension/character-card",
        },
        {
          text: "动作 (Action)",
          link: "/ecosystem/extension/action",
        },
      ],
    },
    {
      text: "娱乐插件",
      items: [
        {
          text: "群分析 (Group Analysis)",
          link: "/ecosystem/fun/group-analysis",
        },
        {
          text: "Smash Or Pass",
          link: "/ecosystem/fun/smash-or-pass",
        },
      ],
    },
    {
      text: "其他插件",
      items: [
        {
          text: "伪装群友 (Character)",
          link: "/ecosystem/other/character",
        },
        {
          text: "翻译服务 (Translator)",
          link: "/ecosystem/other/translator",
        },
        {
          text: "预设仓库 (Preset Market)",
          link: "/ecosystem/other/preset-market",
        },
      ],
    },
  ];
}

function about(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "参与讨论",
      link: "/about/contact",
    },
    {
      text: "赞助者",
      link: "/about/sponsor",
    },
    {
      text: "关于",
      link: "/about/about",
    },
  ];
}

function nav(): DefaultTheme.NavItem[] {
  if (legacy) return [
    { text: "使用指南", link: "/guide/introduction" },
    { text: "开发文档", link: "/development/introduction" },
    { text: "插件生态", link: "/ecosystem/introduction" },
    { text: "ChatLuna v2", link: "https://chatluna.chat" },
  ];
  return [
    { text: "使用手册", link: "/manual/introduction", activeMatch: "/manual/" },
    { text: "开发指南", link: "/guide/", activeMatch: "/guide/" },
    { text: "架构", link: "/architecture/", activeMatch: "/architecture/" },
    { text: "API 参考", link: "/api/", activeMatch: "/api/" },
    { text: "进阶", link: "/cookbook/", activeMatch: "/cookbook/" },
    { text: "ChatLuna v1", link: "https://v1.chatluna.chat" },
  ];
}

function sidebarManual(): DefaultTheme.SidebarItem[] {
  return [
    { text: "介绍", link: "/manual/introduction" },
    { text: "安装", collapsed: false, items: [
      { text: "选择安装方式", link: "/manual/starter/" },
      { text: "命令行（CLI）", link: "/manual/starter/cli" },
      { text: "Docker 部署", link: "/manual/starter/docker" },
      { text: "从源码运行", link: "/manual/starter/source" },
    ] },
    { text: "使用", collapsed: false, items: [
      { text: "快速上手", link: "/manual/quickstart" },
      { text: "认识 WebUI", link: "/manual/usage/webui" },
      { text: "模型与提供商", link: "/manual/usage/models" },
      { text: "角色与预设", link: "/manual/usage/characters" },
      { text: "场景规则", link: "/manual/usage/rules" },
      { text: "什么时候回复", link: "/manual/usage/activation" },
      { text: "群聊记录", link: "/manual/usage/groupchat" },
      { text: "长期记忆", link: "/manual/usage/memory" },
      { text: "能力总览", link: "/manual/usage/capabilities" },
      { text: "工具", link: "/manual/usage/tools" },
      { text: "技能", link: "/manual/usage/skills" },
      { text: "MCP", link: "/manual/usage/mcp" },
      { text: "插件与市场", link: "/manual/usage/plugins" },
      { text: "机器与工作区", link: "/manual/usage/machines" },
      { text: "子代理", link: "/manual/usage/subagents" },
      { text: "定时与后台任务", link: "/manual/usage/automation" },
      { text: "权限与安全", link: "/manual/usage/permissions" },
      { text: "轨迹与用量", link: "/manual/usage/observability" },
      { text: "接入聊天平台", link: "/manual/usage/adapters" },
      { text: "指令一览", link: "/manual/usage/commands" },
    ] },
    { text: "配方", collapsed: false, items: [
      { text: "多实例与多机器人", link: "/manual/recipe/instances" },
      { text: "公网部署", link: "/manual/recipe/server" },
      { text: "给每个群配一套", link: "/manual/recipe/group-presets" },
      { text: "无控制台运行", link: "/manual/recipe/headless" },
    ] },
  ];
}

function sidebarDevGuide(): DefaultTheme.SidebarItem[] {
  return [
    { text: "总览", link: "/guide/" },
    { text: "开发起步", collapsed: false, items: [
      { text: "环境搭建", link: "/guide/develop/setup" },
      { text: "配置文件", link: "/guide/develop/config" },
      { text: "第一个插件", link: "/guide/develop/first-plugin" },
      { text: "发布插件", link: "/guide/develop/publish" },
    ] },
    { text: "框架基础", collapsed: false, items: [
      { text: "插件与生命周期", link: "/guide/plugin/lifecycle" },
      { text: "服务与依赖", link: "/guide/plugin/service" },
      { text: "事件系统", link: "/guide/plugin/events" },
      { text: "配置构型", link: "/guide/plugin/schema" },
    ] },
    { text: "能力扩展", collapsed: false, items: [
      { text: "工具开发", link: "/guide/extend/tools" },
      { text: "提示词分区", link: "/guide/extend/prompts" },
      { text: "路由命名空间", link: "/guide/extend/routing" },
      { text: "编写引擎", link: "/guide/extend/engines" },
      { text: "编写适配器", link: "/guide/extend/adapters" },
      { text: "数据与存储", link: "/guide/extend/storage" },
      { text: "测试插件", link: "/guide/extend/testing" },
      { text: "WebUI 扩展", link: "/guide/extend/webui" },
      { text: "模型提供商", link: "/guide/extend/provider" },
    ] },
  ];
}

function sidebarArchitecture(): DefaultTheme.SidebarItem[] {
  return [
    { text: "架构总览", link: "/architecture/" },
    { text: "消息与路由", collapsed: false, items: [
      { text: "路由与场景规则", link: "/architecture/routing" },
      { text: "消息处理链路", link: "/architecture/chat-pipeline" },
    ] },
    { text: "会话与执行", collapsed: false, items: [
      { text: "会话、消息与分支", link: "/architecture/sessions" },
      { text: "会话与活跃 Agent", link: "/architecture/conversations" },
      { text: "Agent 与执行循环", link: "/architecture/agents" },
      { text: "上下文与缓存", link: "/architecture/context-cache" },
    ] },
    { text: "引擎与提示词", collapsed: false, items: [
      { text: "提示词装配", link: "/architecture/prompts" },
      { text: "引擎", link: "/architecture/engine" },
      { text: "角色系统", link: "/architecture/character" },
    ] },
    { text: "能力与治理", collapsed: false, items: [
      { text: "工具系统", link: "/architecture/tools" },
      { text: "权限与审批", link: "/architecture/permissions" },
      { text: "长期记忆", link: "/architecture/memory" },
      { text: "技能", link: "/architecture/skills" },
      { text: "MCP", link: "/architecture/mcp" },
      { text: "子代理", link: "/architecture/subagent" },
      { text: "执行机器", link: "/architecture/computer" },
    ] },
    { text: "自动化", collapsed: false, items: [
      { text: "定时与后台任务", link: "/architecture/schedule-background" },
    ] },
    { text: "输出与观测", collapsed: false, items: [
      { text: "渲染与投递", link: "/architecture/render-deliver" },
      { text: "适配器", link: "/architecture/adapters" },
      { text: "轨迹与用量", link: "/architecture/trace-usage" },
    ] },
    { text: "运行时", collapsed: false, items: [
      { text: "启动与插件树", link: "/architecture/boot" },
      { text: "存储", link: "/architecture/storage" },
      { text: "控制台", link: "/architecture/webui" },
      { text: "接口与 SDK", link: "/architecture/api-sdk" },
    ] },
    { text: "模型与扩展", collapsed: false, items: [
      { text: "模型与模态运行时", link: "/architecture/models" },
      { text: "插件、服务与数据", link: "/architecture/extensions" },
    ] },
  ];
}

function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    { text: "总览", link: "/api/" },
    { text: "术语表", link: "/api/glossary" },
    { text: "核心服务", collapsed: false, items: [
      { text: "会话 (Conversations)", link: "/api/service/conversations" },
      { text: "会话日志 (Sessions)", link: "/api/service/sessions" },
      { text: "Agent", link: "/api/service/agent" },
      { text: "模型 (Models)", link: "/api/service/models" },
      { text: "提示词 (Prompt)", link: "/api/service/prompt" },
      { text: "路由 (Routing)", link: "/api/service/routing" },
      { text: "预设 (Presets)", link: "/api/service/presets" },
    ] },
    { text: "能力与运行时", collapsed: false, items: [
      { text: "工具 (Tools)", link: "/api/service/tools" },
      { text: "技能 (Skills)", link: "/api/service/skills" },
      { text: "MCP", link: "/api/service/mcp" },
      { text: "机器 (Machines)", link: "/api/service/machines" },
      { text: "子代理 (Subagents)", link: "/api/service/subagents" },
      { text: "权限 (Permissions)", link: "/api/service/permissions" },
      { text: "记忆 (Memory)", link: "/api/service/memory" },
      { text: "定时与后台", link: "/api/service/schedule" },
      { text: "追踪与用量", link: "/api/service/trace" },
      { text: "平台适配 (Adapters)", link: "/api/service/adapters" },
    ] },
    { text: "Cordis 上下文", collapsed: false, items: [
      { text: "上下文 (Context)", link: "/api/cordis/context" },
      { text: "事件 (Events)", link: "/api/cordis/events" },
      { text: "服务 (Service)", link: "/api/cordis/service" },
      { text: "配置构型 (Schema)", link: "/api/cordis/schema" },
    ] },
    { text: "其他", collapsed: false, items: [
      { text: "命令行", link: "/api/cli" },
      { text: "配置与数据目录", link: "/api/configuration" },
      { text: "HTTP API", link: "/api/http" },
    ] },
  ];
}

function sidebarCookbook(): DefaultTheme.SidebarItem[] {
  return [
    { text: "总览", link: "/cookbook/" },
    { text: "排错与诊断", link: "/cookbook/troubleshooting" },
    { text: "命令行诊断", link: "/cookbook/cli" },
    { text: "从 v1 迁移", link: "/cookbook/migration" },
    { text: "反向代理与网络接入", link: "/cookbook/deployment" },
  ];
}

function sidebarV2About(): DefaultTheme.SidebarItem[] {
  return [
    { text: "常见问题", link: "/about/faq" },
    { text: "参与讨论", link: "/about/contact" },
    { text: "赞助者", link: "/about/sponsor" },
    { text: "关于 ChatLuna", link: "/about/about" },
  ];
}
