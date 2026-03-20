# Variable Groups

这个文件保留，但它不再试图重复 `variable-tree.md` 的完整信息。
把它当成一份从 `variable-tree.md` 提炼出来的“首轮筛选索引”：

- `SKILL.md` 负责讲覆盖默认主题的工作流和升级路径。
- `variable-groups.md` 负责帮你快速挑出“先看哪一层变量”。
- `variable-tree.md` 负责提供权威的父子引用链、根变量总表和未声明扩展钩子。

如果你已经知道要查哪条链路，直接去读 `variable-tree.md`。

## 为什么保留这份文件

`variable-tree.md` 很完整，但也很重，适合核对和深挖，不适合第一次下手时快速决策。
这份文件的目标只有一个：把“先改哪一层”压缩成一页可扫读的清单。

## 1. Root Surface Layer

这一层最适合做第一轮主题重涂，因为它直接决定页面是否先形成完整的表面、文本和分隔关系。

- `--vp-c-bg`
- `--vp-c-bg-alt`
- `--vp-c-bg-elv`
- `--vp-c-bg-soft`
- `--vp-c-text-1`
- `--vp-c-text-2`
- `--vp-c-text-3`
- `--vp-c-border`
- `--vp-c-divider`
- `--vp-c-gutter`
- `--vp-shadow-1` 到 `--vp-shadow-5`
- `--vp-font-family-base`
- `--vp-font-family-mono`
- `--vp-layout-max-width`
- `--vp-nav-height`
- `--vp-nav-logo-height`
- `--vp-sidebar-width`

适合场景：

- 先把 light / dark 的可读性和页面层次建立起来
- 改页面气质，但暂时不碰更深的语义链
- 想安全地调整宽度、字体、导航尺度、侧边栏尺度

## 2. Root Palette Layer

这一层是“让默认派生链整体跟着变”的入口。
如果你想保留默认主题的大部分映射关系，就优先看这一层，而不是直接改中间语义层。

- 基础实体色：`--vp-c-white`、`--vp-c-black`
- 默认灰阶源头：`--vp-c-gray-1`、`--vp-c-gray-2`、`--vp-c-gray-3`、`--vp-c-gray-soft`
- 品牌主色源头：`--vp-c-indigo-1`、`--vp-c-indigo-2`、`--vp-c-indigo-3`、`--vp-c-indigo-soft`
- 成功色源头：`--vp-c-green-*`
- 警告色源头：`--vp-c-yellow-*`
- 危险色源头：`--vp-c-red-*`
- important 源头：`--vp-c-purple-*`
- 特殊强调色：`--vp-c-sponsor`

从 `variable-tree.md` 可以直接看到这些根变量的典型下游：

- `--vp-c-indigo-*` 会继续影响 `--vp-c-brand-*`、`--vp-c-tip-*`、`--vp-c-note-*`、代码高亮、局部搜索高亮、Hero 名称等。
- `--vp-c-gray-*` 会继续影响 `--vp-c-default-*`、次级按钮、部分代码块、自定义块 info / note 等。
- `--vp-c-red-*`、`--vp-c-yellow-*`、`--vp-c-green-*`、`--vp-c-purple-*` 会继续驱动 danger / warning / success / important 相关链路。

适合场景：

- 想系统性替换默认主题色板
- 希望更多组件自动跟随，而不是手工逐项覆盖
- 可以接受一定的版本适配成本

## 3. Semantic Middle Layer

这一层不是“根变量优先”的第一选择。
从 `variable-tree.md` 看，它们大多已经处在根变量和组件变量之间，属于默认主题内部的中间语义层。

- `--vp-c-brand-*`
- `--vp-c-note-*`
- `--vp-c-tip-*`
- `--vp-c-default-*`
- `--vp-c-success-*`
- `--vp-c-warning-*`
- `--vp-c-danger-*`
- `--vp-c-caution-*`
- `--vp-c-important-*`

适合场景：

- 你明确想打破默认派生关系
- 想快速换品牌感，但不想整体重做根色板
- 只希望某条语义链脱离上游根变量

不适合场景：

- 还没确认是否能通过根变量解决问题
- 想保持“谁是最终颜色源头”这件事足够清晰

## 4. Component Hook Layer

这一层适合在全局层和语义层已经稳定之后，再做局部表达。
它们通常是默认主题暴露出来的组件级变量入口。

- 导航：`--vp-nav-*`
- 本地搜索：`--vp-local-search-*`
- 首页 Hero：`--vp-home-hero-*`
- 按钮：`--vp-button-*`
- 徽章：`--vp-badge-*`
- 自定义块：`--vp-custom-block-*`
- 代码：`--vp-code-*`
- 输入控件：`--vp-input-*`

适合场景：

- 某个组件需要独立皮肤
- 全局色板已经合理，但局部还不够贴合设计意图
- 你已经明确不想再通过上游根变量去联动更多组件

## 5. Special Cases From The Tree

下面这些点很值得从 `variable-tree.md` 带回脑子里：

- `--vp-c-neutral` 和 `--vp-c-neutral-inverse` 不是单父节点变量，它们和 `--vp-c-black` / `--vp-c-white` 的翻转关系有关。
- `--vp-local-search-result-bg` 也不是简单单父节点变量，它和默认值、选中态重映射都有关系。
- `--vp-code-copy-copied-text-content` 属于文案 / 本地化变量，不是主题换色变量。
- `--vp-c-shadow-3`、`--vp-doc-top-height`、`--vp-layout-top-height`、`--vp-offset`、`--vp-vh` 是未声明扩展钩子，适合单独判断，不要和主表里的根变量混为一谈。

## 决策捷径

可以按这个顺序做第一次判断：

1. 先看 Root Surface Layer，先把页面表面和可读性站稳。
2. 再决定要走 Root Palette Layer 还是 Semantic Middle Layer。
3. 只有在局部还不够准时，再落到 Component Hook Layer。
4. 只要需要确认具体影响链，就回到 `variable-tree.md` 查父子关系。
