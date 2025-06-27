<template>
    <div ref="rootRef"></div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

export default defineComponent({
    name: 'ReactBridge',
    props: {
        component: {
            type: [Object, Function],
            required: true,
        },
        props: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props) {
        const rootRef = ref(null);
        let reactRoot = null;

        const renderReactComponent = () => {
            if (!reactRoot) {
                reactRoot = createRoot(rootRef.value);
            }
            reactRoot.render(createElement(props.component, props.props));
        };

        onMounted(() => {
            renderReactComponent();
        });

        onBeforeUnmount(() => {
            if (reactRoot) {
                reactRoot.unmount();
                reactRoot = null;
            }
        });

        watch(
            () => props.props,
            () => {
                renderReactComponent();
            },
            { deep: true },
        );

        return {
            rootRef,
        };
    },
});
</script>
