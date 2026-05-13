<template>
    <span class="inline-flex min-w-0 items-center gap-[0.72rem]">
        <span
            class="relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] [background:var(--vp-custom-logo-surface)] shadow-(--vp-custom-glass-shadow-sm)"
            aria-hidden="true"
        >
            <span
                class="pointer-events-none absolute inset-px rounded-[9px] [box-shadow:var(--vp-custom-glass-highlight)]"
            ></span>
            <svg
                class="h-[0.9rem] w-auto overflow-visible"
                viewBox="0 0 134 176"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
            >
                <g class="fill-(--vp-custom-logo-ink)">
                    <rect x="0" y="0" width="30" height="176" rx="9" />
                    <rect x="104" y="0" width="30" height="176" rx="9" />
                    <polygon points="30,0 60,0 134,128 134,176 104,176 30,48" />
                </g>
                <g class="fill-(--vp-custom-logo-accent)">
                    <polygon points="30,0 60,0 111,88 81,88" />
                </g>
            </svg>
        </span>
        <span
            class="inline-flex min-w-0 gap-[0.34rem] whitespace-nowrap text-[0.9375rem] leading-none tracking-[-0.03em] max-[519px]:hidden"
        >
            <span class="font-bold text-main">Nil</span>
            <span class="font-semibold text-muted">Design</span>
        </span>
    </span>
</template>
