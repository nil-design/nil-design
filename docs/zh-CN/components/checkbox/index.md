---
title: Checkbox 复选框
cat: 输入
---

# {{ $frontmatter.title }}

用于从一个集合中选择一个或多个项目。

## 变体

::: react-live
```tsx
import { Checkbox } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Checkbox defaultChecked>Solid</Checkbox>
    <Checkbox variant="outlined" defaultChecked>Outlined</Checkbox>
  </div>;
}

render(<Demo />);
```
:::

## 禁用状态

::: react-live
```tsx
import { Checkbox } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Checkbox disabled />
    <Checkbox checked disabled />
    <Checkbox variant="outlined" checked disabled />
  </div>;
}

render(<Demo />);
```
:::

## 尺寸

::: react-live
```tsx
import { Checkbox } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Checkbox size="small">Small</Checkbox>
    <Checkbox>Medium</Checkbox>
    <Checkbox size="large">Large</Checkbox>
  </div>;
}

render(<Demo />);
```
:::

## 自定义内容

::: react-live
```tsx
import { useState } from 'react';
import { Checkbox } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Checkbox>
      <Checkbox.Label>After the label</Checkbox.Label>
      <Checkbox.Indicator />
    </Checkbox>
    <Checkbox>
      <Checkbox.Indicator>
        {checked => (
          <DynamicIcon
            name="like"
            variant={checked ? 'filled' : 'outlined'}
          />
        )}
      </Checkbox.Indicator>
      <Checkbox.Label>
        {checked => checked ? 'Unlike' : 'Like'}
      </Checkbox.Label>
    </Checkbox>
  </div>;
}

render(<Demo />);
```
:::

## 复选框组

::: react-live
```tsx
import { Checkbox } from '@nild/components';

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
    <Checkbox.Group defaultValue={[2]}>
      {options.map(option => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
    <Checkbox.Group direction="vertical" variant="outlined" defaultValue={[1, 3]}>
      {options.map(option => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  </div>;
}

render(<Demo />);
```
:::

##

## API

<!--@include: ../../../../packages/components/src/checkbox/API.zh-CN.md-->
