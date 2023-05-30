// @ts-ignore
import { createRequire } from 'module'
import { defineConfig } from 'vitepress'

export default defineConfig({
    lang: 'zh-CN',
    title: 'Koishi ChatHub',
    // base: "",
    description: 'Koishi ChatHub文档',
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
        },
        editLink: {
            pattern: 'https://github.com/dingyi222666/koishi-chathub-doc/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/dingyi222666/koishi-plugin-chathub' }
        ],
        footer: {
            message: '在 GPL-3.0 许可下发布',
            copyright: 'Copyright © 2023 dingyi'
        },
    },



})




function sidebarGuide() {
    return [
        {
            text: '指南',
            collapsed: false,
            items: [
                { text: '介绍', link: '/guide/introduction' },
                { text: '快速上手', link: '/guide/getting-started' },
                { text: "常用指令", link: '/guide/useful-commands' },
                { text: "常用配置项", link: '/guide/configuration' },
            ]
        },
        {
            text: '进阶',
            collapsed: false,
            items: [
                {
                    text: "配置模型平台",
                    collapsed: true,
                    items: [
                        { text: 'OpenAI (API)', link: '/guide/configure-model-platform/openai' },
                    ]
                },
                {
                    text: "配置嵌入模型",
                    collapsed: true,
                    items: [
                    ]
                },
                {
                    text: "配置向量数据库",
                    collapsed: true,
                    items: [
                    ]
                },
                {
                    text: "预设系统",
                    link: '/guide/preset-system',
                }
            ]
        },
        {
            text: 'FAQ',
            collapsed: false,
            items: []
        }
    ]
}

function nav() {
    return [
        { text: '使用教程', link: '/guide/getting-started', activeMatch: '/guide/' },
        { text: '开发指南', link: '/development/start', activeMatch: '/development/' },
    ]
}
