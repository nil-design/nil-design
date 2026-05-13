---
name: override-vp-default-theme
description: Override or replace the VitePress default theme in a generic, project-agnostic way. Use when asked to customize `.vitepress/theme`, restyle the default theme with CSS variables or custom CSS, extend `DefaultTheme`, replace theme components, or plan a full default-theme override without assuming any project-specific tokens or existing implementation context.
---

# Override VP Default Theme

## Goal

规划或实现 VitePress 默认主题覆盖时，始终先选能满足需求的最浅层方案。优先保留 `DefaultTheme` 的结构与行为；只有变量、CSS 和布局扩展不够用时，才升级到组件替换或局部 fork。

## First Pass

动手前先读当前项目，不要只凭默认主题印象改：

- 主题入口、CSS 入口、`vitepress` 版本、PostCSS/Tailwind 配置、已有自定义组件和 dirty diff。
- 当前安装版本的默认主题源码；要覆盖默认 DOM 时，先确认真实类名、插槽和结构。
- build 是否会生成搜索索引、embeddings、sitemap 或其它 public 产物；把它们视为验证副作用，交付时单独说明。

nil-design 当前形态可作为判断样例：

- 主题入口是 `docs/.vitepress/theme/index.js`，扩展 `DefaultTheme`，引入 `./index.css` 并注册 `Mermaid`、`ReactBridge`、`ReactLive`。
- 自定义 `Layout.vue` 包住 `DefaultTheme.Layout`，通过默认主题插槽挂载 `ProgressBar`、`ThemePicker`、`BadgeLabel`、`HeroLogo`、`Features`，并在布局外挂载 `Assistant`。
- `docs/.vitepress/theme/index.css` 已使用 Tailwind v4、CSS nesting、`@source`、`--vp-custom-*` 共享材料和原生滚动条覆盖。

如果项目已有 staged 或 dirty 主题改动，把它当作当前基线继续增量修改，不要回滚用户改动。

## Decision Path

除非用户明确要求更激进方案，否则按顺序选择覆盖层级：

1. 覆盖 `--vp-*` CSS 变量。
2. 补充稳定的定向 CSS 选择器。
3. 扩展 `Layout` 或注册全局组件。
4. 局部替换默认主题组件。
5. 只在确实需要时 fork 更大范围的默认主题实现。

默认主题扩展入口优先保持简单：

```ts
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './custom.css';

const theme: Theme = {
    extends: DefaultTheme,
    Layout: DefaultTheme.Layout,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp?.(ctx);
    },
};

export default theme;
```

- 入口优先放在 `<docs-root>/.vitepress/theme/index.ts` 或 `index.js`。
- 变量和额外样式优先放在 `<docs-root>/.vitepress/theme/custom.css` 或 `index.css`。
- 如果已有主题入口，直接增量修改，不创建第二套入口。

## Variables First

需求主要涉及品牌色、语义色、背景、文本、边框、阴影、字体、布局宽度、导航高度、按钮、徽章、代码块、自定义块、搜索框或 Hero 时，先尝试变量覆盖，并同时设计 light / dark。

变量选择顺序：

1. Root surface：`--vp-c-bg*`、`--vp-c-text-*`、`--vp-c-border`、`--vp-c-divider`、`--vp-c-gutter`、`--vp-shadow-*`、排版和布局根变量。
2. Root palette：想保留默认派生链时，改 `--vp-c-indigo-*`、`--vp-c-gray-*`、`--vp-c-green-*`、`--vp-c-yellow-*`、`--vp-c-red-*`、`--vp-c-purple-*`、`--vp-c-white`、`--vp-c-black`。
3. Semantic middle：明确要打破默认映射时，才改 `--vp-c-brand-*`、`--vp-c-tip-*`、`--vp-c-note-*`、`--vp-c-success-*`、`--vp-c-warning-*`、`--vp-c-danger-*` 等派生语义层。
4. Component hooks：最后再改 `--vp-nav-*`、`--vp-home-hero-*`、`--vp-local-search-*`、`--vp-button-*`、`--vp-code-*` 等局部变量。

需要快速判断先看哪层变量时，读 `references/variable-groups.md`；需要父子引用链、最小覆盖根和未声明扩展钩子时，读 `references/variable-tree.md`。

语义层快速覆盖示例：

```css
:root {
    --vp-c-brand-1: #2f6feb;
    --vp-c-brand-2: #4a7ff0;
    --vp-c-brand-3: #6a95f2;
    --vp-c-bg: #ffffff;
    --vp-c-bg-alt: #f6f8fa;
    --vp-c-text-1: #1f2328;
    --vp-c-text-2: #57606a;
    --vp-c-border: #d0d7de;
    --vp-c-divider: #d8dee4;
}

.dark {
    --vp-c-bg: #0d1117;
    --vp-c-bg-alt: #161b22;
    --vp-c-text-1: #e6edf3;
    --vp-c-text-2: #9da7b3;
    --vp-c-border: #30363d;
    --vp-c-divider: #21262d;
}
```

如果想让默认主题的派生链自动跟着变，优先改 root palette 变量；不要同时大面积覆盖同一条链上的根变量和派生变量，否则后续很难判断真实色彩源头。特别注意 `--vp-c-neutral` / `--vp-c-neutral-inverse`、`--vp-local-search-result-bg` 有多父节点关系，`--vp-code-copy-copied-text-content` 是文案变量。

## CSS Boundaries

把主题 CSS 当作默认主题覆盖层，而不是所有文档组件样式的收纳处：

