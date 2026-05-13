---
name: unit-test
description: Generate and review frontend unit tests for components, hooks, and utility functions using Vitest or Jest with Testing Library. Use when asked to create new tests, refactor brittle tests, review test quality, improve behavior coverage, convert implementation-detail tests into black-box tests, or add regression tests for bug fixes in React/Vue codebases.
---

# Unit Test

## Goal

生成或评审稳定、可维护、以行为为中心的前端单元测试。优先验证用户可观察行为，不测试私有状态、内部字段或实现顺序。

## First Pass

先识别被测对象、项目测试栈和既有测试习惯：

- nil-design 组件包默认是 `Vitest + @testing-library/react + jsdom + @testing-library/jest-dom`，命令为 `pnpm components:test`。
- 根仓库使用 `pnpm test`、`pnpm test:coverage` 聚合各包测试。
- docs theme 或 Vue 组件测试需要按现有文件另行识别，不要默认套 React 模板。
- 若当前任务落在 Vue 组件或 Vue 主题组件，先识别仓库现有测试栈；若仓库已有 `@testing-library/vue` 或其它既有等价工具链，优先沿用它们，而不是强行套 React 模板。
- 先读相邻测试文件，复用已有 import、mock、render helper、断言扩展和命名风格。

## Workflow

1. 提取行为契约：props / 输入、用户交互、可观察 DOM、公开回调、公共返回值和外部依赖调用。
2. 设计测试矩阵：主流程、边界场景、错误或禁用场景、回归场景。
3. 编写或评审测试：黑盒优先、用例隔离、命名可读、异步等待明确。
4. 运行最小相关测试；改动共享工具或组件公开行为时扩大到包级或仓库级测试。

## Decision Rules

- 若项目使用 `vitest`，使用 `vi`、`describe`、`it`、`expect` 等 Vitest API；若明确使用 Jest，才切到 `jest` API。
- React 组件优先使用 `@testing-library/react` 的 `render`、`screen`、`fireEvent` 或项目已采用的 `user-event`。
- DOM 查询优先语义化，例如 `getByRole`、`getByLabelText`、`getByText`；只在没有稳定语义出口时使用 class 或 test id。
- Hook / 纯函数测试断言公共返回值和可观察副作用，不断言内部实现。
- BDD 漏斗结构是推荐，不是机械要求。复杂场景可用 `describe('<Subject>') -> describe('when ...') -> it('...')`；简单场景可保持 `describe + it` 两层。
- 一个 `it` 聚焦一个行为结果；不要在单个 `it` 里写 `if/else` 分支决定断言路径。
- 同构样例达到 3 组左右时优先 `it.each()`；少量样例可保留显式用例以提升可读性。
- 非平凡测试用空行或简短注释体现 Arrange / Act / Assert；纯渲染即断言或单次调用即断言可省略显式阶段注释。

## Isolation

- 每个用例必须隔离 mocks、timers、globals、模块缓存和 DOM 副作用。
- 优先在 `beforeEach` / `afterEach` 里统一 `vi.clearAllMocks()`、恢复 timers、清理 global stub；单用例临时桩可就地恢复。
- 对不稳定外部依赖做确定性 mock，例如 API、Router、时间、随机数、`@floating-ui/dom`、layout measurement。
- 组件测试中常见浏览器缺口要显式处理，例如 `requestAnimationFrame`、`cancelAnimationFrame`、`scrollIntoView`、尺寸测量或 focus 行为。
- 不让一个 `it` 的 DOM、mock 调用或全局对象改动污染后续用例。

## nil-design Patterns

- 公开组件新增或改名时，必要时断言 root export，例如 `expect(RootSelect).toBe(Select)`，防止根入口遗漏。
- 交互组件优先覆盖用户路径：打开/关闭、键盘导航、禁用态、受控/非受控、外部回调、焦点回归、portal/outside click。
- 选择器、弹层、modal 一类组件通常需要 mock `@floating-ui/dom`、动画帧、滚动或 focus 相关 API。
- 样式断言只覆盖对行为或回归有意义的 class，例如选中态、禁用态、焦点态、品牌 indicator；不要把完整样式实现当快照。
- 测试中文或 CJK 文本时注意文件编码和终端显示；如果输出看起来异常，先验证 UTF-8 字节而不是直接重写内容。

## Review Checklist

生成或评审完成前确认：

- 评审时优先识别脆弱测试、实现细节断言、覆盖缺口、命名/结构问题，并给出可执行的替代写法或修正建议。
- 测试名称能读出“场景 + 期望”。
- 断言面向用户可观察行为、公开回调、公共返回值或外部依赖调用。
- 异步行为已用 `await`、`findBy*`、`waitFor` 或项目等价方式等待。
- 用例之间没有共享污染。
- 边界、错误、禁用和回归路径按风险覆盖。
- 没有无效断言、纯实现细节断言、过度快照或重复样板。

## Small Template

按项目栈和相邻测试调整，不要求逐字照搬：

- 当前示例按 nil-design 现状给出 React + Vitest 模板；遇到 Vue 或其它测试栈时，替换 `render`、导入来源和交互 API，不要逐字照搬。

```tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Target from '..';

describe('Target', () => {
    const onChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls onChange when the user chooses an option', () => {
        render(<Target aria-label="city" onChange={onChange} />);

        fireEvent.click(screen.getByRole('button', { name: 'city' }));
        fireEvent.click(screen.getByRole('option', { name: 'Shanghai' }));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('shanghai');
    });

    it.each([
        ['pending', 'Loading'],
        ['success', 'Done'],
        ['error', 'Failed'],
    ])('renders %s status', (status, text) => {
        render(<Target status={status} />);

        expect(screen.getByText(text)).toBeInTheDocument();
    });
});
```

## Anti-Patterns

命中这些问题时优先重写：

- 断言私有状态、内部方法调用顺序、`wrapper.vm.*` 或组件内部字段。
- 一个 `it` 覆盖多个不相关行为。
- 异步测试缺少等待，依赖竞态或固定延时。
- 测试体里写业务逻辑或条件分支断言。
- 复制粘贴大量样例却不参数化，或参数化后反而损害可读性。
