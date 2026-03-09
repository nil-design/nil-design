<template>
    <div :class="['flex', role === 'user' ? 'justify-end' : 'justify-start']">
        <div
            :class="[
                'max-w-[85%] px-3 py-2 rounded-xl text-md',
                'leading-relaxed whitespace-pre-wrap break-words',
                role === 'user' ? 'bg-brand text-on-brand' : 'bg-container text-body',
            ]"
        >
            {{ content }}<span v-if="streaming" class="inline-block ml-px animate-blink">▋</span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    role: { type: String, required: true },
    content: { type: String, required: true },
    streaming: { type: Boolean, default: false },
});
</script>