- 只放通用变量、基础页面环境、默认主题结构覆盖，以及多个默认主题区域共享的样式。
- 自定义 Vue/React 主题组件的私有布局和视觉样式优先留在组件内；组件可以消费主题 CSS 提供的共享变量或共享 class。
- 文档站点私有变量优先使用 `--vp-custom-*`；新增前先搜索已有 `--vp-*`，避免覆盖默认变量或制造平行概念。
- 重复材料可抽成 `--vp-custom-*`，例如 glass surface、grid background、page glow、nav backdrop、soft border、logo ink/accent、feature card surface、scrollbar；只出现一次且无复用意图的值保留局部 utility。
- 对复杂背景、mask、shadow、backdrop，可把整段值放进变量，再用 `[background:var(--vp-custom-surface)]`、`[mask:var(--vp-custom-mask)]` 等方式消费。

如果项目已通过 Tailwind 处理主题 CSS：

- 优先用 `@apply` 表达布局、间距、尺寸、层级、排版、圆角、边框、背景、颜色和状态工具类。
- 对 CSS 变量使用 Tailwind v4 的 `--()` 简写，例如 `bg-(--vp-custom-surface)`、`border-(--vp-custom-border)`、`shadow-(--vp-custom-shadow)`、`fill-(--vp-custom-ink)`。
- 没有合适属性 utility 时用任意属性类，例如 `[box-shadow:var(--vp-custom-highlight)]`、`[backdrop-filter:var(--vp-custom-backdrop)]`。
- 任意值和内置刻度等价时改用内置刻度，例如 `z-[1]` -> `z-1`、`min-h-[100svh]` -> `min-h-svh`。
- 使用 CSS nesting 缩短默认主题块里的子元素、伪类和伪元素选择器；父选择器仍要是稳定的 VitePress 类名或语义 class。
- 检查 Tailwind `@source` 扫描范围；不要在可扫描文本中放会被误识别的占位 arbitrary class，尤其是带省略号的示例。

原生 CSS 适合保留在变量定义、复杂 background/mask、浏览器专有伪元素和 Tailwind 难以清晰表达的声明上。

## Selectors, Layout, Components

变量不够但默认主题 DOM 仍可保留时，补稳定定向 CSS：

- 适合处理 Hero、导航、侧边栏、正文节奏、hover/focus/pseudo-element/transition 等局部效果。
- 避免依赖构建产物里的不稳定选择器；尽量不用 `!important`，除非对抗内联样式或不可避免的 scoped 优先级。
- 如果选择器开始大面积重写组件结构，升级到组件级覆盖。

需要插入公告条、埋点容器、全局 provider、页面外框或插槽内容时，先扩展 `Layout`，不要复制整套默认布局：

```ts
import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import MyBanner from './components/MyBanner.vue';

const theme: Theme = {
    extends: DefaultTheme,
    Layout: () =>
        h(DefaultTheme.Layout, null, {
            'layout-top': () => h(MyBanner),
        }),
};

export default theme;
```

- 先确认当前 VitePress 版本支持的插槽名。
- 只是注册全局组件、指令或 provider 时，优先写在 `enhanceApp`。
- 只有需要改默认导航、侧边栏、文档页、首页 Hero 的 DOM 结构或交互逻辑时，才替换默认组件。
- 替换组件前确认当前 VitePress 版本，只复制必须接管的组件，并记录基于哪个版本复制。

## Native Scrollbars

只需要统一滚动条视觉时，优先修饰原生滚动条，不引入自定义滚动条组件。只有需要虚拟滚动、拖拽、overlay 轨道、跨浏览器完全一致结构或特殊可访问性交互时，才考虑组件化滚动条。

- 抽共享变量：`--vp-custom-scrollbar-size`、`--vp-custom-scrollbar-track`、`--vp-custom-scrollbar-thumb`、`--vp-custom-scrollbar-thumb-hover`。
- 同时覆盖 Firefox 标准属性和 WebKit 伪元素：`scrollbar-width`、`scrollbar-color`、`::-webkit-scrollbar`、`::-webkit-scrollbar-track`、`::-webkit-scrollbar-thumb`。
- 在 WebKit 中隐藏 `::-webkit-scrollbar-button` 并把宽高归零。
- 侧栏或目录是固定定位时，检查小窗口高度下的滚动条起点；有顶部导航时，滚动容器的 `top`、`height` 或 `bottom` 应与导航底部对齐。
- 自定义组件内部滚动容器可复用共享 class，例如 `.vp-custom-scrollbar`；第三方内部滚动节点只定向稳定内部类，不把完整第三方布局写进主题 CSS。

## Validation

交付前至少检查：

- docs 页面正文、标题、链接、表格、引用块、自定义块。
- home Hero、feature cards、nav、sidebar、mobile nav、local search。
- code block、inline code、copy button。
- light / dark 两套主题。
- 常见断点下的布局与滚动行为。
- 自定义主题组件是否只消费共享变量，私有样式是否仍在组件边界内。

验证命令按项目实际脚本选择：

- CSS/组件 lint 和格式检查，例如 `stylelint`、`eslint`、`prettier --check` 或项目等价命令。
- `vitepress build` 或项目 docs build；若失败，区分代码错误、环境瞬时错误和生成产物副作用。
- 如果 Tailwind warning 来自 scanned docs/examples，定位来源；能在当前任务范围内修就修，不能修就说明 warning 不来自主题实现。
- 有浏览器能力时检查首页、文档页、nav、sidebar、mobile nav、code block、React/Vue 自定义组件的 light/dark 视觉；浏览器工具不可用时，至少确认 dev server HTTP 200 和 build 通过。

最终目标是交付一个仍能跟随 VitePress 升级的覆盖方案，而不是过早锁进重度 fork。
