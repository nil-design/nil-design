<template>
    <ProgressBar />
    <DefaultTheme.Layout>
        <template #nav-bar-content-after>
            <ThemePicker />
        </template>
    </DefaultTheme.Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import ProgressBar from '../progress-bar/ProgressBar.vue';
import ThemePicker from '../theme-picker/ThemePicker.vue';
</script>
