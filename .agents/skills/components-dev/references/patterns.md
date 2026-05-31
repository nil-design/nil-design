# 组件模式参考

这些是 nil-design 组件开发中应复用的长期模式。使用前先核对当前源码中的具体组件、导出和调用方式。

## 收敛原则

- 先复用相邻组件模式，再新增抽象。
- 公开 API 优先窄而语义明确；内部实现可以灵活，但不要把内部字段泄漏成 props。
- 只有抽象能减少真实重复、降低风险或表达稳定边界时才提取 helper。
- 组件结构、样式、交互和文档都要能解释给使用者，而不只是让内部实现方便。

## 视觉与样式

- 视觉变体放在 `style/index.ts`，用 `cva` 组织 base、variants、compound variants 和 defaults。
- 组件文件负责结构、状态和语义属性，避免把复杂 class 拼接散落在 JSX 中。
- 使用 `cnMerge` 合并外部 `className`，让使用者覆盖 Tailwind 冲突时行为可预期。
- ND token utility 是首选；raw color、任意值 class 和内联 style 只在已有 token 无法表达时使用。
- 禁用态优先复用共享 disabled style，避免父子组件重复叠加 opacity / grayscale。

## 复合组件与插槽

- 公开复合组件默认通过目录入口 `Object.assign(Main, { Child })` 暴露。
- 子组件用于稳定语义区块：label、indicator、trigger、portal、header、body、footer、option、panel 等。
- 当使用方需要调整内部节点顺序或内容时，优先 slot 子组件，而不是一串节点注入 props。
- context 默认承载被动共享数据和视觉参数；选择、关闭、激活等动作保持在父组件或明确 handler 中。

## 交互与状态

- 受控/非受控状态复用 `useControllableState`，避免每个组件重新定义协议。
- 键盘导航、active item、滚动定位、focus restore 和测量逻辑由父组件集中装配。
- DOM ref 快照局部变量可使用 `$` 前缀，表明这是当前 DOM 引用而非 React state。
- 对外回调在内部状态求出 next value 后统一触发，避免 updater 内副作用和 Strict Mode 下的重复风险。
- render 依赖当前同步状态或 memo 派生值；effect 用于外部系统同步，不用于普通派生数据。

## 表单协议

- 字段控件的 `onChange` 第一参数传字段值，不传 DOM event 作为主参数。
- controlled props 和 default props 命名保持一致，如 `value/defaultValue`、`checked/defaultChecked`。
- 表单整体值使用单数命名，避免 `values`、`formValues` 等平行概念扩散。
- 表单绑定只覆盖真实需要的窄集合，不为了“通用”暴露过宽的绑定面。
- 字段状态、辅助文案、错误和警告展示应复用已有 field/form 语义模式。
