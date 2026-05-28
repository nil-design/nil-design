---
title: useTimeout
cat: 副作用
catOrder: 2
order: 6
---

# {{ $frontmatter.title }}

手动调度一个会自动清理并始终调用最新回调的定时器。

## 签名

```ts
function useTimeout(
    callback: () => void,
    delay?: number,
): {
    run: (delay?: number) => void;
    cancel: () => void;
};
```

## 基本用法

::: react-live

```tsx
import { useRef, useState } from 'react';
import { useTimeout } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
    const total = 5;
    const remainingRef = useRef(0);
    const [remaining, setRemaining] = useState(total);
    const [running, setRunning] = useState(false);
    const [status, setStatus] = useState('等待开始');
    const timer = useTimeout(() => {
        const next = Math.max(remainingRef.current - 1, 0);

        remainingRef.current = next;
        setRemaining(next);

        if (next === 0) {
            setRunning(false);
            setStatus('倒计时结束，已发送提醒');
        } else {
            timer.run();
        }
    }, 1000);

    const start = () => {
        remainingRef.current = total;
        setRemaining(total);
        setRunning(true);
        setStatus('倒计时中');
        timer.run();
    };

    const cancel = () => {
        timer.cancel();
        remainingRef.current = total;
        setRemaining(total);
        setRunning(false);
        setStatus('已取消');
    };

    return (
        <div className="flex flex-col items-start gap-4">
            <Text>
                剩余 {remaining}s，{status}
            </Text>
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

- `run()` 使用默认 `delay`，也可以临时传入新的延迟时间。
- 再次调用 `run()` 会取消上一次尚未执行的定时器。
- 回调变化时不会丢失最新实现，卸载时会自动取消定时器。

## 注意事项

- 当默认 `delay` 和 `run(delay)` 都未传入时，不会创建定时器。
- `cancel()` 只取消尚未执行的定时器，不会触发回调。
