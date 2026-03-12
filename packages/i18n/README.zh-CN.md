轻量级 i18n 运行时，提供语言链回退、命名空间、插值插件与可选的严格键类型推断。

## 安装

```bash
pnpm add @nild/i18n
```

## 快速上手

```ts
import I18n, { interpolator } from '@nild/i18n';

const i18n = new I18n({
    language: 'zh-CN',
    fallbackLanguages: ['en-US'],
    plugins: [interpolator()],
    locales: {
        'zh-CN': {
            greeting: '你好，{{user.name}}',
        },
        'en-US': {
            greeting: 'Hello, {{user.name}}',
            farewell: 'Goodbye, {{user.name}}',
        },
    },
});

i18n.t('greeting', { parameters: { user: { name: 'Nil' } } });
// → '你好，Nil'

// zh-CN 中没有 farewell，自动回退到 en-US
i18n.t('farewell', { parameters: { user: { name: 'Nil' } } });
// → 'Goodbye, Nil'
```

## 语言链与回退

查找一个 key 时，`@nild/i18n` 会按**语言链**依次尝试，直到找到第一个命中的结果：

1. 当前语言（如 `zh-CN`）
2. 当前语言的区域基础语言（如 `zh`），自动推导，无需手动配置
3. `fallbackLanguages` 中的语言（按顺序），每项同样会自动推导其区域基础语言

```ts
const i18n = new I18n({
    language: 'zh-CN',
    fallbackLanguages: ['en-US'],
    locales: {
        zh: { tip: '提示' },       // zh-CN 缺失时，优先命中 zh
        'en-US': { tip: 'Tip' },
    },
});

i18n.t('tip'); // → '提示'（来自 zh，而非 en-US）
```

`fallbackLanguages` 也支持按语言分组配置：

```ts
const i18n = new I18n({
    language: 'zh-CN',
    fallbackLanguages: {
        'zh-CN': ['zh-TW', 'en-US'],
        'en-GB': ['en-US'],
    },
    locales: { ... },
});
```

## 命名空间

通过 `namespace:key` 格式或 `context.namespace` 在多个命名空间之间组织翻译内容。

```ts
const i18n = new I18n({
    language: 'en-US',
    defaultNamespace: 'common',
    locales: {
        'en-US': [
            {
                namespace: 'common',
                locale: { title: 'Title', confirm: 'Confirm' },
            },
            {
                namespace: 'profile',
                locale: { greeting: 'Hello', bio: 'Bio' },
            },
        ],
    },
});

i18n.t('title');                           // 取 common:title（defaultNamespace）
i18n.t('common:title');                    // 显式指定命名空间
i18n.t('greeting', { namespace: 'profile' }); // 通过 context 指定
i18n.t('profile:greeting');               // key 内嵌命名空间
```

动态追加 locale：

```ts
i18n.addLocale({ language: 'zh-CN', namespace: 'common' }, {
    title: '标题',
    confirm: '确认',
});
```

`addLocale` 默认按 `localeWriteMode` 策略写入（`'merge'` 深合并 / `'replace'` 整块替换）。

## 严格键模式

设置 `strictKey: true` 后，`@nild/i18n` 会从 `locales` 中推导出全部合法 key 和 namespace，并在编译期对 `t()` 的参数进行约束。

```ts
const i18n = new I18n({
    strictKey: true,
    defaultNamespace: 'common',
    locales: {
        'en-US': [
            {
                namespace: 'common',
                locale: {
                    title: 'Title',
                    home: { subtitle: 'Subtitle' },
                },
            },
            {
                namespace: 'profile',
                locale: { greeting: 'Hello' },
            },
        ],
    },
});

// ✅ 合法
i18n.t('title');
i18n.t('home.subtitle');
i18n.t('common:title');
i18n.t('profile:greeting');
i18n.t('greeting', { namespace: 'profile' });

// ❌ 编译期报错
i18n.t('missing.key');
i18n.t('profile:missing');
i18n.t('title', { namespace: 'unknown' });
```

严格模式不增加任何运行时体积，仅通过类型推导生效。

## 插件

### 内置插值插件

`interpolator` 支持 `{{ token }}` 格式的参数替换，参数支持点路径访问。

