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
            { icon: 'github', link: 'https://github.com/dingyi222666/koishi-plugin-chathub' },
        ],
        footer: {
            message: '在 GPL-3.0 许可下发布',
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
            collapsed: false,
            items: [
                { text: '介绍', link: '/guide/introduction' },
                { text: '快速开始', link: '/guide/getting-started' },
                { text: "指令列表", link: '/guide/useful-commands' },
                { text: "配置项", link: '/guide/useful-configurations' },
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
        { text: '使用教程', link: '/guide/introduction', activeMatch: '/guide/' },
        { text: '开发指南', link: '/development/introduction', activeMatch: '/development/' },
    ]
}
