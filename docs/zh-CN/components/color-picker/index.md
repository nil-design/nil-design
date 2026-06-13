---
title: ColorPicker 颜色选择器
cat: 输入
---

# {{ $frontmatter.title }}

用于选择颜色并输出 HEX、RGB 或 HSL 字符串。

## 基础用法

::: react-live

```tsx
import { ColorPicker } from '@nild/components';

const Demo = () => {
    return <ColorPicker defaultValue="#1677ff" portalClassName="vp-raw" />;
};

render(<Demo />);
```

:::

## 禁用状态

::: react-live

```tsx
import { ColorPicker } from '@nild/components';

const Demo = () => {
    return <ColorPicker defaultValue="#1677ff" disabled portalClassName="vp-raw" />;
};

render(<Demo />);
```

:::

## 尺寸

::: react-live

```tsx
import { ColorPicker } from '@nild/components';

const Demo = () => {
    return (
        <div className="flex items-center gap-4">
            <ColorPicker size="small" defaultValue="#1677ff" portalClassName="vp-raw" />
            <ColorPicker size="medium" defaultValue="#13c2c2" portalClassName="vp-raw" />
            <ColorPicker size="large" defaultValue="#722ed1" portalClassName="vp-raw" />
        </div>
    );
};

render(<Demo />);
```

:::

## 格式与透明度

::: react-live

```tsx
import { useState } from 'react';
import { ColorPicker } from '@nild/components';

const Demo = () => {
    const [value, setValue] = useState('rgba(22, 119, 255, 0.72)');
    const [format, setFormat] = useState('rgb');

    return (
        <div className="flex items-center gap-4">
            <ColorPicker
                value={value}
                format={format}
                portalClassName="vp-raw"
                onChange={setValue}
                onFormatChange={setFormat}
            />
            <span className="text-md">{value}</span>
        </div>
    );
};

render(<Demo />);
```

:::

## 预设色

::: react-live

```tsx
import { ColorPicker } from '@nild/components';

const Demo = () => {
    return (
        <ColorPicker
            defaultValue="#52c41a"
            portalClassName="vp-raw"
            presets={[
                { label: 'Brand', value: '#1677ff' },
                { label: 'Success', value: '#52c41a' },
                { label: 'Warning', value: '#faad14' },
                { label: 'Danger', value: '#f5222d' },
                '#000000',
                '#ffffff',
            ]}
        />
    );
};

render(<Demo />);
```

:::

## 自定义触发器

::: react-live

```tsx
import { Button, ColorPicker } from '@nild/components';

const Demo = () => {
    return (
        <ColorPicker defaultValue="#13c2c2" portalClassName="vp-raw">
            <ColorPicker.Trigger>
                <Button variant="outlined">选择颜色</Button>
            </ColorPicker.Trigger>
        </ColorPicker>
    );
};

render(<Demo />);
```

:::

## API

<!--@include: ../../../../packages/components/src/color-picker/API.zh-CN.md-->
