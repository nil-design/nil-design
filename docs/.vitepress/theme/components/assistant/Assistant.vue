<template>
    <Teleport v-if="mounted" to="body">
        <div
            ref="containerRef"
            :class="[
                'vp-raw fixed z-[9999] overflow-hidden text-on-brand font-nd shadow-2xl',
                dragging ? 'transition-none' : 'transition-[width,height,top,left,border-radius]',
            ]"
            :style="{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${containerSize.w}px`,
                height: `${containerSize.h}px`,
                /**
                 * why not use rounded-full class?
                 * tw's rounded-full is implemented by `border-radius: 9999px;` which is not good for transition animation.
                 */
                borderRadius: opened ? '16px' : '50%',
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
                    class="absolute inset-x-0 top-0 bg-panel text-body flex flex-col"
                    :style="{ bottom: `${triggerSize.h}px` }"
                >
                    <Dialog :llm="llm" @header-mousedown="onDragStart" @close="toggleOpen" @retry="llm.retry">
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
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { useData } from 'vitepress';
import ChatIcon from '../../icons/Chat.vue';
import i18n from '../../../../../locales/index.js';
import Dialog from './Dialog.vue';
import PromptBox from './PromptBox.vue';
import { useDraggable } from './useDraggable.js';
import { LLMStatus, useLLM } from './useLLM.js';

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

const { lang } = useData();
const t = key => i18n.t(key, { language: lang.value });

provide('assistant:t', t);

const llm = useLLM({ t });

const promptValue = ref('');
const promptEnabled = computed(() => llm.status === LLMStatus.READY);
const promptSendable = computed(() => promptEnabled.value && promptValue.value.trim().length > 0);
const promptPlaceholder = computed(
    () =>
        ({
            [LLMStatus.LOADING]: t('assistant.input.loading'),
            [LLMStatus.GENERATING]: t('assistant.input.generating'),
            [LLMStatus.ERROR]: t('assistant.input.error'),
        })[llm.status] ?? t('assistant.input'),
);

const mounted = ref(false);
const opened = ref(false);

const containerRef = ref(null);

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
    let originX, originY;
    let targetX, targetY;

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

const sendMessage = async () => {
    const content = promptValue.value.trim();
    if (!content || !promptSendable.value) return;
    promptValue.value = '';
    await llm.generate(content);
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
        }
    } else {
        /**
         * 1. interrupt the generation
         * 2. cancel the initialization in 350ms
         */
        llm.interrupt();
    }
});

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
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    if (llm.status === LLMStatus.GENERATING) llm.interrupt();
});
</script>