```ts
import I18n, { interpolator } from '@nild/i18n';

const i18n = new I18n({
    plugins: [interpolator()],           // 使用默认 {{ }} 定界符
    // plugins: [interpolator({ openToken: '{', closeToken: '}' })],
    locales: {
        'en-US': {
            welcome: 'Hello, {{ user.name }}! You have {{ count }} messages.',
        },
    },
});

i18n.t('welcome', {
    parameters: {
        user: { name: 'Nil' },
        count: 3,
    },
});
// → 'Hello, Nil! You have 3 messages.'
```

参数缺失时保留占位符原文，不会静默替换为空字符串。

### 自定义插件

插件通过四个可选的生命周期钩子实现扩展：

| 钩子 | 时机 | 用途 |
| --- | --- | --- |
| `resolving(payload)` | 开始查找 key 之前 | 日志、修改查找上下文 |
| `missing(payload)` | key 在所有语言中均未找到 | 告警、上报缺失 |
| `resolved(payload)` | 查找结束（无论命中或缺失） | 统计、监控 |
| `apply(text, context)` | 命中后对翻译文本做后处理 | 插值、格式化 |

```ts
import type { Plugin } from '@nild/i18n';

const logger: Plugin = {
    name: 'logger',
    resolving(payload) {
        console.debug('[i18n] resolving', payload.key);
    },
    missing(payload) {
        console.warn('[i18n] missing key:', payload.key, 'in', payload.namespace);
    },
    resolved(payload) {
        if (payload.result !== undefined) {
            console.debug('[i18n] resolved', payload.key, '→', payload.result);
        }
    },
};
```

使用 `PluginCreator` 工厂函数封装带配置的插件：

```ts
import type { PluginCreator } from '@nild/i18n';

interface MyPluginOptions {
    prefix?: string;
}

const myPlugin: PluginCreator<MyPluginOptions, { extra?: string }> = ({ prefix = '' } = {}) => ({
    name: 'my-plugin',
    apply(text, context) {
        return prefix + text + (context.extra ?? '');
    },
});

const i18n = new I18n({
    plugins: [myPlugin({ prefix: '>>> ' })],
    locales: { ... },
});
```

`PluginCreator<Options, ContextExtension>` 的第二个类型参数声明该插件向 `t()` 的 `context` 追加的字段，TypeScript 会自动将其合并到 `t()` 的参数类型中。

## API 参考

### `new I18n(options)`

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `language` | `Language` | — | 当前语言 |
| `fallbackLanguages` | `Language[] \| Record<string, Language[]>` | `[]` | 回退语言，支持全局或按语言分组配置 |
| `namespace` | `string` | — | 实例默认命名空间 |
| `defaultNamespace` | `string` | `'__default'` | LocaleManager 的兜底命名空间 |
| `namespaceDelimiter` | `string` | `':'` | 命名空间分隔符 |
| `keyDelimiter` | `string` | `'.'` | key 路径分隔符 |
| `locales` | `SerializedLocales` | — | 初始 locale 数据（支持平铺或命名空间数组格式） |
| `localeWriteMode` | `'merge' \| 'replace'` | `'merge'` | `addLocale` 的写入策略 |
| `plugins` | `Plugin[]` | — | 插件列表，按注册顺序执行 |
| `strictKey` | `boolean` | `false` | 是否开启严格键推断 |

### 实例方法

| 方法 | 说明 |
| --- | --- |
| `t(key, context?)` | 翻译一个 key，缺失时返回原始 key |
| `setLanguage(language?)` | 设置当前语言 |
| `setNamespace(namespace?)` | 设置实例默认命名空间 |
| `setFallbackLanguages(fallbackLanguages?)` | 设置回退语言，同时清空语言链缓存 |
| `addLocale(context, locale)` | 动态追加 locale 数据，`context.language` 必填 |

### `ResolvePayload`

插件生命周期钩子收到的 payload：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 原始 key（含命名空间前缀，如 `common:title`） |
| `resolvedKey` | `string` | 去除命名空间后的 key（如 `title`） |
| `namespace` | `string` | 解析后使用的命名空间 |
| `languageTrail` | `Language[]` | 本次查找使用的语言链 |
| `context` | `Context` | 完整的 context 对象 |
| `language` | `Language?` | 命中的语言（仅 `resolved` 钩子在命中时存在） |
| `result` | `string?` | 最终翻译结果（仅 `resolved` 钩子在命中时存在） |
