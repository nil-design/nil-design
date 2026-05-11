<template>
    <div class="theme-picker flex items-center">
        <button
            class="flex items-center justify-center size-9 rounded-lg border-0 bg-transparent cursor-pointer"
            title="Switch theme color"
            @click="randomize"
        >
            <PaletteIcon
                class="transition-[color,rotate] ease-in-out"
                :class="{ 'rotate-180': spinning }"
                :style="{ color: `var(--nd-color-brand-60)` }"
                width="20"
                height="20"
                aria-hidden="true"
            />
        </button>
    </div>
</template>

<script setup>
/* eslint-disable @nild/no-hardcoded-colors */
import { onMounted, ref } from 'vue';
import PaletteIcon from '../../icons/palette.svg';

/**
 * Curated hues for OKLCH at C≈0.14, L≈50%.
 * ~26° spacing across the usable hue wheel, skipping low-contrast yellows (65–125°).
 */
const HUES = [
    { h: 25, label: 'Red' },
    { h: 45, label: 'Orange' },
    { h: 75, label: 'Amber' },
    { h: 110, label: 'Lime' },
    { h: 145, label: 'Green' },
    { h: 175, label: 'Teal' },
    { h: 205, label: 'Cyan' },
    { h: 235, label: 'Sky' },
    { h: 255, label: 'Blue' },
    { h: 285, label: 'Indigo' },
    { h: 315, label: 'Violet' },
    { h: 340, label: 'Magenta' },
];

const currentHue = ref(255);
const spinning = ref(false);
const recentHues = [];

const rememberHue = h => {
    const index = recentHues.indexOf(h);

    if (index !== -1) {
        recentHues.splice(index, 1);
    }

    recentHues.unshift(h);
    recentHues.length = Math.min(recentHues.length, HUES.length);
};

const getHueWeight = h => {
    const recentIndex = recentHues.indexOf(h);

    if (recentIndex === -1) {
        return HUES.length + 1;
    }

    return recentIndex;
};

const pickWeightedHue = () => {
    const candidates = HUES.filter(item => item.h !== currentHue.value);
    const weighted = candidates.map(item => ({
        ...item,
        weight: getHueWeight(item.h),
    }));
    const totalWeight = weighted.reduce((total, item) => total + item.weight, 0);
    let cursor = Math.random() * totalWeight;

    return (
        weighted.find(item => {
            cursor -= item.weight;

            return cursor <= 0;
        }) ?? weighted.at(-1)
    );
};

const applyHue = h => {
    document.documentElement.style.setProperty('--nd-brand-h', String(h));
    currentHue.value = h;
    rememberHue(h);
};

const randomize = () => {
    if (spinning.value) return;

    const next = pickWeightedHue();

    spinning.value = true;
    applyHue(next.h);
    setTimeout(() => {
        spinning.value = false;
    }, 200);
};

onMounted(() => {
    applyHue(pickWeightedHue().h);
});
</script>
