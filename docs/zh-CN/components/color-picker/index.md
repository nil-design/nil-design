---
title: ColorPicker 颜色选择器
cat: 输入
---

# {{ $frontmatter.title }}

用于选择颜色并输出 HEX、RGB、HSV 或 HSL 字符串。

## 基础用法

::: react-live

```tsx
import { ColorPicker } from '@nild/components';
import { useBrandColor } from '~internals';

const Demo = () => {
    const brandColor = useBrandColor();

    return <ColorPicker key={brandColor} defaultValue={brandColor} portalClassName="vp-raw" />;
};

render(<Demo />);
```

:::

## 禁用状态

::: react-live

```tsx
import { ColorPicker } from '@nild/components';
import { useBrandColor } from '~internals';

const Demo = () => {
    const brandColor = useBrandColor();

    return <ColorPicker key={brandColor} defaultValue={brandColor} disabled portalClassName="vp-raw" />;
};

render(<Demo />);
```

:::

## 尺寸

::: react-live

```tsx
import { ColorPicker } from '@nild/components';
import { useBrandColor } from '~internals';

const Demo = () => {
    const brandColor = useBrandColor();

    return (
        <div className="flex items-center gap-4">
            <ColorPicker key={`small-${brandColor}`} size="small" defaultValue={brandColor} portalClassName="vp-raw" />
            <ColorPicker
                key={`medium-${brandColor}`}
                size="medium"
                defaultValue={brandColor}
                portalClassName="vp-raw"
            />
            <ColorPicker key={`large-${brandColor}`} size="large" defaultValue={brandColor} portalClassName="vp-raw" />
        </div>
    );
};

render(<Demo />);
```

:::

## 格式与透明度

::: react-live

```tsx
import { useEffect, useState } from 'react';
import { ColorPicker } from '@nild/components';
import { useBrandColor } from '~internals';

const Demo = () => {
    const brandColor = useBrandColor(60, 0.72);
    const [value, setValue] = useState(brandColor);
    const [format, setFormat] = useState('rgb');

    useEffect(() => {
        setValue(brandColor);
    }, [brandColor]);

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
import { useBrandColor } from '~internals';

const Demo = () => {
    const brandColor = useBrandColor();
    const brandHoverColor = useBrandColor(50);
    const brandDeepColor = useBrandColor(70);
    const brandMutedColor = useBrandColor(30);

    return (
        <ColorPicker
            key={brandColor}
            defaultValue={brandColor}
            portalClassName="vp-raw"
            presets={[
                { label: 'Brand 60', value: brandColor },
                { label: 'Brand 50', value: brandHoverColor },
                { label: 'Brand 70', value: brandDeepColor },
                { label: 'Brand 30', value: brandMutedColor },
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
import { useBrandColor } from '~internals';

const Demo = () => {
    const brandColor = useBrandColor();

    return (
        <ColorPicker key={brandColor} defaultValue={brandColor} portalClassName="vp-raw">
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
