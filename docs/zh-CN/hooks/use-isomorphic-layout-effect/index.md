---
title: useIsomorphicLayoutEffect
cat: 副作用
catOrder: 2
order: 3
---

# {{ $frontmatter.title }}

在浏览器环境使用 `useLayoutEffect`，在非浏览器环境回退到 `useEffect`。

## 签名

```ts
const useIsomorphicLayoutEffect: typeof useEffect;
```

## 基本用法

::: react-live
```tsx
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@nild/hooks';
import { Button, Input, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const inputRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (visible) {
      inputRef.current?.focus();
    }
  }, [visible]);

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={() => setVisible(value => !value)}>
        {visible ? '隐藏输入框' : '显示输入框'}
      </Button>
      {visible && <Input block ref={inputRef} placeholder="已经自动聚焦，直接输入即可" />}
      <Text>适合同构场景下的聚焦、测量或定位这类 DOM 同步逻辑。</Text>
    </div>
  );
};

render(<Demo />);
```
:::

## 注意事项

- 这个 hook 主要用于同构场景下需要布局时机的逻辑，例如测量尺寸、同步定位、管理焦点。
- 在非浏览器环境中它会退回到 `useEffect`，从而避免直接使用 `useLayoutEffect` 时常见的 SSR 警告。
