import { computed, reactive, readonly, unref, ref } from 'vue';
import { RAGActionType, RAGMessageType, RAGStatus } from './rag.shared.js';

const WORKER_DISPOSED_MESSAGE = 'RAG worker disposed.';

export function useRAG({ locale, base = '/', t } = {}) {
    const status = ref(RAGStatus.IDLE);
    const loading = ref({
        progress: 0,
        text: '',
    });
    const error = ref({
        message: '',
    });
    const currentLocale = computed(() => unref(locale) ?? 'zh-CN');

    let worker = null;
    let messageId = 0;
    let initPromise = null;
    let disposePromise = null;
    const pendingMessages = new Map();

    const getDefaultErrorMessage = () => t?.('assistant.rag.error') || 'Document retrieval failed.';
    const createDisposedError = () => new Error(WORKER_DISPOSED_MESSAGE);
    const isDisposedError = error => error?.message === WORKER_DISPOSED_MESSAGE;

    const rejectPendingMessages = reason => {
        for (const { reject } of pendingMessages.values()) {
            reject(reason);
        }

        pendingMessages.clear();
    };

    const resetError = () => {
        error.value.message = '';
    };

    const resetLoading = () => {
        loading.value.progress = 0;
        loading.value.text = '';
    };

    const resetState = () => {
        status.value = RAGStatus.IDLE;
        initPromise = null;
        resetError();
        resetLoading();
    };

    const setState = payload => {
        const {
            status: nextStatus,
            progress = loading.value.progress,
            text = loading.value.text,
            message = error.value.message,
        } = payload ?? {};

        if (!nextStatus) {
            return;
        }

        status.value = nextStatus;
        loading.value.progress = progress;
        loading.value.text = text;

        if (nextStatus === RAGStatus.ERROR) {
            error.value.message = message || getDefaultErrorMessage();
        } else {
            resetError();
        }
    };

    const handleMessage = event => {
        const message = event.data ?? {};

        if (message.type === RAGMessageType.STATUS) {
            setState(message.payload);

            return;
        }
        if (message.type !== RAGMessageType.RESPONSE && message.type !== RAGMessageType.ERROR) {
            return;
        }

        const pendingMessage = pendingMessages.get(message.id);

        if (!pendingMessage) {
            return;
        }

        pendingMessages.delete(message.id);

        if (message.type === RAGMessageType.ERROR) {
            pendingMessage.reject(new Error(message.error));
        } else {
            pendingMessage.resolve(message.payload);
        }
    };

    /**
     * tears down worker listeners and process so retry starts from a clean worker.
     */
    function teardownWorker(activeWorker) {
        if (!activeWorker) {
            return;
        }

        activeWorker.removeEventListener('message', handleMessage);
        activeWorker.removeEventListener('error', handleError);
        activeWorker.terminate();

        if (worker === activeWorker) {
            worker = null;
        }
    }

    function handleError(event) {
        if (disposePromise) {
            rejectPendingMessages(createDisposedError());

            return;
        }

        const errorMessage = event?.message ?? getDefaultErrorMessage();
        const workerError = new Error(errorMessage);

        setState({
            status: RAGStatus.ERROR,
            message: errorMessage,
        });

        initPromise = null;

        rejectPendingMessages(workerError);
        teardownWorker(worker);
    }

    const createWorker = () => {
        if (worker) {
            return worker;
        }

        worker = new Worker(new URL('./rag.worker.js', import.meta.url), { type: 'module' });
        worker.addEventListener('message', handleMessage);
        worker.addEventListener('error', handleError);

        return worker;
    };

    const postMessage = (activeWorker, type, payload = {}) => {
        const id = ++messageId;

        return new Promise((resolve, reject) => {
            pendingMessages.set(id, { resolve, reject });

            try {
                activeWorker.postMessage({ id, type, payload });
            } catch (error) {
                pendingMessages.delete(id);
                reject(error);
            }
        });
    };

    const waitForDispose = async () => {
        if (disposePromise) {
            await disposePromise;
        }
    };

    const init = async () => {
        await waitForDispose();

        if (status.value === RAGStatus.READY) {
            return;
        }
        if (status.value === RAGStatus.LOADING && initPromise) {
            return initPromise;
        }

        setState({
            status: RAGStatus.LOADING,
        });

        initPromise = postMessage(createWorker(), RAGActionType.INIT, {
            locale: currentLocale.value,
            base: unref(base),
        })
            .catch(error => {
                if (isDisposedError(error)) {
                    throw error;
                }

                teardownWorker(worker);
                setState({
                    status: RAGStatus.ERROR,
                    message: error?.message,
                });
                throw error;
            })
            .finally(() => {
                initPromise = null;
            });

        return initPromise;
    };

    const retrieve = async query => {
        await waitForDispose();

        const emptyResult = {
            hit: false,
            topScore: 0,
            sources: [],
        };

        if (status.value !== RAGStatus.READY) {
            return emptyResult;
        }

        return postMessage(createWorker(), RAGActionType.RETRIEVE, { query }).catch(error => {
            if (isDisposedError(error)) {
                return emptyResult;
            }
            setState({
                status: RAGStatus.ERROR,
                message: error?.message,
            });

            return emptyResult;
        });
    };

    const dispose = async () => {
        if (disposePromise) {
            return disposePromise;
        }

        if (!worker) {
            resetState();

            return;
        }

        const activeWorker = worker;
        const teardownReason = createDisposedError();

        resetState();

        disposePromise = postMessage(activeWorker, RAGActionType.DISPOSE)
            .catch(() => {
                /**
                 * ignore dispose errors while tearing down the worker.
                 */
            })
            .finally(() => {
                rejectPendingMessages(teardownReason);
                teardownWorker(activeWorker);
                disposePromise = null;
            });

        return disposePromise;
    };

    return readonly(
        reactive({
            status,
            loading,
            error,
            init,
            retrieve,
            dispose,
        }),
    );
}
