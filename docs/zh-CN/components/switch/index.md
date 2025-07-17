---
title: Switch 开关
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
  return <div className="flex flex-wrap gap-4">
    <Switch>
      <Switch.Track type="checked">Open</Switch.Track>
      <Switch.Track type="unchecked">Close</Switch.Track>
    </Switch>
    <Switch shape="square">
      <Switch.Track type="checked">
        <DynamicIcon name="check" />
      </Switch.Track>
      <Switch.Track type="unchecked">
        <DynamicIcon name="close" />
      </Switch.Track>
    </Switch>
    <Switch variant="outlined">
      <Switch.Thumb>
        {checked => (
          <DynamicIcon name={checked ? 'dark-mode' : 'sun-one'}/>
        )}
      </Switch.Thumb>
    </Switch>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/switch/API.zh-CN.md-->
