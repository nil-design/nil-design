---
title: Switch 开关
order: 1
cat: 输入
catOrder: 3
---

# Switch 开关

用于切换单个选项的状态。

## 基础变体

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

## 开关尺寸

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

## 方形开关

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
    <Switch
      checkedContent={'Open'}
      uncheckedContent={'Close'}
    />
    <Switch
      shape="square"
      checkedContent={<DynamicIcon name="check" />}
      uncheckedContent={<DynamicIcon name="close" />}
    />
    <Switch
      variant="outlined"
      checked={checked}
      thumbContent={<DynamicIcon name={checked ? 'dark-mode' : 'sun-one'} />}
      onChange={setChecked}
    />
  </div>;
}

render(<Demo />);
```
:::

## API

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | - | `string` | - |
| variant | - | `"solid" \| "outlined"` | `"solid"` |
| size | - | `"small" \| "medium" \| "large"` | `"medium"` |
| shape | - | `"round" \| "square"` | `"round"` |
| disabled | - | `boolean` | - |
| checkedContent | - | `React.ReactNode` | - |
| uncheckedContent | - | `React.ReactNode` | - |
| thumbContent | - | `React.ReactNode` | - |
