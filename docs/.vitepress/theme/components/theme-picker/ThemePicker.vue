<template>
    <div class="theme-picker flex items-center">
        <button
            class="flex items-center justify-center size-9 rounded-lg border-0 bg-transparent cursor-pointer outline-none transition-[box-shadow] ease-in-out focus-visible:ring-focused motion-reduce:transition-none"
            :style="{ color: `var(--nd-color-brand-60)` }"
            title="Switch theme color"
            @click="randomize"
        >
            <PaletteIcon
                :key="shakeKey"
                class="motion-reduce:animate-none"
                :class="{ 'animate-shake': shakeKey > 0 }"
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
 * Curated brand hues for OKLCH at C≈0.14, L≈50%.
 * Avoid error red, warning yellow, and success green.
 */
const HUES = [
    { h: 110, label: 'Lime' },
    { h: 190, label: 'Teal' },
    { h: 255, label: 'Blue' },
    { h: 285, label: 'Indigo' },
];

const currentHue = ref(255);
const shakeKey = ref(0);
let hueQueue = [];

const shuffleHueQueue = () => {
    hueQueue = [...HUES];

    for (let index = hueQueue.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));

        [hueQueue[index], hueQueue[randomIndex]] = [hueQueue[randomIndex], hueQueue[index]];
    }

    if (hueQueue.length > 1 && hueQueue[0].h === currentHue.value) {
        [hueQueue[0], hueQueue[1]] = [hueQueue[1], hueQueue[0]];
    }
};

const pickNextHue = () => {
    if (hueQueue.length === 0) {
        shuffleHueQueue();
    }

    return hueQueue.shift();
};

const applyHue = h => {
    document.documentElement.style.setProperty('--nd-brand-h', String(h));
    currentHue.value = h;
};

const randomize = () => {
    const next = pickNextHue();

    shakeKey.value += 1;
    applyHue(next.h);
};

onMounted(() => {
    applyHue(pickNextHue().h);
});
</script>
