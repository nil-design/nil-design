<template>
    <div class="theme-picker flex items-center">
        <button
            class="flex items-center justify-center size-9 rounded-lg border-0 bg-transparent cursor-pointer"
            title="Switch theme color"
            @click="randomize"
        >
            <PaletteIcon
                class="transition-[color,rotate] duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
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
import { onMounted, ref } from 'vue';
import PaletteIcon from '../../icons/Palette.vue';

/**
 * Curated hues for OKLCH at C≈0.14, L≈50%.
 * ~26° spacing across the usable hue wheel, skipping low-contrast yellows (65–125°).
 */
const HUES = [
    { h: 10, label: 'Red' },
    { h: 35, label: 'Orange' },
    { h: 60, label: 'Amber' },
    { h: 125, label: 'Lime' },
    { h: 150, label: 'Green' },
    { h: 178, label: 'Teal' },
    { h: 205, label: 'Cyan' },
    { h: 230, label: 'Sky' },
    { h: 258, label: 'Blue' },
    { h: 285, label: 'Indigo' },
    { h: 310, label: 'Violet' },
    { h: 338, label: 'Magenta' },
];

const currentHue = ref(258);
const spinning = ref(false);

const applyHue = h => {
    document.documentElement.style.setProperty('--nd-brand-h', String(h));
    currentHue.value = h;
};

const randomize = () => {
    if (spinning.value) return;

    const others = HUES.filter(item => item.h !== currentHue.value);
    const next = others[Math.floor(Math.random() * others.length)];

    spinning.value = true;
    applyHue(next.h);
    setTimeout(() => {
        spinning.value = false;
    }, 200);
};

onMounted(() => {
    const others = HUES.filter(item => item.h !== currentHue.value);
    applyHue(others[Math.floor(Math.random() * others.length)].h);
});
</script>
