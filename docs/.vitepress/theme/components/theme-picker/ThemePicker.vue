<template>
    <div class="theme-picker flex items-center">
        <button
            class="flex items-center justify-center size-9 rounded-lg border-0 bg-transparent cursor-pointer"
            title="Switch theme color"
            @click="randomize"
        >
            <svg
                class="transition-[color,rotate] duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
                :class="{ 'rotate-180': spinning }"
                :style="{ color: `var(--nd-color-brand-60)` }"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2zM8.5 7.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M13.5 6.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M17.5 10.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M6.5 12.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0"
                />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

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
