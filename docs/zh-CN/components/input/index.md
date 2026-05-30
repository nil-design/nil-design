---
title: Input 输入框
cat: 输入
---

# {{ $frontmatter.title }}

用于接收用户的文本输入。

## 变体

提供边框、填充和下划线三种视觉风格。

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input className="w-56" placeholder="Outlined (default)" variant="outlined" />
    <Input className="w-56" placeholder="Filled" variant="filled" />
    <Input className="w-56" placeholder="Underlined" variant="underlined" />
  </div>;
}

render(<Demo />);
```
:::

## 禁用状态

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input className="w-56" disabled placeholder="Disabled outlined" />
    <Input className="w-56" disabled variant="filled" placeholder="Disabled filled" />
    <Input className="w-56" disabled variant="underlined" placeholder="Disabled underlined" />
  </div>;
}

render(<Demo />);
```
:::

## 尺寸

提供三种尺寸选项。

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input className="w-56" size="small" placeholder="Small" />
    <Input className="w-56" size="medium" placeholder="Medium" />
    <Input className="w-56" size="large" placeholder="Large" />
  </div>;
}

render(<Demo />);
```
:::

## 块级

充满父容器宽度的输入框。

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="w-56">
    <Input block placeholder="Block input" />
  </div>;
}

render(<Demo />);
```
:::

## 前后缀

::: react-live
```tsx
import { Input } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input className="w-56" type="number" placeholder="Amount">
      <Input.Prefix>¥</Input.Prefix>
      <Input.Suffix>RMB</Input.Suffix>
    </Input>
  </div>;
}

render(<Demo />);
```
:::

## 复合

::: react-live
```tsx
import { Input, Button } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input.Composite className="w-56">
      <Input.Prepend>https://</Input.Prepend>
      <Input placeholder="mysite" />
      <Input.Append>.com</Input.Append>
    </Input.Composite>
    <Input.Composite className="w-56" variant="filled">
      <Input placeholder="..." />
      <Input.Append>
        <Button>Submit</Button>
      </Input.Append>
    </Input.Composite>
  </div>;
}

render(<Demo />);
```
:::

## 预设

### Search

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input.Search className="w-56" placeholder="Enter to search..." />
  </div>;
}

render(<Demo />);
```
:::

### Password

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input.Password className="w-56" placeholder="Enter password" />
  </div>;
}

render(<Demo />);
```
:::

### Number

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input.Number className="w-56" defaultValue={1} min={0} max={10} />
  </div>;
}

render(<Demo />);
```
:::

### OTP

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input.OTP className="w-56" length={6} />
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/input/API.zh-CN.md-->
