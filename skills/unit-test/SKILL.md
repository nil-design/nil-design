---
name: unit-test
description: Generate and review frontend unit tests for components, hooks, and utility functions using Vitest or Jest with Testing Library. Use when asked to create new tests, refactor brittle tests, review test quality, improve behavior coverage, convert implementation-detail tests into black-box tests, or add regression tests for bug fixes in React/Vue codebases.
---

# Unit Test

## 核心目标

生成和评审可维护、稳定、以行为为中心的前端单元测试。优先验证用户可观察行为，而不是实现细节。

## 工作模式

### 1. 生成模式（Generate）

- 基于被测模块与项目现有栈生成测试代码。
- 覆盖主流程、边界场景、错误场景与回归场景。

### 2. 评审模式（Review）

- 识别脆弱测试、误测实现细节、覆盖缺口与命名/结构问题。
- 给出可执行修正建议，必要时给出替代测试写法。

## 执行工作流

1. 识别被测对象与技术栈：React/Vue、Vitest/Jest、Testing Library 变体。
2. 提取行为契约：输入、用户交互、可观察输出、副作用。
3. 设计测试矩阵：Happy Path、Edge Cases、Error Path、Regression Path。
4. 编写或评审测试：遵循黑盒原则、用例隔离、可读性优先。
5. 自检并收敛：通过质量清单后再输出。

## 栈识别与适配规则

- 若项目使用 `vitest`，使用 `vi` 与 Vitest API。
- 若项目使用 `jest`，使用 `jest` 与 Jest API。
- React 组件优先使用 `@testing-library/react` 与 `@testing-library/user-event`。
- Vue 组件优先使用 `@testing-library/vue`，并根据项目习惯使用 `fireEvent` 或 `user-event`。
- 始终优先复用仓库已有断言扩展与测试工具约定。

## 质量约束

### 1. 黑盒测试（严禁测试实现细节）

- **MUST**: 断言用户可观察行为（DOM、可见文本、公开回调、公共返回值、外部依赖调用）。
- **NEVER**: 断言私有状态或实现细节（如 `wrapper.vm.*`、私有字段、内部方法调用顺序）。

### 2. BDD 漏斗式结构与命名

- 默认采用 `describe('<Subject>') -> describe('when <Context>') -> it('should <Expectation>')`。
- 对纯函数或极简场景允许 `describe + it` 两层结构，不强制制造冗余嵌套。
- 每个 `it` 仅验证一个行为结果，避免职责混杂。

### 3. AAA 结构

- 每个 `it` 块内部 **MUST** 包含 Arrange（准备）、Act（执行）、Assert（断言）三个明确的阶段。
- 对非平凡测试，阶段之间保持一个空行以提升可读性。
- 对“纯渲染即断言”的极简场景，允许省略显式 `Act` 注释，但不要把多步操作与断言混在一行。

### 4. 用例绝对隔离

- **MUST** 在 `beforeEach()` 中重置 mocks、timers 与共享测试状态。
- **NEVER** 让一个 `it` 的副作用污染后续 `it`。
- **MUST** 对 API、Router、时间、随机数等不稳定外部依赖进行隔离。

### 5. 控制流约束

- **NEVER** 在单个 `it` 内编写基于条件的断言分支（如 `if/else` 决定断言路径）。
- **MUST** 对多组输入/输出使用 `it.each()` 参数化测试。
- **SHOULD** 避免在测试体中写业务逻辑；若必须构造数据，保持最小且确定性。

## 输出清单（生成与评审都需满足）

- 测试名称可直接读出“场景 + 期望”。
- 异步行为均已正确等待，不依赖竞态时序。
- 优先语义化查询（如 `getByRole`），减少脆弱选择器。
- 关键边界与错误路径具备覆盖。
- 无重复样板和无效断言。

## 标准模板（按项目栈调整）

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue'; // 视 React/Vue 自动调整
import TargetComponent from './TargetComponent.vue';

describe('TargetComponent', () => {
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when form is valid', () => {
    it('should submit entered username', async () => {
      // Arrange
      render(TargetComponent, { props: { onSubmit } });
      const input = screen.getByRole('textbox', { name: /username/i });
      const button = screen.getByRole('button', { name: /submit/i });

      // Act
      await fireEvent.update(input, 'testuser');
      await fireEvent.click(button);

      // Assert
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith('testuser');
    });
  });

  describe('when status changes', () => {
    it.each([
      ['pending', 'Loading...'],
      ['success', 'Done'],
      ['error', 'Failed'],
    ])('should render %s as "%s"', (status, expectedText) => {
      // Arrange
      render(TargetComponent, { props: { status } });

      // Assert
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
});
```

## 反模式（命中即重写）

1. 断言内部实现细节而非外部行为。
2. 一个 `it` 覆盖多个不相关行为。
3. 在单个 `it` 内编写条件分支断言。
4. 异步测试缺少等待导致随机失败。
5. 仅复制粘贴测试数据而不参数化，造成冗余与维护成本上升。
