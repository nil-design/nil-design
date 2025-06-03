import '@icon-park/react/styles/index.css';
import DefaultTheme from 'vitepress/theme';
import ReactBridge from './components/react-bridge/ReactBridge.vue';
import './index.css';

export default {
    ...DefaultTheme,
    async enhanceApp({ app }) {
        app.component('ReactBridge', ReactBridge);
        if (!import.meta.env.SSR) {
            const { default: ReactLive } = await import('./components/react-live/ReactLive.vue');
            app.component('ReactLive', ReactLive);
        }
    },
};
