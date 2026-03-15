<template>
    <Teleport v-if="mounted" to="body">
        <div
            :class="[
                'vp-raw fixed z-[9999] overflow-hidden text-brand-contrast font-nd shadow-2xl rounded-xl',
                dragging ? 'transition-none' : 'transition-[width,height,top,left,border-radius]',
            ]"
            :style="{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${containerSize.w}px`,
                height: `${containerSize.h}px`,
                ...(!opened ? { borderRadius: '50%' } : {}),
            }"
        >
            <Transition
                enter-active-class="transition-opacity ease-out delay-150"
                leave-active-class="transition-opacity ease-in"
                leave-to-class="opacity-0"
                @after-leave="llm.clear"
            >
                <div
                    v-if="opened"
                    class="absolute inset-x-0 top-0 bg-subtle text-main flex flex-col"
                    :style="{ bottom: `${triggerSize.h}px` }"
                >
                    <Dialog
                        :llm="llm"
                        :rag="rag"
                        @header-mousedown="onDragStart"
                        @close="toggleOpen"
                        @retry="handleRetry"
                    >
                        <template #input>
                            <PromptBox
                                v-model="promptValue"
                                :placeholder="promptPlaceholder"
                                :disabled="!promptEnabled"
                                :sendable="promptSendable"
                                @send="sendMessage"
                            />
                        </template>
                    </Dialog>
                </div>
            </Transition>
            <div
                :class="[
                    'absolute inset-x-0 bottom-0',
                    'flex items-center justify-center',
                    'bg-brand transition-colors cursor-pointer select-none',
                    'hover:bg-brand-hover',
                    'active:bg-brand-active',
                ]"
                :style="{ height: `${triggerSize.h}px` }"
                @mousedown="onDragStart"
            >
                <ChatIcon class="size-5" />
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { useData } from 'vitepress';
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue';
import i18n from '../../../../../locales/index.js';
import ChatIcon from '../../icons/Chat.vue';
import Dialog from './Dialog.vue';
import PromptBox from './PromptBox.vue';
import { createRAGPrompt, RAGStatus } from './rag.shared.js';
import { useDraggable } from './useDraggable.js';
import { DEFAULT_SYSTEM_PROMPT, LLMStatus, useLLM } from './useLLM.js';
import { useRAG } from './useRAG.js';

const props = defineProps({
    safePadding: {
        type: Number,
        default: 16,
    },
    triggerSize: {
        type: Object,
        default: () => ({ w: 48, h: 48 }),
    },
    dialogSize: {
        type: Object,
        default: () => ({ w: 320, h: 528 }),
    },
});

const { lang, site } = useData();
const t = key => i18n.t(key, { language: lang.value });

provide('assistant:t', t);

const llm = useLLM({ t });
const rag = useRAG({
    locale: lang,
    base: computed(() => site.value.base || '/'),
    t,
});

const promptValue = ref('');
const promptEnabled = computed(() => llm.status === LLMStatus.READY && rag.status === RAGStatus.READY);
const promptSendable = computed(() => promptEnabled.value && promptValue.value.trim().length > 0);
const promptPlaceholder = computed(
    () =>
        ({
            [LLMStatus.LOADING]: t('assistant.input.loading'),
            [LLMStatus.GENERATING]: t('assistant.input.generating'),
            [LLMStatus.ERROR]: t('assistant.input.error'),
        })[llm.status] ?? (rag.status === RAGStatus.LOADING ? t('assistant.input.loading') : t('assistant.input')),
);

const mounted = ref(false);
const opened = ref(false);

const position = ref({ x: 0, y: 0 });
const viewportSize = ref({ w: 0, h: 0 });
const containerSize = computed(() => (opened.value ? props.dialogSize : props.triggerSize));

let resizeRaf = null;

