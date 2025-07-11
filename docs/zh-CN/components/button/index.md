---
title: Button 按钮
cat: 通用
catOrder: 1
---

# {{ $frontmatter.title }}

用于开始一个即时操作。

## 变体

::: react-live
```tsx
import { Button } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Button>Solid</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="filled">Filled</Button>
    <Button variant="text">Text</Button>
  </div>;
}

render(<Demo />);
```
:::

## 禁用状态

::: react-live
```tsx
import { Button } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Button disabled>Solid</Button>
    <Button disabled variant="outlined">Outlined</Button>
    <Button disabled variant="filled">Filled</Button>
    <Button disabled variant="text">Text</Button>
  </div>;
}

render(<Demo />);
```
:::

## 尺寸

::: react-live
```tsx
import { Button } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap items-end gap-4">
    <Button size="small">Small</Button>
    <Button>Medium</Button>
    <Button size="large">Large</Button>
  </div>;
}

render(<Demo />);
```
:::

## 圆形

::: react-live
```tsx
import { Button } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Button shape="round">Solid</Button>
    <Button shape="round" variant="outlined" shape="round">Outlined</Button>
    <Button shape="round" variant="filled">Filled</Button>
    <Button shape="round" variant="text">Text</Button>
  </div>;
}

render(<Demo />);
```
:::

## 块级

::: react-live
```tsx
import { Button } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Button block>Solid</Button>
    <Button block variant="outlined">Outlined</Button>
    <Button block variant="filled">Filled</Button>
    <Button block variant="text">Text</Button>
  </div>;
}

render(<Demo />);
```
:::

## 等宽高

::: react-live
```tsx
import { Button } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return <div className="flex flex-wrap items-end gap-4">
    <Button equal>
      <DynamicIcon name="plus" />
    </Button>
    <Button variant="outlined" equal>
      <DynamicIcon name="search" />
    </Button>
    <Button variant="filled" shape="round" equal>
      <DynamicIcon name="power" />
    </Button>
  </div>;
}

render(<Demo />);
```
:::

## 组合

::: react-live
```tsx
import { Button } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Button.Group>
      <Button>Prev</Button>
      <Button>Next</Button>
    </Button.Group>
    <Button.Group variant="outlined">
      <Button>%</Button>
      <Button>‰</Button>
      <Button>‱</Button>
    </Button.Group>
    <div className="flex gap-4">
      <Button.Group variant="filled" direction="vertical">
        <Button>▲</Button>
        <Button>▼</Button>
      </Button.Group>
      <Button.Group variant="text" direction="vertical">
        <Button>Up</Button>
        <Button>Down</Button>
      </Button.Group>
    </div>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/button/API.zh-CN.md-->
