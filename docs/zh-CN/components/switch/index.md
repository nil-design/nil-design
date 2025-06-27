---
title: Switch 开关
order: 1
cat: 输入
catOrder: 3
---

# {{ $frontmatter.title }}

用于切换单个选项的状态。

## 变体

::: react-live
```tsx
import { Switch } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Switch />
    <Switch variant="outlined" />
  </div>;
}

render(<Demo />);
```
:::

## 禁用状态

::: react-live
```tsx
import { Switch } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Switch disabled />
    <Switch disabled defaultChecked />
    <Switch variant="outlined" disabled />
  </div>;
}

render(<Demo />);
```
:::

## 尺寸

::: react-live
```tsx
import { Switch } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap items-end gap-4">
    <Switch size="small" />
    <Switch />
    <Switch size="large" />
  </div>;
}

render(<Demo />);
```
:::

## 方形

::: react-live
```tsx
import { Switch } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Switch shape="square" />
    <Switch variant="outlined" shape="square" />
  </div>;
}

render(<Demo />);
```
:::

## 自定义内容

::: react-live
```tsx
import { useState } from 'react';
import { Switch } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  const [checked, setChecked] = useState(false);

  return <div className="flex flex-wrap gap-4">
    <Switch>
      <Switch.Checked>Open</Switch.Checked>
      <Switch.Unchecked>Close</Switch.Unchecked>
    </Switch>
    <Switch shape="square">
      <Switch.Checked>
        <DynamicIcon name="check" />
      </Switch.Checked>
      <Switch.Unchecked>
        <DynamicIcon name="close" />
      </Switch.Unchecked>
    </Switch>
    <Switch variant="outlined" checked={checked} onChange={setChecked}>
      <Switch.Thumb>
        <DynamicIcon name={checked ? 'dark-mode' : 'sun-one'} />
      </Switch.Thumb>
    </Switch>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/switch/API.zh-CN.md-->
