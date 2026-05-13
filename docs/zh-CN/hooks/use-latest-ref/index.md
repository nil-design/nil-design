---
title: useLatestRef
cat: Ref
catOrder: 3
order: 1
---

# {{ $frontmatter.title }}

返回稳定的 ref 对象，并让 `current` 始终指向最新值。

## 签名

```ts
function useLatestRef<T>(value: T): { readonly current: T };
```

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { useLatestRef } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('点击按钮后延迟读取');
  const latestCountRef = useLatestRef(count);

  const handleReadLater = () => {
    setMessage('1 秒后读取最新 count...');

    setTimeout(() => {
      setMessage(`Latest count: ${latestCountRef.current}`);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <Text>Count: {count}</Text>
      <div className="flex gap-4">
        <Button onClick={() => setCount(value => value + 1)}>Increase</Button>
        <Button variant="outlined" onClick={handleReadLater}>1 秒后读取</Button>
      </div>
      <Text>{message}</Text>
    </div>
  );
};

render(<Demo />);
```
:::

## 关键行为

- ref 对象本身在重新渲染之间保持不变。
- `current` 会在每次渲染时同步到最新值，适合给定时器、订阅回调、事件监听器读取最新状态。

## 注意事项

- 这里返回的 `current` 应当视为只读使用，不建议手动写入新值。
- 如果你的目标是保存可变实例而不是追踪最新 props/state，普通 `useRef` 往往更直接。
