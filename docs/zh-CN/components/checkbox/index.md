---
title: Checkbox 复选框
cat: 输入
---

# {{ $frontmatter.title }}

允许用户从一个集合中选择一个或多个项目。

## 基本用法

::: react-live
```tsx
import { Checkbox } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Checkbox>Checkbox</Checkbox>
  </div>;
}

render(<Demo />);
```
:::