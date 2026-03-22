# VitePress 默认主题 CSS 变量引用树

> 生成口径：基于本地 `vitepress@1.6.3`，扫描 `node_modules/vitepress/dist/client/theme-default` 下默认主题源码中实际声明的 `--vp-*` 变量，并按“变量名归并”方式合并不同作用域（如 `:root`、`.dark`、`:lang(...)`、组件局部覆盖）的关系。

## 统计摘要

- 已声明的 `--vp-*` 变量：**223** 个。
- 最小覆盖根变量：**86** 个。
- 其中无下游变量的孤立根：**49** 个。
- 参与变量引用的派生变量：**137** 个。
- 被其他变量引用过的变量：**62** 个。
- 多父节点变量：**3** 个，分别为：`--vp-c-neutral`、`--vp-c-neutral-inverse`、`--vp-local-search-result-bg`。
- 当前口径下未纳入主表、但被默认主题使用的未声明扩展钩子：**5** 个。

## 口径说明

- 关系方向统一记为 **父 -> 子**：若 `--b: var(--a)`，则图上显示为 `--a --> --b`。
- 主表第一列只列出“最小覆盖根变量”，也就是**不依赖任何其他 `--vp-*` 变量**的变量。
- 如果一个变量在不同作用域下拥有不同父节点，则在图中允许它同时出现在多棵根树里；当前实际出现多父节点的变量为：--vp-c-neutral <- --vp-c-black, --vp-c-white； --vp-c-neutral-inverse <- --vp-c-black, --vp-c-white； --vp-local-search-result-bg <- --vp-c-bg, --vp-local-search-result-selected-bg。
- `icons.css` 里的 `--vp-icon-copy` / `--vp-icon-copied` 已纳入统计，因为它们同样属于默认主题内部的 `--vp-*` 变量。
- 主表只统计“默认主题自身有声明”的变量；未声明扩展钩子单独列在后文，不并入主表。

## 最小覆盖根变量总表

下面的主表改为 HTML 表格，`引用关系` 列使用目录树式文本排版，便于本地 Markdown 预览直接查阅。

<table>
  <thead>
    <tr>
      <th>变量名</th>
      <th>引用关系</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>--vp-backdrop-bg-color</code></td>
      <td><pre><code>--vp-backdrop-bg-color</code></pre></td>
      <td>颜色：遮罩； 全局遮罩背景色。； 默认值：rgba(0, 0, 0, 0.6)。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-badge-danger-border</code></td>
      <td><pre><code>--vp-badge-danger-border</code></pre></td>
      <td>组件：徽章； 危险徽章边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-badge-info-border</code></td>
      <td><pre><code>--vp-badge-info-border</code></pre></td>
      <td>组件：徽章； 信息徽章边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-badge-tip-border</code></td>
      <td><pre><code>--vp-badge-tip-border</code></pre></td>
      <td>组件：徽章； 提示徽章边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-badge-warning-border</code></td>
      <td><pre><code>--vp-badge-warning-border</code></pre></td>
      <td>组件：徽章； 警告徽章边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-alt-active-border</code></td>
      <td><pre><code>--vp-button-alt-active-border</code></pre></td>
      <td>组件：按钮； 次级按钮激活态边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-alt-border</code></td>
      <td><pre><code>--vp-button-alt-border</code></pre></td>
      <td>组件：按钮； 次级按钮默认态边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-alt-hover-border</code></td>
      <td><pre><code>--vp-button-alt-hover-border</code></pre></td>
      <td>组件：按钮； 次级按钮悬停态边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-brand-active-border</code></td>
      <td><pre><code>--vp-button-brand-active-border</code></pre></td>
      <td>组件：按钮； 品牌按钮激活态边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-brand-border</code></td>
      <td><pre><code>--vp-button-brand-border</code></pre></td>
      <td>组件：按钮； 品牌按钮默认态边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-brand-hover-border</code></td>
      <td><pre><code>--vp-button-brand-hover-border</code></pre></td>
      <td>组件：按钮； 品牌按钮悬停态边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-sponsor-active-bg</code></td>
      <td><pre><code>--vp-button-sponsor-active-bg</code></pre></td>
      <td>组件：按钮； 赞助按钮激活态背景色。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-sponsor-bg</code></td>
      <td><pre><code>--vp-button-sponsor-bg</code></pre></td>
      <td>组件：按钮； 赞助按钮默认态背景色。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-button-sponsor-hover-bg</code></td>
      <td><pre><code>--vp-button-sponsor-hover-bg</code></pre></td>
      <td>组件：按钮； 赞助按钮悬停态背景色。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-c-bg</code></td>
      <td><pre><code>--vp-c-bg
