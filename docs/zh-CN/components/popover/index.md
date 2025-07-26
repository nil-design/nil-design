---
title: Popover 气泡卡片
cat: 展示
catOrder: 4
---

# {{ $frontmatter.title }}

弹窗展示额外信息。

## 触发方式

::: react-live
```tsx
import { Button, Popover } from '@nild/components'

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Popover action="hover">
      <Button>Hover me</Button>
      <Popover.Portal>
        <div className="text-md">
          content
        </div>
      </Popover.Portal>
    </Popover>
    <Popover action="focus">
      <Button variant="outlined">Focus me</Button>
      <Popover.Portal>
        <div className="text-md">
          content
        </div>
      </Popover.Portal>
    </Popover>
    <Popover>
      <Button variant="filled">Click me</Button>
      <Popover.Portal>
        <div className="text-md">
          content
        </div>
      </Popover.Portal>
    </Popover>
    <Popover action="contextMenu">
      <Button variant="text">Right-click me</Button>
      <Popover.Portal>
        <div className="text-md">
          content
        </div>
      </Popover.Portal>
    </Popover>
  </div>;
}

render(<Demo />);
```
:::

## 弹出位置

::: react-live
```tsx
import { Button, Popover } from '@nild/components'

const Demo = () => {
  return <div className="grid grid-cols-5 grid-rows-5 gap-4">
    {Object.entries({
      'col-start-2 row-start-1': 'top-start',
      'col-start-3 row-start-1': 'top',
      'col-start-4 row-start-1': 'top-end',
      'col-start-2 row-start-5': 'bottom-start',
      'col-start-3 row-start-5': 'bottom',
      'col-start-4 row-start-5': 'bottom-end',
      'col-start-1 row-start-2': 'left-start',
      'col-start-1 row-start-3': 'left',
      'col-start-1 row-start-4': 'left-end',
      'col-start-5 row-start-2': 'right-start',
      'col-start-5 row-start-3': 'right',
      'col-start-5 row-start-4': 'right-end',
    }).map(([className, placement]) => (
      <Popover key={placement} placement={placement} action="hover">
        <Button className={className}>
          {placement}
        </Button>
        <Popover.Portal>
          <div className="text-md">
            content
          </div>
        </Popover.Portal>
      </Popover>
    ))}
  </div>;
}

render(<Demo />);
```
:::

## 延迟

> [!NOTE]
> 仅针对 `hover` 触发方式生效

::: react-live
```tsx
import { Typography, Popover } from '@nild/components'

const { Text } = Typography;
const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Popover placement="right" action="hover" delay={[1000]}>
      <Text>Hover for 1s</Text>
      <Popover.Portal>
        <div className="text-md">
          Prompt Text
        </div>
      </Popover.Portal>
    </Popover>
  </div>;
}

render(<Demo />);
```
:::

## 偏移

::: react-live
```tsx
import { isObject } from '@nild/shared';
import { Button, Popover } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    {[12, 24, 36, { mainAxis: 24, crossAxis: 12 }].map((offset) => {
      const offsetKey = isObject(offset) ? JSON.stringify(offset) : `${offset}px`;

      return (
        <Popover key={offsetKey} offset={offset}>
          <Button variant="filled">
            {offsetKey}
          </Button>
          <Popover.Portal>
            <div className="text-md">
              content
            </div>
          </Popover.Portal>
        </Popover>
      );
    })}
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/popover/API.zh-CN.md-->