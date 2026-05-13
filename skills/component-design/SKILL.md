---
name: component-design
description: 用于在 nil-design 仓库中设计、实现或刷新 @nild/components 公开组件与内部基础能力。适用于需要先核对当前公开导出和既有模式（button、field/form、input、checkbox/radio、select、popup + wrappers、modal、transition），再基于 ND tokens、`cva`、现有文档与 API 工具链完成交付和验收的场景。
---

# 组件设计

## 目标与边界

用于 nil-design 的组件工作流：先对齐现有模式，再完成实现、文档、API 生成与验收。

- 公开组件：面向使用者暴露，通常需要更新 `packages/components/src/index.ts`、`docs/zh-CN/components/<component>/index.md` 和生成的 `API.zh-CN.md`。
- 内部基础能力：只支撑其他组件，不默认加入根入口或公开文档。
- 如果已有组件模式能解释需求，优先复用模式，不新增孤立的目录结构、API 风格或抽象。

## 必须先核对的事实

不要靠目录名猜公开面，先读仓库事实：

1. `packages/components/src/index.ts`：当前公开导出为 `Button`、`Checkbox`、`Divider`、`Field`、`Form`、`Input`、`Modal`、`Popover`、`Radio`、`Select`、`Switch`、`Tooltip`、`Transition`、`TransitionStatus`、`Typography`。
2. 最接近需求的组件目录：至少读入口、主组件、`interfaces/`、`style/`、测试、子组件或上下文。
3. 对应 `docs/zh-CN/components/<name>/index.md`：确认章节、示例组织和语气。
4. `packages/components/scripts/generate-api.js`：API 会扫描 `src/*/index.ts`，跳过 `_` 开头目录和无入口目录，读取 `@category Components` 并展开复合子组件。
5. `docs/.vitepress/getThemeConfig.js`：组件文档侧边栏来自 frontmatter 自动收录。
6. `docs/.vitepress/theme/components/react-live/ReactLive.jsx`：需要确认示例可用 import scope 时再读。

当前关键事实：

- `packages/components/src/popup/` 存在，但不是根入口公开组件；是否公开以根入口和文档页为准。
- `Modal` 已经统一 dialog/drawer，并在目录内部协同 open state、motion、portal、focus scope、scroll lock 与 stack。
- 视觉基础来自 `packages/components/src/tailwind.css` 中的 ND tokens 与 Tailwind 语义别名。
- `cva`、`cnMerge`、`createContextSuite` 来自 `@nild/shared`；`useControllableState` 等行为 helper 来自 `@nild/hooks`；`registerSlots`、`mergeProps`、`mergeHandlers`、`lockDocumentScroll` 等内部工具来自 `packages/components/src/_shared/utils`。

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

- 公开组件若要进入 `pnpm components:api` 产物，必须有 `packages/components/src/<component>/index.ts` 入口，且 Typedoc 能从该入口解析到带 `@category Components` 的公开导出；希望进入 API 文档的公开复合子组件也遵循这条约束。
- 新公开组件、props 变化、公开子组件变化或新增 API include 时，必须执行 `pnpm components:api`。
- 如果 `API.zh-CN.md` 缺少主组件或公开子组件，先查目录入口是否存在；再查 `@category Components` 是否能从入口被解析到；再查 `Object.assign` 或当前公开导出结构是否仍能让 Typedoc 识别这些导出。

文档模板和章节偏好见 `references/docs-style.md`。

## 验收

按改动范围选择验证：

1. 组件实现：`pnpm components:build`、`pnpm components:test`。
2. API 变化：`pnpm components:api`。
3. 公开文档变化：`pnpm docs:build`。
4. 准备合并前按范围追加 `pnpm lint`、`pnpm typecheck`、`pnpm build`、`pnpm test:coverage`。

`docs:build` 若刷新 `docs/public/embeddings/*.json`，除非任务需要更新搜索索引，否则还原这些验证副作用并清理浏览器或截图临时文件。

交付前人工核对：

- 是否先判断公开组件 / 内部基础能力边界。
- 是否对齐现有参考模式，而不是引入孤立风格。
- 样式是否基于 ND tokens 与 `cva`。
- 是否只在公开需要时更新根入口、文档页和 API。
- 测试是否覆盖核心行为与关键交互，而不只是渲染成功。

## 按需阅读 references

- `references/component-patterns.md`：需要选择参考组件、处理 API 收敛或查具体模式时读。
- `references/docs-style.md`：需要创建或重写组件文档页时读。