├── --vp-code-copy-code-hover-bg
├── --vp-local-nav-bg-color
├── --vp-local-search-bg
├── --vp-local-search-result-selected-bg
│    └── --vp-local-search-result-bg [另有父节点: --vp-c-bg]
├── --vp-nav-bg-color
└── --vp-nav-screen-bg-color</code></pre></td>
      <td>颜色：背景； 页面主背景色。； 取值：#ffffff / #1b1b1f。； 下游可覆盖 7 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-bg-alt</code></td>
      <td><pre><code>--vp-c-bg-alt
├── --vp-code-block-bg
│    └── --vp-code-tab-bg
├── --vp-input-bg-color
└── --vp-sidebar-bg-color</code></pre></td>
      <td>颜色：背景； 替代背景色。； 取值：#f6f6f7 / #161618。； 下游可覆盖 4 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-bg-elv</code></td>
      <td><pre><code>--vp-c-bg-elv</code></pre></td>
      <td>颜色：背景； 浮层背景色。； 取值：#ffffff / #202127。； 无下游变量，直接被默认主题样式消费。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-bg-soft</code></td>
      <td><pre><code>--vp-c-bg-soft
├── --vp-carbon-ads-bg-color
└── --vp-code-copy-code-bg</code></pre></td>
      <td>颜色：背景； 柔和背景色。； 取值：#f6f6f7 / #202127。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-black</code></td>
      <td><pre><code>--vp-c-black
├── --vp-c-neutral
└── --vp-c-neutral-inverse
    └── --vp-local-search-highlight-text</code></pre></td>
      <td>颜色：基础实体色； 基础黑色常量。； 默认值：#000000。； 下游可覆盖 3 个变量。</td>
    </tr>
    <tr>
      <td><code>--vp-c-border</code></td>
      <td><pre><code>--vp-c-border
└── --vp-input-border-color</code></pre></td>
      <td>颜色：边框； 交互边框颜色。； 取值：#c2c2c4 / #3c3f44。； 下游可覆盖 1 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-divider</code></td>
      <td><pre><code>--vp-c-divider
├── --vp-code-copy-code-border-color
├── --vp-code-copy-code-hover-border-color
└── --vp-local-search-result-border</code></pre></td>
      <td>颜色：边框； 分隔线颜色。； 取值：#e2e2e3 / #2e2e32。； 下游可覆盖 3 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-gray-1</code></td>
      <td><pre><code>--vp-c-gray-1
└── --vp-c-default-1
    └── --vp-button-alt-active-bg</code></pre></td>
      <td>颜色：调色板； 灰色调色板 1 级 根变量。； 取值：#dddde3 / #515c67。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-gray-2</code></td>
      <td><pre><code>--vp-c-gray-2
└── --vp-c-default-2
    └── --vp-button-alt-hover-bg</code></pre></td>
      <td>颜色：调色板； 灰色调色板 2 级 根变量。； 取值：#e4e4e9 / #414853。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-gray-3</code></td>
      <td><pre><code>--vp-c-gray-3
└── --vp-c-default-3
    └── --vp-button-alt-bg</code></pre></td>
      <td>颜色：调色板； 灰色调色板 3 级 根变量。； 取值：#ebebef / #32363f。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-gray-soft</code></td>
      <td><pre><code>--vp-c-gray-soft
