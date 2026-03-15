<template>
    <div class="h-full flex flex-col">
        <div
            :class="[
                'flex-shrink-0',
                'px-4 h-12 border-b border-muted',
                'flex items-center justify-between gap-3',
                'cursor-move select-none',
            ]"
            @mousedown="$emit('header-mousedown', $event)"
        >
            <div class="flex items-center gap-2 min-w-0">
                <span
                    :class="['w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300', statusDotClass]"
                ></span>
                <span class="text-md font-semibold text-main truncate">{{ t('assistant.title') }}</span>
                <span class="flex-shrink-0 px-2 py-1 rounded text-xs bg-muted text-muted leading-none">{{
                    llm.model.name
                }}</span>
            </div>
            <button
                :class="[
                    'w-6 h-6',
                    'flex-shrink-0 flex items-center justify-center',
                    'rounded-md text-main',
                    'transition-colors cursor-pointer',
                    'hover:bg-muted-hover',
                ]"
                @mousedown.stop
                @click.stop="$emit('close')"
            >
                <XIcon class="size-4" />
            </button>
        </div>
        <div ref="messageListRef" class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0 bg-page">
            <div v-if="showLoading" class="h-full flex flex-col items-center justify-center gap-4 px-4">
                <SparklesIcon class="text-brand animate-sparkle size-7" />
                <div class="w-full flex flex-col gap-1.5">
                    <div class="w-full h-1 bg-muted rounded-full overflow-hidden">
                        <div
                            class="h-full bg-brand rounded-full transition-all duration-300 ease-out"
                            :style="{ width: `${activeLoading.progress}%` }"
                        ></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-sm text-subtle truncate max-w-[85%]">
                            {{ activeLoadingText }}
                        </p>
                        <p class="text-sm text-subtle flex-shrink-0">{{ activeLoading.progress }}%</p>
                    </div>
                </div>
                <p class="text-sm text-subtle text-center">{{ activeLoadingHint }}</p>
            </div>
            <div v-else-if="showError" class="h-full flex flex-col items-center justify-center gap-3 px-4">
                <ExclamationCircleIcon class="text-subtle size-7 opacity-50" />
                <p class="text-md text-subtle font-medium">{{ errorTitle }}</p>
                <p v-if="errorMessage" class="text-sm text-subtle text-center leading-relaxed">
                    {{ errorMessage }}
                </p>
                <button
                    :class="[
                        'mt-1 px-4 h-8',
                        'rounded-lg bg-brand text-brand-contrast text-sm',
                        'cursor-pointer transition-opacity',
                        'hover:bg-brand-hover',
                    ]"
                    @click="$emit('retry')"
                >
                    {{ t('assistant.error.retry') }}
                </button>
            </div>
            <div v-else-if="llm.messages.length === 0" class="h-full flex flex-col items-center justify-center gap-3">
                <ChatBubbleIcon class="text-brand size-9" />
                <p class="text-md text-subtle text-center">{{ t('assistant.empty') }}</p>
            </div>
            <template v-else>
                <Message
                    v-for="msg in llm.messages"
                    :key="msg.id"
                    :role="msg.role"
                    :content="msg.content"
                    :sources="msg.sources"
                    :streaming="llm.status === LLMStatus.GENERATING && msg === lastMessage"
                />
            </template>
        </div>
        <slot name="input" />
    </div>
</template>

<script setup>
import { computed, inject, nextTick, ref, watch } from 'vue';
import ChatBubbleIcon from '../../icons/ChatBubble.vue';
import ExclamationCircleIcon from '../../icons/ExclamationCircle.vue';
import SparklesIcon from '../../icons/Sparkles.vue';
import XIcon from '../../icons/X.vue';
import Message from './Message.vue';
import { RAGStatus } from './rag.shared.js';
import { LLMStatus } from './useLLM.js';

defineEmits(['close', 'retry', 'header-mousedown']);

const { llm, rag } = defineProps({
    llm: { type: Object, required: true },
    rag: { type: Object, required: true },
});
const t = inject('assistant:t');
const messageListRef = ref(null);
const llmLoading = computed(() => llm.status === LLMStatus.LOADING);
const lastMessage = computed(() => llm.messages[llm.messages.length - 1] ?? null);
const showLoading = computed(
    () => llmLoading.value || (llm.status === LLMStatus.READY && rag.status === RAGStatus.LOADING),
);

const statusDotClass = computed(() => {
    if (showLoading.value) {
        return 'bg-muted-hover animate-pulse';
    }

    switch (llm.status) {
        case LLMStatus.READY:
            return 'bg-brand';
        case LLMStatus.GENERATING:
            return 'bg-brand animate-pulse';
        default:
            return 'bg-muted';
    }
});

const activeLoading = computed(() => (llmLoading.value ? llm.loading : rag.loading));

const activeLoadingText = computed(() => {
    if (llmLoading.value) {
        return llm.loading.text || t('assistant.loading.init');
    }

    return rag.loading.text || t('assistant.rag.init');
});

const activeLoadingHint = computed(() => {
    return t('assistant.loading.hint');
});

const showError = computed(() => {
    return llm.status === LLMStatus.ERROR || rag.status === RAGStatus.ERROR;
});

const errorTitle = computed(() => {
    return llm.status === LLMStatus.ERROR ? t('assistant.error.title') : t('assistant.rag.error.title');
});

const errorMessage = computed(() => {
    return llm.status === LLMStatus.ERROR ? llm.error.message : rag.error.message;
});

const scrollToBottom = () => {
    const el = messageListRef.value;

    if (el) {
        el.scrollTop = el.scrollHeight;
    }
};

const isNearBottom = () => {
    const el = messageListRef.value;

    if (!el) {
        return false;
    }

    return el.scrollHeight - el.scrollTop - el.clientHeight < 20;
};

watch(() => llm.messages.length, scrollToBottom, { flush: 'post' });

watch(
    () => lastMessage.value?.content,
    () => {
        if (llm.status !== LLMStatus.GENERATING || !isNearBottom()) {
            return;
        }

        nextTick(scrollToBottom);
    },
);

watch(
    () => lastMessage.value?.sources?.length ?? 0,
    () => {
        if (!isNearBottom()) {
            return;
        }

        nextTick(scrollToBottom);
    },
    { flush: 'post' },
);
</script>
