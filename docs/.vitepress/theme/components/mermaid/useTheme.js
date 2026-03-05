import { ref, shallowRef, computed, unref, onMounted, onUnmounted } from 'vue';

const useTheme = isDark => {
    const theme = ref('base');
    const probe = shallowRef(null);
    const canvasCtx = shallowRef(null);

    onMounted(() => {
        probe.value = document.createElement('div');
        probe.value.style.display = 'none';
        document.body.appendChild(probe.value);

        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        canvasCtx.value = canvas.getContext('2d', { willReadFrequently: true });
    });

    onUnmounted(() => {
        probe.value?.remove();
        probe.value = null;
        canvasCtx.value = null;
    });

    /**
     * Resolves a CSS custom property to a sRGB hex string.
     */
    const resolveCssColor = varName => {
        if (!probe.value || !canvasCtx.value) return '';

        probe.value.style.color = `var(${varName})`;
        const color = getComputedStyle(probe.value).color;
        const ctx = canvasCtx.value;
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const themeVariables = computed(() => {
        const dark = unref(isDark); // track dark/light switch

        return {
            darkMode: dark,
            fontSize: '14px',
            fontFamily: 'var(--vp-font-family-base)',
            mainBkg: resolveCssColor('--nd-color-neutral-5'),
            primaryColor: resolveCssColor('--nd-color-brand-60'),
            primaryTextColor: resolveCssColor('--nd-color-neutral-100'),
            primaryBorderColor: resolveCssColor('--nd-color-brand-60'),
            lineColor: resolveCssColor('--nd-color-brand-80'),
        };
    });

    return { theme, themeVariables };
};

export default useTheme;
