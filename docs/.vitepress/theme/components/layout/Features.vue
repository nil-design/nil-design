<template>
    <div v-if="features.length" :class="['custom-features vp-raw relative z-1 px-6', 'sm:px-12 lg:px-16']">
        <div class="mx-auto max-w-[1152px]">
            <div class="-m-2 flex flex-wrap">
                <div v-for="feature in features" :key="feature.title" :class="['w-full p-2', itemCls]">
                    <VPLink
                        :class="[
                            'custom-feature block h-full rounded-xl bg-subtle shadow-sm',
                            'transition-[background-color,box-shadow,translate]',
                            'hover:translate-y-[-2px] hover:shadow-md',
                        ]"
                        :href="feature.link"
                        :rel="feature.rel"
                        :target="feature.target"
                        :no-icon="true"
                        :tag="feature.link ? 'a' : 'div'"
                    >
                        <article class="flex h-full flex-col p-[26px]">
                            <div
                                v-if="feature.iconComponent || feature.inlineIcon"
                                :class="[
                                    'mb-5 flex size-12 items-center justify-center',
                                    'rounded-2xl border border-subtle bg-muted',
                                    '[&_svg]:block [&_svg]:size-7',
                                ]"
                                aria-hidden="true"
                            >
                                <component :is="feature.iconComponent" v-if="feature.iconComponent" />
                                <div v-else-if="feature.inlineIcon" v-html="feature.inlineIcon"></div>
                            </div>
                            <h2 class="text-md leading-6 font-semibold tracking-[-0.02em]" v-html="feature.title"></h2>
                            <p
                                v-if="feature.details"
                                class="grow pt-2 text-md leading-6 font-medium text-muted"
                                v-html="feature.details"
                            ></p>

                            <div v-if="feature.linkText" class="pt-2">
                                <p class="flex items-center text-sm font-medium text-brand">
                                    {{ feature.linkText }} <span class="vpi-arrow-right ml-1.5" />
                                </p>
                            </div>
                        </article>
                    </VPLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useData } from 'vitepress';
import { VPLink } from 'vitepress/theme';
import { computed, markRaw } from 'vue';
import ComponentsIcon from '../../icons/components.svg';
import HooksIcon from '../../icons/hooks.svg';
import MaterialsI18nIcon from '../../icons/materials-i18n.svg';

const { frontmatter } = useData();

const iconMap = {
    components: markRaw(ComponentsIcon),
    hooks: markRaw(HooksIcon),
    'materials-i18n': markRaw(MaterialsI18nIcon),
};

const features = computed(() =>
    (frontmatter.value.customFeatures ?? []).map(feature => {
        const icon = feature.icon;
        const iconName =
            typeof icon === 'object'
                ? (icon?.name ?? icon?.src)
                : typeof icon === 'string' && iconMap[icon]
                  ? icon
                  : '';
        const iconComponent = iconName ? (iconMap[iconName] ?? null) : null;

        return {
            ...feature,
            iconComponent,
            inlineIcon: typeof icon === 'string' && !iconComponent ? icon : '',
        };
    }),
);

const itemCls = computed(() => {
    const length = features.value.length;

    if (length === 2) {
        return 'sm:w-1/2 md:w-1/2';
    }

    if (length === 3) {
        return 'md:w-1/3';
    }

    if (length > 3 && length % 3 === 0) {
        return 'sm:w-1/2 md:w-1/3';
    }

    if (length > 3) {
        return 'sm:w-1/2 md:w-1/2 lg:w-1/4';
    }

    return '';
});
</script>
