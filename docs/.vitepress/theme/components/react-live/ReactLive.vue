<template>
    <ReactBridge :component="ReactLive" :props="{ code, dark }" />
</template>

<script>
import { defineComponent } from 'vue';
import { useData } from 'vitepress';
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
