import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
import ChatPanel from './components/ChatPanel.vue';
import ChatMessage from './components/ChatMessage.vue';
import { EnhanceAppContext, Theme } from 'vitepress';

export default {
    Layout: DefaultTheme.Layout,
    enhanceApp({ app }: EnhanceAppContext) {
        app.component('chat-panel', ChatPanel);
        app.component('chat-message', ChatMessage);
    },
};