└── --vp-c-default-soft
    ├── --vp-badge-info-bg
    ├── --vp-code-bg
    ├── --vp-code-line-highlight-color
    ├── --vp-custom-block-info-bg
    │    └── --vp-custom-block-details-bg
    ├── --vp-custom-block-info-code-bg
    │    └── --vp-custom-block-details-code-bg
    ├── --vp-custom-block-note-bg
    ├── --vp-custom-block-note-code-bg
    └── --vp-input-switch-bg-color</code></pre></td>
      <td>颜色：调色板； 灰色调色板 soft 柔和层 根变量。； 取值：rgba(142, 150, 170, 0.14) / rgba(101, 117, 133, 0.16)。； 下游可覆盖 11 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-green-1</code></td>
      <td><pre><code>--vp-c-green-1
└── --vp-c-success-1
    └── --vp-code-line-diff-add-symbol-color</code></pre></td>
      <td>颜色：调色板； 绿色调色板 1 级 根变量。； 取值：#18794e / #3dd68c。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-green-2</code></td>
      <td><pre><code>--vp-c-green-2
└── --vp-c-success-2</code></pre></td>
      <td>颜色：调色板； 绿色调色板 2 级 根变量。； 取值：#299764 / #30a46c。； 下游可覆盖 1 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-green-3</code></td>
      <td><pre><code>--vp-c-green-3
└── --vp-c-success-3</code></pre></td>
      <td>颜色：调色板； 绿色调色板 3 级 根变量。； 取值：#30a46c / #298459。； 下游可覆盖 1 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-green-soft</code></td>
      <td><pre><code>--vp-c-green-soft
└── --vp-c-success-soft
    └── --vp-code-line-diff-add-color</code></pre></td>
      <td>颜色：调色板； 绿色调色板 soft 柔和层 根变量。； 取值：rgba(16, 185, 129, 0.14) / rgba(16, 185, 129, 0.16)。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-gutter</code></td>
      <td><pre><code>--vp-c-gutter
└── --vp-code-block-divider-color
    └── --vp-code-tab-divider</code></pre></td>
      <td>颜色：边框； 页面沟槽分隔色。； 取值：#e2e2e3 / #000000。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-indigo-1</code></td>
      <td><pre><code>--vp-c-indigo-1
└── --vp-c-brand-1
    ├── --vp-button-brand-active-bg
    ├── --vp-c-brand
    ├── --vp-c-note-1
    ├── --vp-c-tip-1
    │    └── --vp-badge-tip-text
    ├── --vp-carbon-ads-hover-text-color
    ├── --vp-code-color
    ├── --vp-code-link-color
    ├── --vp-code-tab-active-bar-color
    ├── --vp-home-hero-name-color
    ├── --vp-local-search-highlight-bg
    └── --vp-local-search-result-selected-border</code></pre></td>
      <td>颜色：调色板； 靛蓝调色板 1 级 根变量。； 取值：#3451b2 / #a8b1ff。； 下游可覆盖 13 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-indigo-2</code></td>
      <td><pre><code>--vp-c-indigo-2
└── --vp-c-brand-2
    ├── --vp-button-brand-hover-bg
    ├── --vp-c-note-2
    ├── --vp-c-tip-2
    └── --vp-code-link-hover-color</code></pre></td>
      <td>颜色：调色板； 靛蓝调色板 2 级 根变量。； 取值：#3a5ccc / #5c73e7。； 下游可覆盖 5 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-indigo-3</code></td>
      <td><pre><code>--vp-c-indigo-3
└── --vp-c-brand-3
    ├── --vp-button-brand-bg
    ├── --vp-c-note-3
    └── --vp-c-tip-3</code></pre></td>
      <td>颜色：调色板； 靛蓝调色板 3 级 根变量。； 取值：#5672cd / #3e63dd。； 下游可覆盖 4 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-indigo-soft</code></td>
      <td><pre><code>--vp-c-indigo-soft
└── --vp-c-brand-soft
    ├── --vp-c-note-soft
    └── --vp-c-tip-soft
        ├── --vp-badge-tip-bg
        ├── --vp-custom-block-tip-bg
        └── --vp-custom-block-tip-code-bg</code></pre></td>
      <td>颜色：调色板； 靛蓝调色板 soft 柔和层 根变量。； 取值：rgba(100, 108, 255, 0.14) / rgba(100, 108, 255, 0.16)。； 下游可覆盖 6 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-purple-1</code></td>
      <td><pre><code>--vp-c-purple-1
