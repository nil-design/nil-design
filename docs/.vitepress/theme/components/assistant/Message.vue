<template>
    <div :class="['flex', role === 'user' ? 'justify-end' : 'justify-start']">
        <div class="max-w-[85%] flex flex-col gap-2">
            <div
                :class="[
                    'px-3 py-2 rounded-xl text-md',
                    'leading-relaxed whitespace-pre-wrap break-words',
                    role === 'user' ? 'bg-brand text-brand-contrast' : 'bg-subtle text-main',
                ]"
            >
                {{ content }}<span v-if="streaming" class="inline-block ml-px animate-blink">|</span>
            </div>
            <div v-if="sourceable" class="px-1 flex flex-col gap-1">
                <button
                    v-for="(source, index) in sources"
                    :key="source.path"
                    :class="[
                        'text-left text-xs leading-5 text-muted',
                        'underline decoration-transparent underline-offset-2',
                        'cursor-pointer transition-[opacity,text-decoration-color]',
                        'hover:decoration-current hover:text-brand-hover',
                    ]"
                    @click="navigate(source.path)"
                >
                    <span class="text-brand">[{{ index + 1 }}]. </span>
                    <span>{{ source.title }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useData, useRouter } from 'vitepress';

const props = defineProps({
    role: { type: String, required: true },
    content: { type: String, required: true },
    sources: { type: Array, default: () => [] },
    streaming: { type: Boolean, default: false },
});

const { site } = useData();
const router = useRouter();

const sourceable = computed(() => props.role === 'assistant' && props.sources.length > 0);

const navigate = path => {
    router.go(`${site.value.base.replace(/\/$/, '')}${path}`);
};
</script>
