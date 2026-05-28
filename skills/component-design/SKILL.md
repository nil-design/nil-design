---
name: component-design
description: 用于在 nil-design 仓库中设计、实现或刷新 @nild/components 公开组件、组件文档中的 @nild/icons 图标能力与内部基础能力。适用于需要先核对当前公开导出和既有模式（button、field/form、input、checkbox/radio、select、popup + wrappers、modal、transition），再基于 ND tokens、`cva`、现有文档与半托管 API 工具链完成交付和验收的场景。
---

# 组件设计

## 目标与边界

用于 nil-design 的组件工作流：先对齐现有模式，再完成实现、文档、API 生成与验收。

- 公开组件：面向使用者暴露，通常需要更新 `packages/components/src/index.ts`、`docs/zh-CN/components/<component>/index.md` 和半托管的 `API.zh-CN.md`。
- 图标文档：`docs/zh-CN/components/icon/index.md` 属于组件文档导航，但 API 来自 `packages/icons/src/API.zh-CN.md`，由 `pnpm icons:api` 生成。
- 内部基础能力：只支撑其他组件，不默认加入根入口或公开文档。
- 如果已有组件模式能解释需求，优先复用模式，不新增孤立的目录结构、API 风格或抽象。

## 必须先核对的事实

不要靠目录名猜公开面，先读仓库事实：

1. `packages/components/src/index.ts`：当前公开导出为 `Button`、`Checkbox`、`Divider`、`Field`、`Form`、`Input`、`Modal`、`Popover`、`Radio`、`Select`、`Switch`、`Tooltip`、`Transition`、`TransitionStatus`、`Typography`。组件总览还包含 `Icon` 文档页，但它来自 `@nild/icons`，不是 `@nild/components` 根入口。
2. 最接近需求的组件目录：至少读入口、主组件、`interfaces/`、`style/`、测试、子组件或上下文。
3. 对应 `docs/zh-CN/components/<name>/index.md`：确认章节、示例组织和语气。
4. `packages/components/scripts/generate-api.js`：API 会扫描 `src/*/index.ts`，跳过 `_` 开头目录和无入口目录，读取 `@category Components` 并展开复合子组件；生成前会解析旧 `API.zh-CN.md`，保留描述列。
5. `packages/icons/scripts/generate-api.js`：Icon API 走同样的半托管流程，入口是 `packages/icons/src/index.ts`，输出到 `packages/icons/src/API.zh-CN.md`。
6. `scripts/shared/docs/parseApiMarkdown.js`：components 与 icons 共享的旧 API 表格解析器，按 `### <Name> Props` section 和属性名保留描述。
7. `docs/.vitepress/getThemeConfig.js`：组件文档侧边栏来自 frontmatter 自动收录。
8. `docs/.vitepress/theme/components/react-live/ReactLive.jsx`：需要确认示例可用 import scope 时再读。

当前关键事实：

- `packages/components/src/popup/` 存在，但不是根入口公开组件；是否公开以根入口和文档页为准。
- `Modal` 已经统一 dialog/drawer，并在目录内部协同 open state、motion、portal、focus scope、scroll lock 与 stack。
- 视觉基础来自 `packages/components/src/tailwind.css` 中的 ND tokens 与 Tailwind 语义别名。
- `cva`、`cnMerge`、`createContextSuite` 来自 `@nild/shared`；`useControllableState` 等行为 helper 来自 `@nild/hooks`；`registerSlots`、`mergeProps`、`mergeHandlers`、`lockDocumentScroll` 等内部工具来自 `packages/components/src/_shared/utils`。
- API 文档是“半托管”产物：属性名、类型、默认值、继承/等价关系由 extractor 刷新；中文“描述”列允许人工维护，并会在下一次生成时按 `组件名.属性名` 保留。

## 实现决策

先判断参考模式：

- 视觉变体和复合导出：参考 `button`。
- 表单语义与字段组合：参考 `field`、`form`。
- 受控输入与多插槽子组件：参考 `input`。
- 槽位解析与上下文共享：参考 `checkbox`、`radio`。
- 选择器、键盘导航、父组件 refs 与 active item：参考 `select`。
- 锚定型弹层能力与薄封装：参考 `popup`、`tooltip`、`popover`。
- 流程打断型覆盖层：参考 `modal`。
- 轻量状态驱动包装：参考 `transition`。

实现规则：

