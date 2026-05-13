---
title: useControllableState
cat: 状态
catOrder: 1
order: 1
---

# {{ $frontmatter.title }}

统一受控与非受控两种状态模式。

## 签名

```ts
function useControllableState<T>(
  controlledState: T | undefined,
  defaultValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>];
```

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { useControllableState } from '@nild/hooks';
import { Button, Switch, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const [externalChecked, setExternalChecked] = useState(false);
  const [controlled, setControlled] = useControllableState(externalChecked, false);
  const [uncontrolled, setUncontrolled] = useControllableState(undefined, false);

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-6">
      <div className="flex w-full flex-col items-start gap-3">
        <Text>受控：点开关不会自己切换</Text>
        <div className="flex items-center gap-3">
          <Switch checked={controlled} onChange={() => setControlled(checked => !checked)} />
          <Text>{controlled ? '当前：开' : '当前：关'}</Text>
        </div>
        <Button onClick={() => setExternalChecked(checked => !checked)}>点击这里才会切换</Button>
      </div>
      <div className="flex w-full flex-col items-start gap-3">
        <Text>非受控：点开关就会切换</Text>
        <div className="flex items-center gap-3">
          <Switch checked={uncontrolled} onChange={() => setUncontrolled(checked => !checked)} />
          <Text>{uncontrolled ? '当前：开' : '当前：关'}</Text>
        </div>
      </div>
    </div>
  );
};

render(<Demo />);
```
:::

## 关键行为

- 当 `controlledState` 为 `undefined` 时，行为与普通 `useState` 接近，由内部状态驱动。
- 当 `controlledState` 有值时，返回值始终以外部传入值为准，setter 不会在内部保存新状态。
- 受控模式下使用函数式更新器时，更新函数仍会收到当前受控值，便于复用同一套更新逻辑。

## 注意事项

- 受控模式下调用 setter 只会触发一次重新渲染，真正的状态变化仍需要父组件更新传入值。
- `defaultValue` 只在非受控模式的首次初始化时生效。
