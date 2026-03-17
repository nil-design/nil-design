<template>
    <span class="nil-nav-logo">
        <span class="nil-nav-logo__mark" aria-hidden="true">
            <svg class="nil-nav-logo__svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" fill="none">
                <rect class="nil-nav-logo__stem" x="9" y="8" width="4" height="20" rx="2" />
                <polygon class="nil-nav-logo__accent" points="13,8 17.2,8 25,22.3 25,28 20.8,28 13,13.8" />
                <rect class="nil-nav-logo__stem" x="22" y="8" width="4" height="20" rx="2" />
                <path class="nil-nav-logo__trace" d="M8 11H18" />
                <path class="nil-nav-logo__trace" d="M19 28H28" />
            </svg>
        </span>
        <span class="nil-nav-logo__title">
            <span class="nil-nav-logo__title-strong">Nil</span>
            <span class="nil-nav-logo__title-light">Design</span>
        </span>
    </span>
</template>

<style scoped>
.nil-nav-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.72rem;
    min-width: 0;
}

.nil-nav-logo__mark {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid color-mix(in oklch, var(--nd-color-brand-30) 26%, transparent);
    border-radius: 0.75rem;
    width: 2rem;
    height: 2rem;
    background:
        linear-gradient(180deg, color-mix(in oklch, var(--nd-color-neutral-0) 22%, transparent), transparent 78%),
        color-mix(in oklch, var(--nd-color-brand-10) 26%, var(--nd-color-neutral-0));
    box-shadow:
        inset 0 1px 0 0 color-mix(in oklch, var(--nd-color-neutral-0) 82%, transparent),
        0 10px 24px -16px var(--nd-color-shadow-key);
    flex-shrink: 0;
}

.nil-nav-logo__svg {
    width: 1.15rem;
    height: 1.15rem;
    overflow: visible;
}

.nil-nav-logo__stem {
    fill: color-mix(in oklch, var(--nd-color-neutral-100) 96%, var(--nd-color-brand-90));
}

.nil-nav-logo__accent {
    fill: color-mix(in oklch, var(--nd-color-brand-50) 84%, var(--nd-color-brand-60));
}

.nil-nav-logo__trace {
    stroke: color-mix(in oklch, var(--nd-color-brand-30) 76%, var(--nd-color-brand-40));
    stroke-linecap: round;
    stroke-width: 1.6;
    opacity: 0.9;
}

.nil-nav-logo__title {
    display: inline-flex;
    gap: 0.34rem;
    min-width: 0;
    line-height: 1;
    font-size: 0.9375rem;
    letter-spacing: -0.03em;
    white-space: nowrap;
}

.nil-nav-logo__title-strong {
    color: var(--vp-c-text-1);
    font-weight: 700;
}

.nil-nav-logo__title-light {
    color: var(--vp-c-text-2);
    font-weight: 600;
}

@media (width < 520px) {
    .nil-nav-logo__title {
        display: none;
    }
}
</style>
