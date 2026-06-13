---
title: Slider 滑块
cat: 输入
---

# {{ $frontmatter.title }}

用于在连续或分段数值范围内选择单个值。

## 变体

::: react-live

```tsx
import { Slider } from '@nild/components';

const Demo = () => {
    return (
        <div className="flex w-full max-w-96 flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span className="text-md">floating:</span>
                <Slider aria-label="浮动滑块" defaultValue={42} variant="floating" block />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-md">contained:</span>
                <Slider aria-label="内嵌滑块" defaultValue={42} variant="contained" block />
            </div>
        </div>
    );
};

render(<Demo />);
```

:::

## 禁用状态

::: react-live

```tsx
import { Slider } from '@nild/components';

const Demo = () => {
    return (
        <div className="flex flex-col items-start gap-4">
            <Slider aria-label="禁用滑块" defaultValue={45} disabled />
            <Slider aria-label="禁用垂直滑块" orientation="vertical" defaultValue={45} disabled />
        </div>
    );
};

render(<Demo />);
```

:::

## 范围与步进

::: react-live

```tsx
import { Slider } from '@nild/components';

const Demo = () => {
    return (
        <div className="flex flex-col items-start gap-4">
            <Slider aria-label="音量" defaultValue={30} min={0} max={100} />
            <Slider aria-label="字号" defaultValue={16} min={12} max={32} step={2} />
            <Slider aria-label="透明度" defaultValue={0.6} min={0} max={1} step={0.1} />
        </div>
    );
};

render(<Demo />);
```

:::

## 尺寸与块级

::: react-live

```tsx
import { Slider } from '@nild/components';

const Demo = () => {
    return (
        <div className="flex w-full flex-col gap-4">
            <Slider aria-label="小尺寸" size="small" defaultValue={24} block />
            <Slider aria-label="中尺寸" size="medium" defaultValue={48} block />
            <Slider aria-label="大尺寸" size="large" defaultValue={72} block />
        </div>
    );
};

render(<Demo />);
```

:::

## 垂直排列

::: react-live

```tsx
import { Slider } from '@nild/components';

const Demo = () => {
    return (
        <div className="flex h-48 items-end gap-4">
            <Slider aria-label="一月" orientation="vertical" defaultValue={30} />
            <Slider aria-label="二月" orientation="vertical" defaultValue={55} />
            <Slider aria-label="三月" orientation="vertical" defaultValue={75} />
        </div>
    );
};

render(<Demo />);
```

:::

## 自定义内容

::: react-live

```tsx
import { Slider } from '@nild/components';

const ticks = Array.from({ length: 17 }, (_, index) => index);

const Demo = () => (
    <Slider aria-label="刻度滑块" defaultValue={62} step={0.1} block className="mx-auto h-10 max-w-md">
        <Slider.Track className="overflow-visible bg-muted">
            <Slider.Range className="bg-brand" />
            {ticks.map(index => (
                <span
                    key={index}
                    className="pointer-events-none absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-canvas"
                    style={{ height: index % 4 === 0 ? 16 : 10, left: `${index * 6.25}%` }}
                />
            ))}
        </Slider.Track>
        <Slider.Thumb className="size-6 rotate-45 rounded-sm border-2 border-brand bg-brand-contrast shadow-sm">
            <span className="size-1.5 rounded-full bg-brand" />
        </Slider.Thumb>
    </Slider>
);

render(<Demo />);
```

:::

## API

<!--@include: ../../../../packages/components/src/slider/API.zh-CN.md-->
