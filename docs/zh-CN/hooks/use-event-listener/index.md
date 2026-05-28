---
title: useEventListener
cat: DOM
catOrder: 4
order: 1
---

# {{ $frontmatter.title }}

以更稳定的方式绑定和清理事件监听器。

## 签名

```ts
function useEventListener(
    target: ResolvableTarget<Window | Document | HTMLElement | Element | EventTarget>,
    eventName: string,
    listener: (...args: unknown[]) => void,
    options?: AddEventListenerOptions,
): void;
```

## 基本用法

::: react-live

```tsx
import { useState } from 'react';
import { useEventListener } from '@nild/hooks';
import { Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
    const [pos, setPos] = useState(null);

    useEventListener(window, 'mousemove', event => {
        setPos({ x: event.clientX, y: event.clientY });
    });

    return <Text>当前鼠标位置：{pos ? `(${pos.x}, ${pos.y})` : '移动鼠标试试'}</Text>;
};

render(<Demo />);
```

:::

## 关键行为

- `target` 可以是 `Window`、`Document`、`HTMLElement`、`Element`、通用 `EventTarget`、React ref、`null` 或 `undefined`。
- 监听函数变化时不会重复绑定事件，内部会通过最新 ref 调用新版本的 listener。
- 当 `options.capture`、`options.once`、`options.passive` 或 `options.signal` 变化时，会重新绑定监听器。

## 注意事项

- 只有当目标对象存在 `addEventListener` 时才会绑定监听器，空目标会被直接跳过。
- 如果目标节点来自 ref，可以直接传入 ref 对象；内部会在副作用执行时解析当前节点。
