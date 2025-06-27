---
title: useEffectCallback
cat: 副作用
catOrder: 2
---

# {{ $frontmatter.title }}

返回传入回调的稳定引用：回调可以包含副作用，但它只被允许在 useLayoutEffect、useEffect 或事件回调中使用。

> [!WARNING]
> 如果回调被传递给子组件，那么它仅可以在子组件的 useEffect 和事件回调中使用

## 基本用法
