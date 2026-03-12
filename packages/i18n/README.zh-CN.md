轻量级 i18n 运行时，提供语言链回退、命名空间、插值插件与可选的严格键类型推断。

## 快速上手

```ts
import I18n, { interpolator } from '@nild/i18n';

const i18n = new I18n({
    language: 'zh-CN',
    fallbackLanguages: ['en-US'],
    plugins: [interpolator()],
    locales: {
        'zh-CN': { __default: { greeting: '你好，{{user.name}}' } },
        'en-US': { __default: {
            greeting: 'Hello, {{user.name}}',
            farewell: 'Goodbye, {{user.name}}',
        }},
    },
});

i18n.t('greeting', { parameters: { user: { name: 'Nil' } } }); // → '你好，Nil'
i18n.t('farewell', { parameters: { user: { name: 'Nil' } } }); // → 'Goodbye, Nil'（回退到 en-US）
```

## 语言链与回退

查找 key 时按**语言链**依次尝试：当前语言 → 区域基础语言（自动推导，如 `zh-CN` → `zh`）→ `fallbackLanguages`（每项同样推导基础语言）。

```ts
const i18n = new I18n({
    language: 'zh-CN',
    fallbackLanguages: ['en-US'],
    locales: {
        zh: { __default: { tip: '提示' } }, // zh-CN 缺失时，优先命中 zh 而非 en-US
        'en-US': { __default: { tip: 'Tip' } },
    },
});

i18n.t('tip'); // → '提示'
```

`fallbackLanguages` 也支持按语言分组：

```ts
fallbackLanguages: {
    'zh-CN': ['zh-TW', 'en-US'],
    'en-GB': ['en-US'],
}
```

## 命名空间

通过 `namespace:key` 格式或 `context.namespace` 在多个命名空间之间组织翻译内容。

```ts
const i18n = new I18n({
    language: 'en-US',
    defaultNamespace: 'common',
    locales: {
        'en-US': {
            common: { title: 'Title' },
            profile: { greeting: 'Hello' },
        },
    },
});

i18n.t('title');                               // common:title（defaultNamespace）
i18n.t('profile:greeting');                    // key 内嵌命名空间
i18n.t('greeting', { namespace: 'profile' });  // context 指定命名空间
```

动态追加 locale：

```ts
i18n.addLocale({ language: 'zh-CN', namespace: 'common' }, { title: '标题' });
```

## 严格模式

`strict: true` 时，从 `locales` 推导出全部合法 key 和 namespace，在编译期约束 `t()` 参数，不增加运行时体积。

- 裸 key 默认只允许来自 `defaultNamespace`
- 传入 `context.namespace` 后，裸 key 收窄为该命名空间下的 key
- `namespace:key` 格式始终按 key 内的命名空间校验

```ts
const i18n = new I18n({
    strict: true,
    defaultNamespace: 'common',
    locales: {
        'en-US': {
            common: { title: 'Title', home: { subtitle: 'Subtitle' } },
            profile: { greeting: 'Hello' },
        },
    },
});

// ✅ 合法
i18n.t('title');
i18n.t('home.subtitle');
i18n.t('profile:greeting');
i18n.t('greeting', { namespace: 'profile' });

// ❌ 编译期报错
i18n.t('missing.key');
i18n.t('greeting');                          // 不在 common 里
i18n.t('title', { namespace: 'profile' });   // title 不在 profile 里
```

## 插件

### 内置插值插件

`interpolator` 支持 `{{ token }}` 格式，参数支持点路径访问，缺失时保留占位符原文。

```ts
import I18n, { interpolator } from '@nild/i18n';

const i18n = new I18n({
    plugins: [interpolator()],  // 可选: interpolator({ openToken: '{', closeToken: '}' })
    locales: { 'en-US': { __default: { welcome: 'Hello, {{ user.name }}! You have {{ count }} messages.' } } },
});

i18n.t('welcome', { parameters: { user: { name: 'Nil' }, count: 3 } });
// → 'Hello, Nil! You have 3 messages.'
```

### 自定义插件

| 钩子 | 时机 | 用途 |
| --- | --- | --- |
| `beforeResolve(payload)` | 开始查找 key 之前 | 日志、修改查找上下文 |
| `onMiss(payload)` | key 在所有语言中均未找到 | 告警、上报缺失 |
| `afterResolve(payload)` | 查找结束（无论命中或缺失） | 统计、监控 |
| `transform(text, context)` | 命中后对翻译文本做后处理 | 插值、格式化 |

```ts
import type { Plugin, PluginFactory } from '@nild/i18n';

// 简单插件
const logger: Plugin = {
    name: 'logger',
    beforeResolve: ({ key }) => console.debug('[i18n] resolving', key),
    onMiss: ({ key, namespace }) => console.warn('[i18n] missing key:', key, 'in', namespace),
};

// 带配置的插件工厂（第二个类型参数声明向 t() context 追加的字段）
const myPlugin: PluginFactory<{ prefix?: string }, { extra?: string }> = ({ prefix = '' } = {}) => ({
    name: 'my-plugin',
    transform: (text, context) => prefix + text + (context.extra ?? ''),
});
```

## API

### `new I18n(options)`

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `language` | `Language` | — | 当前语言 |
| `fallbackLanguages` | `Language[] \| Record<string, Language[]>` | `[]` | 回退语言 |
| `namespace` | `string` | — | 实例默认命名空间 |
| `defaultNamespace` | `string` | `'__default'` | 兜底命名空间 |
| `namespaceDelimiter` | `string` | `':'` | 命名空间分隔符 |
| `keyDelimiter` | `string` | `'.'` | key 路径分隔符 |
| `locales` | `SerializedLocales` | — | 初始 locale 数据（`language → namespace → locale`） |
| `localeWriteMode` | `'merge' \| 'replace'` | `'merge'` | `addLocale` 写入策略 |
| `plugins` | `Plugin[]` | — | 插件列表，按注册顺序执行 |
| `strict` | `boolean` | `false` | 是否开启严格键推断 |

### 实例方法

| 方法 | 说明 |
| --- | --- |
| `t(key, context?)` | 翻译 key，缺失时返回原始 key |
| `setLanguage(language?)` | 设置当前语言 |
| `setNamespace(namespace?)` | 设置实例默认命名空间 |
| `setFallbackLanguages(fallbackLanguages?)` | 设置回退语言并清空语言链缓存 |
| `addLocale(context, locale)` | 动态追加 locale（`context.language` 必填） |

### `t()` context 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `language` | `Language?` | 仅本次调用生效的语言，不修改实例状态 |
| `namespace` | `string?` | 仅本次调用生效的命名空间 |

插件可通过 `PluginFactory` 第二个类型参数向 context 追加自定义字段。

### `ResolvePayload`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 原始 key（如 `common:title`） |
| `resolvedKey` | `string` | 去除命名空间后的 key（如 `title`） |
| `namespace` | `string` | 解析后使用的命名空间 |
| `languageChain` | `Language[]` | 本次查找使用的语言链 |
| `context` | `TranslationContext` | 完整的 context 对象 |
| `language` | `Language?` | 命中的语言（仅 `afterResolve` 在命中时存在） |
| `result` | `string?` | 最终翻译结果（仅 `afterResolve` 在命中时存在） |
