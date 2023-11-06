import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
    Layout: DefaultTheme.Layout,
    enhanceApp({ app }) {},
};
