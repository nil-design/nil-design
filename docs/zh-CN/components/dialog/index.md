---
title: Dialog 对话框
cat: 展示
catOrder: 6
---

# {{ $frontmatter.title }}

用于在当前页面之上承载需要中断流程确认的内容。

## 基础用法

::: react-live
```tsx
import { Button, Dialog } from '@nild/components';

const Demo = () => {
  return (
    <Dialog aria-label="删除确认">
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Header>Delete item</Dialog.Header>
        <Dialog.Body>
          This action cannot be undone.
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="text">Cancel</Button>
          <Button>Delete</Button>
        </Dialog.Footer>
        <Dialog.Close />
      </Dialog.Portal>
    </Dialog>
  );
};

render(<Demo />);
```
:::

## 受控打开

::: react-live
```tsx
import { useState } from 'react';
import { Button, Dialog } from '@nild/components';

const Demo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open controlled dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} aria-label="受控对话框">
        <Dialog.Portal>
          <Dialog.Header>Controlled dialog</Dialog.Header>
          <Dialog.Body>
            Closing by overlay, Escape or the close button will call <code>onClose</code>.
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </Dialog.Footer>
          <Dialog.Close />
        </Dialog.Portal>
      </Dialog>
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
import { Button, Dialog } from '@nild/components';

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
        <Button onClick={() => setOpen(true)}>Preview dialog</Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} size={size} aria-label="尺寸示例">
        <Dialog.Portal>
          <Dialog.Header>{size} dialog</Dialog.Header>
          <Dialog.Body>
            Resize the dialog by switching the size buttons above.
          </Dialog.Body>
          <Dialog.Close />
        </Dialog.Portal>
      </Dialog>
    </>
  );
};

render(<Demo />);
```
:::

## 直接在 `Dialog.Portal` 中组合 `Header / Body / Footer / Close`

::: react-live
```tsx
import { Button, Dialog } from '@nild/components';

const Demo = () => {
  return (
    <Dialog aria-label="结构组合示例">
      <Dialog.Trigger>
        <Button>Open structured dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Header>Structured portal</Dialog.Header>
        <Dialog.Body>
          Combine the dialog sections explicitly to keep the structure clear and predictable.
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="text">Secondary</Button>
          <Button>Primary</Button>
        </Dialog.Footer>
        <Dialog.Close />
      </Dialog.Portal>
    </Dialog>
  );
};

render(<Demo />);
```
:::

## 可访问命名

::: react-live
```tsx
import { Button, Dialog } from '@nild/components';

const Demo = () => {
  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <Dialog.Trigger>
        <Button>Edit profile</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Header>
          <h2 id="dialog-title">Edit profile</h2>
        </Dialog.Header>
        <Dialog.Body>
          <p id="dialog-description">
            The dialog name and description are wired through standard aria attributes.
          </p>
        </Dialog.Body>
        <Dialog.Close />
      </Dialog.Portal>
    </Dialog>
  );
};

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/dialog/API.zh-CN.md-->
