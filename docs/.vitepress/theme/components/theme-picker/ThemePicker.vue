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
const spinning = ref(false);
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
    if (spinning.value) return;

    const next = pickNextHue();

    spinning.value = true;
    applyHue(next.h);
    setTimeout(() => {
        spinning.value = false;
    }, 200);
};

onMounted(() => {
    applyHue(pickNextHue().h);
});
</script>
