<template>
    <span class="inline-flex min-w-0 items-center gap-[0.72rem]">
        <span
            :class="[
                'relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden',
                'rounded-lg',
                'bg-[linear-gradient(180deg,color-mix(in_oklch,var(--nd-color-neutral-0)_22%,transparent),transparent_78%),color-mix(in_oklch,var(--nd-color-brand-10)_26%,var(--nd-color-neutral-0))]',
                'shadow-sm',
            ]"
            aria-hidden="true"
        >
            <span
                :class="[
                    'pointer-events-none absolute inset-px rounded-[calc(0.5rem-1px)]',
                    '[box-shadow:inset_0_1px_0_0_color-mix(in_oklch,var(--nd-color-neutral-0)_82%,transparent)]',
                ]"
            ></span>
            <svg
                class="size-[1.15rem] overflow-visible"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
            >
                <rect
                    :class="['fill-[color-mix(in_oklch,var(--nd-color-neutral-100)_96%,var(--nd-color-brand-90))]']"
                    x="9"
                    y="8"
                    width="4"
                    height="20"
                    rx="2"
                />
                <polygon
                    :class="['fill-[color-mix(in_oklch,var(--nd-color-brand-50)_84%,var(--nd-color-brand-60))]']"
                    points="13,8 17.2,8 25,22.3 25,28 20.8,28 13,13.8"
                />
                <rect
                    :class="['fill-[color-mix(in_oklch,var(--nd-color-neutral-100)_96%,var(--nd-color-brand-90))]']"
                    x="22"
                    y="8"
                    width="4"
                    height="20"
                    rx="2"
                />
                <path
                    :class="[
                        'stroke-[color-mix(in_oklch,var(--nd-color-brand-30)_76%,var(--nd-color-brand-40))]',
                        '[stroke-linecap:round] stroke-[1.6]',
                        'opacity-90',
                    ]"
                    d="M8 11H18"
                />
                <path
                    :class="[
                        'stroke-[color-mix(in_oklch,var(--nd-color-brand-30)_76%,var(--nd-color-brand-40))]',
                        '[stroke-linecap:round] stroke-[1.6]',
                        'opacity-90',
                    ]"
                    d="M19 28H28"
                />
            </svg>
        </span>
        <span
            :class="[
                'inline-flex min-w-0 gap-[0.34rem] whitespace-nowrap',
                'text-[0.9375rem] leading-none tracking-[-0.03em]',
                'max-[519px]:hidden',
            ]"
        >
            <span class="font-bold text-main">Nil</span>
            <span class="font-semibold text-muted">Design</span>
        </span>
    </span>
</template>