└── --vp-c-important-1</code></pre></td>
      <td>颜色：调色板； 紫色调色板 1 级 根变量。； 取值：#6f42c1 / #c8abfa。； 下游可覆盖 1 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-purple-2</code></td>
      <td><pre><code>--vp-c-purple-2
└── --vp-c-important-2</code></pre></td>
      <td>颜色：调色板； 紫色调色板 2 级 根变量。； 取值：#7e4cc9 / #a879e6。； 下游可覆盖 1 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-purple-3</code></td>
      <td><pre><code>--vp-c-purple-3
└── --vp-c-important-3</code></pre></td>
      <td>颜色：调色板； 紫色调色板 3 级 根变量。； 默认值：#8e5cd9。； 下游可覆盖 1 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-purple-soft</code></td>
      <td><pre><code>--vp-c-purple-soft
└── --vp-c-important-soft
    ├── --vp-custom-block-important-bg
    └── --vp-custom-block-important-code-bg</code></pre></td>
      <td>颜色：调色板； 紫色调色板 soft 柔和层 根变量。； 取值：rgba(159, 122, 234, 0.14) / rgba(159, 122, 234, 0.16)。； 下游可覆盖 3 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-red-1</code></td>
      <td><pre><code>--vp-c-red-1
├── --vp-c-caution-1
└── --vp-c-danger-1
    ├── --vp-badge-danger-text
    └── --vp-code-line-diff-remove-symbol-color</code></pre></td>
      <td>颜色：调色板； 红色调色板 1 级 根变量。； 取值：#b8272c / #f66f81。； 下游可覆盖 4 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-red-2</code></td>
      <td><pre><code>--vp-c-red-2
├── --vp-c-caution-2
└── --vp-c-danger-2</code></pre></td>
      <td>颜色：调色板； 红色调色板 2 级 根变量。； 取值：#d5393e / #f14158。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-red-3</code></td>
      <td><pre><code>--vp-c-red-3
├── --vp-c-caution-3
└── --vp-c-danger-3</code></pre></td>
      <td>颜色：调色板； 红色调色板 3 级 根变量。； 取值：#e0575b / #b62a3c。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-red-soft</code></td>
      <td><pre><code>--vp-c-red-soft
├── --vp-c-caution-soft
│    ├── --vp-custom-block-caution-bg
│    └── --vp-custom-block-caution-code-bg
└── --vp-c-danger-soft
    ├── --vp-badge-danger-bg
    ├── --vp-code-line-diff-remove-color
    ├── --vp-code-line-error-color
    ├── --vp-custom-block-danger-bg
    └── --vp-custom-block-danger-code-bg</code></pre></td>
      <td>颜色：调色板； 红色调色板 soft 柔和层 根变量。； 取值：rgba(244, 63, 94, 0.14) / rgba(244, 63, 94, 0.16)。； 下游可覆盖 9 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-sponsor</code></td>
      <td><pre><code>--vp-c-sponsor
├── --vp-button-sponsor-active-border
├── --vp-button-sponsor-active-text
├── --vp-button-sponsor-hover-border
└── --vp-button-sponsor-hover-text</code></pre></td>
      <td>颜色：调色板； 赞助强调色。； 默认值：#db2777。； 下游可覆盖 4 个变量。</td>
    </tr>
    <tr>
      <td><code>--vp-c-text-1</code></td>
      <td><pre><code>--vp-c-text-1
