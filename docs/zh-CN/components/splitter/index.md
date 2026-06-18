---
title: Splitter 分割面板
cat: 布局
---

# {{ $frontmatter.title }}

用于把一个区域拆分为可调整尺寸的多个面板。

## 基础

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter className="h-52">
            <Splitter.Panel className="flex items-center justify-center bg-subtle">左侧面板</Splitter.Panel>
            <Splitter.Panel className="flex items-center justify-center">右侧面板</Splitter.Panel>
        </Splitter>
    );
};

render(<Demo />);
```

:::

## 方向

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter className="h-64" orientation="vertical" defaultSize={[35, 65]}>
            <Splitter.Panel className="flex items-center justify-center bg-subtle">预览</Splitter.Panel>
            <Splitter.Panel className="flex items-center justify-center">日志</Splitter.Panel>
        </Splitter>
    );
};

render(<Demo />);
```

:::

## 尺寸

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter className="h-52" defaultSize={[30, 45, 25]}>
            <Splitter.Panel className="flex items-center justify-center bg-subtle">导航</Splitter.Panel>
            <Splitter.Panel className="flex items-center justify-center">内容</Splitter.Panel>
            <Splitter.Panel className="flex items-center justify-center bg-subtle">详情</Splitter.Panel>
        </Splitter>
    );
};

render(<Demo />);
```

:::

## 限制

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter className="h-52" defaultSize={[28, 44, 28]}>
            <Splitter.Panel min={20} max={40} className="flex items-center justify-center bg-subtle">
                最小 20%
            </Splitter.Panel>
            <Splitter.Panel min={30} className="flex items-center justify-center">
                主区域
            </Splitter.Panel>
            <Splitter.Panel min={18} max={34} className="flex items-center justify-center bg-subtle">
                最大 34%
            </Splitter.Panel>
        </Splitter>
    );
};

render(<Demo />);
```

:::

## 折叠

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter className="h-52" defaultSize={[32, 68]}>
            <Splitter.Panel collapsible className="flex items-center justify-center bg-subtle">
                可折叠面板
            </Splitter.Panel>
            <Splitter.Panel className="flex items-center justify-center">内容面板</Splitter.Panel>
        </Splitter>
    );
};

render(<Demo />);
```

:::

## 受控

::: react-live

```tsx
import { useState } from 'react';
import { Splitter } from '@nild/components';

const Demo = () => {
    const [size, setSize] = useState([36, 64]);

    return (
        <div className="flex flex-col gap-3">
            <Splitter className="h-52" size={size} onResize={setSize}>
                <Splitter.Panel className="flex items-center justify-center bg-subtle">列表</Splitter.Panel>
                <Splitter.Panel className="flex items-center justify-center">工作区</Splitter.Panel>
            </Splitter>
            <span className="text-md">当前尺寸：{size.map(item => `${Math.round(item)}%`).join(' / ')}</span>
        </div>
    );
};

render(<Demo />);
```

:::

## 自定义

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter className="h-52" defaultSize={[36, 64]}>
            <Splitter.Panel className="flex items-center justify-center bg-subtle">目录</Splitter.Panel>
            <Splitter.Grip>
                <span className="flex h-8 w-3 items-center justify-center rounded-sm bg-muted text-subtle">⋮</span>
            </Splitter.Grip>
            <Splitter.Panel className="flex items-center justify-center">正文</Splitter.Panel>
        </Splitter>
    );
};

render(<Demo />);
```

:::

## 禁用

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter className="h-52" defaultSize={[40, 60]}>
            <Splitter.Panel className="flex items-center justify-center bg-subtle" resizable={false}>
                固定面板
            </Splitter.Panel>
            <Splitter.Panel className="flex items-center justify-center">内容面板</Splitter.Panel>
        </Splitter>
    );
};

render(<Demo />);
```

:::

## API

<!--@include: ../../../../packages/components/src/splitter/API.zh-CN.md-->
