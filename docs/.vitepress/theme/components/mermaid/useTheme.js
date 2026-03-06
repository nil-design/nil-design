import { ref, shallowRef, computed, unref, onMounted, onUnmounted } from 'vue';

const useTheme = () => {
    const theme = ref('base');
    const probe = shallowRef(null);
    const canvasCtx = shallowRef(null);
    const observer = shallowRef(null);
    const themeVersion = ref(0);

    onMounted(() => {
        probe.value = document.createElement('div');
        probe.value.style.display = 'none';
        document.body.appendChild(probe.value);

        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        canvasCtx.value = canvas.getContext('2d', { willReadFrequently: true });

        observer.value = new MutationObserver(mutations => {
            let changed = false;
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    changed = true;
                }
            });
            if (changed) {
                themeVersion.value++;
            }
        });
        observer.value.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    });

    onUnmounted(() => {
        probe.value?.remove();
        probe.value = null;
        canvasCtx.value = null;
        observer.value?.disconnect();
        observer.value = null;
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
        const formatC = c => c.toString(16).padStart(2, '0');

        return `#${formatC(r)}${formatC(g)}${formatC(b)}`;
    };

    const themeVariables = computed(() => {
        unref(themeVersion); // track style/hue switch and dark/light switch
        const darkScheme =
            typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;

        return {
            darkMode: darkScheme,
            fontSize: '14px',
            fontFamily: 'var(--vp-font-family-base)',
            mainBkg: resolveCssColor('--nd-color-neutral-5'),
            primaryColor: resolveCssColor('--nd-color-brand-60'),
            primaryTextColor: resolveCssColor('--nd-color-neutral-100'),
            primaryBorderColor: resolveCssColor('--nd-color-brand-60'),
            lineColor: resolveCssColor('--nd-color-brand-80'),
        };
    });

    return { theme, themeVariables, themeVersion };
};

export default useTheme;
