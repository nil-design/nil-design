<template>
    <div
        :class="[
            'badge-label',
            'mx-auto mb-6 inline-flex w-fit items-center gap-[0.65rem]',
            'rounded-full bg-surface',
            'px-[0.9rem] py-[0.45rem] text-[0.8125rem] font-semibold tracking-[0.02em]',
            'text-muted shadow-sm',
            'backdrop-blur-xl backdrop-saturate-150 md:mx-0',
        ]"
    >
        <span
            :class="['size-2 rounded-full bg-brand', '[box-shadow:0_0_0_0.3rem_var(--background-color-brand-soft)]']"
            aria-hidden="true"
        ></span>
        {{ badgeLabel }}
    </div>
</template>

<script setup>
import { useData } from 'vitepress';
import { computed } from 'vue';

const { lang } = useData();

const badgeLabel = computed(() =>
    lang.value.startsWith('zh') ? 'OKLCH \u4f18\u5148\u7684 React \u4f53\u7cfb' : 'OKLCH-first React System',
);
</script>
