import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client';
import './styles/custom.css';
import ChatPanel from './components/ChatPanel.vue';
import ChatMessage from './components/ChatMessage.vue';

import { Theme } from 'vitepress';

import {
    InjectionKey as NolebaseEnhancedReadabilitiesInjectionKey,
    LayoutMode as NolebaseEnhancedReadabilitiesLayoutMode,
    NolebaseEnhancedReadabilitiesMenu,
    NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client';

import { NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client';

import { NolebaseHighlightTargetedHeading } from '@nolebase/vitepress-plugin-highlight-targeted-heading/client';

import {
    InjectionKey,
    NolebaseGitChangelogPlugin,
} from '@nolebase/vitepress-plugin-git-changelog/client';

import { NolebasePagePropertiesPlugin } from '@nolebase/vitepress-plugin-page-properties/client';

import { NolebaseUnlazyImg } from '@nolebase/vitepress-plugin-thumbnail-hash/client';

import AppContainer from './components/AppContainer.vue';

import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css';
import '@nolebase/vitepress-plugin-highlight-targeted-heading/client/style.css';
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css';
import '@nolebase/vitepress-plugin-git-changelog/client/style.css';
import '@nolebase/vitepress-plugin-page-properties/client/style.css';
import '@nolebase/vitepress-plugin-thumbnail-hash/client/style.css';
import '@nolebase/vitepress-plugin-enhanced-mark/client/style.css';

import 'virtual:uno.css'

import './styles/main.css';
import './styles/vars.css';

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';

import('@nolebase/vitepress-plugin-inline-link-preview/client');

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
            'doc-top': () => [h(NolebaseHighlightTargetedHeading)],
            'nav-bar-content-after': () => [
                h(NolebaseEnhancedReadabilitiesMenu),
            ],
            'nav-screen-content-after': () => [
                h(NolebaseEnhancedReadabilitiesScreenMenu),
            ],
        });
    },
    enhanceApp({ app }) {
        app.component('chat-panel', ChatPanel);
        app.component('chat-message', ChatMessage);

        enhanceAppWithTabs(app);

        /**
         * Have to manually import and register the essential components that needed during build globally.
         *
         * Learn more at: Warn `Hydration completed but contains mismatches.` and Custom components are not rendered · Issue #1918 · vuejs/vitepress
         * https://github.com/vuejs/vitepress/issues/1918
         */

        app.component('AppContainer', AppContainer);
        app.component('NolebaseUnlazyImg', NolebaseUnlazyImg);

        app.provide(NolebaseEnhancedReadabilitiesInjectionKey, {
            layoutSwitch: {
                defaultMode:
                    NolebaseEnhancedReadabilitiesLayoutMode.SidebarWidthAdjustableOnly,
            },
            spotlight: {
                defaultToggle: true,
                hoverBlockColor: 'rgb(240 197 52 / 7%)',
            },
        });

        app.provide(InjectionKey, {
            commitsRelativeTime: true,
            displayAuthorsInsideCommitLine: true,
        });

        app.use(NolebaseInlineLinkPreviewPlugin);
        app.use(NolebaseGitChangelogPlugin);
        app.use(
            NolebasePagePropertiesPlugin<{
                progress: number;
            }>(),
            {
                properties: {
                    'zh-CN': [
                        {
                            key: 'wordCount',
                            type: 'dynamic',
                            title: '字数',
                            options: {
                                type: 'wordsCount',
                            },
                        },
                        {
                            key: 'readingTime',
                            type: 'dynamic',
                            title: '阅读时间',
                            options: {
                                type: 'readingTime',
                                dateFnsLocaleName: 'zhCN',
                            },
                        },
                    ],
                },
            }
        );

        app.use(TwoslashFloatingVue);
    },
} satisfies Theme;
