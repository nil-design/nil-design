import '@nild/icons/css';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import Mermaid from './components/mermaid/Mermaid.vue';
import ReactBridge from './components/react-bridge/ReactBridge.vue';
import ReactLive from './components/react-live/ReactLive.vue';
import ThemePicker from './components/theme-picker/ThemePicker.vue';
import './index.css';

export default {
    extends: DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'nav-bar-content-after': () => h(ThemePicker),
        });
    },
    async enhanceApp({ app }) {
        app.component('Mermaid', Mermaid);
        app.component('ReactBridge', ReactBridge);
        app.component('ReactLive', ReactLive);
    },
};
