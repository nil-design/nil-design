<template>
    <div class="mermaid" ref="containerRef" v-html="innerHTMLRef"></div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useData } from 'vitepress';
import mermaid from 'mermaid';
import useTheme from './useTheme';

export default defineComponent({
    name: 'Mermaid',
    props: {
        code: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const { isDark } = useData();
        const containerRef = ref(null);
        const decodedCode = decodeURIComponent(props.code);
        const timestamp = Date.now();
        const innerHTMLRef = ref(`<pre>${decodedCode}</pre>`);
        const { theme, themeVariables } = useTheme(isDark);

        async function renderMermaid() {
            if (containerRef.value) {
                try {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: theme.value,
                        themeVariables: themeVariables.value,
                    });

                    const id = `${isDark.value}-${timestamp}`;
                    const { svg } = await mermaid.render(id, decodedCode);

                    innerHTMLRef.value = svg;
                } catch (e) {
                    innerHTMLRef.value = `<pre>${decodedCode}</pre>`;
                }
            }
        }

        onMounted(renderMermaid);
        watch([() => props.code, isDark], renderMermaid);

        return {
            containerRef,
            innerHTMLRef,
        };
    },
});
</script>
