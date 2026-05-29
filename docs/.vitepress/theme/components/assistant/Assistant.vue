<template>
    <ReactBridge :component="Assistant" :props="{ locale: lang, base: site.base, routePath: route.path, navigate }" />
</template>

<script>
import { useData, useRoute, useRouter } from 'vitepress';
import { defineComponent } from 'vue';
import ReactBridge from '../react-bridge/ReactBridge.vue';
import Assistant from './Assistant.jsx';

export default defineComponent({
    name: 'Assistant',
    components: {
        ReactBridge,
    },
    setup() {
        const { lang, site } = useData();
        const route = useRoute();
        const router = useRouter();

        const navigate = path => {
            router.go(`${site.value.base.replace(/\/$/, '')}${path}`);
        };

        return {
            Assistant,
            lang,
            navigate,
            route,
            site,
        };
    },
});
</script>
