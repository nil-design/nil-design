<template>
    <div
        :class="[
            'progress-bar',
            'fixed top-0 left-0 h-[2px] z-[99999]',
            'bg-brand pointer-events-none transition-all duration-300 ease-out',
            visible ? 'opacity-100' : 'opacity-0',
        ]"
        :style="{ width: `${progress}%` }"
    ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vitepress';

const router = useRouter();
const progress = ref(0);
const visible = ref(false);

let startTimer = null;
let incrementTimer = null;
let hideTimer = null;

const start = () => {
    clearTimeout(startTimer);
    clearTimeout(hideTimer);
    clearInterval(incrementTimer);

    /**
     * delay start:
     * if the loading is too fast (<150ms), the progress bar will not be displayed to avoid flickering
     */
    startTimer = setTimeout(() => {
        progress.value = 5;
        visible.value = true;

        incrementTimer = setInterval(() => {
            const remaining = 95 - progress.value;
            progress.value += remaining * 0.1;
        }, 200);
    }, 150);
};

const finish = () => {
    clearTimeout(startTimer);
    clearInterval(incrementTimer);

    if (visible.value) {
        progress.value = 100;

        /**
         * wait for the width transition animation to complete
         */
        hideTimer = setTimeout(() => {
            visible.value = false;

            /**
             * wait for the opacity transition animation to complete,
             * then reset the width to 0, ready for the next time
             */
            setTimeout(() => {
                progress.value = 0;
            }, 300);
        }, 300);
    }
};

onMounted(() => {
    router.onBeforeRouteChange = start;
    router.onAfterRouteChange = finish;
});

onUnmounted(() => {
    clearTimeout(startTimer);
    clearTimeout(hideTimer);
    clearInterval(incrementTimer);
});
</script>
