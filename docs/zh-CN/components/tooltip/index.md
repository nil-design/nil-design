---
title: Tooltip 提示
cat: 展示
---

# {{ $frontmatter.title }}

用于提示的气泡框。

## 触发方式

::: react-live
```tsx
import { Button, Tooltip } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Tooltip action="hover">
      <span>
        <DynamicIcon name="help" />
      </span>
      <Tooltip.Portal>
        <div className="text-md">
          Help
        </div>
      </Tooltip.Portal>
    </Tooltip>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/tooltip/API.zh-CN.md-->