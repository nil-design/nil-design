<template>
    <div class="mermaid vp-raw" ref="containerRef" v-html="innerHTMLRef"></div>
</template>

<script>
/* eslint-disable no-unused-vars */
import mermaid from 'mermaid';
import { defineComponent, onMounted, ref, watch } from 'vue';
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
        const containerRef = ref(null);
        const decodedCode = decodeURIComponent(props.code);
        const timestamp = Date.now();
        const innerHTMLRef = ref(`<pre>${decodedCode}</pre>`);
        const { theme, themeVariables, themeVersion } = useTheme();

        async function renderMermaid() {
            if (containerRef.value) {
                try {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: theme.value,
                        themeVariables: themeVariables.value,
                    });

                    const id = `mermaid-${themeVersion.value}-${timestamp}`;
                    const { svg } = await mermaid.render(id, decodedCode);

                    innerHTMLRef.value = svg;
                } catch (e) {
                    innerHTMLRef.value = `<pre>${decodedCode}</pre>`;
                }
            }
        }

        onMounted(renderMermaid);
        watch([() => props.code, themeVersion], renderMermaid);

        return {
            containerRef,
            innerHTMLRef,
        };
    },
});
</script>
