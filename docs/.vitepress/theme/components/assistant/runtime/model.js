import { DEFAULT_MODEL_ID } from '../services/openrouter/config';

export const normalizeModelId = value => `${value || ''}`.trim() || DEFAULT_MODEL_ID;

export const getModelMode = value => (normalizeModelId(value) === DEFAULT_MODEL_ID ? 'free' : 'custom');