├── --vp-button-alt-active-text
├── --vp-button-alt-hover-text
├── --vp-button-alt-text
├── --vp-carbon-ads-hover-poweredby-color
├── --vp-carbon-ads-text-color
├── --vp-code-tab-active-text-color
├── --vp-code-tab-hover-text-color
├── --vp-custom-block-caution-text
├── --vp-custom-block-danger-text
├── --vp-custom-block-important-text
├── --vp-custom-block-info-text
│    └── --vp-custom-block-details-text
├── --vp-custom-block-note-text
├── --vp-custom-block-tip-text
└── --vp-custom-block-warning-text</code></pre></td>
      <td>颜色：文本； 1 级文本颜色。； 取值：#3c3c43 / #dfdfd6。； 下游可覆盖 15 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-text-2</code></td>
      <td><pre><code>--vp-c-text-2
├── --vp-badge-info-text
├── --vp-button-sponsor-border
├── --vp-button-sponsor-text
├── --vp-carbon-ads-poweredby-color
├── --vp-code-block-color
├── --vp-code-copy-code-active-text
└── --vp-code-tab-text-color</code></pre></td>
      <td>颜色：文本； 2 级文本颜色。； 取值：#67676c / #98989f。； 下游可覆盖 7 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-text-3</code></td>
      <td><pre><code>--vp-c-text-3
├── --vp-code-lang-color
└── --vp-code-line-number-color</code></pre></td>
      <td>颜色：文本； 3 级文本颜色。； 取值：#929295 / #6a6a71。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-white</code></td>
      <td><pre><code>--vp-c-white
├── --vp-button-brand-active-text
├── --vp-button-brand-hover-text
├── --vp-button-brand-text
├── --vp-c-neutral
└── --vp-c-neutral-inverse
    └── --vp-local-search-highlight-text</code></pre></td>
      <td>颜色：基础实体色； 基础白色常量。； 默认值：#ffffff。； 下游可覆盖 6 个变量。</td>
    </tr>
    <tr>
      <td><code>--vp-c-yellow-1</code></td>
      <td><pre><code>--vp-c-yellow-1
└── --vp-c-warning-1
    └── --vp-badge-warning-text</code></pre></td>
      <td>颜色：调色板； 黄色调色板 1 级 根变量。； 取值：#915930 / #f9b44e。； 下游可覆盖 2 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-yellow-2</code></td>
      <td><pre><code>--vp-c-yellow-2
└── --vp-c-warning-2</code></pre></td>
      <td>颜色：调色板； 黄色调色板 2 级 根变量。； 取值：#946300 / #da8b17。； 下游可覆盖 1 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-yellow-3</code></td>
      <td><pre><code>--vp-c-yellow-3
└── --vp-c-warning-3</code></pre></td>
      <td>颜色：调色板； 黄色调色板 3 级 根变量。； 取值：#9f6a00 / #a46a0a。； 下游可覆盖 1 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-c-yellow-soft</code></td>
      <td><pre><code>--vp-c-yellow-soft
└── --vp-c-warning-soft
    ├── --vp-badge-warning-bg
    ├── --vp-code-line-warning-color
    ├── --vp-custom-block-warning-bg
    └── --vp-custom-block-warning-code-bg</code></pre></td>
      <td>颜色：调色板； 黄色调色板 soft 柔和层 根变量。； 取值：rgba(234, 179, 8, 0.14) / rgba(234, 179, 8, 0.16)。； 下游可覆盖 5 个变量。； 含 light/dark 双值。</td>
    </tr>
    <tr>
      <td><code>--vp-code-copy-copied-text-content</code></td>
      <td><pre><code>--vp-code-copy-copied-text-content</code></pre></td>
      <td>组件：代码； 复制成功提示文案。； 无下游变量，直接被默认主题样式消费。； 含语言覆盖。</td>
    </tr>
    <tr>
      <td><code>--vp-code-font-size</code></td>
      <td><pre><code>--vp-code-font-size</code></pre></td>
      <td>组件：代码； 代码字体大小。； 默认值：0.875em。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-code-line-height</code></td>
      <td><pre><code>--vp-code-line-height</code></pre></td>
      <td>组件：代码； 行内/块级代码行高。； 默认值：1.7。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-caution-border</code></td>
      <td><pre><code>--vp-custom-block-caution-border</code></pre></td>
      <td>组件：自定义块； 注意自定义块边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-code-font-size</code></td>
      <td><pre><code>--vp-custom-block-code-font-size</code></pre></td>
      <td>组件：自定义块； 自定义块代码字号。； 默认值：13px。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-danger-border</code></td>
      <td><pre><code>--vp-custom-block-danger-border</code></pre></td>
      <td>组件：自定义块； 危险自定义块边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-font-size</code></td>
      <td><pre><code>--vp-custom-block-font-size</code></pre></td>
      <td>组件：自定义块； 自定义块字号。； 默认值：14px。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-important-border</code></td>
      <td><pre><code>--vp-custom-block-important-border</code></pre></td>
      <td>组件：自定义块； 重要自定义块边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-info-border</code></td>
      <td><pre><code>--vp-custom-block-info-border
