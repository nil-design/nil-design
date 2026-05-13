<template>
    <section v-if="cards.length" class="vp-raw mt-6 sm:mt-5" aria-label="Component catalog">
        <div class="grid max-w-full gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr))]">
            <component
                v-for="card in cards"
                :key="card.slug"
                :is="card.tag"
                :class="[
                    'group relative grid overflow-hidden rounded-2xl bg-transparent text-inherit no-underline',
                    '[grid-template-rows:minmax(0,1fr)_auto] shadow-sm',
                    'transition-[transform,box-shadow] duration-180 ease-out',
                    'hover:-translate-y-px hover:shadow-sm',
                    'focus-visible:-translate-y-px focus-visible:outline-none',
                    'focus-visible:[box-shadow:0_0_0_0.2rem_var(--color-brand-ring),var(--shadow-sm)]',
                    'w-full border-0 p-0 text-left appearance-none',
                    card.href ? 'cursor-pointer' : '',
                    'motion-reduce:transition-none',
                ]"
                :type="card.tag === 'button' ? 'button' : undefined"
                @keydown.enter.prevent="handleNavigate(card)"
                @keydown.space.prevent="handleNavigate(card)"
                @click="handleNavigate(card)"
            >
                <div
                    class="relative flex aspect-[10/5.45] items-center justify-center overflow-hidden border-b border-[color:color-mix(in_oklch,var(--vp-c-divider)_80%,transparent)] bg-transparent px-2.5 pt-2.5 pb-2"
                >
                    <component
                        :is="card.iconComponent"
                        v-if="card.iconComponent"
                        class="block h-full w-full overflow-visible transition-transform duration-180 ease-out group-hover:-translate-y-px group-focus-visible:-translate-y-px motion-reduce:transition-none [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:overflow-visible"
                        aria-hidden="true"
                    />
                </div>
                <div class="flex items-center justify-between gap-2.5 px-3 pt-2.5 pb-3">
                    <h2 class="m-0 text-[0.9rem] leading-[1.35] font-semibold tracking-[-0.02em] text-main">
                        {{ card.title }}
                    </h2>
                    <span
                        class="mt-px h-[0.45rem] w-[0.45rem] shrink-0 rotate-45 border-t-[1.5px] border-r-[1.5px] border-[color:color-mix(in_oklch,var(--vp-c-text-1)_76%,var(--vp-c-brand-1))] opacity-70"
                        aria-hidden="true"
                    ></span>
                </div>
            </component>
        </div>
    </section>
</template>

<script setup>
import { useData, useRouter } from 'vitepress';
import { computed, markRaw } from 'vue';
import ButtonIcon from '../../icons/components/button.svg';
import CheckboxIcon from '../../icons/components/checkbox.svg';
import DividerIcon from '../../icons/components/divider.svg';
import FieldIcon from '../../icons/components/field.svg';
import FormIcon from '../../icons/components/form.svg';
import IconIcon from '../../icons/components/icon.svg';
import InputIcon from '../../icons/components/input.svg';
import ModalIcon from '../../icons/components/modal.svg';
import PopoverIcon from '../../icons/components/popover.svg';
import RadioIcon from '../../icons/components/radio.svg';
import SelectIcon from '../../icons/components/select.svg';
import SwitchIcon from '../../icons/components/switch.svg';
import TooltipIcon from '../../icons/components/tooltip.svg';
import TransitionIcon from '../../icons/components/transition.svg';
import TypographyIcon from '../../icons/components/typography.svg';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});

const { lang, site } = useData();
const router = useRouter();

const iconMap = {
    button: markRaw(ButtonIcon),
    checkbox: markRaw(CheckboxIcon),
    divider: markRaw(DividerIcon),
    field: markRaw(FieldIcon),
    form: markRaw(FormIcon),
    icon: markRaw(IconIcon),
    input: markRaw(InputIcon),
    modal: markRaw(ModalIcon),
    popover: markRaw(PopoverIcon),
    radio: markRaw(RadioIcon),
    select: markRaw(SelectIcon),
    switch: markRaw(SwitchIcon),
    tooltip: markRaw(TooltipIcon),
    transition: markRaw(TransitionIcon),
    typography: markRaw(TypographyIcon),
};

const navigate = href => {
    router.go(`${site.value.base.replace(/\/$/, '')}${href}`);
};

const handleNavigate = card => {
    if (!card?.href) {
        return;
    }

    navigate(card.href);
};

const cards = computed(() => {
    const language = lang.value || 'zh-CN';

    return (Array.isArray(props.items) ? props.items : []).map(item => {
        const href = item.href || `/${language}/components/${item.slug}/`;

        return {
            ...item,
            href,
            tag: href ? 'button' : 'div',
            iconComponent: iconMap[item.slug] ?? null,
        };
    });
});
</script>
