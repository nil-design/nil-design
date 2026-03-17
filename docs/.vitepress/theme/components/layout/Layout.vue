<template>
    <ProgressBar />
    <DefaultTheme.Layout>
        <template #nav-bar-title-before>
            <NavLogo />
        </template>
        <template #nav-bar-content-after>
            <ThemePicker />
        </template>
        <template #home-hero-info-before>
            <div v-if="isHome" class="nil-home-badge">
                {{ badgeLabel }}
            </div>
        </template>
        <template #home-hero-image>
            <HeroLogo v-if="isHome" />
        </template>
    </DefaultTheme.Layout>
    <Assistant />
</template>

<script setup>
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { computed } from 'vue';
import Assistant from '../assistant/Assistant.vue';
import HeroLogo from '../branding/HeroLogo.vue';
import NavLogo from '../branding/NavLogo.vue';
import ProgressBar from '../progress-bar/ProgressBar.vue';
import ThemePicker from '../theme-picker/ThemePicker.vue';

const { frontmatter, lang } = useData();
const isHome = computed(() => frontmatter.value.layout === 'home');
const badgeLabel = computed(() =>
    lang.value.startsWith('zh') ? 'OKLCH \u4f18\u5148\u7684 React \u4f53\u7cfb' : 'OKLCH-first React System',
);
</script>
