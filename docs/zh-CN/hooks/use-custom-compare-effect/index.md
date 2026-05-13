---
title: useCustomCompareEffect
cat: 副作用
catOrder: 2
order: 2
---

# {{ $frontmatter.title }}

为 `useEffect` 增加可定制的依赖比较逻辑。

## 签名

```ts
function useCustomCompareEffect(
  effect: EffectCallback,
  deps: DependencyList,
  compare?: (prevDeps: DependencyList, nextDeps: DependencyList) => boolean,
): void;
```

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { useCustomCompareEffect } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const [user, setUser] = useState({ id: 1, name: 'Nil' });
  const [runs, setRuns] = useState(0);

  useCustomCompareEffect(
    () => {
      setRuns(value => value + 1);
    },
    [user],
    (prevDeps, nextDeps) => prevDeps[0].id === nextDeps[0].id,
  );

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex gap-4">
        <Button onClick={() => setUser(value => ({ ...value, name: `${value.name}!` }))}>
          Change name
        </Button>
        <Button variant="outlined" onClick={() => setUser(value => ({ ...value, id: value.id + 1 }))}>
          Change id
        </Button>
      </div>
      <Text>Current user: {user.name} #{user.id}</Text>
      <Text>Effect 运行次数：{runs}</Text>
    </div>
  );
};

render(<Demo />);
```
:::

## 关键行为

- 自定义比较器决定当前依赖数组是否可以继续复用上一次的依赖引用。
- 当比较器返回 `true` 时，hook 会把依赖视为“等价”，从而跳过一次新的依赖替换。
- 最终 effect 是否重跑，仍然由 React 对传给 `useEffect` 的依赖数组做比较来决定。

## 注意事项

- 默认比较器会逐项使用 `Object.is` 比较依赖项。
- 这个 hook 适合“依赖值结构经常变化，但只有部分字段真正决定副作用是否需要重跑”的场景。
