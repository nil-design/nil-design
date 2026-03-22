# 组件模式参考

这个文件用于快速对照仓库里已经稳定存在的组件实现方式，帮助新组件优先复用现有模式。

## 通用更新点

新增一个 `@nild/components` 组件时，通常至少会涉及这些位置：

- `packages/components/src/<component>/`：组件源码、类型、样式、测试
- `packages/components/src/<component>/index.ts`：组件公开导出入口
- `packages/components/src/index.ts`：组件库主入口导出
- `docs/zh-CN/components/<component>/index.md`：组件中文文档页

其中：

- `docs/zh-CN/components/<component>/index.md` 会被现有 VitePress 配置自动纳入侧边栏，通常不需要额外手配导航。
- `packages/components/src/<component>/index.ts` 中带 `@category Components` 的公开导出会被 `pnpm components:api` 扫描，用于生成 `API.zh-CN.md`。

## Button：标准复合导出模式

`button` 适合用来参考“常见业务组件”的最基础形态：

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

注意：

- 这里的结构扩展依赖子组件插槽，而不是 `prefixNode`、`suffixNode`、`renderPrefix` 这类 prop 注入方式。

## Checkbox / Radio：槽位解析与上下文共享模式

`checkbox` 和 `radio` 适合用来参考“内部节点顺序可扩展”的组件：

- 使用 `registerSlots` 识别 `Label`、`Indicator` 等子节点
- 使用 `createContextSuite` 共享状态与视觉参数
- 允许默认内容和显式子组件共存
- 通过插槽的顺序决定渲染顺序

适用场景：

- 组件内部节点存在固定语义，但允许使用方重排或替换内容
- 需要让内部节点感知父组件状态

统一约束：

- 内部节点扩展只走插槽，不走 prop 注入节点。
- 如果你发现自己想设计 `renderLabel`、`customIndicator`、`icon` 之类 prop，先回退一步，评估是否应该改成 `Component.Label`、`Component.Indicator` 这样的子组件插槽。

## Popup / Tooltip / Popover：基础能力复用模式

`popup`、`tooltip`、`popover` 适合用来参考“先沉淀基础能力，再做薄封装”的模式：

- `popup` 是底层通用能力
- `tooltip`、`popover` 通过组合 `popup` 能力形成更聚焦的公开 API
- `popup` 自身使用 `registerSlots`、上下文和行为控制组合出较完整的结构能力

适用场景：

- 新需求本质上是已有基础能力的特化版本
- 你不想复制一整套逻辑，而是想在默认参数或少量包装上形成新组件

## Transition：简单单组件模式

`transition` 适合用来参考“没有复合子组件也没有复杂样式变体”的轻量组件：

- 目录结构更简单
- `index.ts` 直接导出主组件
- 同样保留 `@category Components`

适用场景：

- 组件只有一个明确职责
- 不需要上下文、组合子组件或大量视觉变体

## 关于内部节点扩展的统一约束

在 nil-design 中，为了保持 API 一致性和结构清晰度，新设计组件在考虑自定义内部节点扩展性时遵循下面这条硬约束：

- 仅考虑当前项目内已有的插槽方式。
- 禁止通过 prop 传入自定义节点、渲染函数或 JSX 片段来实现内部节点替换。

推荐方式：

- `Component.Label`
- `Component.Indicator`
- `Component.Trigger`
- `Component.Portal`
- 其他语义明确的复合子组件

不推荐方式：

- `icon`
- `prefixNode`
- `suffixNode`
- `labelNode`
- `renderLabel`
- `renderIndicator`
- 其他节点注入型 prop

只有在仓库中已经存在同类成熟先例时，才考虑沿用同类 API；否则默认坚持插槽方案。
