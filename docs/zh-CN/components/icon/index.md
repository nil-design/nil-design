---
title: Icon 图标
cat: 通用
---

# {{ $frontmatter.title }}

语义化的矢量图形。

> [!NOTE]
> 引自 [IconPark 官方图标库](https://iconpark.oceanengine.com/official)

## 按需引入

::: react-live
```tsx
import { Icon } from '@nild/icons';
import Layers from '@nild/icons/Layers';

const Demo = () => {
  return (
    <Icon component={Layers} className="text-2xl" />
  );
};

render(<Demo />);
```
:::

## 动态导入

> [!NOTE]
> 所有图标都将参与构建

::: react-live
```tsx
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return (
    <DynamicIcon name={'download-two'} className="text-2xl" />
  );
};

render(<Demo />);
```
:::

## 旋转

::: react-live
```tsx
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  return (
    <DynamicIcon spin name={'rotation'} className="text-2xl" />
  );
};

render(<Demo />);
```
:::

## 风格

::: react-live
```tsx
import { Button, Typography } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const { Text } = Typography;
const Demo = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {['bat', 'bear', 'bee', 'bird'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['butterfly', 'cat', 'deer', 'dog'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" variant="filled" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['dolphin', 'duck', 'eagle', 'frog'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" variant="two-tone" fill={['var(--color-primary)', 'var(--vp-c-brand-1)']}/>
          <Text>{name}</Text>
        </Button>
      ))}
    </div>
  );
};

render(<Demo />);
```
:::

## 端点类型

::: react-live
```tsx
import { Button, Typography } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const { Text } = Typography;
const Demo = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {['compression', 'copy-one', 'doc-search', 'doc-fail'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['compression', 'copy-one', 'doc-search', 'doc-fail'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" strokeLinecap="butt" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['compression', 'copy-one', 'doc-search', 'doc-fail'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" strokeLinecap="square" />
          <Text>{name}</Text>
        </Button>
      ))}
    </div>
  );
};

render(<Demo />);
```
:::

## 拐点类型

::: react-live
```tsx
import { Button, Typography } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const { Text } = Typography;
const Demo = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {['tips', 'config', 'lightning', 'sleep'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['tips', 'config', 'lightning', 'sleep'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" strokeLinejoin="miter" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['tips', 'config', 'lightning', 'sleep'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <DynamicIcon name={name} className="text-2xl" strokeLinejoin="bevel" />
          <Text>{name}</Text>
        </Button>
      ))}
    </div>
  );
};

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/icons/src/API.zh-CN.md-->
