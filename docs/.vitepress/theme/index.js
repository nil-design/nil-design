import '@nild/icons/css';
import DefaultTheme from 'vitepress/theme';
import Mermaid from './components/mermaid/Mermaid.vue';
import ReactBridge from './components/react-bridge/ReactBridge.vue';
import ReactLive from './components/react-live/ReactLive.vue';
import './index.css';

export default {
    ...DefaultTheme,
    async enhanceApp({ app }) {
        app.component('Mermaid', Mermaid);
        app.component('ReactBridge', ReactBridge);
        app.component('ReactLive', ReactLive);
    },
};
