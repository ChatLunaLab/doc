// @ts-ignore
import { createRequire } from 'module'
import { defineConfig } from 'vitepress'
import { DefaultTheme } from 'vitepress/types/default-theme'

export default defineConfig({
    lang: 'zh-CN',
    title: 'Koishi ChatHub',
    // base: "",
    description: 'Koishi ChatHub 相关文档',
    ignoreDeadLinks: true,
    lastUpdated: true,
    cleanUrls: false,
    head: [
        ['meta', { name: 'theme-color', content: '#47A69E' }],
        [
            'link',
            { rel: 'icon', href: 'logo.jpg' }
        ]

    ],

    themeConfig: {
        outline: {
            label: '本页目录',
            level: 'deep',
        },

        nav: nav(),
        sidebar: {
            '/guide/': sidebarGuide(),
            '/development/': sidebarDevelopment(),
        },
        editLink: {
            pattern: 'https://github.com/ChatHubLab/doc/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/ChatHubLab/chathub' },
        ],
        footer: {
            message: '文档在 Apache 2.0 许可下发布',
            copyright: 'Copyright © 2023 ChatHub Lab'
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
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换',
                                    closeText: '关闭'
                                }
                            }
                        }
                    },
                }
            }
        },
    },
    locales: {
        root: {
            label: 'Chinese',
            lang: 'zh'
        },
    }

})




function sidebarGuide() {
    return [
        {
            text: '指南',
            items: [
                { text: '插件介绍', link: '/guide/introduction' },
                { text: '快速上手', link: '/guide/getting-started' },
                { text: "指令列表", link: '/guide/useful-commands' },
                { text: "配置项", link: '/guide/useful-configurations' },
            ]
        },
        {
            text: '进阶',
            items: [

                {
                    text: "模型平台",
                    collapsed: true,
                    items: [
                        { text: '介绍', link: '/guide/configure-model-platform/introduction' },
                        { text: 'OpenAI', link: '/guide/configure-model-platform/openai' },
                        { text: 'New Bing', link: '/guide/configure-model-platform/bing-chat' },
                        { text: 'Claude 2', link: '/guide/configure-model-platform/cluade-2' },
                        { text: 'Poe', link: '/guide/configure-model-platform/poe' },
                        { text: 'Bard', link: '/guide/configure-model-platform/bard' },
                        { text: 'Lmsys', link: '/guide/configure-model-platform/lmsys' },
                        { text: 'Chat GLM', link: '/guide/configure-model-platform/chat-glm' },
                        { text: 'Copilot Hub（等待维护）', link: '/guide/configure-model-platform/copilot-hub' },
                    ]
                },
                {
                    text: "嵌入模型",
                    collapsed: true,
                    items: [
                        { text: '介绍', link: '/guide/configure-embedding-model/introduction' },
                        { text: 'OpenAI Embeddings', link: '/guide/configure-embedding-model/openai-embeddings' },
                        { text: 'Hugging Face Embeddings', link: '/guide/configure-embedding-model/hugging-face-embeddings' },
                    ]
                },
                {
                    text: "向量数据库",
                    collapsed: true,
                    items: [
                        { text: '介绍', link: '/guide/configure-vector-database/introduction' },
                        { text: 'Faiss', link: '/guide/configure-vector-database/faiss' },
                        { text: 'Pinecone', link: '/guide/configure-vector-database/pinecone' },
                    ]
                },
                {
                    text: "预设系统",
                    collapsed: true,
                    items: [
                        { text: '介绍', link: '/guide/preset-system/introduction' },
                        { text: '使用预设', link: '/guide/preset-system/switch-preset' },
                        { text: '编写预设', link: '/guide/preset-system/write-preset' },
                        { text: '分享预设', link: '/guide/preset-system/share-preset' },
                    ]
                },
                {
                    text: "会话相关",
                    collapsed: true,
                    items: [
                        { text: "房间系统", link: '/guide/session-related/room' },
                        { text: "黑名单", link: '/guide/session-related/blacklist' },
                        { text: "长期记忆", link: '/guide/session-related/long-term-memory' },
                        { text: "并发限制", link: '/guide/session-related/concurrency-limit' },
                        { text: "聊天限额", link: '/guide/session-related/chat-limit' },
                    ]
                },
                {
                    text: "聊天链",
                    collapsed: true,
                    items: [
                        { text: '介绍', link: '/guide/chat-chain/introduction' },
                        { text: '聊天模式', link: '/guide/chat-chain/chat-mode' },
                        { text: '输出格式', link: '/guide/chat-chain/output-mode' },
                    ]
                },
                {
                    text: "模型插件",
                    collapsed: true,
                    items: [
                        { text: '介绍', link: '/guide/model-plugin-system/introduction' },
                        {
                            text: '联网浏览搜索',
                            link: '/guide/model-plugin-system/web-search'
                        },
                        {
                            text: '网络请求',
                            link: '/guide/model-plugin-system/request-web'
                        },
                        {
                            text: '文件读写',
                            link: '/guide/model-plugin-system/file-io'
                        }
                    ]
                }
            ]
        },
        {
            text: 'FAQ',
            items: [
                {
                    text: '错误码表',
                    link: '/guide/faq/error_code'
                },

            ]
        }
    ]
}