└── --vp-custom-block-details-border</code></pre></td>
      <td>组件：自定义块； 信息自定义块边框值。； 默认值：transparent。； 下游可覆盖 1 个变量。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-note-border</code></td>
      <td><pre><code>--vp-custom-block-note-border</code></pre></td>
      <td>组件：自定义块； 说明自定义块边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-tip-border</code></td>
      <td><pre><code>--vp-custom-block-tip-border</code></pre></td>
      <td>组件：自定义块； 提示自定义块边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-custom-block-warning-border</code></td>
      <td><pre><code>--vp-custom-block-warning-border</code></pre></td>
      <td>组件：自定义块； 警告自定义块边框值。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-font-family-base</code></td>
      <td><pre><code>--vp-font-family-base</code></pre></td>
      <td>排版； 基础正文字体栈。； 无下游变量，直接被默认主题样式消费。； 含语言覆盖。</td>
    </tr>
    <tr>
      <td><code>--vp-font-family-mono</code></td>
      <td><pre><code>--vp-font-family-mono</code></pre></td>
      <td>排版； 等宽字体栈。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-header-anchor-symbol</code></td>
      <td><pre><code>--vp-header-anchor-symbol</code></pre></td>
      <td>组件：标题锚点； 标题锚点符号。； 默认值：'#'。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-home-hero-image-background-image</code></td>
      <td><pre><code>--vp-home-hero-image-background-image</code></pre></td>
      <td>组件：首页； 首页 Hero 插图背景图像。； 默认值：none。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-home-hero-image-filter</code></td>
      <td><pre><code>--vp-home-hero-image-filter</code></pre></td>
      <td>组件：首页； 首页 Hero 插图滤镜。； 默认值：none。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-home-hero-name-background</code></td>
      <td><pre><code>--vp-home-hero-name-background</code></pre></td>
      <td>组件：首页； 首页 Hero 名称背景。； 默认值：transparent。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-icon-copied</code></td>
      <td><pre><code>--vp-icon-copied</code></pre></td>
      <td>组件：图标； 代码复制成功图标资源。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-icon-copy</code></td>
      <td><pre><code>--vp-icon-copy</code></pre></td>
      <td>组件：图标； 代码复制按钮图标资源。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-layout-max-width</code></td>
      <td><pre><code>--vp-layout-max-width</code></pre></td>
      <td>布局； 布局最大宽度。； 默认值：1440px。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-nav-height</code></td>
      <td><pre><code>--vp-nav-height</code></pre></td>
      <td>组件：导航； 导航高度。； 取值：64px / 0px / 22px。； 无下游变量，直接被默认主题样式消费。； 含局部状态覆盖。</td>
    </tr>
    <tr>
      <td><code>--vp-nav-logo-height</code></td>
      <td><pre><code>--vp-nav-logo-height</code></pre></td>
      <td>组件：导航； 导航 Logo 高度。； 默认值：24px。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-shadow-1</code></td>
      <td><pre><code>--vp-shadow-1</code></pre></td>
      <td>阴影； 1 级阴影预设。； 取值：0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-shadow-2</code></td>
      <td><pre><code>--vp-shadow-2</code></pre></td>
      <td>阴影； 2 级阴影预设。； 取值：0 3px 12px rgba(0, 0, 0, 0.07), 0 1px 4px rgba(0, 0, 0, 0.07)。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-shadow-3</code></td>
      <td><pre><code>--vp-shadow-3</code></pre></td>
      <td>阴影； 3 级阴影预设。； 取值：0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-shadow-4</code></td>
      <td><pre><code>--vp-shadow-4</code></pre></td>
      <td>阴影； 4 级阴影预设。； 取值：0 14px 44px rgba(0, 0, 0, 0.12), 0 3px 9px rgba(0, 0, 0, 0.12)。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-shadow-5</code></td>
      <td><pre><code>--vp-shadow-5</code></pre></td>
      <td>阴影； 5 级阴影预设。； 取值：0 18px 56px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.16)。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-sidebar-width</code></td>
      <td><pre><code>--vp-sidebar-width</code></pre></td>
      <td>组件：侧边栏； 侧边栏宽度。； 默认值：272px。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-z-index-backdrop</code></td>
      <td><pre><code>--vp-z-index-backdrop</code></pre></td>
      <td>层级； 遮罩层级值。； 默认值：50。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-z-index-footer</code></td>
      <td><pre><code>--vp-z-index-footer</code></pre></td>
      <td>层级； 页脚层级值。； 默认值：10。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-z-index-layout-top</code></td>
      <td><pre><code>--vp-z-index-layout-top</code></pre></td>
      <td>层级； 布局顶层层级值。； 默认值：40。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-z-index-local-nav</code></td>
      <td><pre><code>--vp-z-index-local-nav</code></pre></td>
      <td>层级； 局部导航层级值。； 默认值：20。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-z-index-nav</code></td>
      <td><pre><code>--vp-z-index-nav</code></pre></td>
      <td>层级； 主导航层级值。； 默认值：30。； 无下游变量，直接被默认主题样式消费。</td>
    </tr>
    <tr>
      <td><code>--vp-z-index-sidebar</code></td>
      <td><pre><code>--vp-z-index-sidebar</code></pre></td>
      <td>层级； 侧边栏层级值。； 取值：60 / 25。； 无下游变量，直接被默认主题样式消费。； 含响应式覆盖。</td>
    </tr>
  </tbody>
