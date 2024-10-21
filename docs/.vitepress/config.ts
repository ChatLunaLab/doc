import { defineConfig, DefaultTheme } from 'vitepress';
import timelinePlugin from 'vitepress-markdown-timeline';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import math from 'markdown-it-mathjax3';
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links';
import UnoCSS from 'unocss/vite';
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it';
import {
    GitChangelog,
    GitChangelogMarkdownSection,
} from '@nolebase/vitepress-plugin-git-changelog/vite';
import {
    PageProperties,
    PagePropertiesMarkdownSection,
} from '@nolebase/vitepress-plugin-page-properties/vite';
import { ThumbnailHashImages } from '@nolebase/vitepress-plugin-thumbnail-hash/vite';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { transformHeadMeta } from '@nolebase/vitepress-plugin-meta/vitepress'

export default defineConfig({
    lang: 'zh-CN',
    title: 'ChatLuna',
    base: "/",
    description: 'ChatLuna',
    ignoreDeadLinks: true,
    lastUpdated: true,
    cleanUrls: false,
    head: [['link', { rel: 'icon', href: 'logo.png' }]],

    themeConfig: {
        outline: {
            label: '本页目录',
            level: 'deep',
        },

        nav: nav(),
        sidebar: {
            '/guide/': sidebarGuide(),
            '/development/': sidebarDevelopment(),
            '/ecosystem/': sidebarEcosystem(),
        },
        editLink: {
            pattern: 'https://github.com/ChatLunaLab/doc/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页',
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/ChatLunaLab/chatluna' },
        ],
        footer: {
            message: '在 CC-BY-SA-4.0 许可下发布',
            copyright: `Copyright © 2023-${new Date().getFullYear()} dingyi`,
        },
        lastUpdatedText: '上次更新时间',
        returnToTopLabel: '返回顶部',
        sidebarMenuLabel: '目录',
        docFooter: { prev: '上一篇', next: '下一篇' },
        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档',
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    locales: {
        root: {
            label: 'Chinese',
            lang: 'zh',
        },
    },
    sitemap: {
        hostname: 'https://chatluna.chat',
    },
    markdown: {
        theme: {
            light: 'github-light',
            dark: 'one-dark-pro',
        },
        math: true,
        config(md) {
            md.use(tabsMarkdownPlugin);

            md.use(timelinePlugin as any);

            md.use(math);
            md.use(BiDirectionalLinks());

            md.use(InlineLinkPreviewElementTransform);
        },
        codeTransformers: [transformerTwoslash()],
        image: {
            lazyLoading: true,
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler', // or "modern"
                },
            },
        },
        ssr: {
            noExternal: ['@nolebase/*', 'vue-demi', '@unlazy/*'],
        },
        plugins: [
            UnoCSS(),
            ThumbnailHashImages(),
            GitChangelog({
                maxGitLogCount: 2000,
                repoURL: () => 'https://github.com/chatlunalab/doc',
            }),
            GitChangelogMarkdownSection({
                exclude: (id) => id.endsWith('index.md'),
                sections: {
                    disableChangelog: false,
                    disableContributors: true,
                },
            }),
            PageProperties(),
            PagePropertiesMarkdownSection({
                excludes: ['index.md'],
            }),
        ],
    },
    async transformHead(context) {
        let head = [...context.head]
    
        const returnedHead = await transformHeadMeta()(head, context)
        if (typeof returnedHead !== 'undefined')
          head = returnedHead
    
        return head
      },
});

