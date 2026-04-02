---
name: component-design
description: 用于在 nil-design 仓库中设计、实现或刷新 @nild/components 组件与内部基础能力。适用于需要先核对当前公开导出和既有模式（button、input、checkbox/radio、popup + wrappers、modal、transition），再基于 ND tokens、`cva`、现有文档与 API 工具链完成交付和验收的场景。
---

# 组件设计

## 概览

把这个技能用于 nil-design 仓库中的组件工作流，目标不是只把组件“写出来”，而是把组件从模式对标、实现、文档、API 生成到验收一次完成。

先明确这次工作属于哪一类：

- 公开组件：需要面向使用者暴露，通常需要更新 `packages/components/src/index.ts`、补齐 `docs/zh-CN/components/<component>/index.md`，并让 API 文档可被页面引用。
- 内部基础能力：仅用于支撑其他公开组件，可以只存在于 `packages/components/src/<component>/`，不必默认写入根入口或公开文档。

如果能用现有模式解释新需求，就不要发明新的组件抽象、目录结构或 API 风格。

## 当前架构快照

先用仓库事实判断当前组件体系，不要靠目录名猜测公开面：

- 当前 `@nild/components` 的公开面以 `packages/components/src/index.ts` 为准：`Button`、`Checkbox`、`Divider`、`Input`、`Modal`、`Popover`、`Radio`、`Switch`、`Tooltip`、`Transition`、`Typography`。
- `packages/components/src/popup/` 仍然存在，但它更像内部基础能力而不是根入口公开组件；是否公开以根入口和文档页为准，不以目录是否存在为准。
- 当前覆盖层模式不再只有 `popup -> tooltip/popover`。`Modal` 已经把 dialog/drawer 统一成一个公开组件模式，相关 open state、motion、portal、focus scope、scroll lock 与 stack 都由 `modal` 目录内部协同完成。
- 视觉与语义基础来自 `packages/components/src/tailwind.css` 中的 ND tokens 与 Tailwind 语义别名。
- 关键 helper 来源要明确：
  - `cva`、`cnMerge`、`createContextSuite` 来自 `@nild/shared`
  - `useControllableState`、`useEffectCallback`、`useIsomorphicLayoutEffect` 等行为 helper 来自 `@nild/hooks`
  - `registerSlots`、`mergeProps`、`mergeHandlers`、`lockDocumentScroll` 等组件内部工具来自 `packages/components/src/_shared/utils`

## 无上下文 Agent 首轮检查

如果当前 agent 对 nil-design 没有项目上下文，开始实现前强制先读下面这些事实来源：

1. `packages/components/src/index.ts`：确认哪些组件是真正公开导出的。
2. 最接近需求的参考组件目录：至少阅读 `index.ts`、主组件文件、`interfaces/index.d.ts`、`style/index.ts`、测试文件与相关子组件或上下文文件。
3. 对应的 `docs/zh-CN/components/<name>/index.md`：确认文档分节、示例组织方式与语气。
4. `packages/components/scripts/generate-api.js`：确认 API 文档是如何扫描 `src/*/index.ts`、识别 `@category Components` 并展开复合子组件的。
5. `docs/.vitepress/getThemeConfig.js`：确认组件文档侧边栏是基于 frontmatter 自动收录的，而不是手工维护。
6. `docs/.vitepress/theme/components/react-live/ReactLive.jsx`：如果文档示例需要 `react`、`@nild/hooks`、`@nild/shared` 或 `@nild/icons` 导入，先确认当前 `react-live` scope。

需要更具体的代码组织示例时，再阅读 `references/component-patterns.md`；需要文档模板时，再阅读 `references/docs-style.md`。

## 参考模式

先判断新组件更接近哪一类，再决定实现方式：

- 标准复合导出组件：参考 `button`
- 受控输入与多插槽子组件：参考 `input`
- 槽位解析与上下文共享：参考 `checkbox`、`radio`
- 锚定型弹层基础能力与薄封装：参考 `popup`、`tooltip`、`popover`
- 流程打断型覆盖层：参考 `modal`
- 轻量单组件与状态驱动包装：参考 `transition`

如果需求本质上是已有基础能力的轻量包装，优先复用基础组件，而不是复制一份逻辑。

## 设计规范

- 围绕 `packages/components/src/tailwind.css` 中的 ND tokens 与 Tailwind 语义别名设计视觉层，不凭空定义新的颜色、阴影、圆角和状态色。
- 优先在 `style/index.ts` 中通过 `cva` 定义尺寸、变体、状态和结构差异，让视觉逻辑集中在样式变体层，而不是散落在 JSX 条件分支里。
- 允许通过 `cnMerge` 合并外部 `className`，但不要把外部 `className` 当作内部视觉规则的替代品。
- 优先复用现有语义类，例如品牌色、背景色、文本色、边框色、焦点态、禁用态、阴影和圆角。
- 当现有 token 不能完全覆盖需求时，先复用最接近的语义 token，再决定是否需要新增设计约束；不要把 lint 细节写进技能。
- 保持组件命名、尺寸层级、状态语义与交互反馈和现有组件连续，避免让组件库出现孤立风格。

## 实现规范

新组件默认采用以下目录结构：

- `packages/components/src/<component>/index.ts`
- `packages/components/src/<component>/<Component>.tsx`
- `packages/components/src/<component>/interfaces/index.d.ts`
- `packages/components/src/<component>/style/index.ts`

按需补充以下目录或文件：

- `__tests__/*.test.tsx`
- `contexts/`
- `hooks/`
- 复合子组件文件，例如 `Label.tsx`、`Indicator.tsx`、`Trigger.tsx`、`Portal.tsx`
- 内部共享逻辑目录，例如 `_shared/`

