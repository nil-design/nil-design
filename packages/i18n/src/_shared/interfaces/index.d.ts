/**
 * Standard language identifier type
 * Contains ISO 639-1 language codes and common regional identifiers
 */
export type Language =
    // English variants
    | 'en'
    | 'en-US'
    | 'en-GB'
    | 'en-CA'
    | 'en-AU'
    | 'en-NZ'
    | 'en-ZA'
    // Chinese variants
    | 'zh'
    | 'zh-CN'
    | 'zh-TW'
    | 'zh-HK'
    | 'zh-SG'
    // Japanese
    | 'ja'
    | 'ja-JP'
    // Korean
    | 'ko'
    | 'ko-KR'
    // French variants
    | 'fr'
    | 'fr-FR'
    | 'fr-CA'
    | 'fr-BE'
    | 'fr-CH'
    // German variants
    | 'de'
    | 'de-DE'
    | 'de-AT'
    | 'de-CH'
    // Spanish variants
    | 'es'
    | 'es-ES'
    | 'es-MX'
    | 'es-AR'
    | 'es-CO'
    | 'es-CL'
    | 'es-PE'
    | 'es-VE'
    // Portuguese variants
    | 'pt'
    | 'pt-BR'
    | 'pt-PT'
    // Italian
    | 'it'
    | 'it-IT'
    // Russian
    | 'ru'
    | 'ru-RU'
    // Arabic variants
    | 'ar'
    | 'ar-SA'
    | 'ar-EG'
    | 'ar-AE'
    // Dutch variants
    | 'nl'
    | 'nl-NL'
    | 'nl-BE'
    // Polish
    | 'pl'
    | 'pl-PL'
    // Turkish
    | 'tr'
    | 'tr-TR'
    // Swedish
    | 'sv'
    | 'sv-SE'
    // Norwegian
    | 'no'
    | 'no-NO'
    // Danish
    | 'da'
    | 'da-DK'
    // Finnish
    | 'fi'
    | 'fi-FI'
    // Greek
    | 'el'
    | 'el-GR'
    // Hebrew
    | 'he'
    | 'he-IL'
    // Hindi
    | 'hi'
    | 'hi-IN'
    // Thai
    | 'th'
    | 'th-TH'
    // Vietnamese
    | 'vi'
    | 'vi-VN'
    // Indonesian
    | 'id'
    | 'id-ID'
    // Malay
    | 'ms'
    | 'ms-MY'
    // Hungarian
    | 'hu'
    | 'hu-HU'
    // Czech
    | 'cs'
    | 'cs-CZ'
    // Slovak
    | 'sk'
    | 'sk-SK'
    // Romanian
    | 'ro'
    | 'ro-RO'
    // Bulgarian
    | 'bg'
    | 'bg-BG'
    // Croatian
    | 'hr'
    | 'hr-HR'
    // Slovenian
    | 'sl'
    | 'sl-SI'
    // Estonian
    | 'et'
    | 'et-EE'
    // Latvian
    | 'lv'
    | 'lv-LV'
    // Lithuanian
    | 'lt'
    | 'lt-LT'
    // Ukrainian
    | 'uk'
    | 'uk-UA';

export interface Locale {
    [key: string]: string | Locale;
}

export type UnknownContext = Record<string, unknown>;

export type Context<T extends UnknownContext = UnknownContext> = {
    language?: Language;
    namespace?: string;
} & T;

export type UnwrapContext<T> = T extends Context<infer U> ? U : never;
