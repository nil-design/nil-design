<template>
    <ReactBridge :component="Assistant" :props="{ locale: lang, base: site.base, routePath: route.path, navigate }" />
</template>

<script>
import { getScrollOffset, onContentUpdated, useData, useRoute, useRouter } from 'vitepress';
import { defineComponent } from 'vue';
import ReactBridge from '../react-bridge/ReactBridge.vue';
import Assistant from './Assistant.jsx';

const MAX_ANCHOR_SCROLL_FRAMES = 6;

const scrollToAnchor = (hash, frame = 0) => {
    if (!hash) {
        return;
    }

    requestAnimationFrame(() => {
        const $target = document.getElementById(decodeURIComponent(hash).slice(1));

        if ($target) {
            const targetPadding = Number.parseInt(window.getComputedStyle($target).paddingTop, 10) || 0;

            window.scrollTo(
                0,
                window.scrollY + $target.getBoundingClientRect().top - getScrollOffset() + targetPadding,
            );
        }

        if (frame < MAX_ANCHOR_SCROLL_FRAMES) {
            scrollToAnchor(hash, frame + 1);
        }
    });
};

export default defineComponent({
    name: 'Assistant',
    components: {
        ReactBridge,
    },
    setup() {
        const { lang, site } = useData();
        const route = useRoute();
        const router = useRouter();
        let pendingHash = '';

        const scrollPendingAnchor = () => {
            if (!pendingHash) {
                return;
            }

            scrollToAnchor(pendingHash);
            pendingHash = '';
        };

        onContentUpdated(scrollPendingAnchor);

        const navigate = async path => {
            const href = `${site.value.base.replace(/\/$/, '')}${path}`;
            const targetUrl = new URL(href, window.location.origin);
            const currentUrl = new URL(window.location.href);
            const { hash } = targetUrl;

            if (hash && targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
                if (hash !== currentUrl.hash) {
                    history.pushState({}, '', targetUrl.href);
                    window.dispatchEvent(
                        new HashChangeEvent('hashchange', { oldURL: currentUrl.href, newURL: targetUrl.href }),
                    );
                }

                scrollToAnchor(hash);

                return;
            }

            pendingHash = hash;
            await router.go(href);
            scrollPendingAnchor();
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
