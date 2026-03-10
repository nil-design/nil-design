<template>
    <ProgressBar />
    <DefaultTheme.Layout>
        <template #nav-bar-content-after>
            <ThemePicker />
        </template>
    </DefaultTheme.Layout>
    <Assistant />
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
import Assistant from '../assistant/Assistant.vue';
import ProgressBar from '../progress-bar/ProgressBar.vue';
import ThemePicker from '../theme-picker/ThemePicker.vue';
</script>
