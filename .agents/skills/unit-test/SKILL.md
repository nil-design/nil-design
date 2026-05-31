---
name: unit-test
description: "用于创建、重构或评审通用前端单元测试，适用于 Vitest、Jest、Testing Library、React、Vue、hooks/composables、组件、工具函数、回归测试、行为覆盖和脆弱测试清理；nil-design 仅作为本仓库默认栈示例。"
---

# 编写单元测试

用于行为导向的单元测试工作。目标是让测试证明公开契约，而不是锁住内部实现。

## 第一轮核对

- 先读相邻测试、package scripts、测试环境和已有 render/mock helper。
- 明确被测契约：可观察 DOM、用户交互、callback、hook/composable 返回值、工具函数输出、外部副作用或生成产物。
- 根据项目实际栈选择 Vitest/Jest、React Testing Library、Vue Testing Library、renderHook 或纯函数测试。
- 在 nil-design 中，React 组件通常用 Vitest + Testing Library + jsdom；shared 工具默认普通测试环境，DOM 需求再切 jsdom。

## 测试设计

- 优先断言用户可观察行为、公开回调和公共返回值，不断言私有状态、内部方法顺序或完整样式快照。
- 查询 DOM 时优先 role、label、text、accessible name；只有没有语义出口时才用 test id 或 class。
- 一个测试聚焦一个行为结果；多个等价输入共享同一契约时用 table test。
- BDD 漏斗结构是工具不是仪式；复杂场景可用 `describe('<Subject>') -> describe('when ...') -> it('...')`，简单场景保持两层即可。
- 同构样例达到 3 组左右时优先 `it.each()`；样例少且逐条更清楚时保留显式测试。
- 测试体里不要写 `if/else` 决定断言路径；分支行为应拆成独立用例或 table case。
- 非平凡测试用空行或简短注释体现 arrange / act / assert；简单断言不要为了形式增加噪音。
- 异步行为用 `await`、`findBy*`、`waitFor` 或项目等价工具等待，不靠固定延时赌时序。
- 时间、随机值、observer、layout、focus、storage、router 和外部 API 使用确定性 mock。
- bug fix 和 shared helper 变化要补回归测试；影响面大时从聚焦测试扩大到包级或根级命令。

## 隔离规则

- 每个用例隔离 DOM、mocks、timers、globals、module state 和 mutated objects。
- 在 `beforeEach` / `afterEach` 中清理 mock、timer、global stub 和 DOM 副作用。
- 不让一个测试的调用次数、元素、storage 或全局 API 改动污染后续测试。
- 样式/class 断言只覆盖有行为意义的状态，如 selected、disabled、focus、visibility 或关键回归。

## 评审清单

- 测试名能读出“场景 + 期望”。
- 断言面向公开契约，不依赖私有实现。
- 异步路径等待明确。
- 边界、错误、禁用、cleanup 和回归路径按风险覆盖。
- 没有无效断言、过度快照、条件分支断言或大段复制粘贴样板。
- 已运行最小相关测试命令，或明确说明未运行原因。
