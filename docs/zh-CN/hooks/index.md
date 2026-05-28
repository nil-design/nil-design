---
title: Hooks
navOrder: 4
---

# 总览

`@nild/hooks` 提供了一组围绕状态、引用、事件和副作用组织方式设计的 React Hooks。它们的 API 都很小，重点是让常见模式更稳定、更容易复用。

## 状态

- [useControllableState](./use-controllable-state/)：统一受控与非受控两种状态模式。
- [useLocalStorage](./use-local-storage/)：像 `useState` 一样读写 `localStorage`。
- [usePrevious](./use-previous/)：读取上一次被接受的值。
- [useForceUpdate](./use-force-update/)：在不引入业务状态时强制当前组件重新渲染。
- [useRefState](./use-ref-state/)：在状态更新时同步维护最新值 ref。

## 副作用

- [useEffectCallback](./use-effect-callback/)：返回稳定引用，并始终调用最新实现的副作用回调。
- [useCustomCompareEffect](./use-custom-compare-effect/)：为 `useEffect` 增加可定制的依赖比较逻辑。
- [useIsomorphicLayoutEffect](./use-isomorphic-layout-effect/)：在浏览器中使用 `useLayoutEffect`，在非浏览器环境中回退到 `useEffect`。
- [useMount](./use-mount/)：在组件首次挂载后执行一次逻辑。
- [useUnmount](./use-unmount/)：在组件卸载时执行清理逻辑。
- [useTimeout](./use-timeout/)：手动调度并自动清理定时器。
- [useRaf](./use-raf/)：手动调度并自动清理下一帧回调。

## Ref

- [useLatestRef](./use-latest-ref/)：返回稳定的 ref 对象，并让 `current` 始终指向最新值。
- [usePureCallback](./use-pure-callback/)：返回稳定引用，并始终调用最新实现的纯函数回调。

## DOM

- [useEventListener](./use-event-listener/)：以更稳定的方式绑定和清理事件监听器。
- [useScrollLock](./use-scroll-lock/)：锁定文档或元素滚动并自动恢复样式。
- [useResizeObserver](./use-resize-observer/)：监听一个或多个元素尺寸变化。
- [useMutationObserver](./use-mutation-observer/)：监听一个或多个 DOM 节点变化。
