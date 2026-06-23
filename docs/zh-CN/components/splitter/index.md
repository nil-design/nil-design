---
title: Splitter 分割面板
cat: 布局
---

# {{ $frontmatter.title }}

用于把一个区域拆分为可调整尺寸的多个面板。

## 方向

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Splitter className="h-52">
                <Splitter.Panel className="flex items-center justify-center bg-subtle">左侧面板</Splitter.Panel>
                <Splitter.Panel className="flex items-center justify-center">右侧面板</Splitter.Panel>
            </Splitter>
            <Splitter className="h-52" orientation="vertical" defaultSize={[35, 65]}>
                <Splitter.Panel className="flex items-center justify-center bg-subtle">预览</Splitter.Panel>
                <Splitter.Panel className="flex items-center justify-center">日志</Splitter.Panel>
            </Splitter>
        </div>
    );
};

render(<Demo />);
```

:::

## 禁用状态

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter disabled className="h-52" defaultSize={[40, 60]}>
            <Splitter.Panel className="flex items-center justify-center bg-subtle">导航面板</Splitter.Panel>
            <Splitter.Panel className="flex items-center justify-center">内容面板</Splitter.Panel>
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

## 自定义内容

::: react-live

```tsx
import { Splitter } from '@nild/components';

const Demo = () => {
    return (
        <Splitter className="h-52" defaultSize={[36, 64]}>
            <Splitter.Panel className="flex items-center justify-center bg-subtle">左侧面板</Splitter.Panel>
            <Splitter.Grip className="flex h-7 w-2 items-center justify-center">
                <span className="flex flex-col gap-1">
                    <span className="size-1 rounded-full bg-emphasized transition-colors group-enabled:group-hover:bg-brand group-focus-visible:bg-brand motion-reduce:transition-none" />
                    <span className="size-1 rounded-full bg-emphasized transition-colors group-enabled:group-hover:bg-brand group-focus-visible:bg-brand motion-reduce:transition-none" />
                    <span className="size-1 rounded-full bg-emphasized transition-colors group-enabled:group-hover:bg-brand group-focus-visible:bg-brand motion-reduce:transition-none" />
                </span>
            </Splitter.Grip>
            <Splitter.Panel className="flex items-center justify-center">右侧面板</Splitter.Panel>
        </Splitter>
    );
};

render(<Demo />);
```

:::

## API

<!--@include: ../../../../packages/components/src/splitter/API.zh-CN.md-->
