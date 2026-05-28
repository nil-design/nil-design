---
title: useScrollLock
cat: DOM
catOrder: 4
order: 2
---

# {{ $frontmatter.title }}

锁定文档或元素的滚动，并在卸载或关闭时恢复原始样式。

## 签名

```ts
function useScrollLock(locked?: boolean): void;
function useScrollLock(target: ResolvableTarget<Document | HTMLElement>, locked?: boolean): void;
```

## 基本用法

::: react-live

```tsx
import { useRef, useState } from 'react';
import { useScrollLock } from '@nild/hooks';
import { Switch, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
    const panelRef = useRef(null);
    const [locked, setLocked] = useState(false);

    useScrollLock(panelRef, locked);

    return (
        <div className="flex max-w-md flex-col gap-4">
            <div className="flex items-center gap-4">
                <Switch checked={locked} className="min-w-16" onChange={setLocked}>
                    <Switch.Track type="checked">锁定</Switch.Track>
                    <Switch.Track type="unchecked">滚动</Switch.Track>
                </Switch>
                <Text>{locked ? '面板滚动已锁定' : '面板可以滚动'}</Text>
            </div>
            <div ref={panelRef} className="h-28 overflow-auto rounded-md border border-muted bg-subtle p-3">
                <div className="space-y-2">
                    {['工作流节点', '状态通知', '操作记录', '同步任务', '归档结果'].map(item => (
                        <div key={item} className="rounded-sm bg-surface px-3 py-2">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

render(<Demo />);
```

:::

## 关键行为

- 不传 target 时默认锁定当前 `document.body`。
- 传入 `Document` 时锁定该文档的 `body`；传入 `HTMLElement` 时锁定元素自身。
- 多个锁作用在同一目标上时会计数，最后一个锁释放后才恢复样式。
- 锁定 `body` 时会按滚动条宽度补偿 `padding-right`，减少页面横向抖动。

## 注意事项

- target 支持 DOM 对象、React ref、`null` 和 `undefined`。
- `locked` 为 `false` 时不会锁定；已锁定的目标会恢复原始样式。
