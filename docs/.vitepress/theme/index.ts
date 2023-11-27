import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
import ChatPanel from './components/ChatPanel.vue';
import ChatMessage from './components/ChatMessage.vue';
import { EnhanceAppContext } from 'vitepress';
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client';

export default {
    Layout: DefaultTheme.Layout,
    enhanceApp({ app }: EnhanceAppContext) {
        app.component('chat-panel', ChatPanel);
        app.component('chat-message', ChatMessage);
        enhanceAppWithTabs(app);
    },
};