function sidebarGuide(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: '指南',
            items: [
                { text: '插件介绍', link: '/guide/introduction' },
                { text: '快速上手', link: '/guide/getting-started' },
                { text: '用法', link: '/guide/useful-commands' },
                { text: '配置项', link: '/guide/useful-configurations' },
            ],
        },
        {
            text: '进阶',
            items: [
                {
                    text: '模型平台',
                    collapsed: true,
                    items: [
                        {
                            text: '介绍',
                            link: '/guide/configure-model-platform/introduction',
                        },
                        {
                            text: 'OpenAI',
                            link: '/guide/configure-model-platform/openai',
                        },

                        {
                            text: 'Google Gemini',
                            link: '/guide/configure-model-platform/google-gemini',
                        },
                        {
                            text: 'Claude',
                            link: '/guide/configure-model-platform/claude',
                        },
                        {
                            text: '通义千问',
                            link: '/guide/configure-model-platform/qwen',
                        },
                        {
                            text: '智谱（ChatGLM）',
                            link: '/guide/configure-model-platform/zhipu',
                        },
                        {
                            text: '讯飞星火',
                            link: '/guide/configure-model-platform/spark',
                        },
                        {
                            text: '文心一言',
                            link: '/guide/configure-model-platform/wenxin',
                        },
                        {
                            text: '混元大模型',
                            link: '/guide/configure-model-platform/hunyuan',
                        },
                        {
                            text: 'DeepSeek',
                            link: '/guide/configure-model-platform/deepseek',
                        },
                        {
                            text: 'Moonshot',
                            link: '/guide/configure-model-platform/moonshot',
                        },
                        {
                            text: 'OpenAI Like',
                            link: '/guide/configure-model-platform/openai-like',
                        },
                        {
                            text: 'Ollama',
                            link: '/guide/configure-model-platform/ollama',
                        },
                        {
                            text: 'RWKV',
                            link: '/guide/configure-model-platform/rwkv',
                        }
                    ],
                },
                {
                    text: '嵌入模型',
                    collapsed: true,
                    items: [
                        {
                            text: '介绍',
                            link: '/guide/configure-embedding-model/introduction',
                        },
                        {
                            text: 'OpenAI Embeddings',
                            link: '/guide/configure-embedding-model/openai-embeddings',
                        },
                        {
                            text: 'Gemini Embeddings',
                            link: '/guide/configure-embedding-model/gemini-embeddings',
                        },
                        {
                            text: '通义千问 Embeddings',
                            link: '/guide/configure-embedding-model/qwen-embeddings',
                        },
                        {
                            text: '智谱 Embeddings',
                            link: '/guide/configure-embedding-model/zhipu-embeddings',
                        },
                        {
                            text: 'Hugging Face Embeddings',
                            link: '/guide/configure-embedding-model/hugging-face-embeddings',
                        },
                    ],
                },
                {
                    text: '向量数据库',
                    collapsed: true,
                    items: [
                        {
                            text: '介绍',
                            link: '/guide/configure-vector-database/introduction',
                        },
                        {
                            text: 'Faiss',
                            link: '/guide/configure-vector-database/faiss',
                        },
                        {
                            text: 'LanceDB',
                            link: '/guide/configure-vector-database/lancedb',
                        },
                        {
                            text: 'Redis',
                            link: '/guide/configure-vector-database/redis',
                        },
                    ],
                },
                {
                    text: '预设系统',
                    collapsed: true,
                    items: [
                        {
                            text: '介绍',
                            link: '/guide/preset-system/introduction',
                        },
                        {
                            text: '使用预设',
                            link: '/guide/preset-system/switch-preset',
                        },
                        {
                            text: '编写预设',
                            link: '/guide/preset-system/write-preset',
                        },
                        {
                            text: '分享预设',
                            link: '/guide/preset-system/share-preset',
                        },
                    ],
                },
                {
                    text: '会话配置',
                    collapsed: true,
                    items: [
                        {
                            text: '黑名单',
                            link: '/guide/session-related/blacklist',
                        },
                        {
                            text: '长期记忆',
                            link: '/guide/session-related/long-term-memory',
                        },
                        {
                            text: '聊天限额',
                            link: '/guide/session-related/chat-limit',
                        },
                        {
                            text: '并发限制和重试',
                            link: '/guide/session-related/concurrency-limit-and-retry',
                        },
                        {
                            text: '房间系统',
                            link: '/guide/session-related/room',
                        },
                    ],
                },
                {
                    text: '聊天链',
                    collapsed: true,
                    items: [
                        {
                            text: '介绍',
                            link: '/guide/chat-chain/introduction',
                        },
                        {
                            text: '聊天模式',
                            link: '/guide/chat-chain/chat-mode',
                        },
                        {
                            text: '渲染输出',
                            link: '/guide/chat-chain/output-mode',
                        },
                        {
                            text: '文本审核',
                            link: '/guide/chat-chain/text-censor',
                        },
                        {
                            text: '流式输出',
                            link: '/guide/chat-chain/stream',
                        },
                    ],
                },
                {
                    text: '模型工具',
                    collapsed: true,
                    items: [
                        {
                            text: '介绍',
                            link: '/guide/model-plugin-system/introduction',
                        },
                        {
                            text: '联网搜索',
                            link: '/guide/model-plugin-system/web-search',
                        },
                        {
                            text: '网络浏览',
                            link: '/guide/model-plugin-system/web-browser',
                        },
                        {
                            text: '网络请求',
                            link: '/guide/model-plugin-system/request-web',
                        },
                        {
                            text: '文件读写',
                            link: '/guide/model-plugin-system/file-io',
                        },
                        {
                            text: '定时任务',
                            link: '/guide/model-plugin-system/cron',
                        },
                        {
                            text: 'Koishi 命令执行',
                            link: '/guide/model-plugin-system/command-execution',
                        },
                        {
                            text: '文生图',
                            link: '/guide/model-plugin-system/draw',
                        },
                        {
                            text: '代码执行',
                            link: '/guide/model-plugin-system/code-interpreter',
                        },
                        {
                            text: '主动记忆',
                            link: '/guide/model-plugin-system/active-memory',
                        },
                        {
                            text: '简易音频生成',
                            link: '/guide/model-plugin-system/simple-audio-generation',
                        },
                    ],
                },
            ],
        },
        {
            text: 'FAQ',
            items: [
                {
                    text: '错误码表',
                    link: '/guide/faq/error_code',
                },
            ],
        },
    ];
}