function sidebarDevelopment(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: '总览',
            link: '/development/introduction'
        },
        {
            text: '开发起步',
            items: [
                {
                    text: "为 ChatHub 开发插件",
                    link: '/development/getting-started'
                },
                {
                    text: "调用 ChatHub API",
                    link: '/development/call-chathub-api'
                }
            ]
        },
        {
            text: '接入服务',
            items: [
                {
                    text: "语言模型",
                    link: '/development/connect-to-core-services/language-model'
                },
                {
                    text: "嵌入模型",
                    link: '/development/connect-to-core-services/embedding-model'
                },
                {
                    text: "向量数据库",
                    link: '/development/connect-to-core-services/vector-database'
                },
                {
                    text: '中间件',
                    link: '/development/connect-to-core-services/middleware'
                },
                {
                    text: '消息读取',
                    link: '/development/connect-to-core-services/message-read'
                },
            ]
        },

        {
            text: '调用服务',
            items: [
                {
                    text: "语言模型",
                    link: '/development/call-core-services/language-model'
                },
                {
                    text: "嵌入模型",
                    link: '/development/call-core-services/embedding-model'
                },
                {
                    text: "向量数据库",
                    link: '/development/call-core-services/vector-database'
                },
            ]
        },
        {
            text: 'API 参考',
            items: [
                {
                    text: "ChatHub 服务 （ChatHub Service）",
                    link: '/development/api-reference/chathub-service'
                },
                {
                    text: "ChatHub 中间件聊天链（ChatChain）",
                    link: '/development/api-reference/chathub-chat-chain'
                },
                {
                    text: "ChatHub 插件(ChatHub Plugin)",
                    link: '/development/api-reference/chathub-plugin'
                },
                {
                    text: "ChatHub 大语言模型核心 （LLM Core）",
                    collapsed: true,
                    items: [
                        { text: '人格预设 (Preset Template)', link: '/development/api-reference/llm-core/preset-template' },
                        { text: '平台 (Platform)', link: '/development/api-reference/llm-core/platform' },
                        { text: '模型请求器 (Requester)', link: '/development/api-reference/llm-core/requester' },
                        { text: '模型 (Model)', link: '/development/api-reference/llm-core/model' },
                        { text: '模型聊天接口 (Model Chat Interface)', link: '/development/api-reference/llm-core/model-chat-interface' },
                    ]
                },
                {
                    text: "ChatHub 辅助工具 （ChatHub Utils）",
                    collapsed: true,
                    items: [
                        { text: '日志 (logger)', link: '/development/api-reference/chathub-utils/logger' },
                        { text: '请求工具 (request)', link: '/development/api-reference/chathub-utils/request' },
                    ]
                }
            ]
        }
    ]
}

function nav() {
    return [
        { text: '使用教程', link: '/guide/introduction', activeMatch: '/guide/' },
        { text: '开发指南', link: '/development/introduction', activeMatch: '/development/' },
    ]
}
