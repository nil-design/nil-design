# Shared 模式参考

## 抽象准入

- 至少两个调用点真实需要，或一个调用点已经暴露出稳定、可复用的底层语义。
- 抽象能减少复杂度，而不是把上下文藏进泛化参数。
- 名称应描述调用侧想做的事，不描述内部实现技巧。

## Type-only helpers

- 只放类型层能力，不导入 runtime 模块。
- 类型复杂度要换来明显的调用侧推导收益。
- 类型测试或 typecheck 能证明契约时，补对应验证。

## React helpers

- 只放跨组件通用能力，如 refs、generic forwardRef、context helper。
- 不放具体组件状态机或组件私有行为。
- 需要 displayName 或 debug 信息时，让 helper 提供明确参数，而不是隐藏约定。

## Runtime utilities

- 保持纯函数优先；有环境读取时显式命名并测试浏览器/非浏览器边界。
- class helper 分清 join 与 merge：join 只拼接 truthy class，merge 才处理 Tailwind 冲突。
- `cva` 用于把稳定的样式变体模型压成 class function，不用于管理运行时业务状态。