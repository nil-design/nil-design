<template>
    <ReactBridge class="react-live vp-raw my-4" :component="ReactLive" :props="{ code, dark }" />
</template>

<script>
import { useData } from 'vitepress';
import { defineComponent } from 'vue';
import ReactLive from './ReactLive.jsx';

export default defineComponent({
    name: 'ReactLive',
    props: {
        code: {
            type: String,
            required: true,
        },
    },
    setup() {
        const { isDark } = useData();

        return {
            ReactLive,
            dark: isDark,
        };
    },
});
</script>
