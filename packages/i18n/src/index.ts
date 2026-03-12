import I18n from './I18n';
import { interpolator } from './plugins';

export { interpolator };
export type { I18nOptions, Plugin, PluginFactory, ResolvePayload } from './I18n';
export type { Language, Locale, SerializedLocales, TranslationContext } from './interfaces';
export default I18n;
