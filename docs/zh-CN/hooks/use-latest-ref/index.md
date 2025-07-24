---
title: useLatestRef
cat: Ref
catOrder: 3
---

# {{ $frontmatter.title }}

跟踪状态最新值并返回引用。

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { useLatestRef } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;
const Demo = () => {
  const [count, setCount] = useState(0);
  const latestCountRef = useLatestRef(count);

  const handleAlert = () => {
    setTimeout(() => {
      alert(`Latest count: ${latestCountRef.current}`);
    }, 3000);
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Text>Count: {count}</Text>
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setCount(count + 1)}>Increase</Button>
        <Button variant="outlined" onClick={handleAlert}>Alert after 3s</Button>
      </div>
    </div>
  );
}

render(<Demo />);
```
:::