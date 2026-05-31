---
name: shared-dev
description: "用于 nil-design 仓库中设计、开发、重构、测试、维护或导出 @nild/shared 类型、React helpers、class utilities、runtime utilities、通用工具方法和 shared 包公开接口。"
---

# 开发共享能力

用于 `@nild/shared` 工作。shared 是跨包基础层；只有抽象稳定且至少有真实复用价值时才放入这里。

## 第一轮核对

- 修改导出前读 `packages/shared/src/index.ts` 和相关子入口。
- 新增工具前读最接近的 helper、测试和调用方。
- 涉及 class utility、React helper、type-only helper 或 runtime utility 时读 `references/patterns.md`。
- 任何跨包影响都要回看 components/hooks/docs 的调用方式。

## 包边界

- `interfaces` 放可复用 TypeScript 类型，保持 type-only，避免 runtime 依赖。
- `react` 放 React 专属 helpers，可以依赖 React，但要保持跨组件通用。
- `utils` 放 runtime utilities、class helpers、字符串转换、环境判断、数值工具和少量稳定 re-export。
- 不把组件专属行为提前搬进 shared；先在组件内稳定，再考虑抽象。

## 实现偏好

- 工具函数保持小、纯、依赖少，优先直接命名和直接行为。
- 不做选项很多的万能 helper；调用侧更清楚时宁可保持局部实现。
- 默认导出配合 barrel export，保持本地 tree-shaking 和导入风格一致。
- TypeScript generics 只在改善调用侧推导或约束时使用。
- 不给 `utils` 或 type-only 模块引入 React 依赖。
- class utilities 保持职责分层：普通 class join、Tailwind conflict merge、variant class function 各自语义清晰。

## 验证

- runtime helper 跑聚焦测试或 `pnpm shared:test`。
- 类型形状变化运行 `pnpm shared:build` 或包级 typecheck。
- shared 变化影响 components/hooks 时，同时运行对应包的聚焦测试或构建。