公共实现约束：

- 先决定组件是公开组件还是内部基础能力。只有当组件被设计为公开组件时，才默认更新 `packages/components/src/index.ts` 和 `docs/zh-CN/components/<component>/index.md`。
- 想参与 `pnpm components:api` 生成时，组件目录必须有 `packages/components/src/<component>/index.ts` 作为入口，并且 Typedoc 能从这个入口解析到带 `@category Components` 的公开导出。
- `@category Components` 通常放在 `src/<component>/index.ts` 的公开组件导出上；像 `transition` 这类简单组件，也可以直接标在组件文件本身，只要入口能解析到它。
- 主组件与公开子组件都应设置 `displayName`。
- 复合组件使用 `Object.assign` 聚合公开子组件，保持与现有仓库一致的公开形态。
- 类型优先集中在 `interfaces/index.d.ts` 中管理，公共 props、枚举、别名与 ref 类型尽量在这里声明。
- 主组件实现中保持“结构职责”和“样式职责”分离：结构写在组件文件，视觉变体写在 `style/index.ts`。

关于内部节点扩展，默认遵循下面这条强约束：

- 默认坚持插槽子组件，例如 `Component.Label`、`Component.Indicator`、`Component.Trigger`、`Component.Portal`。
- 只有当仓库中已经存在成熟先例时，才沿用节点注入型 prop API。
- 不要在没有先例的情况下新增 `icon`、`prefixNode`、`suffixNode`、`labelNode`、`renderXxx` 一类节点注入型 prop。

组合与复用约束：

- 受控/非受控状态优先复用 `useControllableState`。
- 上下文共享优先复用 `createContextSuite`。
- 槽位解析优先复用 `registerSlots`。
- 事件合并、属性合并和普通子节点识别优先复用 `packages/components/src/_shared/utils` 中已有工具。
- 覆盖层组件先判断是“锚定型弹层”还是“流程打断型表面”：
  - 锚定型弹层优先参考 `popup` 及其 `tooltip`、`popover` 薄封装模式。
  - 流程打断型表面优先参考 `modal`，尤其是 `variant="dialog" | "drawer"`、portal、focus scope、scroll lock 与 stack 管理。

## 文档规范

- 只有公开组件才默认新增 `docs/zh-CN/components/<component>/index.md`；内部基础能力不需要默认补齐公开文档，除非它被明确设计为文档化 API。
- 组件文档的 sidebar 来自 frontmatter 自动收集；不要手改导航。当前逻辑见 `docs/.vitepress/getThemeConfig.js`。
- frontmatter 至少包含：
  - `title`
  - `cat`
  - 需要排序时再补 `catOrder`
- `cat` 仅从现有分类中选择：`通用`、`输入`、`展示`、`布局`、`其它`。
- 标题格式使用“英文组件名 + 中文名”。
- 页面开头使用：

```md
# {{ $frontmatter.title }}
```

- 标题下方先用一句简短中文说明组件用途。
- 按用户可感知的使用场景分节，例如变体、尺寸、状态、组合、特殊能力，不要按源码文件拆章节。
- 示例统一使用 `react-live`，并遵守当前运行环境的 import scope。当前可直接导入：
  - `react`
  - `@nild/components`
  - `@nild/hooks`
  - `@nild/shared`
  - `@nild/icons`
  - `@nild/icons/Layers`
- 如果组件支持内部节点扩展，示例必须展示插槽式扩展写法，不展示通过 prop 注入节点的写法。
- 如果示例会把内容渲染到 portal 或浮层容器中，优先参考 `modal` 文档做法，必要时在 portal 根节点或表面节点上加 `className="vp-raw"`，避免 VitePress 文档样式污染。
- 页面结尾固定追加：

```md
## API

<!--@include: ../../../../packages/components/src/<component>/API.zh-CN.md-->
```

## API 生成规范

- API 表格只通过脚本生成，不手写表格。
- 当预期会新增或更新 `API.zh-CN.md` 时执行 `pnpm components:api`；对于新公开组件、props 变化、公开子组件变化或文档页新增 API include，这一步是必须的。
- 当前脚本会扫描 `packages/components/src/*/index.ts`，跳过以下目录：
  - 不是目录的项
  - 以 `_` 开头的目录
  - 没有 `index.ts` 入口的目录
- 脚本读取 `@category Components`，并通过复合导出关系展开附属子组件；不要假设只有根入口导出才会进入 API。
- 如果组件或子组件没有出现在 API 输出里，优先检查：
  - 目录入口是否存在
  - `@category Components` 是否能被入口解析到
  - `Object.assign` 或其他公开导出结构是否仍可被 Typedoc 识别

## 验收清单

完成组件后，按顺序执行检查：

1. `pnpm components:build`
2. `pnpm components:test`
3. 如果预期更新 API 文档，执行 `pnpm components:api`
4. 如果新增或修改了公开组件文档，执行 `pnpm docs:build`

在准备合并前，再视改动范围执行仓库级 gate：

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test:coverage`

交付前再人工核对这些点：

- 是否先判断了“公开组件 / 内部基础能力”的边界，而不是见目录就默认公开
- 是否遵循现有组件模式，而不是引入新的孤立风格
- 样式是否基于 ND tokens 与 `cva`
- 是否只在需要公开时才更新了根入口与文档页
- 是否在需要时执行了 `pnpm components:api`
- 若存在自定义内部节点扩展，是否优先使用插槽子组件
- 测试是否覆盖了核心行为与关键交互，而不是只验证渲染是否成功
