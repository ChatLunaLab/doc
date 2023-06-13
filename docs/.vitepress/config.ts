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
    head: [['meta', { name: 'theme-color', content: '#47A69E' }]],

    themeConfig: {
        outline: {
            label: '本页目录',
            level: [2, 3],
        },

        nav: nav(),
        sidebar: {
            '/guide/': sidebarGuide(),
            '/development/': sidebarDevelopment(),
        },
        editLink: {
            pattern: 'https://github.com/dingyi222666/koishi-chathub-doc/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/dingyi222666/koishi-plugin-chathub' },
        ],
        footer: {
            message: '在 AGPL-3.0 许可下发布',
            copyright: 'Copyright © 2023 dingyi'
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
                { text: '介绍', link: '/guide/introduction' },
                { text: '快速开始', link: '/guide/getting-started' },
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
                        { text: 'OpenAI (API)', link: '/guide/configure-model-platform/openai' },
                    ]
                },
                {
                    text: "嵌入模型",
                    collapsed: true,
                    items: [
                    ]
                },
                {
                    text: "向量数据库",
                    collapsed: true,
                    items: [
                    ]
                },
                {
                    text: "会话，白名单，并发限制与聊天限额",
                    link: '/guide/session-whitelist-concurrency-limit'
                },
                {
                    text: "预设系统",
                    link: '/guide/preset-system',
                },
                {
                    text: "聊天模式与输出格式",
                    link: '/guide/chat-mode-and-output-mode',
                }
            ]
        },
        {
            text: 'FAQ',

            items: []
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
            text: '接入核心服务',
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
            ]
        },

        {
            text: '调用核心服务',
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
                    text: "ChatHub 大语言模型核心 （LLM Core）",
                    collapsed: true,
                    items: [
                        { text: '人格预设 (Preset Template)', link: '/development/api-reference/llm-core/preset-template' },
                        { text: '模型工厂 (Factory)', link: '/development/api-reference/llm-core/factory' },
                        { text: '模型提供者 (Provider)', link: '/development/api-reference/llm-core/provider' },
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
