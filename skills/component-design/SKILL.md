---
name: component-design
description: 用于在 nil-design 仓库中设计并实现新的 @nild/components 组件。适用于需要先研究现有组件实现与 docs/ 目录下的文档组织，再基于 ND tokens 与 cva 设计样式、编写组件源码与导出、执行 API 生成脚本、补充 docs/zh-CN/components 页面，并完成构建、类型检查、测试与最终验收的场景。
---

# 组件设计

## 概览

把这个技能用于 nil-design 仓库中的新组件工作流，目标不是只把组件“写出来”，而是把组件从设计、实现、文档、API 生成到验收一次完成。

默认交付物至少包括：

- `packages/components/src/<component>/` 下的组件源码、样式、类型与测试
- `packages/components/src/index.ts` 中的主入口导出
- `docs/zh-CN/components/<component>/index.md` 文档页面
- 通过 `pnpm components:api` 生成的 API 文档文件
- 通过组件级与仓库级验收命令验证后的结果

优先复用仓库内已有模式，不凭空设计新的组件抽象、目录结构或扩展方式。

## 先对标现有实现

开始写代码前，先完成一轮对标：

1. 在 `packages/components/src` 中找到一个最接近的新组件参照物。
2. 阅读该组件的 `index.ts`、主组件文件、`interfaces/index.d.ts`、`style/index.ts`、测试文件与相关上下文或子组件文件。
3. 同时阅读对应的 `docs/zh-CN/components/<name>/index.md` 页面，确认文档分节、示例组织方式与语气。
4. 判断新组件属于哪一类模式，再决定实现方式：
   - 简单单组件：参考 `transition`、`divider`
   - 复合导出组件：参考 `button`、`input`、`typography`
   - 依赖上下文与槽位解析的组件：参考 `checkbox`、`radio`、`popup`
   - 在基础能力之上做薄封装的组件：参考 `tooltip`、`popover`

如果能用现有模式解释新需求，就不要发明新的 API 风格。

需要更具体的代码组织示例时，再阅读 `references/component-patterns.md`。

## 设计规范

- 视觉设计必须围绕 `packages/components/src/tailwind.css` 中的 ND tokens 与 Tailwind 语义别名展开。
- 样式优先在 `style/index.ts` 中通过 `cva` 定义，让尺寸、变体、状态、结构差异都体现在样式变体层，而不是散落在 JSX 条件分支里。
- 允许通过 `cnMerge` 合并外部 `className`，但不要把外部 `className` 当作内部视觉规则的替代品。
- 优先复用现有语义类，例如品牌色、背景色、文本色、边框色、焦点态、禁用态、阴影和圆角。
- 不要随意写死颜色、阴影、圆角、边框或状态色，除非现有 token 和语义别名确实无法表达。
- 当现有 token 不能完全覆盖需求时，先尝试复用最接近的语义 token，再决定是否需要补充新的设计约束；不要把 lint 规则细节写进技能。
- 组件命名、尺寸层级、状态语义、交互反馈要尽量与现有组件保持一致，让组件库整体体验连续。

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
- 复合子组件文件，例如 `Label.tsx`、`Indicator.tsx`、`Trigger.tsx`

公共实现约束：

- 组件公共导出入口必须带 `@category Components`，以便 `pnpm components:api` 识别并生成 API 文档。
- 主组件与公开子组件都应设置 `displayName`。
- 组件落地后要更新 `packages/components/src/index.ts` 暴露主入口。
- 复合组件使用 `Object.assign` 聚合子组件导出，保持与现有仓库一致的公开形态。
- 类型优先声明在 `interfaces/index.d.ts` 中，公共 props、枚举、别名与 ref 类型都集中管理。
- 主组件实现中优先保持“结构职责”和“样式职责”分离：结构写在组件文件，视觉变体写在 `style/index.ts`。

关于自定义内部节点的扩展性，使用下面这条硬约束：

- 仅允许通过当前项目已有的插槽方式设计内部节点扩展。
- 禁止通过额外 prop 传入自定义节点、渲染函数或 JSX 片段来替代内部节点扩展。
- 当组件需要允许使用方替换内部结构时，优先提供显式子组件插槽，例如 `Component.Label`、`Component.Indicator`、`Component.Trigger`、`Component.Portal`。
- 除非仓库中已经存在明确先例，否则不要新增 `icon`、`prefixNode`、`suffixNode`、`renderXxx` 一类节点注入型 prop API。

## 组合与复用规范

- 受控/非受控状态优先复用 `useControllableState`。
- 上下文共享优先复用 `createContextSuite`。
- 槽位解析优先复用 `registerSlots`。
- 事件合并、属性合并、普通子节点识别等能力优先复用 `packages/components/src/_shared/utils` 中已有工具。
- 如果需求本质上是现有基础能力的轻量包装，优先复用基础组件，而不是复制一份逻辑。
- 复杂组件的行为设计优先参考：
  - `input` 的受控输入和复合子组件模式
  - `checkbox`、`radio` 的槽位解析与上下文共享模式
  - `popup` 的基础能力拆分模式
  - `tooltip`、`popover` 对基础弹出能力的薄封装模式

设计可扩展内部结构时，先判断是否真的需要开放扩展点；需要开放时，再用插槽子组件来表达扩展边界，不要退回到节点注入 prop。

## 文档规范

- 为新组件新增 `docs/zh-CN/components/<component>/index.md`。
- frontmatter 固定至少包含：
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
- 文档按用户可感知的使用场景分节，例如变体、尺寸、状态、组合、特殊能力，不要按源码文件拆章节。
- 示例统一使用 `react-live`，写法和现有页面保持一致。
- 如果组件支持内部节点扩展，示例必须展示插槽式扩展写法，不展示通过 prop 注入节点的写法。
- 页面结尾固定追加：

```md
## API

<!--@include: ../../../../packages/components/src/<component>/API.zh-CN.md-->
```

- 不额外手改导航；`docs/zh-CN/components/<component>/index.md` 会被现有文档配置自动收录。

需要模板时，再阅读 `references/docs-style.md`。

## API 生成规范

- API 表格只通过脚本生成处理，不手写表格。
- 组件实现完成后执行 `pnpm components:api`。
- 如果组件或子组件没有出现在 API 输出里，优先检查公开导出入口、`@category Components` 注释和导出结构。
- 文档页面通过 `@include` 引用对应的 `API.zh-CN.md`，不要把 API 内容手动复制到文档页。

## 验收清单

完成组件后，至少执行以下检查：

1. 组件级检查
   - `pnpm components:build`
   - `pnpm components:test`
   - `pnpm components:api`
2. 文档级检查
   - `pnpm docs:build`
3. 仓库级检查
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`
   - `pnpm test:coverage`

交付前再人工核对下面这些点：

- 新组件是否遵循现有组件模式，而不是引入全新风格
- 样式是否基于 ND tokens 与 `cva`
- 是否正确更新了主入口导出
- 是否为组件补齐了文档页
- 是否执行了 `pnpm components:api`
- 若存在自定义内部节点扩展，是否严格采用插槽，而不是节点注入 prop
- 测试是否覆盖了核心行为与关键交互
