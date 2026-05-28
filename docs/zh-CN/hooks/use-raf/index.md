---
title: useRaf
cat: 副作用
catOrder: 2
order: 7
---

# {{ $frontmatter.title }}

手动调度一个下一帧执行的回调，并在重复调度或卸载时自动取消。

## 签名

```ts
function useRaf(callback: FrameRequestCallback): {
    run: () => void;
    cancel: () => void;
};
```

## 基本用法

::: react-live

```tsx
import { useRef, useState } from 'react';
import { useRaf } from '@nild/hooks';
import { Button, Typography } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const { Text } = Typography;
const icons = ['sun-one', 'dark-mode', 'lightning', 'sleep'];

const Demo = () => {
    const tickRef = useRef(0);
    const runningRef = useRef(false);
    const [index, setIndex] = useState(0);
    const [running, setRunning] = useState(false);
    const frame = useRaf(() => {
        if (!runningRef.current) {
            return;
        }

        tickRef.current += 1;
        if (tickRef.current % 18 === 0) {
            setIndex(value => (value + 1) % icons.length);
        }

        frame.run();
    });

    const start = () => {
        runningRef.current = true;
        setRunning(true);
        frame.run();
    };

    const cancel = () => {
        runningRef.current = false;
        setRunning(false);
        frame.cancel();
    };

    return (
        <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <DynamicIcon name={icons[index]} className="text-2xl text-brand" />
                <Text secondary>{running ? '循环切换中' : '已暂停'}</Text>
            </div>
            <div className="flex flex-wrap gap-4">
                <Button disabled={running} onClick={start}>
                    开始
                </Button>
                <Button variant="outlined" disabled={!running} onClick={cancel}>
                    取消
                </Button>
            </div>
        </div>
    );
};

render(<Demo />);
```

:::

## 关键行为

- `run()` 会取消上一次尚未执行的帧任务，再调度新的任务。
- 回调会接收 `requestAnimationFrame` 传入的时间戳。
- 回调变化时始终使用最新实现，组件卸载时会自动取消待执行任务。

## 注意事项

- 非浏览器环境或缺少 `requestAnimationFrame` 时，`run()` 不会执行任何操作。
