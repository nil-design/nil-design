---
title: Input 输入框
cat: 输入
---

# {{ $frontmatter.title }}

用于接收用户的文本输入。

## 变体

提供边框和填充两种视觉风格。

::: react-live
```tsx
import { Input } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Input placeholder="Outlined (default)" variant="outlined" />
    <Input placeholder="Filled" variant="filled" />
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
    <Input disabled placeholder="Disabled outlined" />
    <Input disabled variant="filled" placeholder="Disabled filled" />
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
    <Input size="small" placeholder="Small" />
    <Input size="medium" placeholder="Medium" />
    <Input size="large" placeholder="Large" />
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
  return <div>
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
    <Input type="number" placeholder="Amount">
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
    <Input.Composite>
      <Input.Prepend>https://</Input.Prepend>
      <Input placeholder="mysite" />
      <Input.Append>.com</Input.Append>
    </Input.Composite>
    <Input.Composite variant="filled">
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
    <Input.Search placeholder="Enter to search..." onSearch={(val) => alert('Search: ' + val)} />
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
    <Input.Password placeholder="Enter password" />
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
    <Input.Number defaultValue={1} min={0} max={10} />
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
    <Input.OTP length={6} onComplete={(val) => alert('OTP: ' + val)} />
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/input/API.zh-CN.md-->