- 默认目录为 `index.ts`、`<Component>.tsx`、`interfaces/index.d.ts`、`style/index.ts`；按需增加 `__tests__/`、`contexts/`、`hooks/`、复合子组件和内部 `_shared/`。
- 样式围绕 ND tokens 和 `cva` 组织；结构写在组件文件，视觉变体写在 `style/index.ts`，外部 `className` 只通过 `cnMerge` 合并。
- `cva` variants 只表达样式差异，不把 `open`、`active`、`selected`、`disabled` 一类语义 class 当成变体事实来源。
- 通用禁用态统一使用 `packages/components/src/_shared/style` 的 default helper：`sharedVariants.disabled()`。需要承载禁用视觉的组件样式把它放进 base class；不要再输出 `.disabled` class，也不要为了占位定义 `disabled: { true: '', false: '' }` 这类空 variant，调用侧没有样式差异时也不要把 `disabled` 传给 `cva`。
- `sharedVariants.disabled()` 内部会加入 `nd-disabled-carrier` marker、`disabled:*` 交互反馈和 `disabled-visual:*` 视觉衰减。`nd-disabled-carrier` 只标记“这个节点会承载禁用视觉”，不单独定义 CSS。`disabled` variant 匹配 `:disabled`、`[aria-disabled='true']`、`[data-disabled]`；`disabled-visual` 使用同样语义，但当前节点处于另一个已禁用的 `.nd-disabled-carrier` 祖先内时不生效，避免父子组件重复 opacity / grayscale。
- 禁用运行时属性按节点职责选择：原生可禁用元素使用 `disabled={disabled}`；非原生交互节点使用 `aria-disabled={disabled}`；只作为视觉承载的包装节点使用 `data-disabled={disabled || undefined}`。不要把 `data-disabled` 写成直接 boolean，因为 React 会渲染 `data-disabled="false"`，而 Tailwind 的 `[data-disabled]` presence selector 会把它误判为禁用。
- 父组件或祖先组件禁用时，父级 `.nd-disabled-carrier[data-disabled]` 负责整体视觉衰减；子级仍可以通过 `disabled:*` 保留 `cursor-not-allowed` / `select-none` 等非叠加语义，但不重复应用 `disabled-visual:*`。组件特有禁用差异可以继续保留，例如局部 `text-subtle`，但 opacity / grayscale 统一走 `sharedVariants.disabled()`。
- 公开复合组件默认在 `index.ts` 用 `Object.assign` 聚合；主组件和公开子组件都设置 `displayName`。
- 类型集中在 `interfaces/index.d.ts`；公共 props 使用语义直接的命名，不暴露带下划线或内部运行时感过强的字段。
- 内部节点扩展默认使用插槽子组件，例如 `Component.Label`、`Component.Indicator`、`Component.Trigger`、`Component.Portal`；只有成熟先例支持时才沿用 `icon`、`prefixNode`、`renderXxx` 等节点注入型 prop。
- 受控/非受控状态优先复用 `useControllableState`；上下文共享优先复用 `createContextSuite`；槽位解析优先复用 `registerSlots`。
- 父组件负责运行时交互装配。涉及焦点、键盘导航、active item、滚动定位或测量时，由父组件持有 DOM refs、可用索引和派生状态，hook 消费输入，不用 `querySelectorAll` 反向收集内部节点。
- DOM ref 快照本地变量统一以 `$` 开头，例如 `const $listbox = listboxRef.current`。
- context 默认承载被动共享状态和视觉参数，不承载选择、激活、关闭等动作方法，除非现有模式已有明确需要。
- 对外回调不要放进 state updater / dispatcher 里；先求 `nextState`，再通过统一出口写内部状态并触发外部回调。
- 渲染结果必须直接依赖当前同步状态或 memo 派生值；不要用 `useEffectCallback` 一类事件稳定回调驱动 render 判断。
- 表单类运行时遵循 nild 控件协议：`onChange` 第一参数是字段值，整体表单值命名使用单数 `FormValue`、`formValue`、`defaultValue`、`onChange(value)`，绑定能力只覆盖真实需要的窄集合。

需要更具体的正反例和参考组件细节时，读 `references/component-patterns.md`。

## 文档与 API

- 只有公开组件才默认新增或更新 `docs/zh-CN/components/<component>/index.md`；内部基础能力不默认文档化。
- frontmatter 至少包含 `title`、`cat`，需要排序时再加 `catOrder`；`cat` 只从 `通用`、`输入`、`展示`、`布局`、`其它` 中选择。
- 标题使用 `# {{ $frontmatter.title }}`；标题下方用一句中文说明用途；章节按用户可感知场景组织，不按源码文件拆节。
- 示例统一使用 `react-live`，可直接导入 `react`、`@nild/components`、`@nild/hooks`、`@nild/shared`、`@nild/icons`、`@nild/icons/Layers`。
- 示例布局优先使用 Tailwind 预设刻度；支持内部节点扩展时展示插槽写法；portal / 浮层内容按需加 `className="vp-raw"` 避免 VitePress 样式污染。
- 页面末尾固定追加 API include，不手写 API 表格：

