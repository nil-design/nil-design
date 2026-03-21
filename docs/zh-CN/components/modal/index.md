---
title: Modal 弹窗
cat: 展示
catOrder: 6
---

# {{ $frontmatter.title }}

用于在当前页面之上承载需要中断流程确认或补充信息的内容。

## 变体

::: react-live
```tsx
import { useState } from 'react';
import { Button, Modal } from '@nild/components';

const Demo = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
      <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Open drawer</Button>

      <Modal open={dialogOpen} onClose={() => setDialogOpen(false)} aria-label="Delete confirmation">
        <Modal.Portal className="vp-raw">
          <Modal.Header>Delete item</Modal.Header>
          <Modal.Body>
            This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="solid" onClick={() => setDialogOpen(false)}>Confirm</Button>
          </Modal.Footer>
        </Modal.Portal>
      </Modal>

      <Modal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="drawer"
        placement="right"
        aria-label="Filter panel"
      >
        <Modal.Portal className="vp-raw">
          <Modal.Header>Filters</Modal.Header>
          <Modal.Body>
            Adjust the options and apply them without leaving the current page.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="solid" onClick={() => setDrawerOpen(false)}>Apply</Button>
          </Modal.Footer>
        </Modal.Portal>
      </Modal>
    </div>
  );
};

render(<Demo />);
```
:::

## 无遮罩

::: react-live
```tsx
import { useState } from 'react';
import { Button, Modal } from '@nild/components';

const Demo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Open overlayless drawer</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        variant="drawer"
        placement="right"
        aria-label="Overlayless drawer"
      >
        <Modal.Portal className="vp-raw" overlayless>
          <Modal.Header>No overlay</Modal.Header>
          <Modal.Body>
            The modal still behaves like a layered surface, but it does not render the dimmed overlay.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="solid" onClick={() => setOpen(false)}>Confirm</Button>
          </Modal.Footer>
        </Modal.Portal>
      </Modal>
    </>
  );
};

render(<Demo />);
```
:::

## 自定义内容

::: react-live
```tsx
import { useState } from 'react';
import { Button, Modal } from '@nild/components';

const Demo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open custom modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} aria-label="Custom modal example">
        <Modal.Portal className="vp-raw">
          <Modal.Header>Custom Title</Modal.Header>
          <Modal.Body>
            <code>Modal.Portal</code> only accepts <code>Modal.Header</code>, <code>Modal.Body</code>,
            <code>Modal.Footer</code> and <code>Modal.Close</code> as direct children.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="solid" onClick={() => setOpen(false)}>Confirm</Button>
          </Modal.Footer>
          <Modal.Close aria-label="Close modal" />
        </Modal.Portal>
      </Modal>
    </>
  );
};

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/modal/API.zh-CN.md-->
