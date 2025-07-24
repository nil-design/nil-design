---
title: useEventListener
cat: DOM
catOrder: 4
---

# {{ $frontmatter.title }}

更优雅地使用 addEventListener。

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { useEventListener } from '@nild/hooks';
import { Typography } from '@nild/components';

const { Text } = Typography;
const Demo = () => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEventListener(window, 'mousemove', (e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  });

  return (
    <Text>
      Current cursor position: {pos ? `(${pos.x}, ${pos.y})` : '[move your cursor]'}
    </Text>
  );
}

render(<Demo />);
```
:::