```md
## API

<!--@include: ../../../../packages/components/src/<component>/API.zh-CN.md-->
```

- Icon 页使用 icons 包的 API include：

```md
## API

<!--@include: ../../../../packages/icons/src/API.zh-CN.md-->
```

- 公开组件若要进入 `pnpm components:api` 产物，必须有 `packages/components/src/<component>/index.ts` 入口，且 Typedoc 能从该入口解析到带 `@category Components` 的公开导出；希望进入 API 文档的公开复合子组件也遵循这条约束。
- 新公开组件、props 变化、公开子组件变化或新增 API include 时，必须执行 `pnpm components:api`；图标 API 变化必须执行 `pnpm icons:api`。
- `API.zh-CN.md` 只能人工维护“描述”列；不要手改属性名、类型、默认值等结构列，这些列会被生成器覆盖。
- 描述列风格保持简洁：上下文已经明确主语时省略组件名或“是否”等冗余词，例如写“视觉样式。”、“禁用状态。”、“值变化回调。”；保留受控/默认、回调时机、等价关系等必要信息。
- 不需要在源码注释中写多语种描述。`summary` 或 `@description` 只作为旧 Markdown 没有描述时的兜底；中文描述以 `API.zh-CN.md` 的描述列为准。
- `parseApiMarkdown` 只解析本仓库生成器输出的标准 API 表格；如果调整表头、section 标题或表格格式，要同步更新 `scripts/shared/docs/parseApiMarkdown.js`，并同时验证 components 与 icons。
- 生成器输出会按 `[created]`、`[updated]`、`[unchanged]` 分组。只改描述列后再次执行脚本，若结构列没有变化，预期应输出 `[unchanged]`。
- 如果 `API.zh-CN.md` 缺少主组件或公开子组件，先查目录入口是否存在；再查 `@category Components` 是否能从入口被解析到；再查 `Object.assign` 或当前公开导出结构是否仍能让 Typedoc 识别这些导出。
- 新公开组件若同步新增 `docs/zh-CN/components/<component>/index.md`，还要补组件总览卡片与缩略图。这部分不是自动生成，默认同步三处：
  - `docs/zh-CN/components/index.md`：在 `componentCards` 中新增卡片，`slug` 与组件文档目录名保持一致，`title` 默认复用组件文档 frontmatter 的 `title`。
  - `docs/.vitepress/theme/components/component-catalog/ComponentCatalog.vue`：新增对应 SVG import，并把 `slug -> markRaw(Icon)` 补进 `iconMap`。
  - `docs/.vitepress/theme/icons/components/<component>.svg`：新增组件剪影 SVG。
- 组件总览卡片默认追加到现有手工列表末尾；只有需求明确指定展示顺序时才调整插入位置。
- 组件剪影 SVG 统一使用 `viewBox="0 0 120 80"`，只使用当前目录已有的 ND token 色值语义，例如 `--nd-color-brand-60`、`--nd-color-neutral-0`、`--nd-color-neutral-15`、`--nd-color-neutral-60`。
- 组件剪影以“可识别的组件轮廓或典型使用场景”表达，不做截图式还原、不放文字、不加渐变；几何形状保持简洁，只有组件本身依赖层级关系时才用轻量 offset / shadow 表达层次。

文档模板和章节偏好见 `references/docs-style.md`。

## 验收

按改动范围选择验证：

1. 组件实现：`pnpm components:build`、`pnpm components:test`。
2. 组件 API 变化：`pnpm components:api`。
3. 图标 API 变化：`pnpm icons:api`。
4. 公开文档变化：`pnpm docs:build`。
5. 准备合并前按范围追加 `pnpm lint`、`pnpm typecheck`、`pnpm build`、`pnpm test:coverage`。

`docs:build` 若刷新 `docs/public/embeddings/*.json`，除非任务需要更新搜索索引，否则还原这些验证副作用并清理浏览器或截图临时文件。

交付前人工核对：

- 是否先判断公开组件 / 内部基础能力边界。
- 是否对齐现有参考模式，而不是引入孤立风格。
- 样式是否基于 ND tokens 与 `cva`。
- 是否只在公开需要时更新根入口、文档页、总览卡片 / 缩略图和 API。
- API 文档是否只人工维护描述列，且执行对应的 `components:api` 或 `icons:api` 后保持描述不丢失。
- 测试是否覆盖核心行为与关键交互，而不只是渲染成功。

## 按需阅读 references

- `references/component-patterns.md`：需要选择参考组件、处理 API 收敛或查具体模式时读。
- `references/docs-style.md`：需要创建或重写组件文档页时读。
