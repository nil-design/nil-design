# VitePress 主题覆盖

覆盖 nil-design 文档站的 VitePress 默认主题、主题变量、全局 CSS 和滚动条时，按以下规则执行。

## 覆盖顺序

除非需求明确更激进，否则按以下顺序升级：

1. 覆盖 `--vp-*` CSS 变量。
2. 补稳定的定向 CSS selector。
3. 扩展 Layout slots 或注册全局组件。
4. 局部替换默认主题组件。
5. 只有确实需要时，fork 更大范围的默认主题实现。

## 变量层级

当方案适合覆盖 `--vp-*` 变量时，先用本节判断覆盖层级；需要确认父子引用链、最小覆盖根、默认值、light/dark 作用域、多父节点变量或未声明扩展钩子时，再读 `variable-tree.md`。`variable-tree.md` 是基于 VitePress 默认主题源码扫描得到的版本化事实；升级 VitePress 后不要假设旧链路仍然成立。

### Root surface

第一轮主题重涂优先看 surface 层，先建立 light/dark 的背景、文本、边框和页面层次。

- 背景：`--vp-c-bg`、`--vp-c-bg-alt`、`--vp-c-bg-elv`、`--vp-c-bg-soft`。
- 文本：`--vp-c-text-1`、`--vp-c-text-2`、`--vp-c-text-3`。
- 边界：`--vp-c-border`、`--vp-c-divider`、`--vp-c-gutter`。
- 全局尺度：`--vp-shadow-1` 到 `--vp-shadow-5`、`--vp-font-family-base`、`--vp-font-family-mono`、`--vp-layout-max-width`、`--vp-nav-height`、`--vp-nav-logo-height`、`--vp-sidebar-width`。

### Root palette

想保留默认主题的大部分派生链时，优先改根色板，而不是直接改中间语义层。

- 基础实体色：`--vp-c-white`、`--vp-c-black`。
- 默认灰阶源头：`--vp-c-gray-1`、`--vp-c-gray-2`、`--vp-c-gray-3`、`--vp-c-gray-soft`。
- 品牌主色源头：`--vp-c-indigo-1`、`--vp-c-indigo-2`、`--vp-c-indigo-3`、`--vp-c-indigo-soft`。
- 状态色源头：`--vp-c-green-*`、`--vp-c-yellow-*`、`--vp-c-red-*`、`--vp-c-purple-*`。
- 特殊强调色：`--vp-c-sponsor`。

这些根变量的典型下游见 `variable-tree.md`：indigo 会牵动 brand、tip、note、代码高亮、本地搜索高亮和 Hero 名称；gray 会牵动 default、次级按钮、部分代码块和 info/note 自定义块；red/yellow/green/purple 会牵动 danger/warning/success/important 链路。

### Semantic middle

明确要打破默认派生关系时，再改中间语义层，例如 `--vp-c-brand-*`、`--vp-c-note-*`、`--vp-c-tip-*`、`--vp-c-default-*`、`--vp-c-success-*`、`--vp-c-warning-*`、`--vp-c-danger-*`、`--vp-c-caution-*`、`--vp-c-important-*`。

适合快速换品牌感、让某条语义链脱离上游根变量；不适合在还没确认 root palette 能否解决时直接大面积覆盖。

### Component hooks

全局层稳定后，再处理组件级变量，例如 `--vp-nav-*`、`--vp-local-search-*`、`--vp-home-hero-*`、`--vp-button-*`、`--vp-badge-*`、`--vp-custom-block-*`、`--vp-code-*`、`--vp-input-*`。

### 特殊变量

从 `variable-tree.md` 带回以下判断：

- `--vp-c-neutral` 和 `--vp-c-neutral-inverse` 不是单父节点变量，二者和 `--vp-c-black` / `--vp-c-white` 的翻转关系有关。
- `--vp-local-search-result-bg` 也不是简单单父节点变量，该变量和默认值、选中态重映射都有关系。
- `--vp-code-copy-copied-text-content` 是文案 / 本地化变量，不是主题换色变量。
- `--vp-c-shadow-3`、`--vp-doc-top-height`、`--vp-layout-top-height`、`--vp-offset`、`--vp-vh` 是未声明扩展钩子，适合单独判断，不要和主表里的根变量混为一谈。

决策顺序：先看 Root surface；再决定走 Root palette 还是 Semantic middle；局部还不够准时再落到 Component hooks；需要确认影响链就查 `variable-tree.md`。

- 不要同时大面积覆盖同一条变量链上的根变量和派生变量；先保持颜色源头清晰，再做局部修正。
- 如果 reference 与当前行为冲突，直接检查当前安装的 VitePress 默认主题源码，并按实际源码更新判断。

## CSS 边界

- `index.css` 只放通用变量、基础页面环境、默认主题结构覆盖，以及多个默认主题区域共享的样式。
- 自定义组件私有布局和视觉样式优先留在组件文件内。
- docs 专属共享变量优先使用 `--vp-custom-*`，新增前先搜索已有变量。
- Tailwind utility 能清楚表达时优先用 `@apply`；复杂 background、mask、shadow、浏览器伪元素和变量声明保留原生 CSS。
- 使用 Tailwind v4 的变量 utility 或任意属性类消费变量；不要为了一个值制造平行 token。
- 任意值和内置刻度等价时改用内置刻度，避免把偶然数值固化成设计语言。
- 使用 CSS nesting 缩短默认主题块里的子元素、伪类和伪元素选择器；父选择器仍应是稳定 VitePress 类名或语义 class。
- Tailwind 扫描范围变化可能把文档示例里的占位类误识别为真实 utility；新增 `@source` 或示例 arbitrary class 时要一起检查 warning。

## 原生滚动条

只需要统一滚动条视觉时，优先修饰原生滚动条，不引入自定义滚动条组件。

- 同时覆盖 Firefox 标准属性和 WebKit 伪元素。
- WebKit 中隐藏 scrollbar button 并把宽高归零。
- 固定定位侧栏或目录要检查小窗口高度下的滚动起点。
- 自定义组件内部滚动容器可复用共享 class。

## 验证重点

检查首页、features、nav、sidebar、mobile nav、local search、正文、表格、代码块、自定义块和自定义主题组件，并同时确认 light/dark。
