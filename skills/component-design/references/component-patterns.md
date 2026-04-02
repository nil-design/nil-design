# 组件模式参考

这个文件用于快速对照仓库里已经稳定存在的组件实现方式，帮助新组件优先复用现有模式。

## 通用判断

开始实现前，先确认下面这些事实：

- 公开组件以 `packages/components/src/index.ts` 为准，不以 `src/<component>/` 目录是否存在为准。
- 只有公开组件才默认需要更新根入口与 `docs/zh-CN/components/<component>/index.md`。
- `pnpm components:api` 会扫描 `packages/components/src/*/index.ts`，读取 `@category Components`，并展开复合子组件。

## Button：标准复合导出模式

`button` 适合用来参考“视觉变体为主、结构相对稳定”的公开组件：

- 主组件使用 `forwardRef`
- 样式放在 `style/index.ts`
- 样式通过 `cva` 定义变体、尺寸、状态和复合变体
- 渲染时用 `cnMerge` 合并 `variants.xxx(...)` 与外部 `className`
- `index.ts` 通过 `Object.assign(ButtonComponent, { Group })` 暴露复合子组件

适用场景：

- 主组件已经足够清晰，只需要少量复合子组件
- 主要差异来自视觉变体，而不是复杂结构逻辑

## Input：受控输入与复合子组件模式

`input` 适合用来参考“带多个显式插槽子组件”的复杂输入型组件：

- 使用 `useControllableState` 管理受控/非受控值
- 使用 `registerSlots` 识别 `Prefix`、`Suffix` 等内部结构扩展点
- 通过 `Object.assign` 暴露 `Composite`、`Prepend`、`Append`、`Prefix`、`Suffix`、`Search`、`Password`、`OTP`、`Number`
- 类型集中在 `interfaces/index.d.ts`

适用场景：

- 组件允许局部结构扩展
- 需要复合子组件表达组成关系
- 需要多个衍生子组件共享同一套基础能力

## Checkbox / Radio：槽位解析与上下文共享模式

`checkbox` 和 `radio` 适合用来参考“内部节点顺序可扩展”的组件：

- 使用 `registerSlots` 识别 `Label`、`Indicator` 等子节点
- 使用 `createContextSuite` 共享状态与视觉参数
- 允许默认内容和显式子组件共存
- 通过插槽顺序决定渲染顺序

适用场景：

- 组件内部节点存在固定语义，但允许使用方重排或替换内容
- 需要让内部节点感知父组件状态

## Popup + Wrappers：锚定型弹层基础能力模式

`popup`、`tooltip`、`popover` 适合用来参考“先沉淀基础能力，再做公开薄封装”的模式：

- `popup` 是底层锚定型弹层能力，负责 trigger、portal、positioning、delay 和 hover/click/focus/contextMenu 行为
- `tooltip`、`popover` 通过组合 `popup` 能力形成更聚焦的公开 API
- `popup` 当前更像内部基础能力，不在根入口公开导出；是否公开要显式决定，不要自动把这类基础组件暴露到根入口

适用场景：

- 新需求本质上是已有锚定弹层能力的特化版本
- 你希望把公共 API 收窄到少量默认参数，而不是复制整套弹层逻辑

## Modal：流程打断型覆盖层模式

`modal` 适合用来参考“流程打断型表面”的公开模式：

- 用 `variant="dialog" | "drawer"` 统一两类覆盖层
- 根组件负责 open state、上下文和 motion 注入
- `Portal` 负责 overlay、surface、focus scope、scroll lock、stack 管理和关闭行为
- 通过 `Object.assign` 暴露 `Trigger`、`Portal`、`Header`、`Body`、`Footer`、`Close`

适用场景：

- 组件会中断当前流程，要求用户确认、补充信息或处理分层任务
- 组件需要焦点管理、Esc/overlay 关闭、层级栈或 drawer/direction 语义
- 需求不是“锚定到某个触发元素的轻量弹层”，而是“承载完整流程的覆盖层表面”

## Transition：轻量单组件模式

`transition` 适合用来参考“没有复合子组件，但有状态驱动包装逻辑”的轻量组件：

- 目录结构更简单
- `index.ts` 只负责导出主组件和类型
- `@category Components` 不一定只能写在 `index.ts`；像 `transition` 这类简单组件，也可以写在组件文件本身，只要入口能解析到它

适用场景：

- 组件只有一个明确职责
- 不需要上下文或复合子组件
- 逻辑重点是状态机、生命周期包装或 child cloning，而不是复杂视觉结构

## 关于内部节点扩展的统一约束

在 nil-design 中，为了保持 API 一致性和结构清晰度，默认先采用插槽子组件来表达内部扩展边界：

推荐方式：

- `Component.Label`
- `Component.Indicator`
- `Component.Trigger`
- `Component.Portal`
- 其他语义明确的复合子组件

谨慎使用的方式：

- `icon`
- `prefixNode`
- `suffixNode`
- `labelNode`
- `renderLabel`
- `renderIndicator`
- 其他节点注入型 prop

只有在仓库中已经存在同类成熟先例时，才沿用同类节点注入型 API；否则默认坚持插槽方案。
