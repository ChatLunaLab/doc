import { App, h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
import ChatPanel from './components/ChatPanel.vue';
import ChatMessage from './components/ChatMessage.vue';
import { EnhanceAppContext } from 'vitepress';
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client';
import type { Theme } from 'vitepress';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('chat-panel', ChatPanel);
        app.component('chat-message', ChatMessage);
        enhanceAppWithTabs(app);
    },
} as Theme;
