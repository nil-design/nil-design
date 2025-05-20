---
title: Button 按钮
category: 通用
order: 1
---

# Button 按钮

按钮用于开始一个即时操作。

## 基础变体

::: react-live
```tsx
const Demo = () => {
  return <div class="flex gap-4">
    <Button>Solid</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="filled">Filled</Button>
    <Button variant="text">Text</Button>
  </div>;
}

render(<Demo />);
```
:::

## 按钮尺寸

::: react-live
```tsx
const Demo = () => {
  return <div class="flex items-end gap-4">
    <Button size="small">Small</Button>
    <Button>Medium</Button>
    <Button size="large">Large</Button>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ./api.md-->