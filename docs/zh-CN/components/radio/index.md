---
title: Radio 单选框
cat: 输入
---

# {{ $frontmatter.title }}

用于从一个集合中选择一个项目。

## 变体

::: react-live
```tsx
import { Radio } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Radio defaultChecked>Solid</Radio>
    <Radio variant="outlined" defaultChecked>Outlined</Radio>
  </div>;
}

render(<Demo />);
```
:::

## 禁用状态

::: react-live
```tsx
import { Radio } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Radio disabled />
    <Radio checked disabled />
    <Radio variant="outlined" checked disabled />
  </div>;
}

render(<Demo />);
```
:::

## 尺寸

::: react-live
```tsx
import { Radio } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Radio size="small">Small</Radio>
    <Radio>Medium</Radio>
    <Radio size="large">Large</Radio>
  </div>;
}

render(<Demo />);
```
:::

## 自定义内容

::: react-live
```tsx
import { useState } from 'react';
import { Radio } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Radio>
      <Radio.Label>After the label</Radio.Label>
      <Radio.Indicator />
    </Radio>
    <Radio>
      <Radio.Indicator>
        {checked => (
          <DynamicIcon
            name="alarm"
            variant={checked ? 'filled' : 'outlined'}
          />
        )}
      </Radio.Indicator>
      <Radio.Label>
        {checked => checked ? 'Sounding' : 'Sound'}
      </Radio.Label>
    </Radio>
  </div>;
}

render(<Demo />);
```
:::

## 组合

::: react-live
```tsx
import { Radio } from '@nild/components';

const options = [
  {
    label: 'Option 1',
    value: 1,
  },
  {
    label: 'Option 2',
    value: 2,
  },
  {
    label: 'Option 3',
    value: 3,
  },
];

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Radio.Group defaultValue={2}>
      {options.map(({ label, value }) => (
        <Radio key={value} value={value}>
          {label}
        </Radio>
      ))}
    </Radio.Group>
    <Radio.Group direction="vertical" variant="outlined" defaultValue={3}>
      {options.map(({ label, value }) => (
        <Radio key={value} value={value}>
          {label}
        </Radio>
      ))}
    </Radio.Group>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/radio/API.zh-CN.md-->
