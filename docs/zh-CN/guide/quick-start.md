---
title: 快速开始
order: 1
cat: 入门
catOrder: 1
---

# {{ $frontmatter.title }}

本页只覆盖最短接入路径：安装当前可用包、接入组件样式，并渲染第一个组件。

## 前置条件

- React `^18.2.0`。
- Tailwind CSS `^4.1.7`。
- 使用 PNPM 时建议开启 `auto-install-peers=true`。

## 按场景安装

组件包把 Hooks、图标与基础工具作为 peer 使用。接入组件时，推荐一起安装：

::: code-group
```sh [NPM]
npm install @nild/components @nild/hooks @nild/icons @nild/shared
```

```sh [PNPM]
pnpm add @nild/components @nild/hooks @nild/icons @nild/shared
```
:::

只使用某一类能力时，可以选择更小的组合：

::: code-group
```sh [Hooks]
pnpm add @nild/hooks @nild/shared
```

```sh [图标]
pnpm add @nild/icons @nild/shared
```

```sh [国际化]
pnpm add @nild/i18n @nild/shared
```
:::

## 接入样式

在应用的全局 CSS 中加入最小样式配置：

```css
@import 'tailwindcss';
@import '@nild/components/tailwindcss';

@source '../node_modules/@nild/components/dist';
```

`@source` 路径按项目实际目录调整即可。更多 Tailwind 扫描、品牌色和明暗模式说明见 [样式与动态主题](./style-and-theme.md)。

## 渲染组件

```tsx
import { Button } from '@nild/components';

const App = () => {
  return <Button>开始使用</Button>;
};

export default App;
```

如果按钮已经带有品牌色、圆角、阴影和交互状态，说明包安装与样式接入都已生效。

## 下一步

- 想确认每个包的职责、依赖和 peer 范围：阅读 [包与依赖关系](./package-relationships.md)。
- 想调整品牌色、明暗模式或主题变量：阅读 [样式与动态主题](./style-and-theme.md)。
- 想查看组件示例：进入 [组件总览](/zh-CN/components/)。
- 想查找 Hooks 用法：进入 [Hooks](/zh-CN/hooks/)。
