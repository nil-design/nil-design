---
title: useEffectCallback
cat: 副作用
catOrder: 2
order: 1
---

# {{ $frontmatter.title }}

返回稳定引用，并始终调用最新实现的副作用回调。

## 签名

```ts
function useEffectCallback<T extends (...args: any[]) => any>(callback: T): T;
```

## 基本用法

::: react-live
```tsx
import { useEffect, useState } from 'react';
import { useEffectCallback } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState('还没有同步');
  const syncLatestCount = useEffectCallback(() => {
    setSaved(`Latest count: ${count}`);
  });

  useEffect(() => {
    const timer = setTimeout(syncLatestCount, 600);

    return () => clearTimeout(timer);
  }, [count, syncLatestCount]);

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setCount(value => value + 1)}>Increase</Button>
      <Text>Count: {count}</Text>
      <Text>{saved}</Text>
    </div>
  );
};

render(<Demo />);
```
:::

## 关键行为

- 返回的函数引用在重新渲染后保持稳定。
- 调用返回函数时，实际执行的始终是最新版本的 `callback`。
- 它适合放在 `useEffect`、`useLayoutEffect`、事件回调等副作用场景中，避免因为闭包过旧而读到旧状态。

## 注意事项

- 这个 hook 允许回调内部包含副作用，因此不要把它当作可在渲染阶段随意执行的纯函数。
- 如果你需要“稳定引用 + 可在任意位置安全执行”，更适合使用 [usePureCallback](../use-pure-callback/)。
