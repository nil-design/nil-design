---
title: useForceUpdate
cat: 状态
catOrder: 1
order: 4
---

# {{ $frontmatter.title }}

在不引入业务状态时强制当前组件重新渲染。

## 签名

```ts
function useForceUpdate(): () => void;
```

## 基本用法

::: react-live
```tsx
import { useRef } from 'react';
import { useForceUpdate } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const forceUpdate = useForceUpdate();
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;

  return (
    <div className="flex flex-col items-start gap-4">
      <Text>Render count: {renderCountRef.current}</Text>
      <Button onClick={forceUpdate}>Force update</Button>
    </div>
  );
};

render(<Demo />);
```
:::

## 注意事项

- 这个 hook 只负责触发重新渲染，本身不表达任何业务语义。
- 如果你已经有明确的状态来源，优先直接更新真实状态，而不是把它当成常规状态管理手段。
