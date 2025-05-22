import '@icon-park/react/styles/index.css';
import '@nild/components/style';
import DefaultTheme from 'vitepress/theme';
import ReactBridge from './components/react-bridge/ReactBridge.vue';
import ReactLive from './components/react-live/ReactLive.vue';
import './index.css';

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('ReactBridge', ReactBridge);
        app.component('ReactLive', ReactLive);
    },
};
