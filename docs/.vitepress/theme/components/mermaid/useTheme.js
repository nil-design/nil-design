/* eslint-disable @nild/boolean-naming */
import { ref, computed, unref, onMounted } from 'vue';

const theme = ref('base');
const themeVersion = ref(0);
let probe;
let canvasCtx;
let observer;

const ensureThemeRuntime = () => {
    if (!probe) {
        probe = document.createElement('div');
        probe.style.display = 'none';
        document.body.appendChild(probe);
    }

    if (!canvasCtx) {
        const $canvas = document.createElement('canvas');

        $canvas.width = $canvas.height = 1;
        canvasCtx = $canvas.getContext('2d', { willReadFrequently: true });
    }

    if (!observer) {
        observer = new MutationObserver(mutations => {
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
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    }
};

/**
 * Resolves a CSS custom property to a sRGB hex string.
 */
const resolveCssColor = varName => {
    if (!probe || !canvasCtx) return '';

    probe.style.color = `var(${varName})`;
    const color = getComputedStyle(probe).color;
    const ctx = canvasCtx;

    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const formatC = c => c.toString(16).padStart(2, '0');

    return `#${formatC(r)}${formatC(g)}${formatC(b)}`;
};

const themeVariables = computed(() => {
    unref(themeVersion); // track style/hue switch and dark/light switch
    const darkScheme = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;
    const brandColor = resolveCssColor('--nd-color-brand-60');

    return {
        darkMode: darkScheme,
        fontSize: '14px',
        fontFamily: 'var(--nd-font-family)',
        mainBkg: resolveCssColor('--nd-color-neutral-5'),
        edgeLabelBackground: resolveCssColor('--nd-color-neutral-0'),
        primaryColor: brandColor,
        primaryTextColor: resolveCssColor('--nd-color-neutral-100'),
        primaryBorderColor: brandColor,
        arrowheadColor: brandColor,
        lineColor: resolveCssColor('--nd-color-brand-80'),
        transitionColor: brandColor,
    };
});

const themeCSS = computed(() => {
    unref(themeVersion); // track style/hue switch and dark/light switch
    const brandColor = resolveCssColor('--nd-color-brand-60');

    return `
            marker[id$='-barbEnd'] path,
            marker[id='statediagram-barbEnd'] path {
                fill: ${brandColor};
                stroke: ${brandColor};
            }
        `;
});

const useTheme = () => {
    onMounted(ensureThemeRuntime);

    return { theme, themeVariables, themeCSS, themeVersion };
};

export default useTheme;
