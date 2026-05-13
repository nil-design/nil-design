---
title: usePrevious
cat: 状态
catOrder: 1
order: 3
---

# {{ $frontmatter.title }}

读取上一次被接受的值。

## 签名

```ts
function usePrevious<T>(
  value: T,
  shouldUpdate?: (current: T, next: T) => boolean,
): T | undefined;
```

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { usePrevious } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const [count, setCount] = useState(0);
  const previous = usePrevious(count);

  return (
    <div className="flex flex-col items-start gap-4">
      <Text>Current: {count}</Text>
      <Text>Previous: {previous ?? 'undefined'}</Text>
      <Button onClick={() => setCount(value => value + 1)}>Increase</Button>
    </div>
  );
};

render(<Demo />);
```
:::

## 关键行为

- 首次渲染时返回 `undefined`。
- 默认只要新旧值不满足 `Object.is`，就会把当前值记录为“上一个值”。
- 你可以通过 `shouldUpdate` 控制何时接受新值，从而过滤过于频繁或无意义的变化。

## 注意事项

- `shouldUpdate` 比较的是“当前已记录值”和“本次传入值”，而不是 React effect 那种依赖数组比较。
