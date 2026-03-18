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
            <BadgeLabel />
        </template>
        <template #home-hero-image>
            <HeroLogo />
        </template>
        <template #home-features-after>
            <Features />
        </template>
    </DefaultTheme.Layout>
    <Assistant />
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import Assistant from '../assistant/Assistant.vue';
import ProgressBar from '../progress-bar/ProgressBar.vue';
import ThemePicker from '../theme-picker/ThemePicker.vue';
import BadgeLabel from './BadgeLabel.vue';
import Features from './Features.vue';
import HeroLogo from './HeroLogo.vue';
import NavLogo from './NavLogo.vue';
</script>
