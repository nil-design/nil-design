---
title: usePureCallback
cat: Ref
catOrder: 3
order: 2
---

# {{ $frontmatter.title }}

返回稳定引用，并始终调用最新实现的纯函数回调。

## 签名

```ts
function usePureCallback<T extends (...args: any[]) => any>(callback: T): T;
```

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { usePureCallback } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const [prefix, setPrefix] = useState('Count');
  const [count, setCount] = useState(1);
  const format = usePureCallback(value => `${prefix}: ${value}`);

  return (
    <div className="flex flex-col items-start gap-4">
      <Text>{format(count)}</Text>
      <div className="flex gap-4">
        <Button onClick={() => setCount(value => value + 1)}>Increase</Button>
        <Button variant="outlined" onClick={() => setPrefix(value => value === 'Count' ? 'Value' : 'Count')}>
          Toggle prefix
        </Button>
      </div>
    </div>
  );
};

render(<Demo />);
```
:::

## 关键行为

- 返回的函数引用在重新渲染后保持稳定。
- 调用这个稳定函数时，拿到的仍然是最新版本的回调逻辑。
- 它适合格式化、映射、比较这类纯函数场景，可以在渲染阶段安全执行。

## 注意事项

- 回调应保持纯函数，不要在里面写副作用。
- 如果回调需要在 `useEffect`、`useLayoutEffect` 或事件回调中执行业务副作用，请使用 [useEffectCallback](../use-effect-callback/)。
