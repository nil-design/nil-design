<template>
    <div class="relative mx-auto aspect-[1/1.02] w-full max-w-140" aria-hidden="true">
        <div
            class="absolute inset-[8%_4%_10%] rounded-3xl [background:var(--vp-custom-hero-logo-glow)] blur-[28px] opacity-90 dark:opacity-100"
        ></div>
        <div
            class="absolute inset-0 overflow-hidden rounded-3xl [background:var(--vp-custom-hero-logo-surface)] shadow-(--vp-custom-glass-shadow) [backdrop-filter:var(--vp-custom-glass-backdrop-strong)] [-webkit-backdrop-filter:var(--vp-custom-glass-backdrop-strong)]"
        >
            <div class="pointer-events-none absolute inset-0 [background:var(--vp-custom-hero-logo-overlay)]"></div>
            <div
                class="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] [box-shadow:var(--vp-custom-glass-highlight)]"
            ></div>
            <div
                class="absolute inset-0 opacity-[0.54] [background-image:var(--vp-custom-page-grid-background)] [background-size:var(--vp-custom-page-grid-size)] [mask:var(--vp-custom-hero-logo-grid-mask)]"
            ></div>
            <svg
                class="absolute inset-[18%_10%_24%] h-auto w-[80%] overflow-visible"
                viewBox="0 0 520 224"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
            >
                <g class="fill-(--vp-custom-logo-shadow-fill)" transform="translate(14 14)">
                    <rect x="34" y="24" width="30" height="176" rx="9" />
                    <rect x="138" y="24" width="30" height="176" rx="9" />
                    <polygon points="64,24 94,24 168,152 168,200 138,200 64,72" />
                    <rect x="236" y="24" width="30" height="176" rx="9" />
                    <rect x="340" y="24" width="30" height="176" rx="9" />
                    <rect x="340" y="170" width="146" height="30" rx="9" />
                </g>
                <g class="fill-(--vp-custom-logo-ink)">
                    <rect x="34" y="24" width="30" height="176" rx="9" />
                    <rect x="138" y="24" width="30" height="176" rx="9" />
                    <polygon points="64,24 94,24 168,152 168,200 138,200 64,72" />
                    <rect x="236" y="24" width="30" height="176" rx="9" />
                    <rect x="340" y="24" width="30" height="176" rx="9" />
                    <rect x="340" y="170" width="146" height="30" rx="9" />
                </g>
                <g class="fill-(--vp-custom-logo-accent)">
                    <polygon points="64,24 94,24 145,112 115,112" />
                    <rect x="236" y="24" width="30" height="46" rx="9" />
                    <rect x="340" y="170" width="92" height="30" rx="9" />
                </g>
                <g
                    class="fill-none stroke-(--vp-custom-logo-line) [stroke-linecap:round] [stroke-linejoin:round] stroke-4 opacity-[0.88]"
                >
                    <path d="M10 12H134" />
                    <path d="M438 12H510V84" />
                    <path d="M10 186V212H84" />
                    <path d="M372 212H510" />
                    <path d="M86 46H156" />
                    <path d="M318 180H464" />
                </g>
                <g class="fill-(--vp-custom-logo-dot) opacity-90">
                    <circle cx="10" cy="12" r="6" />
                    <circle cx="510" cy="84" r="6" />
                    <circle cx="84" cy="212" r="6" />
                </g>
            </svg>
            <div
                class="absolute right-[11%] bottom-[10%] left-[11%] flex items-end justify-between gap-4 text-[0.75rem] uppercase tracking-[0.12em] text-muted max-[639px]:flex-col max-[639px]:items-start"
            >
                <span class="font-bold text-main">Nil Design</span>
                <span class="text-right opacity-80 max-[639px]:text-left">Adaptive UI Surface</span>
            </div>
        </div>
    </div>
</template>
