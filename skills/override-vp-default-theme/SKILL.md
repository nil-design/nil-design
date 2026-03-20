---
name: override-vp-default-theme
description: Override or replace the VitePress default theme in a generic, project-agnostic way. Use when asked to customize `.vitepress/theme`, restyle the default theme with CSS variables or custom CSS, extend `DefaultTheme`, replace theme components, or plan a full default-theme override without assuming any project-specific tokens or existing implementation context.
---

# Override VP Default Theme

## Overview

用这个技能规划或实现 VitePress 默认主题覆盖时，始终先选“能满足需求的最浅层方案”。
优先保留 `DefaultTheme` 的结构与行为，只在变量、CSS 和布局扩展不够用时，才升级到组件替换或局部 fork。

## Start From DefaultTheme

先采用默认主题扩展模式，不要一上来重写整套主题入口。

```ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: DefaultTheme.Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
  },
}

export default theme
```

- 把主题入口优先放在 `<docs-root>/.vitepress/theme/index.ts` 或 `index.js`。
- 把变量和额外样式优先放在 `<docs-root>/.vitepress/theme/custom.css` 或 `index.css`。
- 如果仓库里已经存在主题入口，直接增量修改，不要重复创建第二套主题入口。

## Choose The Override Layer

按下面的顺序选择覆盖层级，除非用户明确要求更激进的替换方案。

1. 覆盖 CSS 变量。
2. 补充定向 CSS 选择器。
3. 扩展 `Layout` 或注册额外组件。
4. 局部替换默认主题组件。
5. 只在确实需要时 fork 更大范围的默认主题实现。

## Override CSS Variables First

在需求主要涉及下面这些方面时，先覆盖 `--vp-*` 变量：

- 品牌色、语义色、背景、文本、边框、阴影。
- 字体、字号、布局宽度、导航高度。
- 按钮、徽章、代码块、自定义块、搜索框、Hero 等已有样式钩子。

先改高杠杆变量，再改组件级变量。
根据 `variable-tree.md` 的父子关系，优先顺序最好改成下面这样：

1. 先改根表面层：`--vp-c-bg*`、`--vp-c-text-*`、`--vp-c-border`、`--vp-c-divider`、`--vp-c-gutter`、`--vp-shadow-*`、排版和布局根变量。
2. 如果想保留默认派生链，再改根色板层：`--vp-c-indigo-*`、`--vp-c-gray-*`、`--vp-c-green-*`、`--vp-c-yellow-*`、`--vp-c-red-*`、`--vp-c-purple-*`、`--vp-c-white`、`--vp-c-black`。
3. 只有在明确要打破默认映射时，才改中间语义层：`--vp-c-brand-*`、`--vp-c-tip-*`、`--vp-c-note-*`、`--vp-c-success-*`、`--vp-c-warning-*`、`--vp-c-danger-*`。
4. 最后才改组件级钩子：`--vp-nav-*`、`--vp-home-hero-*`、`--vp-local-search-*`、`--vp-button-*`、`--vp-code-*`。

把 light 和 dark 一起设计，不要只改单侧主题。
如果只是想先快速判断“现在应该看哪一层变量”，先读 `references/variable-groups.md`；如果要确认具体影响链，再读 `references/variable-tree.md`。

### Semantic-First Example

在“想直接控制品牌语义层，同时只对页面表面做少量重涂”时，可以优先改语义层变量和根表面层变量。
这种方式更直接，但也意味着你在有意识地跳过一部分默认派生链：

```css
:root {
  --vp-c-brand-1: #2f6feb;
  --vp-c-brand-2: #4a7ff0;
  --vp-c-brand-3: #6a95f2;

  --vp-c-bg: #ffffff;
  --vp-c-bg-alt: #f6f8fa;
  --vp-c-bg-elv: #ffffff;
  --vp-c-text-1: #1f2328;
  --vp-c-text-2: #57606a;
  --vp-c-text-3: #6e7781;
  --vp-c-border: #d0d7de;
  --vp-c-divider: #d8dee4;

  --vp-font-family-base: "Atkinson Hyperlegible", system-ui, sans-serif;
  --vp-layout-max-width: 1440px;
  --vp-nav-height: 64px;
}

.dark {
  --vp-c-bg: #0d1117;
  --vp-c-bg-alt: #161b22;
  --vp-c-bg-elv: #161b22;
  --vp-c-text-1: #e6edf3;
  --vp-c-text-2: #9da7b3;
  --vp-c-text-3: #7d8590;
  --vp-c-border: #30363d;
  --vp-c-divider: #21262d;
}
```

### Root-Palette Example

在“想让默认主题的派生链自动跟着变”时，优先改更底层的调色板源头变量。
这种方式更系统，但也更依赖当前安装版本的默认变量关系。

