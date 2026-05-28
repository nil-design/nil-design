---
title: useResizeObserver
cat: DOM
catOrder: 4
order: 3
---

# {{ $frontmatter.title }}

监听一个或多个元素尺寸变化，并在缺少 `ResizeObserver` 时回退到窗口 resize。

## 签名

```ts
function useResizeObserver<T extends Element>(
    targets: readonly ResolvableTarget<T>[],
    callback: (entries: ResizeObserverEntry[], observer: ResizeObserver | null) => void,
    options?: ResizeObserverOptions & {
        enabled?: boolean;
        fallbackToWindow?: boolean;
    },
): void;
```

## 基本用法

::: react-live

```tsx
import { useRef, useState } from 'react';
import { useResizeObserver } from '@nild/hooks';
import { Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
    const boxRef = useRef(null);
    const [size, setSize] = useState('调整窗口或容器试试');

    useResizeObserver([boxRef], entries => {
        const entry = entries[0];
        if (entry) {
            const { width, height } = entry.contentRect;
            setSize(`${Math.round(width)} × ${Math.round(height)}`);
        }
    });

    return (
        <div
            ref={boxRef}
            className="flex h-28 w-64 min-h-24 min-w-44 max-w-full resize items-center justify-center overflow-hidden rounded border border-solid border-muted p-4"
        >
            <Text>{size}</Text>
        </div>
    );
};

render(<Demo />);
```

:::

## 关键行为

- targets 是目标数组，单个目标也需要写成 `[target]`。
- targets 中的每一项支持 DOM 对象、React ref、`null` 和 `undefined`。
- 回调变化时不会重新创建观察器，内部会调用最新回调。
- 缺少 `ResizeObserver` 且 `fallbackToWindow` 未关闭时，会监听 `window.resize` 并以 `observer: null` 调用回调。

## 注意事项

- `enabled: false` 会跳过观察并清理已创建的观察器。
- targets 中重复的元素只会被观察一次。
