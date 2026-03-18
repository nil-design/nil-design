<template>
    <div
        :class="[
            'badge-label',
            'mx-auto mb-6 inline-flex w-fit items-center gap-[0.65rem]',
            'rounded-full bg-(--nil-glass-bg-strong)',
            'px-[0.9rem] py-[0.45rem] text-[0.8125rem] font-semibold tracking-[0.02em]',
            'text-muted shadow-md [backdrop-filter:blur(18px)_saturate(140%)]',
            '[-webkit-backdrop-filter:blur(18px)_saturate(140%)] md:mx-0',
        ]"
    >
        <span
            :class="[
                'size-2 rounded-full bg-brand',
                '[box-shadow:0_0_0_0.3rem_color-mix(in_oklch,var(--nd-color-brand-30)_18%,transparent)]',
            ]"
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