</table>

## 未声明扩展钩子

这些变量在默认主题源码中被 `var(--vp-*)` 使用，但没有在默认主题内部声明。它们更像“扩展钩子”或“兼容位”，因此不纳入上面的根变量主表。

- `--vp-c-shadow-3`：使用位置为 `node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue`；默认主题内部仍有兼容式引用，建议自定义阴影体系时显式映射到 `--vp-shadow-3`。
- `--vp-doc-top-height`：使用位置为 `node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue`；文档正文顶部额外偏移钩子，常用于在导航之外再叠加额外吸顶区域。
- `--vp-layout-top-height`：使用位置为 `node_modules/vitepress/dist/client/theme-default/components/VPContent.vue`、`node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue`、`node_modules/vitepress/dist/client/theme-default/components/VPHero.vue`、`node_modules/vitepress/dist/client/theme-default/components/VPLocalNav.vue`、`node_modules/vitepress/dist/client/theme-default/components/VPNav.vue`、`node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue`、`node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue`；全局布局顶部偏移钩子，影响内容区、导航、侧边栏和 Hero 的整体下移。
- `--vp-offset`：使用位置为 `node_modules/vitepress/dist/client/theme-default/components/VPHomeContent.vue`；首页内容偏移钩子，用于局部布局细调。
- `--vp-vh`：使用位置为 `node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue`；可视区高度钩子，适合在移动端修正视口高度差异。

## 如何使用这份表

- 在想找“最值得先改”的变量时，先看左侧的根变量列，再结合 `references/variable-groups.md` 做第一轮筛选。
- 在想判断某个组件颜色会被哪些上游变量牵动时，直接看 `引用关系` 列里的树状链路。
- 在想知道某个值更适合通过变量覆盖、选择器覆盖还是组件替换解决时，先确认它是不是默认主题已经声明的 `--vp-*` 变量。
- 在升级 VitePress 后，如果主题行为变了，优先重新核对这份表依赖的版本口径，而不是假设旧链路一定不变。

