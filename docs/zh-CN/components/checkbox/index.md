---
title: Checkbox 复选框
cat: 输入
---

# {{ $frontmatter.title }}

用于从一个集合中选择一个或多个项目。

## 基本用法

::: react-live
```tsx
import { Checkbox } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <Checkbox>Checkbox</Checkbox>
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
  const [liking, setLiking] = useState(false);

  return <div className="flex flex-wrap gap-4">
    <Checkbox checked={liking} onChange={setLiking}>
      <Checkbox.Indicator>
        <DynamicIcon name="like" variant={liking ? 'filled' : 'outlined'} />
      </Checkbox.Indicator>
      {liking ? 'Unlike' : 'Like'}
    </Checkbox>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/checkbox/API.zh-CN.md-->
