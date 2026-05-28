---
title: useMutationObserver
cat: DOM
catOrder: 4
order: 4
---

# {{ $frontmatter.title }}

监听一个或多个 DOM 节点的结构或属性变化。

## 签名

```ts
function useMutationObserver<T extends Node>(
    targets: readonly ResolvableTarget<T>[],
    callback: MutationCallback,
    options: MutationObserverInit & {
        enabled?: boolean;
    },
): void;
```

## 基本用法

::: react-live

```tsx
import { useRef, useState } from 'react';
import { useMutationObserver } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
    const containerRef = useRef(null);
    const nextIdRef = useRef(4);
    const [direction, setDirection] = useState('ltr');
    const [items, setItems] = useState([
        { id: 1, width: 64 },
        { id: 2, width: 112 },
        { id: 3, width: 88 },
    ]);
    const [logs, setLogs] = useState(['等待 DOM 变化']);

    const createItem = () => ({
        id: nextIdRef.current++,
        width: Math.round(48 + Math.random() * 88),
    });

    useMutationObserver(
        [containerRef],
        records => {
            const added = records.reduce((total, record) => total + record.addedNodes.length, 0);
            const removed = records.reduce((total, record) => total + record.removedNodes.length, 0);
            const directionChanged = records.some(record => record.type === 'attributes');
            const nextLogs = [];

            if (added > 0) {
                nextLogs.push(`插入 ${added} 个节点`);
            }
            if (removed > 0) {
                nextLogs.push(`删除 ${removed} 个节点`);
            }
            if (directionChanged) {
                const value = containerRef.current?.dataset.direction === 'rtl' ? '从右到左' : '从左到右';

                nextLogs.push(`方向切换为${value}`);
            }

            setLogs(value => nextLogs.concat(value).slice(0, 5));
        },
        {
            attributes: true,
            attributeFilter: ['data-direction'],
            childList: true,
        },
    );

    const insertItem = () => {
        setItems(value => value.concat(createItem()));
    };

    const removeItem = () => {
        setItems(value => {
            if (value.length === 0) {
                return value;
            }

            return value.slice(0, -1);
        });
    };

    return (
        <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-4">
                <Button onClick={insertItem}>插入末尾节点</Button>
                <Button variant="filled" onClick={() => setDirection(value => (value === 'ltr' ? 'rtl' : 'ltr'))}>
                    切换方向
                </Button>
                <Button variant="outlined" disabled={items.length === 0} onClick={removeItem}>
                    删除末尾节点
                </Button>
            </div>
            <div
                ref={containerRef}
                data-direction={direction}
                className={`flex min-h-15 w-full flex-wrap gap-2 rounded-md border border-muted bg-subtle p-4 ${
                    direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'
                }`}
            >
                {items.map(item => (
                    <div
                        key={item.id}
                        className="h-6 shrink-0 rounded-sm bg-emphasized"
                        style={{ width: `${item.width}px` }}
                    />
                ))}
            </div>
            <div className="flex flex-col gap-1 text-sm">
                {logs.map((log, index) => (
                    <Text key={`${log}-${index}`} secondary>
                        {log}
                    </Text>
                ))}
            </div>
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
- 缺少 `MutationObserver`、targets 为空或 `enabled: false` 时不会执行任何操作。

## 注意事项

- `options` 会直接传给 `MutationObserver.observe`，至少需要指定一个观察维度，例如 `childList`、`attributes` 或 `characterData`。
- targets 中重复的节点只会被观察一次。
