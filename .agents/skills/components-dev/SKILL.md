---
name: components-dev
description: "用于 nil-design 仓库中设计、开发、重构、测试、文档化或维护 @nild/components 公开组件、内部组件能力、样式变体、复合组件 API、组件文档、API 生成产物和组件总览资源。修改公开面、样式协议、交互行为或文档前，先从当前源码核对事实。"
---

# 开发组件

用于 nil-design 的 `@nild/components` 工作。先以当前源码确定事实，再按以下维护偏好实现、文档化和验证。

## 第一轮核对

- 先读 `packages/components/src/index.ts` 判断公开组件面；有目录不等于公开，有文档页也不等于来自 components 包。
- 读最接近目标的现有组件目录：入口、主组件、`interfaces/`、`style/`、测试、子组件、contexts、hooks 和内部 `_shared` 用法。
- 改视觉前读 `packages/components/src/tailwind.css`，确认已有 ND tokens、语义 utility、自定义 variant、字号、圆角、阴影和禁用态能力。
- 改公开 props、复合子组件、文档或 API 产物时读 `references/docs-api.md`。
- 需要选择组件结构、状态模型、slot 模型或键盘交互时读 `references/patterns.md`。

## 公开边界

- 根入口导出、组件文档、API include、组件总览是用户可见边界；内部目录、实验基础能力和生成中间产物不是自动公开边界。
- 新增公开能力时同步考虑源码入口、类型、测试、文档、API 生成和组件总览；新增内部能力时默认不更新公开文档。
- 公开 props 命名保持语义稳定，描述使用方意图，不暴露内部 runtime 字段、临时缓存或实现细节。

## 实现偏好

- 默认组件结构为 `index.ts`、`<Component>.tsx`、`interfaces/index.d.ts`、`style/index.ts`；按复杂度增加 `__tests__/`、contexts、hooks、子组件或内部 `_shared/`。
- 样式用 ND tokens、Tailwind 语义 utility 和 `cva` 组织；外部 `className` 用 `cnMerge` 合并。
- `cva` variants 表达样式差异，不把 `open`、`active`、`selected`、`disabled` 等运行时语义当成状态源。
- 共享禁用视觉走 `packages/components/src/_shared/style`；原生控件用 `disabled`，非原生交互节点用 `aria-disabled`，视觉承载 wrapper 用 `data-disabled={disabled || undefined}`。
- 公开复合组件用目录入口 `Object.assign` 聚合，并给主组件和公开子组件设置 `displayName`。
- 内部结构扩展优先使用插槽子组件，如 `Label`、`Indicator`、`Trigger`、`Portal`；只有已有成熟先例时才新增 `icon`、`prefixNode`、`renderXxx` 这类节点注入 prop。
- 受控/非受控值优先复用 `useControllableState`；被动共享状态用 `createContextSuite`；子节点语义识别用 `registerSlots`。
- 父组件负责交互装配：refs、focus、键盘导航、active item、测量、滚动定位和关闭回焦；子 hook 消费明确输入，不反向扫描 DOM。
- 对外回调不要埋进 state updater 或 dispatcher；先求 `nextState`，再通过统一出口写内部状态并触发外部回调。
- 渲染结果直接来自 props/state/memo 派生值，不用事件稳定回调或 effect 反向驱动 render 判断。
- 表单类控件遵循 nild 控件协议：`onChange` 第一参数是字段值，整体表单值使用单数命名，如 `FormValue`、`formValue`、`defaultValue`、`onChange(value)`。

## 验证

- 组件实现优先运行聚焦测试和 `pnpm components:build`。
- 公开组件新增、重命名或调整根入口时，按需补根导出测试，防止文档可见但包入口遗漏。
- 组件单测默认断言语义、行为、可访问属性、回调和公开状态；避免为了覆盖视觉实现而断言纯视觉 class。
- 只有 class / style 本身是公开样式协议、状态 marker、用户 `className` 路由或明确回归点时，才做窄断言；不要断言完整 class 列表或快照。
- 公开 API 变化运行 `pnpm components:api`；图标 API 变化运行 `pnpm icons:api`。
- 文档或组件总览变化按影响运行 `pnpm docs:build`，视觉变化启动 docs 并截图确认 light/dark。
- 跨包或共享行为变化再扩大到 `pnpm lint`、`pnpm typecheck`、`pnpm build` 或 `pnpm test:coverage`。
