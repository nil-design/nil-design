<template>
    <div class="h-full flex flex-col">
        <div
            :class="[
                'flex-shrink-0',
                'px-4 h-12 border-b border-split',
                'flex items-center justify-between gap-3',
                'cursor-move select-none',
            ]"
            @mousedown="$emit('header-mousedown', $event)"
        >
            <div class="flex items-center gap-2 min-w-0">
                <span
                    :class="['w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300', statusDotClass]"
                ></span>
                <span class="text-md font-semibold text-body truncate">{{ t('assistant.title') }}</span>
                <span class="flex-shrink-0 px-2 py-1 rounded text-xs bg-container text-subtle leading-none">{{
                    llm.model.name
                }}</span>
            </div>
            <button
                :class="[
                    'w-6 h-6',
                    'flex-shrink-0 flex items-center justify-center',
                    'rounded-md text-subtle',
                    'transition-colors cursor-pointer',
                    'hover:text-body hover:bg-surface-hover',
                ]"
                @mousedown.stop
                @click.stop="$emit('close')"
            >
                <XIcon class="size-4" />
            </button>
        </div>
        <div ref="messageListRef" class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
            <div
                v-if="llm.status === LLMStatus.LOADING"
                class="h-full flex flex-col items-center justify-center gap-4 px-4"
            >
                <SparklesIcon class="text-brand animate-sparkle size-7 opacity-70" />
                <div class="w-full flex flex-col gap-1.5">
                    <div class="w-full h-1 bg-fill rounded-full overflow-hidden">
                        <div
                            class="h-full bg-brand rounded-full transition-all duration-300 ease-out"
                            :style="{ width: `${llm.loading.progress}%` }"
                        ></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <p class="text-sm text-subtle truncate max-w-[85%]">
                            {{ llm.loading.text || t('assistant.loading.init') }}
                        </p>
                        <p class="text-sm text-subtle flex-shrink-0">{{ llm.loading.progress }}%</p>
                    </div>
                </div>
                <p class="text-sm text-subtle text-center">{{ t('assistant.loading.hint') }}</p>
            </div>
            <div
                v-else-if="llm.status === LLMStatus.ERROR"
                class="h-full flex flex-col items-center justify-center gap-3 px-4"
            >
                <ExclamationCircleIcon class="text-subtle size-7 opacity-50" />
                <p class="text-md text-muted font-medium">{{ t('assistant.error.title') }}</p>
                <p v-if="llm.error.message" class="text-sm text-subtle text-center leading-relaxed">
                    {{ llm.error.message }}
                </p>
                <button
                    :class="[
                        'mt-1 px-4 h-8',
                        'rounded-lg bg-brand text-on-brand text-sm',
                        'cursor-pointer transition-opacity',
                        'hover:bg-brand-hover',
                    ]"
                    @click="$emit('retry')"
                >
                    {{ t('assistant.error.retry') }}
                </button>
            </div>
            <div v-else-if="llm.messages.length === 0" class="h-full flex flex-col items-center justify-center gap-3">
                <ChatBubbleIcon class="text-brand size-9 opacity-25" />
                <p class="text-md text-subtle text-center">{{ t('assistant.empty') }}</p>
            </div>
            <template v-else>
                <Message
                    v-for="msg in llm.messages"
                    :key="msg.id"
                    :role="msg.role"
                    :content="msg.content"
                    :streaming="llm.status === LLMStatus.GENERATING && msg === llm.messages[llm.messages.length - 1]"
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
import { LLMStatus } from './useLLM.js';
import Message from './Message.vue';

defineEmits(['close', 'retry', 'header-mousedown']);

/**
 * llm is a reactive obj
 */
const { llm } = defineProps({
    llm: { type: Object, required: true },
});
const t = inject('assistant:t');
const messageListRef = ref(null);

const statusDotClass = computed(() => {
    switch (llm.status) {
        case LLMStatus.READY:
            return 'bg-brand';
        case LLMStatus.GENERATING:
            return 'bg-brand animate-pulse';
        case LLMStatus.LOADING:
            return 'bg-fill-hover animate-pulse';
        default:
            return 'bg-fill';
    }
});

const scrollToBottom = () => {
    const el = messageListRef.value;
    if (el) el.scrollTop = el.scrollHeight;
};

/**
 * scroll to bottom when new messages are added
 */
watch(
    () => llm.messages.length,
    () => scrollToBottom(),
    { flush: 'post' },
);

/**
 * during streaming, check if at bottom BEFORE new content renders (flush: 'pre'),
 * then scroll to new bottom AFTER DOM update via nextTick
 */
watch(
    () => llm.messages[llm.messages.length - 1]?.content,
    () => {
        if (llm.status !== LLMStatus.GENERATING) return;
        const el = messageListRef.value;
        if (!el) return;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) nextTick(scrollToBottom);
    },
);
</script>
