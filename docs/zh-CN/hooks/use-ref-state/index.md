---
title: useRefState
cat: 状态
catOrder: 1
order: 5
---

# {{ $frontmatter.title }}

在状态更新时同步维护一个始终指向最新值的 ref。

## 签名

```ts
function useRefState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>];
```

## 基本用法

::: react-live

```tsx
import { useRefState } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
    const [count, setCount, countRef] = useRefState(0);

    return (
        <div className="flex flex-col items-start gap-4">
            <Text>当前值：{count}，ref：{countRef.current}</Text>
            <Button onClick={() => setCount(value => value + 1)}>增加</Button>
        </div>
    );
};

render(<Demo />);
```

:::

## 关键行为

- 返回值和 `useState` 接近，第三项是同步更新的 ref。
- 调用 setter 时会先计算新值并写入 `ref.current`，再触发组件渲染。
- 函数式更新会读取 `ref.current`，连续调用时能拿到上一轮刚写入的最新值。

## 注意事项

- `ref.current` 可以被读取，但业务更新仍应优先通过 setter 完成。
- `initialState` 只在首次渲染时使用，行为与 `useState` 一致。
