# @nild/i18n

一个功能强大、轻量级的 JavaScript 国际化库，支持动态资源加载、命名空间、插值和插件系统。

## 特性

- 🌍 **动态资源加载** - 支持异步加载翻译资源
- 📦 **命名空间支持** - 组织和管理大型应用的翻译内容
- 🔀 **插值功能** - 支持变量替换和格式化
- 🔌 **插件系统** - 可扩展的插件架构
- 🔢 **复数处理** - 内置多语言复数规则支持
- 📅 **格式化功能** - 支持日期、数字、货币等格式化
- 🎯 **TypeScript 支持** - 完整的类型定义
- 🚀 **浏览器兼容** - 纯浏览器端实现，无需 Node.js

## 安装

```bash
npm install @nild/i18n
```

## 基本使用

### 快速开始

```typescript
import { createI18nWithPlugins, t } from '@nild/i18n';

// 创建国际化实例
const i18n = createI18nWithPlugins({
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  defaultNamespace: 'common'
});

// 使用翻译函数
console.log(t('hello')); // Hello
console.log(t('welcome', { params: { name: 'John' } })); // Welcome, John!
```

### 自定义资源加载器

```typescript
import { createI18n, createDefaultResourceLoader } from '@nild/i18n';

// 使用自定义路径的资源加载器
const i18n = createI18n({
  defaultLanguage: 'zh',
  fallbackLanguage: 'en',
  resourceLoader: createDefaultResourceLoader('/assets/locales')
});
```

### 手动创建资源加载器

```typescript
import { createI18n } from '@nild/i18n';

const i18n = createI18n({
  resourceLoader: {
    async load(language: string, namespace: string) {
      // 自定义加载逻辑
      const response = await fetch(`/api/i18n/${language}/${namespace}`);
      return await response.json();
    }
  }
});
```

## 高级功能

### 命名空间

```typescript
// 加载不同命名空间的资源
await i18n.loadResources('en', 'navigation');
await i18n.loadResources('en', 'forms');

// 使用命名空间
console.log(t('menu.home', { namespace: 'navigation' }));
console.log(t('validation.required', { namespace: 'forms' }));

// 创建作用域翻译函数
const navT = i18n.createScopedT('navigation');
console.log(navT('menu.home')); // 等同于 t('menu.home', { namespace: 'navigation' })
```

### 插值功能

```typescript
// 基础插值
t('welcome', { params: { name: 'Alice', age: 25 } });
// 资源文件: "welcome": "Welcome {{name}}, you are {{age}} years old"

// 格式化插值
t('price', { params: { amount: 1234.56 } });
// 资源文件: "price": "Price: {{amount | currency:{\"currency\":\"USD\"}}}"
// 输出: "Price: $1,234.56"

// 日期格式化
t('lastLogin', { params: { date: new Date() } });
// 资源文件: "lastLogin": "Last login: {{date | date:{\"dateStyle\":\"full\"}}}"
```

### 复数处理

```typescript
// 资源文件结构
{
  "items_0": "No items",
  "items_1": "1 item", 
  "items_2": "{{count}} items"
}

// 使用复数
t('items', { count: 0 }); // "No items"
t('items', { count: 1 }); // "1 item"
t('items', { count: 5 }); // "5 items"
```

### 预加载资源

```typescript
// 预加载多个语言和命名空间
await i18n.preloadResources(['en', 'zh', 'fr'], ['common', 'navigation', 'forms']);

// 检查资源是否已加载
console.log(i18n.getLoadedLanguages()); // ['en', 'zh', 'fr']
console.log(i18n.getLoadedNamespaces('en')); // ['common', 'navigation', 'forms']
```

## 插件系统

### 使用内置插件

```typescript
import { createI18n, pluralPlugin, formatPlugin } from '@nild/i18n';

const i18n = createI18n({
  plugins: [pluralPlugin, formatPlugin]
});
```

### 创建自定义插件

```typescript
import { createI18n } from '@nild/i18n';

const customPlugin = {
  name: 'uppercase',
  process(key, value, options, context) {
    // 如果选项中包含 uppercase，则转换为大写
    if (options.uppercase) {
      return value.toUpperCase();
    }
    return value;
  }
};

const i18n = createI18n({
  plugins: [customPlugin]
});

// 使用自定义插件
t('hello', { uppercase: true }); // "HELLO"
```

### 自定义格式化器

```typescript
import { createFormatPlugin } from '@nild/i18n';

const customFormatters = [
  {
    name: 'reverse',
    format: (value) => String(value).split('').reverse().join('')
  }
];

const customFormatPlugin = createFormatPlugin(customFormatters);

const i18n = createI18n({
  plugins: [customFormatPlugin]
});

// 使用自定义格式化器
t('text', { params: { word: 'hello' } });
// 资源文件: "text": "Reversed: {{word | reverse}}"
// 输出: "Reversed: olleh"
```

## API 参考

### I18n 类

```typescript
class I18n {
  constructor(options: I18nOptions)
  
  // 核心方法
  t(key: string, options?: TranslateOptions): string
  getLanguage(): string
  setLanguage(language: string): Promise<void>
  loadResources(language: string, namespace?: string): Promise<void>
  
  // 插件管理
  use(plugin: I18nPlugin): void
  removePlugin(name: string): boolean
  getPlugins(): I18nPlugin[]
  
  // 实用方法
  exists(key: string, options?: { namespace?: string }): boolean
  createScopedT(namespace: string): TFunction
  preloadResources(languages: string[], namespaces?: string[]): Promise<void>
  getLoadedLanguages(): string[]
  getLoadedNamespaces(language: string): string[]
  destroy(): void
}
```

### 配置选项

```typescript
interface I18nOptions {
  defaultLanguage?: string;
  fallbackLanguage?: string; 
  defaultNamespace?: string;
  resourceLoader?: ResourceLoader;
  plugins?: I18nPlugin[];
}

interface TranslateOptions {
  namespace?: string;
  params?: Record<string, any>;
  count?: number;
  context?: string;
  defaultValue?: string;
}
```

## 资源文件格式

### 基础结构

```json
{
  "welcome": "Welcome!",
  "user": {
    "profile": "User Profile",
    "settings": "User Settings"
  }
}
```

### 复数形式

```json
{
  "message_0": "No messages",
  "message_1": "1 message",
  "message_2": "{{count}} messages"
}
```

### 格式化示例

```json
{
  "price": "Price: {{amount | currency:{\"currency\":\"USD\"}}}",
  "date": "Today is {{today | date:{\"dateStyle\":\"full\"}}}",
  "list": "Items: {{items | list:{\"style\":\"long\"}}}"
}
```

## 内置格式化器

- `number` - 数字格式化
- `currency` - 货币格式化  
- `percent` - 百分比格式化
- `date` - 日期格式化
- `time` - 时间格式化
- `relative` - 相对时间格式化
- `list` - 列表格式化

## 浏览器支持

支持所有现代浏览器，依赖以下浏览器 API：
- `Intl.NumberFormat`
- `Intl.DateTimeFormat`
- `Intl.RelativeTimeFormat`
- `Intl.ListFormat`
- `fetch` API

## 许可证

Apache-2.0 