import I18n from './I18n';
import { interpolator } from './plugins';

export { interpolator };
export type { I18nContext, I18nKey, I18nNamespace, I18nOptions } from './I18n';
export type {
    Plugin,
    PluginContext,
    PluginCreator,
    PluginManagerOptions,
    ResolvePayload,
    ResolveResultPayload,
} from './PluginManager';
export default I18n;
