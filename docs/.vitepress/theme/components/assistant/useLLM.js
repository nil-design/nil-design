import { isMobile } from '@nild/shared';
import { reactive, readonly, ref } from 'vue';

export const LLMStatus = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    READY: 'ready',
    GENERATING: 'generating',
    ERROR: 'error',
});

export const LLModel = Object.freeze({
    QWEN_2DOT5: {
        '1DOT5B': {
            id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
            name: 'Qwen2.5-1.5B',
            temperature: 0.4,
            maxTokens: 4096,
        },
        '3B': {
            id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',
            name: 'Qwen2.5-3B',
            temperature: 0.4,
            maxTokens: 4096,
        },
    },
    QWEN_2DOT5_CODER: {
        '1DOT5B': {
            id: 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC',
            name: 'Qwen2.5-Coder-1.5B',
            temperature: 0.3,
            maxTokens: 4096,
        },
        '3B': {
            id: 'Qwen2.5-Coder-3B-Instruct-q4f16_1-MLC',
            name: 'Qwen2.5-Coder-3B',
            temperature: 0.3,
            maxTokens: 4096,
        },
    },
});

export const DEFAULT_SYSTEM_PROMPT = `\
You are an assistant embedded in the Nil Design documentation site.

## What you can do
- Answer general React and frontend questions.
- Answer Nil Design questions when documentation context is provided.
- Explain general programming concepts.

## What you cannot do - tell the user immediately when asked
- You have NO internet access and CANNOT fetch any URLs or online content. If asked, respond: "I don't have internet access."

## Hard rules
1. If documentation context is provided, treat it as the authoritative Nil Design reference.
2. Never make up Nil Design component names, props, or APIs.
3. If the provided docs do not cover a Nil Design question, say the docs do not cover it.
4. Do not pretend to have capabilities you don't have.
5. Keep answers concise. Do not repeat yourself.`;

const copyMessages = messages => messages.map(({ role, content }) => ({ role, content }));

export function useLLM({
    model = isMobile() ? LLModel.QWEN_2DOT5_CODER['1DOT5B'] : LLModel.QWEN_2DOT5_CODER['3B'],
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    t,
} = {}) {
    const status = ref(LLMStatus.IDLE);
    const loading = ref({
        progress: 0,
        text: '',
    });
    const error = ref({
        message: '',
    });
    const messages = ref([]);

    let engine = null;
    let initTimer = null;
    let msgIdCounter = 0;

    const executeInit = async () => {
        status.value = LLMStatus.LOADING;
        loading.value.progress = 0;
        loading.value.text = '';
        error.value.message = '';

        try {
            const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
            const worker = new Worker(new URL('./llm.worker.js', import.meta.url), { type: 'module' });

            engine = await CreateWebWorkerMLCEngine(worker, model.id, {
                initProgressCallback: ({ progress, text }) => {
                    loading.value.progress = Math.min(100, Math.round(progress * 100));
                    loading.value.text = text?.replace(/\[.*?\]/g, '').trim() ?? '';
                },
            });
            status.value = LLMStatus.READY;
        } catch (err) {
            error.value.message = err?.message ?? 'Unknown error occurred.';
            status.value = LLMStatus.ERROR;
            engine = null;
        }
    };

    const init = (options = {}) => {
        const { delay = 0 } = options;

        if (status.value !== LLMStatus.IDLE) {
            return;
        }
        if (initTimer) {
            clearTimeout(initTimer);
            initTimer = null;
        }
        if (delay > 0) {
            initTimer = setTimeout(() => {
                executeInit();
                initTimer = null;
            }, delay);
        } else {
            executeInit();
        }
    };

    const retry = () => {
        status.value = LLMStatus.IDLE;
        init();
    };

    const interrupt = () => {
        if (initTimer) {
            clearTimeout(initTimer);
            initTimer = null;
        }

        engine?.interruptGenerate();
    };

    const clear = () => {
        messages.value = [];
    };

    const addSources = (messageId, sources = []) => {
        const targetMessage = messages.value.find(({ id, role }) => id === messageId && role === 'assistant');

        if (!targetMessage) {
            return;
        }

        targetMessage.sources = sources.map(source => ({
            title: source.title,
            path: source.path,
            score: source.score,
        }));
    };

    const generate = async (content, options = {}) => {
        const { systemPromptOverride } = options;

        if (status.value !== LLMStatus.READY) {
            return {
                assistantMessageId: null,
                completed: false,
            };
        }

        messages.value.push({ id: ++msgIdCounter, role: 'user', content });
        const assistantMessageId = ++msgIdCounter;

        messages.value.push({ id: assistantMessageId, role: 'assistant', content: '', sources: [] });
        status.value = LLMStatus.GENERATING;

        const nextIdx = messages.value.length - 1;
        const historyMessages = copyMessages(messages.value.slice(0, -1));
        let completed = false;

        try {
            const stream = await engine.chat.completions.create({
                messages: [{ role: 'system', content: systemPromptOverride || systemPrompt }].concat(historyMessages),
                stream: true,
                temperature: model.temperature,
                max_tokens: model.maxTokens,
            });

            let pendingDelta = '';
            let rafId = null;

            const flush = () => {
                if (pendingDelta) {
                    messages.value[nextIdx].content += pendingDelta;
                    pendingDelta = '';
                }
                rafId = null;
            };

            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta?.content ?? '';

                if (delta) {
                    pendingDelta += delta;

                    if (!rafId) {
                        rafId = requestAnimationFrame(flush);
                    }
                }
            }

            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            if (pendingDelta) {
                messages.value[nextIdx].content += pendingDelta;
            }

            completed = true;
        } catch (err) {
            if (!err?.message?.includes('interrupt')) {
                messages.value[nextIdx].content = t('assistant.error.msg');
            }
        } finally {
            if (status.value === LLMStatus.GENERATING) {
                status.value = LLMStatus.READY;
            }
        }

        return {
            assistantMessageId,
            completed,
        };
    };

    return readonly(
        reactive({
            model,
            status,
            loading,
            error,
            messages,
            init,
            retry,
            interrupt,
            clear,
            addSources,
            generate,
        }),
    );
}
