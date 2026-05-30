<template>
    <div ref="rootRef"></div>
</template>

<script>
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { defineComponent, onBeforeUnmount, ref, watchPostEffect } from 'vue';

const createPropsSnapshot = value => {
    const source = value || {};

    return Object.keys(source).reduce((snapshot, key) => {
        snapshot[key] = source[key];

        return snapshot;
    }, {});
};

const arePropsShallowEqual = (left, right) => {
    if (!left || !right) {
        return left === right;
    }

    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    return leftKeys.every(key => Object.prototype.hasOwnProperty.call(right, key) && Object.is(left[key], right[key]));
};

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
        let renderedComponent = null;
        let renderedProps = null;

        const renderReactComponent = (component, nextProps) => {
            if (!reactRoot) {
                reactRoot = createRoot(rootRef.value);
            }

            if (component === renderedComponent && arePropsShallowEqual(nextProps, renderedProps)) {
                return;
            }

            reactRoot.render(createElement(component, nextProps));
            renderedComponent = component;
            renderedProps = nextProps;
        };

        watchPostEffect(() => {
            const component = props.component;
            const nextProps = createPropsSnapshot(props.props);

            if (!rootRef.value) {
                return;
            }

            renderReactComponent(component, nextProps);
        });

        onBeforeUnmount(() => {
            if (reactRoot) {
                reactRoot.unmount();
                reactRoot = null;
                renderedComponent = null;
                renderedProps = null;
            }
        });

        return {
            rootRef,
        };
    },
});
</script>