function sidebarDevelopment(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: '总览',
            link: '/development/introduction',
        },
        {
            text: '起步',
            items: [
                {
                    text: '为 ChatLuna 开发插件',
                    link: '/development/getting-started',
                },
                {
                    text: '调用 ChatLuna API',
                    link: '/development/call-chatluna-api',
                },
            ],
        },
        {
            text: '接入服务',
            items: [
                {
                    text: '语言模型',
                    link: '/development/connect-to-core-services/language-model',
                },
                {
                    text: '嵌入模型',
                    link: '/development/connect-to-core-services/embedding-model',
                },
                {
                    text: '向量数据库',
                    link: '/development/connect-to-core-services/vector-database',
                },
                {
                    text: '模型工具',
                    link: '/development/connect-to-core-services/model-tool',
                },
                {
                    text: '中间件',
                    link: '/development/connect-to-core-services/middleware',
                },
                {
                    text: '消息读取',
                    link: '/development/connect-to-core-services/message-read',
                },
            ],
        },

        {
            text: '调用服务',
            items: [
                {
                    text: '语言模型',
                    link: '/development/call-core-services/language-model',
                },
                {
                    text: '嵌入模型',
                    link: '/development/call-core-services/embedding-model',
                },
                {
                    text: '向量数据库',
                    link: '/development/call-core-services/vector-database',
                },
            ],
        },
        {
            text: 'API 参考',
            items: [
                {
                    text: 'ChatLuna 服务 （ChatLuna Service）',
                    link: '/development/api-reference/chatluna-service',
                },
                {
                    text: 'ChatLuna 中间件聊天链（ChatChain）',
                    link: '/development/api-reference/chatluna-chat-chain',
                },
                {
                    text: 'ChatLuna 插件(ChatLuna Plugin)',
                    link: '/development/api-reference/chatluna-plugin',
                },
                {
                    text: 'ChatLuna 大语言模型核心 （LLM Core）',
                    collapsed: true,
                    items: [
                        {
                            text: '人格预设 (Preset Template)',
                            link: '/development/api-reference/llm-core/preset-template',
                        },
                        {
                            text: '平台 (Platform)',
                            link: '/development/api-reference/llm-core/platform',
                        },
                        {
                            text: '模型请求器 (Requester)',
                            link: '/development/api-reference/llm-core/requester',
                        },
                        {
                            text: '模型 (Model)',
                            link: '/development/api-reference/llm-core/model',
                        },
                        {
                            text: '模型聊天接口 (Model Chat Interface)',
                            link: '/development/api-reference/llm-core/model-chat-interface',
                        },
                    ],
                },
                {
                    text: 'ChatLuna 辅助工具 （ChatLuna Utils）',
                    collapsed: true,
                    items: [
                        {
                            text: '日志 (logger)',
                            link: '/development/api-reference/chatluna-utils/logger',
                        },
                        {
                            text: '请求工具 (request)',
                            link: '/development/api-reference/chatluna-utils/request',
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
            text: '总览',
            link: '/ecosystem/introduction',
        },
        {
            text: '聊天模式 / 插件模式工具',
            items: [
                {
                    text: '搜索服务 (Search Service)',
                    link: '/ecosystem/plugin/search-service',
                },
                {
                    text: '基础工具合集 (Plugin Common)',
                    link: '/ecosystem/plugin/common',
                },
            ],
        },
        {
            text: '回复渲染器',
            items: [
                {
                    text: '图片渲染器 (Image Renderer)',
                    link: '/ecosystem/renderer/image',
                },
            ],
        },
        {
            text: '能力扩展',
            items: [
                {
                    text: '知识库 (Knowledge)',
                    link: '/ecosystem/extension/knowledge',
                },
                {
                    text: '角色卡兼容 (Character Card)',
                    link: '/ecosystem/extension/character-card',
                },
            ],
        },
        {
            text: '其他插件',
            items: [
                {
                    text: '伪装群友 (Character)',
                    link: '/ecosystem/other/character',
                },
                {
                    text: '翻译服务 (Translator)',
                    link: '/ecosystem/other/translator',
                },
                {
                    text: '预设仓库服务 (Preset Market)',
                    link: '/ecosystem/other/preset-market',
                },
            ],
        },
    ];
}

function nav() {
    return [
        {
            text: '教程',
            link: '/guide/introduction',
            activeMatch: '/guide/',
        },
        {
            text: '开发',
            link: '/development/introduction',
            activeMatch: '/development/',
        },
        {
            text: '生态',
            link: '/ecosystem/introduction',
            activeMatch: '/ecosystem/',
        },
    ];
}
