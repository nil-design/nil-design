---
title: Button 按钮
order: 1
cat: 通用
catOrder: 1
---

# Button 按钮

用于开始一个即时操作。

## 基础变体

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

## 按钮尺寸

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

## 圆形按钮

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

## 块级按钮

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

## 等宽高按钮

::: react-live
```tsx
import { Button, Icon } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap items-end gap-4">
    <Button equal>
      <Icon name="plus" />
    </Button>
    <Button variant="outlined" equal>
      <Icon name="search" />
    </Button>
    <Button variant="filled" shape="round" equal>
      <Icon name="power" />
    </Button>
  </div>;
}

render(<Demo />);
```
:::

## 按钮组合

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

## Button API

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | - | `string` | - |
| children | - | `React.ReactNode` | - |
| variant | - | `"solid" \| "outlined" \| "filled" \| "text"` | `"solid"` |
| size | - | `"small" \| "medium" \| "large"` | `"medium"` |
| shape | - | `"round" \| "square"` | `"square"` |
| disabled | - | `boolean` | - |
| block | - | `boolean` | - |
| equal | - | `boolean` | - |

## Button.Group API

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | - | `string` | - |
| children | - | `React.ReactNode` | - |
| direction | - | `"horizontal" \| "vertical"` | `"horizontal"` |
| variant | - | `"solid" \| "outlined" \| "filled" \| "text"` | `"solid"` |
| size | - | `"small" \| "medium" \| "large"` | `"medium"` |
| disabled | - | `boolean` | - |
