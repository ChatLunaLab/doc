// @ts-ignore
import { createRequire } from 'module'
import { defineConfig } from 'vitepress'

export default defineConfig({
    lang: 'zh-CN',
    title: 'Koishi ChatHub',
    base: "/docs/",
    description: 'Koishi ChatHub文档',

    lastUpdated: true,
    cleanUrls: true,
    head: [['meta', { name: 'theme-color', content: '#47A69E' }]],
    themeConfig: {
       /*  nav: nav(),
        sidebar: {
            '/guide/': sidebarGuide(),
            '/models/': sidebarModels(),
            '/en/guide/': sidebarGuide(),
            '/en/models/': sidebarModels()
        }, */
        editLink: {
            pattern: 'https://github.com/dingyi222666/koishi-chathub-doc/edit/main/docs/:path',
            text: '在 GitHub 上编辑此页'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/dingyi222666/koishi-plugin-chathub' }
        ],
        footer: {
            message: '在 GPL-3.0 许可下发布',
            copyright: 'Copyright © 2023 ChatHub 开发项目组'
        },
    },
}
)
