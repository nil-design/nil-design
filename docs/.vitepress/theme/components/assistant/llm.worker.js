import { MLCEngine, WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const engine = new MLCEngine();
const handler = new WebWorkerMLCEngineHandler(engine);

self.onmessage = msg => handler.onmessage(msg);
