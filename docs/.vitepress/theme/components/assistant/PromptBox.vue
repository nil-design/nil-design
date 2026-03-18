<template>
    <div class="shrink-0 bg-page border-t border-muted flex gap-2 px-3 py-2.5">
        <textarea
            ref="textareaRef"
            :value="modelValue"
            rows="1"
            :class="[
                'flex-1 resize-none bg-transparent outline-none border-0 leading-5.5',
                'placeholder:text-subtle text-main text-md',
                'max-h-28 overflow-y-auto',
                disabled ? 'cursor-not-allowed opacity-60' : '',
            ]"
            :placeholder="placeholder"
            :disabled="disabled"
            @input="handleInput"
            @keydown.enter.exact.prevent="handleSend"
        />
        <button
            :class="[
                'self-end shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                'bg-brand text-brand-contrast transition-[opacity,background-color]',
                'enabled:hover:bg-brand-hover',
                'enabled:active:bg-brand-active',
                sendable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
            ]"
            :disabled="!sendable"
            @click="handleSend"
        >
            <SendIcon class="size-[15px]" />
        </button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import SendIcon from '../../icons/send.svg';

const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Message…' },
    disabled: { type: Boolean, default: false },
    sendable: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'send']);

const textareaRef = ref(null);

const autoResize = () => {
    const el = textareaRef.value;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
};

const handleInput = e => {
    emit('update:modelValue', e.target.value);
    autoResize();
};

const handleSend = () => emit('send');

/**
 * when value is cleared, reset the textarea height
 */
watch(
    () => props.modelValue,
    val => {
        if (!val && textareaRef.value) textareaRef.value.style.height = 'auto';
    },
);
</script>
