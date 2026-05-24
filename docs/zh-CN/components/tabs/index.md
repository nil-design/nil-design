---
title: Tabs 标签页
cat: 导航
catOrder: 3
---

# {{ $frontmatter.title }}

用于在同一区域内切换多组相关内容。

## 变体

::: react-live
```tsx
import { Tabs } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col gap-6">
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">概览</Tabs.Tab>
        <Tabs.Tab value="activity">动态</Tabs.Tab>
        <Tabs.Tab value="settings">设置</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">概览内容</Tabs.Panel>
      <Tabs.Panel value="activity">动态内容</Tabs.Panel>
      <Tabs.Panel value="settings">设置内容</Tabs.Panel>
    </Tabs>

    <Tabs defaultValue="overview" variant="card">
      <Tabs.List>
        <Tabs.Tab value="overview">概览</Tabs.Tab>
        <Tabs.Tab value="activity">动态</Tabs.Tab>
        <Tabs.Tab value="settings">设置</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">概览内容</Tabs.Panel>
      <Tabs.Panel value="activity">动态内容</Tabs.Panel>
      <Tabs.Panel value="settings">设置内容</Tabs.Panel>
    </Tabs>
  </div>;
};

render(<Demo />);
```
:::

## 禁用

::: react-live
```tsx
import { Tabs } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col gap-6">
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">概览</Tabs.Tab>
        <Tabs.Tab value="activity" disabled>动态</Tabs.Tab>
        <Tabs.Tab value="settings">设置</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">概览内容</Tabs.Panel>
      <Tabs.Panel value="activity">动态内容</Tabs.Panel>
      <Tabs.Panel value="settings">设置内容</Tabs.Panel>
    </Tabs>

    <Tabs defaultValue="overview" disabled>
      <Tabs.List>
        <Tabs.Tab value="overview">概览</Tabs.Tab>
        <Tabs.Tab value="activity">动态</Tabs.Tab>
        <Tabs.Tab value="settings">设置</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">概览内容</Tabs.Panel>
      <Tabs.Panel value="activity">动态内容</Tabs.Panel>
      <Tabs.Panel value="settings">设置内容</Tabs.Panel>
    </Tabs>
  </div>;
};

render(<Demo />);
```
:::

## 尺寸

::: react-live
```tsx
import { Tabs } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-col gap-6">
    {['small', 'medium', 'large'].map(size => (
      <Tabs key={size} defaultValue="first" size={size}>
        <Tabs.List>
          <Tabs.Tab value="first">First</Tabs.Tab>
          <Tabs.Tab value="second">Second</Tabs.Tab>
          <Tabs.Tab value="third">Third</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="first">{size} first panel</Tabs.Panel>
        <Tabs.Panel value="second">{size} second panel</Tabs.Panel>
        <Tabs.Panel value="third">{size} third panel</Tabs.Panel>
      </Tabs>
    ))}
  </div>;
};

render(<Demo />);
```
:::

## 自定义内容

::: react-live
```tsx
import { Tabs } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return <Tabs defaultValue="profile">
    <Tabs.List>
      <Tabs.Tab value="profile">
        <span className="inline-flex items-center gap-1">
          <DynamicIcon name="user" />
          资料
        </span>
      </Tabs.Tab>
      <Tabs.Tab value="security">
        <span className="inline-flex items-center gap-1">
          <DynamicIcon name="shield" />
          安全
        </span>
      </Tabs.Tab>
      <Tabs.Tab value="billing">
        <span className="inline-flex items-center gap-1">
          <DynamicIcon name="file-text" />
          账单
        </span>
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="profile">资料内容</Tabs.Panel>
    <Tabs.Panel value="security">安全内容</Tabs.Panel>
    <Tabs.Panel value="billing">账单内容</Tabs.Panel>
  </Tabs>;
};

render(<Demo />);
```
:::

## 垂直排列

::: react-live
```tsx
import { Tabs } from '@nild/components';

const Demo = () => {
  return <Tabs className="max-w-xl items-stretch" defaultValue="profile" orientation="vertical" variant="card">
    <Tabs.List>
      <Tabs.Tab value="profile">资料</Tabs.Tab>
      <Tabs.Tab value="security">安全</Tabs.Tab>
      <Tabs.Tab value="billing">账单</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel className="rounded-bl-none" value="profile">资料内容</Tabs.Panel>
    <Tabs.Panel className="rounded-bl-none" value="security">安全内容</Tabs.Panel>
    <Tabs.Panel className="rounded-bl-none" value="billing">账单内容</Tabs.Panel>
  </Tabs>;
};

render(<Demo />);
```
:::

## 可关闭

::: react-live
```tsx
import { useState } from 'react';
import { Tabs } from '@nild/components';

const initialItems = [
  { value: 'draft', label: '草稿', content: '草稿内容', closable: false },
  { value: 'review', label: '评审', content: '评审内容', closable: true },
  { value: 'done', label: '完成', content: '完成内容', closable: true },
];

const Demo = () => {
  const [items, setItems] = useState(initialItems);
  const [value, setValue] = useState('draft');

  const handleClose = closedValue => {
    const nextItems = items.filter(item => item.value !== closedValue);

    setItems(nextItems);

    if (value === closedValue && nextItems[0]) {
      setValue(nextItems[0].value);
    }
  };

  return <Tabs closable value={value} onChange={setValue} onClose={handleClose}>
    <Tabs.List>
      {items.map(item => (
        <Tabs.Tab closable={item.closable} key={item.value} value={item.value}>{item.label}</Tabs.Tab>
      ))}
    </Tabs.List>
    {items.map(item => (
      <Tabs.Panel key={item.value} value={item.value}>{item.content}</Tabs.Panel>
    ))}
  </Tabs>;
};

render(<Demo />);
```
:::

## 销毁时机

::: react-live
```tsx
import { Tabs } from '@nild/components';

const Demo = () => {
  return <Tabs defaultValue="keep" destroyOnInactive>
    <Tabs.List>
      <Tabs.Tab value="keep">保留当前</Tabs.Tab>
      <Tabs.Tab value="reset">切换后销毁</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="keep">当前面板内容</Tabs.Panel>
    <Tabs.Panel value="reset">非激活面板会从 DOM 中移除</Tabs.Panel>
  </Tabs>;
};

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/tabs/API.zh-CN.md-->
