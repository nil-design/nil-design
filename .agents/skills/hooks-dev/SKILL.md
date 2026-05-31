---
name: hooks-dev
description: "用于 nil-design 仓库中设计、开发、重构、测试、文档化或维护 @nild/hooks React hooks，包括公开导出、DOM target 解析、订阅/observer/timer 清理、SSR/浏览器边界、hooks 文档和行为回归测试。"
---

# 开发 Hooks

用于 `@nild/hooks` 工作。先以当前源码确定导出和实现边界，再按以下设计偏好实现、测试和文档化。

## 第一轮核对

- 判断公开面前先读 `packages/hooks/src/index.ts`。
- 读目标 hook 目录、测试和最接近的相似 hook。
- DOM、document、window、observer、timer、storage 或 ref 相关改动要读 `_shared` target/util 模式。
- 影响公开文档时读 hooks 文档索引和对应 hook 文档页。
- 需要实现模式时读 `references/patterns.md`。

## 实现偏好

- hook API 保持小、明确、可组合；不要把多个无关职责塞进一个 hook。
- DOM target 使用共享 `ResolvableTarget` 和 target resolver，支持元素、document/window 和 ref 对象。
- 订阅、observer、timer、lock 等副作用使用 cleanup ref 和 binding ref，避免重复绑定和泄漏。
- 需要 callback 始终最新但不重绑副作用时，使用 latest-ref 模式。
- 浏览器专属逻辑用 `isBrowser`、`globalThis` 或 isomorphic layout effect 做边界保护。
- 不把影响 render 的状态藏在稳定事件回调或 mutable ref 里；render 需要的数据必须能触发 React 更新。
- 公开类型描述调用侧意图，不暴露内部 binding、cleanup 或缓存结构。

## 文档与验证

- 公开 hook 需要文档时，示例必须能通过 docs 的 ReactLive 运行，并从当前 import scope 核对可用包。
- DOM hook 测试使用 jsdom；按需 stub observer、timer、layout、storage 或事件 API。
- 优先运行聚焦 hook 测试；公开类型或构建形状变化运行 `pnpm hooks:build`。
- 共享行为或多包影响时再扩大到根级 `pnpm test` 或 `pnpm test:coverage`。
