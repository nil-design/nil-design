---
title: Segment 分段控制器
cat: 输入
---

# {{ $frontmatter.title }}

用于在少量互斥选项之间切换当前值。

## 基础用法

::: react-live
```tsx
import { Segment } from '@nild/components';

const Demo = () => {
  return <Segment defaultValue="month">
    <Segment.Item value="day">日</Segment.Item>
    <Segment.Item value="month">月</Segment.Item>
    <Segment.Item value="year">年</Segment.Item>
  </Segment>;
};

render(<Demo />);
```
:::

## 禁用

::: react-live
```tsx
import { Segment } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    <Segment defaultValue="preview">
      <Segment.Item value="preview">预览</Segment.Item>
      <Segment.Item value="edit" disabled>编辑</Segment.Item>
      <Segment.Item value="history">历史</Segment.Item>
    </Segment>

    <Segment defaultValue="preview" disabled>
      <Segment.Item value="preview">预览</Segment.Item>
      <Segment.Item value="edit">编辑</Segment.Item>
      <Segment.Item value="history">历史</Segment.Item>
    </Segment>
  </div>;
};

render(<Demo />);
```
:::

## 尺寸

::: react-live
```tsx
import { Segment } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col items-start gap-4">
    {['small', 'medium', 'large'].map(size => (
      <Segment key={size} defaultValue="list" size={size}>
        <Segment.Item value="list">列表</Segment.Item>
        <Segment.Item value="grid">网格</Segment.Item>
        <Segment.Item value="kanban">看板</Segment.Item>
      </Segment>
    ))}
  </div>;
};

render(<Demo />);
```
:::

## 自定义内容

::: react-live
```tsx
import { Segment } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return <Segment defaultValue="list">
    <Segment.Item value="list">
      <DynamicIcon name="list" />
      列表
    </Segment.Item>
    <Segment.Item value="grid">
      <DynamicIcon name="grid-four" />
      网格
    </Segment.Item>
    <Segment.Item value="chart">
      <DynamicIcon name="chart-line" />
      图表
    </Segment.Item>
  </Segment>;
};

render(<Demo />);
```
:::

## 垂直排列

::: react-live
```tsx
import { Segment } from '@nild/components';

const Demo = () => {
  return <Segment defaultValue="basic" orientation="vertical">
    <Segment.Item value="basic">基础信息</Segment.Item>
    <Segment.Item value="permission">权限设置</Segment.Item>
    <Segment.Item value="notice">通知偏好</Segment.Item>
  </Segment>;
};

render(<Demo />);
```
:::

## 块级

::: react-live
```tsx
import { Segment } from '@nild/components';

const Demo = () => {
  return <Segment block defaultValue="all">
    <Segment.Item value="all">全部</Segment.Item>
    <Segment.Item value="active">进行中</Segment.Item>
    <Segment.Item value="done">已完成</Segment.Item>
  </Segment>;
};

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/segment/API.zh-CN.md-->