```css
:root {
  --vp-c-white: #ffffff;
  --vp-c-black: #000000;

  --vp-c-indigo-1: #2f6feb;
  --vp-c-indigo-2: #4a7ff0;
  --vp-c-indigo-3: #6a95f2;
  --vp-c-indigo-soft: rgba(47, 111, 235, 0.14);

  --vp-c-gray-1: #d0d7de;
  --vp-c-gray-2: #e5e7eb;
  --vp-c-gray-3: #f3f4f6;
  --vp-c-gray-soft: rgba(15, 23, 42, 0.06);

  --vp-c-bg: #ffffff;
  --vp-c-bg-alt: #f8fafc;
  --vp-c-bg-elv: #ffffff;
  --vp-c-bg-soft: #f1f5f9;

  --vp-c-text-1: #0f172a;
  --vp-c-text-2: #475569;
  --vp-c-text-3: #64748b;
  --vp-c-border: #dbe2ea;
  --vp-c-divider: #e2e8f0;
}

.dark {
  --vp-c-indigo-1: #7aa2ff;
  --vp-c-indigo-2: #5c87f5;
  --vp-c-indigo-3: #3e6be7;
  --vp-c-indigo-soft: rgba(122, 162, 255, 0.18);

  --vp-c-gray-1: #4b5563;
  --vp-c-gray-2: #374151;
  --vp-c-gray-3: #1f2937;
  --vp-c-gray-soft: rgba(148, 163, 184, 0.16);

  --vp-c-bg: #0f172a;
  --vp-c-bg-alt: #111827;
  --vp-c-bg-elv: #111827;
  --vp-c-bg-soft: #1e293b;

  --vp-c-text-1: #e5eefc;
  --vp-c-text-2: #c0cad8;
  --vp-c-text-3: #94a3b8;
  --vp-c-border: #334155;
  --vp-c-divider: #1e293b;
}
```

需要快速判断“先改哪一层变量”时，再读 `references/variable-groups.md`。
需要逐项核对默认主题变量的父子引用链、最小覆盖根和未声明扩展钩子时，再读 `references/variable-tree.md`。

## Add CSS Selectors When Variables Are Not Enough

如果变量系统暴露不出目标效果，但默认主题的 DOM 结构仍可保留，就补定向 CSS。

典型场景：

- Hero、导航、侧边栏、正文节奏需要特殊布局微调。
- 需要 hover、focus、pseudo-element、transition 之类的额外视觉表达。
- 某些组件只差一两个局部样式，但不值得复制组件。

执行时遵守这些规则：

- 优先依赖稳定的默认主题类名和结构选择器。
- 避免依赖构建产物里的不稳定选择器。
- 尽量不用 `!important`，除非是在对抗内联样式或不可避免的优先级问题。
- 如果选择器覆盖开始大面积重写组件结构，就不要再硬撑，升级到组件级覆盖。

## Extend Layout Before Replacing Components

如果用户想加公告条、埋点容器、全局 provider、页面外框或插槽内容，先扩展 `Layout`，不要直接 fork 默认主题。

```ts
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import MyBanner from './components/MyBanner.vue'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(MyBanner),
    })
  },
}

export default theme
```

- 先确认当前 VitePress 版本支持的 `Layout` 插槽名，再落代码。
- 如果需求只是“在默认布局里插入内容”，就不要复制整个布局组件。
- 如果只是注册全局组件、指令或 provider，优先写在 `enhanceApp` 里。

## Replace Components Only For Structural Or Behavioral Changes

只有在下面这些场景里，才升级到组件替换或更大范围的主题 fork：

- 需要改默认导航、侧边栏、文档页或首页 Hero 的 DOM 结构。
- 需要改交互逻辑，而不仅是视觉样式。
- 需要移除、重排、或替换默认主题自带的组件行为。
- 需要接管默认主题未暴露的内部实现。

执行时遵守这些规则：

- 先确认当前安装的 VitePress 版本，再复制默认主题源码。
- 只复制必须接管的组件，不要无差别整包拷贝。
- 记录你基于哪个 VitePress 版本复制了哪些默认组件。
- 把它当成高维护成本路径，后续升级时优先回看 upstream 变更。

## Decide Whether To Break The Default Derivation Chain

按下面原则决定“改根变量”还是“改派生变量”：

- 想低风险重涂默认主题时，优先改根表面层，再决定是否需要少量语义层变量。
- 想系统性改造默认色板时，优先改调色板源头变量，如 `--vp-c-indigo-*`、`--vp-c-gray-*`、`--vp-c-green-*`、`--vp-c-red-*`。
- 只有在明确要打破默认映射关系时，才单独改派生变量。
- 不要同时大面积覆盖同一条链上的根变量和派生变量，否则后续很难判断真实色彩源头。

特别注意 `variable-tree.md` 里暴露出的几个例外：

- `--vp-c-neutral` / `--vp-c-neutral-inverse` 有多父节点关系，不适合拿来当普通单源变量理解。
- `--vp-local-search-result-bg` 同时涉及默认值和选中态重映射，最好先确认你是在改全局默认态还是改选中态行为。
- `--vp-code-copy-copied-text-content` 是文案变量，不属于换色层。

## Validate The Result

交付前至少检查这些区域：

- docs 页面正文、标题、链接、表格、引用块、自定义块
- home 页面 Hero 与 feature cards
- nav、sidebar、mobile nav、local search
- code block、inline code、copy button
- light / dark 两套主题
- 常见断点下的布局与滚动行为

如果用户要的是“覆盖默认主题”，就尽量交付一个仍然能跟随 VitePress 升级的方案，而不是过早把自己锁进重度 fork。
