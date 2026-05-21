# @nild/eslint-plugin

`@nild/eslint-plugin` 提供 Nil Design 项目约定相关的 ESLint 规则。它当前面向 ESLint flat config，默认导出插件对象，并提供 `recommended` 配置。

## 安装

```bash
pnpm add -D @nild/eslint-plugin eslint
```

`eslint` 是 peer dependency，需要由使用方项目提供。

## 推荐配置

```js
import { configs } from '@nild/eslint-plugin';

export default [configs.recommended];
```

`configs.recommended` 会把插件注册到 `@nild` 命名空间，并对支持的 JS、TS、JSX、TSX 和 Vue 文件启用所有规则：

```js
{
    name: '@nild/eslint-plugin/recommended',
    files: ['**/*.{js,cjs,mjs,jsx,ts,tsx,vue}'],
    rules: {
        '@nild/boolean-naming': 'warn',
        '@nild/dom-naming': 'warn',
        '@nild/no-hardcoded-colors': 'warn',
    },
}
```

## 手动配置

```js
import nild from '@nild/eslint-plugin';

export default [
    {
        files: ['**/*.{ts,tsx,vue}'],
        plugins: {
            '@nild': nild,
        },
        rules: {
            '@nild/boolean-naming': 'warn',
            '@nild/dom-naming': 'warn',
            '@nild/no-hardcoded-colors': 'warn',
        },
    },
];
```

## 规则

### `@nild/boolean-naming`

约束布尔值和返回布尔值的可调用对象命名：

- 布尔数据应该描述状态，不使用 `is`、`has`、`can` 等布尔前缀。
- 返回布尔值的函数、方法或函数类型属性应该使用布尔前缀。

```ts
// valid
const dialogOpen = true;
const requestPending: boolean = false;
function isDialogOpen(): boolean {
    return dialogOpen;
}

// invalid
const isDialogOpen = true;
function dialogOpen(): boolean {
    return true;
}
```

规则会检查变量声明、对象属性、类属性、getter、函数声明、方法签名、TS 属性签名以及 Vue `<script setup>` 中的常见写法。

### `@nild/dom-naming`

约束本地 DOM 变量命名，DOM 类型变量必须使用 `$` 前缀，便于区分真实 DOM 节点和普通数据。

```ts
// valid
const $root = document.createElement('div');
const $surface: HTMLDivElement | null = surfaceRef.current;

// invalid
const root = document.createElement('div');
const surface: HTMLDivElement | null = surfaceRef.current;
```

规则会检查变量声明中的显式 DOM 类型标注、DOM 查询/创建表达式以及常见类型断言；函数参数、对象属性和公开类型签名暂不检查，避免误伤 API 命名。

### `@nild/no-hardcoded-colors`

禁止在逻辑文件中直接写入硬编码颜色字面量，鼓励使用设计 token、CSS 变量或语义化颜色。

```ts
// valid
const color = 'var(--text-main)';
const className = 'text-red-500';
const fill = token;

// invalid
const color = '#fff';
const danger = 'red';
const shadow = `rgb(255, 0, 0)`;
```

规则会识别十六进制颜色、CSS 颜色函数和标准命名色，并支持 JSX、TSX 与 Vue template 中的字面量检查。

## 导出

```ts
import plugin, { configs, rules } from '@nild/eslint-plugin';
```

- `plugin`：默认导出的 ESLint 插件对象。
- `configs.recommended`：推荐 flat config。
- `rules`：插件内的规则集合。
