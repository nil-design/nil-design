# 组件模式参考

这个文件只记录 nil-design 中已经稳定存在的组件模式。主流程、公开边界和验收规则以 `../SKILL.md` 为准。

## 收敛清单

当仓库里已有可对齐模式时，优先回到这些写法：

- `registerSlots` 优于手写 `collectXxx`；只有现有槽位模型无法表达需求时，才新增自定义收集逻辑。
- `index.ts + Object.assign` 优于分散式复合导出；公开子组件默认在目录入口统一聚合。
- data-only context + parent-injected handlers 优于 action-heavy context；context 默认共享状态和视觉参数。
- inline derivation / single-pass memo 优于机械拆 hook；只有职责边界稳定时才把派生逻辑拆到独立 hook。
- 公开 props 保持语义直接、可读，避免暴露带下划线或内部运行时感过强的字段。
- render 期判断直接读取同步状态或 memo 派生值，不用事件稳定回调驱动渲染结果。

出现实现分歧时，先问：

- 这个做法是不是仓库里已有的稳定模式？
- 这个抽象是在降低复杂度，还是只是在搬运复杂度？

## Button：视觉变体与复合导出

参考点：

- 主组件 `forwardRef`。
- `style/index.ts` 用 `cva` 定义变体、尺寸、状态和复合变体。
- 渲染时用 `cnMerge` 合并样式变体和外部 `className`。
- `index.ts` 通过 `Object.assign(ButtonComponent, { Group })` 暴露复合子组件。

适用场景：

- 主结构稳定，差异主要来自视觉变体。
- 只需要少量复合子组件。

## Field / Form：表单语义与控件协议

`field` 适合参考字段语义、标签、必填提示、辅助信息和状态展示；`form` 适合参考表单值管理、字段路径、actions 和 issues。

参考点：

- 表单控件协议以字段值为核心，`onChange` 第一参数传值。
- 整体表单值命名使用单数：`FormValue`、`formValue`、`defaultValue`、`onChange(value)`。
- 绑定能力只覆盖真实需要的窄集合，例如 `value`、`checked`。
- 表单结构组件通过复合子组件表达语义区域，而不是把所有节点都塞进 prop。

适用场景：

- 新组件需要接入表单状态、字段语义、校验展示或 actions。
- 需要判断控件 API 是否符合 nild 表单协议。

## Input：受控输入与显式插槽

参考点：

- `useControllableState` 管理受控/非受控值。
- `registerSlots` 识别 `Prefix`、`Suffix` 等内部结构扩展点。
- `Object.assign` 暴露 `Composite`、`Prepend`、`Append`、`Prefix`、`Suffix`、`Search`、`Password`、`OTP`、`Number`。
- 类型集中在 `interfaces/index.d.ts`。

适用场景：

- 组件允许局部结构扩展。
- 多个衍生子组件共享一套基础输入能力。
- 使用方需要通过插槽表达前后缀、组合区域或特殊输入形态。

## Checkbox / Radio：槽位解析与上下文共享

参考点：

- `registerSlots` 识别 `Label`、`Indicator` 等子节点。
- `createContextSuite` 共享状态与视觉参数。
- 默认内容和显式子组件可共存。
- 插槽顺序决定渲染顺序。

适用场景：

- 内部节点有固定语义，但允许使用方重排或替换。
- 内部节点需要感知父组件状态。

## Select：父组件装配与键盘导航

参考点：

- 根组件拥有选项集合、选中值、active item、open state 和必要 DOM refs。
- 导航 hook 消费父组件传入的 refs、可用索引和派生状态，不反向查询内部 DOM。
- 单选选择后关闭并回焦 trigger；多选选择后保持 listbox 打开。
- 禁用 trigger / option、空选项、outside click、Escape、Tab、Home/End、ArrowUp/ArrowDown 都是核心行为。

适用场景：

- 组件需要键盘导航、active descendant、滚动定位或焦点回归。
- 需要从 options 中派生摘要、选中态、禁用态和可导航项。

## Popup + Wrappers：锚定型弹层基础能力

参考点：

- `popup` 负责 trigger、portal、positioning、delay 和 hover/click/focus/contextMenu 行为。
- `tooltip`、`popover` 组合 `popup` 能力形成更聚焦的公开 API。
- `popup` 当前更像内部基础能力；不要因为目录存在就自动加入根入口。

适用场景：

- 新需求是已有锚定弹层能力的特化版本。
- 希望收窄公开 API，而不是复制整套弹层逻辑。

## Modal：流程打断型覆盖层

参考点：

- `variant="dialog" | "drawer"` 统一两类覆盖层。
- 根组件负责 open state、上下文和 motion 注入。
- `Portal` 负责 overlay、surface、focus scope、scroll lock、stack 管理和关闭行为。
- `Object.assign` 暴露 `Trigger`、`Portal`、`Header`、`Body`、`Footer`、`Close`。

适用场景：

- 组件中断当前流程，要求用户确认、补充信息或处理分层任务。
- 需要焦点管理、Esc/overlay 关闭、层级栈或 drawer/direction 语义。
- 需求不是锚定到触发元素的轻量弹层，而是承载完整流程的覆盖层表面。

## Transition：轻量状态包装

参考点：

- 目录结构较简单。
- `index.ts` 只负责导出主组件和类型。
- `@category Components` 可写在组件文件本身，只要入口能解析到它。

适用场景：

- 组件只有一个明确职责。
- 不需要上下文或复合子组件。
- 逻辑重点是状态机、生命周期包装或 child cloning。

## 内部节点扩展

默认采用插槽子组件表达内部扩展边界：

- 推荐：`Component.Label`、`Component.Indicator`、`Component.Trigger`、`Component.Portal`、其他语义明确的复合子组件。
- 谨慎：`icon`、`prefixNode`、`suffixNode`、`labelNode`、`renderLabel`、`renderIndicator`、其他节点注入型 prop。

只有仓库中已有同类成熟先例时，才沿用节点注入型 API；否则默认坚持插槽方案。
