---
title: Select 选择器
cat: 输入
---

# {{ $frontmatter.title }}

用于从一组选项中进行单选或多选。

## 变体
::: react-live
```tsx
import { Select } from '@nild/components';

const Demo = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <Select className="w-56" placeholder="Outlined (default)" variant="outlined">
        <Select.Option value="beijing" label="Beijing" />
        <Select.Option value="shanghai" label="Shanghai" />
      </Select>
      <Select className="w-56" placeholder="Filled" variant="filled">
        <Select.Option value="beijing" label="Beijing" />
        <Select.Option value="shanghai" label="Shanghai" />
      </Select>
    </div>
  );
};

render(<Demo />);
```
:::

## 尺寸
::: react-live
```tsx
import { Select } from '@nild/components';

const Demo = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <Select className="w-56" size="small" placeholder="Small">
        <Select.Option value="beijing" label="Beijing" />
        <Select.Option value="shanghai" label="Shanghai" />
      </Select>
      <Select className="w-56" size="medium" placeholder="Medium">
        <Select.Option value="beijing" label="Beijing" />
        <Select.Option value="shanghai" label="Shanghai" />
      </Select>
      <Select className="w-56" size="large" placeholder="Large">
        <Select.Option value="beijing" label="Beijing" />
        <Select.Option value="shanghai" label="Shanghai" />
      </Select>
    </div>
  );
};

render(<Demo />);
```
:::

## 基础单选
::: react-live
```tsx
import { Select } from '@nild/components';

const Demo = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <Select className="w-60" placeholder="请选择城市">
        <Select.Option value="beijing" label="北京">
          北京 / Beijing
        </Select.Option>
        <Select.Option value="shanghai" label="上海">
          上海 / Shanghai
        </Select.Option>
        <Select.Option value="shenzhen" label="深圳">
          深圳 / Shenzhen
        </Select.Option>
      </Select>
    </div>
  );
};

render(<Demo />);
```
:::

## 基础多选
::: react-live
```tsx
import { Select } from '@nild/components';

const Demo = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <Select className="w-72" multiple defaultValue={['css', 'react']} placeholder="请选择技术栈">
        <Select.Option value="html" label="HTML" />
        <Select.Option value="css" label="CSS" />
        <Select.Option value="react" label="React" />
        <Select.Option value="vite" label="Vite" />
      </Select>
    </div>
  );
};

render(<Demo />);
```
:::

## 禁用状态
::: react-live
```tsx
import { Select } from '@nild/components';

const Demo = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <Select className="w-60" disabled placeholder="整个选择器已禁用">
        <Select.Option value="beijing" label="北京" />
        <Select.Option value="shanghai" label="上海" />
      </Select>
      <Select className="w-60" placeholder="包含禁用选项">
        <Select.Option value="beijing" label="北京" />
        <Select.Option value="shanghai" disabled label="上海（暂不可选）" />
        <Select.Option value="shenzhen" label="深圳" />
      </Select>
    </div>
  );
};

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/select/API.zh-CN.md-->
