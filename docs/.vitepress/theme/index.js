import '@nild/icons/css';
import DefaultTheme from 'vitepress/theme';
import Layout from './components/layout/Layout.vue';
import Mermaid from './components/mermaid/Mermaid.vue';
import ReactBridge from './components/react-bridge/ReactBridge.vue';
import ReactLive from './components/react-live/ReactLive.vue';
import './index.css';

export default {
    extends: DefaultTheme,
    Layout,
    async enhanceApp({ app }) {
        app.component('Mermaid', Mermaid);
        app.component('ReactBridge', ReactBridge);
        app.component('ReactLive', ReactLive);
    },
};
