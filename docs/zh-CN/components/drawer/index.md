---
title: Drawer 抽屉
cat: 展示
catOrder: 7
---

# {{ $frontmatter.title }}

用于从视口边缘滑出补充信息、设置项或分步操作。

## 基础用法

::: react-live
```tsx
import { Button, Drawer } from '@nild/components';

const Demo = () => {
  return (
    <Drawer aria-label="筛选条件">
      <Drawer.Trigger>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Header>Filters</Drawer.Header>
        <Drawer.Body>
          Adjust the options and apply them without leaving the current page.
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="text">Reset</Button>
          <Button>Apply</Button>
        </Drawer.Footer>
        <Drawer.Close />
      </Drawer.Portal>
    </Drawer>
  );
};

render(<Demo />);
```
:::

## 展开方向

::: react-live
```tsx
import { useState } from 'react';
import { Button, Drawer } from '@nild/components';

const Demo = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {['left', 'right', 'top', 'bottom'].map((nextPlacement) => (
          <Button
            key={nextPlacement}
            variant={placement === nextPlacement ? 'solid' : 'outlined'}
            onClick={() => setPlacement(nextPlacement)}
          >
            {nextPlacement}
          </Button>
        ))}
        <Button onClick={() => setOpen(true)}>Preview drawer</Button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} placement={placement} aria-label="方向示例">
        <Drawer.Portal>
          <Drawer.Header>{placement} drawer</Drawer.Header>
          <Drawer.Body>
            Switch the placement buttons above to preview each slide direction.
          </Drawer.Body>
          <Drawer.Close />
        </Drawer.Portal>
      </Drawer>
    </>
  );
};

render(<Demo />);
```
:::

## 尺寸

::: react-live
```tsx
import { useState } from 'react';
import { Button, Drawer } from '@nild/components';

const Demo = () => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState('medium');

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {['small', 'medium', 'large', 'full'].map((nextSize) => (
          <Button
            key={nextSize}
            variant={size === nextSize ? 'solid' : 'outlined'}
            onClick={() => setSize(nextSize)}
          >
            {nextSize}
          </Button>
        ))}
        <Button onClick={() => setOpen(true)}>Preview drawer</Button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} size={size} aria-label="尺寸示例">
        <Drawer.Portal>
          <Drawer.Header>{size} drawer</Drawer.Header>
          <Drawer.Body>
            Use different sizes to control how much viewport space the drawer occupies.
          </Drawer.Body>
          <Drawer.Close />
        </Drawer.Portal>
      </Drawer>
    </>
  );
};

render(<Demo />);
```
:::

## 直接在 `Drawer.Portal` 中组合 `Header / Body / Footer / Close`

::: react-live
```tsx
import { Button, Drawer } from '@nild/components';

const Demo = () => {
  return (
    <Drawer aria-label="结构组合示例">
      <Drawer.Trigger>
        <Button>Open structured drawer</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Header>Portal sections</Drawer.Header>
        <Drawer.Body>
          Compose the drawer with explicit sections so the layout stays predictable across different placements.
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="text">Back</Button>
          <Button>Continue</Button>
        </Drawer.Footer>
        <Drawer.Close />
      </Drawer.Portal>
    </Drawer>
  );
};

render(<Demo />);
```
:::

## `overlaid={false}` 的无遮罩示例

::: react-live
```tsx
import { Button, Drawer } from '@nild/components';

const Demo = () => {
  return (
    <Drawer aria-label="无遮罩抽屉">
      <Drawer.Trigger>
        <Button>Open overlayless drawer</Button>
      </Drawer.Trigger>
      <Drawer.Portal overlaid={false}>
        <Drawer.Header>No overlay</Drawer.Header>
        <Drawer.Body>
          The drawer still behaves like a modal layer, but it does not render the dimmed overlay.
        </Drawer.Body>
        <Drawer.Footer>
          <Button>Action</Button>
        </Drawer.Footer>
        <Drawer.Close />
      </Drawer.Portal>
    </Drawer>
  );
};

render(<Demo />);
```
:::

## 可访问命名

::: react-live
```tsx
import { Button, Drawer } from '@nild/components';

const Demo = () => {
  return (
    <Drawer
      aria-labelledby="drawer-title"
      aria-describedby="drawer-description"
    >
      <Drawer.Trigger>
        <Button>Open settings</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Header>
          <h2 id="drawer-title">Notification settings</h2>
        </Drawer.Header>
        <Drawer.Body>
          <p id="drawer-description">
            Standard aria attributes can point to visible title and description nodes inside the drawer.
          </p>
        </Drawer.Body>
        <Drawer.Close />
      </Drawer.Portal>
    </Drawer>
  );
};

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/drawer/API.zh-CN.md-->