const clampPosition = (x, y, targetOpened) => {
    const size = targetOpened ? props.dialogSize : props.triggerSize;

    return {
        x: Math.max(props.safePadding, Math.min(x, viewportSize.value.w - size.w - props.safePadding)),
        y: Math.max(props.safePadding, Math.min(y, viewportSize.value.h - size.h - props.safePadding)),
    };
};

const toggleOpen = () => {
    const nextOpened = !opened.value;
    let originX, originY, targetX, targetY;

    if (opened.value) {
        originX = position.value.x + props.dialogSize.w / 2;
        originY = position.value.y + props.dialogSize.h - props.triggerSize.h / 2;
    } else {
        originX = position.value.x + props.triggerSize.w / 2;
        originY = position.value.y + props.triggerSize.h / 2;
    }
    if (nextOpened) {
        targetX = originX - props.dialogSize.w / 2;
        targetY = originY - props.dialogSize.h + props.triggerSize.h / 2;
    } else {
        targetX = originX - props.triggerSize.w / 2;
        targetY = originY - props.triggerSize.h / 2;
    }

    position.value = clampPosition(targetX, targetY, nextOpened);
    opened.value = nextOpened;
};

const { dragging, onDragStart } = useDraggable({
    position,
    clamp: (x, y) => clampPosition(x, y, opened.value),
    onClick: toggleOpen,
});

const initRagIfNeeded = () => {
    if (!(opened.value && llm.status === LLMStatus.READY && [RAGStatus.IDLE, RAGStatus.ERROR].includes(rag.status))) {
        return;
    }

    rag.init().catch(() => {
        // RAG silently degrades to the base LLM flow.
    });
};

const handleRetry = () => {
    if (llm.status === LLMStatus.ERROR) {
        llm.retry();

        return;
    }
    if (rag.status === RAGStatus.ERROR) {
        initRagIfNeeded();
    }
};

const sendMessage = async () => {
    const content = promptValue.value.trim();

    if (!content || !promptSendable.value) {
        return;
    }

    promptValue.value = '';

    const ragResult = rag.status === RAGStatus.READY ? await rag.retrieve(content) : null;
    const systemPromptOverride = ragResult?.hit
        ? createRAGPrompt({
              basePrompt: DEFAULT_SYSTEM_PROMPT,
              topChunk: ragResult.topChunk,
          })
        : null;
    const { assistantMessageId, completed } = await llm.generate(
        content,
        systemPromptOverride
            ? {
                  systemPromptOverride,
              }
            : {},
    );

    if (completed && assistantMessageId && ragResult?.hit && ragResult.sources.length > 0) {
        llm.addSources(assistantMessageId, ragResult.sources);
    }
};

const handleWindowResize = () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
        viewportSize.value = { w: window.innerWidth, h: window.innerHeight };
        position.value = clampPosition(position.value.x, position.value.y, opened.value);
        resizeRaf = null;
    });
};

watch(opened, open => {
    if (open) {
        if (llm.status === LLMStatus.IDLE) {
            llm.init({ delay: 350 });
        } else {
            initRagIfNeeded();
        }
    } else {
        /**
         * 1. interrupt the generation
         * 2. cancel the initialization in 350ms
         */
        llm.interrupt();
    }
});

watch(
    () => llm.status,
    nextStatus => {
        if (nextStatus === LLMStatus.READY) {
            initRagIfNeeded();
        }
    },
);

watch(
    () => lang.value,
    async () => {
        await rag.dispose();
        initRagIfNeeded();
    },
);

onMounted(() => {
    mounted.value = true;
    viewportSize.value = { w: window.innerWidth, h: window.innerHeight };
    position.value = clampPosition(
        viewportSize.value.w - props.triggerSize.w - props.safePadding * 2,
        viewportSize.value.h - props.triggerSize.h - props.safePadding * 2,
        false,
    );
    window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleWindowResize);

    if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
    }
    if (llm.status === LLMStatus.GENERATING) {
        llm.interrupt();
    }

    rag.dispose();
});
</script>
