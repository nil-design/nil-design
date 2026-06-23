---
title: Watermark 水印
cat: 展示
---

# {{ $frontmatter.title }}

为区域内容叠加重复水印，降低截图、转发或打印时的信息泄露风险。

## 基础用法

::: react-live
```tsx
import { Watermark, Typography } from '@nild/components';

const { Paragraph, Title } = Typography;

const Demo = () => {
  return <Watermark
    className="overflow-hidden rounded-lg border border-muted p-6 text-md"
    text="Nil Design"
  >
    <Title level={5}>项目周报</Title>
    <Paragraph>本周完成了组件库文档结构整理，并补充了设计系统验收记录。</Paragraph>
    <Paragraph>水印层不会拦截鼠标事件，内部内容仍可正常选择和交互。</Paragraph>
  </Watermark>;
}

render(<Demo />);
```
:::

## 文字样式

::: react-live
```tsx
import { Watermark, Typography } from '@nild/components';
import { useBrandColor } from '~internals';

const { Paragraph } = Typography;

const Demo = () => {
  const brandColor = useBrandColor();

  return <Watermark
    className="overflow-hidden rounded-lg border border-muted p-6 text-md"
    text={['Confidential', '2026-05-19']}
    textStyle={{
      color: brandColor,
      fontSize: 22,
      fontWeight: 600,
    }}
  >
    <Paragraph>多行文本会在同一个水印图案中居中绘制。</Paragraph>
    <Paragraph className="mb-0">可以通过字体、颜色、旋转角度和透明度调整视觉强度。</Paragraph>
  </Watermark>;
}

render(<Demo />);
```
:::

## 图片水印

::: react-live
```tsx
import { Watermark, Typography } from '@nild/components';

const { Paragraph } = Typography;

const Demo = () => {
  const icon = 'https://api.iconify.design/lucide:stamp.svg';

  return <Watermark
    className="overflow-hidden rounded-lg border border-muted p-6 text-md"
    image={{
      src: icon,
      crossOrigin: 'anonymous',
    }}
  >
    <Paragraph>图片水印会先加载资源，再绘制到 Canvas 图案中。</Paragraph>
    <Paragraph className="mb-0">跨域图片需要资源本身允许跨域访问。</Paragraph>
  </Watermark>;
}

render(<Demo />);
```
:::

## 组合

::: react-live
```tsx
import { Watermark, Typography } from '@nild/components';

const { Paragraph } = Typography;

const Demo = () => {
  const icon = 'https://api.iconify.design/material-symbols:shield-rounded.svg';
  const image = {
    src: icon,
    crossOrigin: 'anonymous',
  };
  const compositionItems = [
    {
      composition: 'stack',
      imageSize: 24,
      compositionGap: 4,
      textStyle: { fontSize: 14, fontWeight: 700, lineHeight: 20 },
    },
    {
      composition: 'inline',
      imageSize: 24,
      compositionGap: 4,
      textStyle: { fontSize: 14, fontWeight: 700, lineHeight: 20 },
    },
    {
      composition: 'overlay',
      imageSize: 40,
      textStyle: {
        color: 'white',
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 20,
      },
    },
  ] as const;

  return <div className="grid gap-4 md:grid-cols-3">
    {compositionItems.map(({ composition, imageSize, compositionGap, textStyle }) => (
      <div key={composition} className="space-y-2">
        <Paragraph className="mb-2 font-medium text-main">{composition}</Paragraph>
        <Watermark
          className="min-h-40 overflow-hidden rounded-lg border border-muted text-md"
          text="ND"
          image={{ ...image, width: imageSize, height: imageSize }}
          opacity={0.24}
          pattern={{ gap: [44, 32], composition, compositionGap }}
          textStyle={textStyle}
        />
      </div>
    ))}
  </div>;
}

render(<Demo />);
```
:::

## 平铺参数

::: react-live
```tsx
import { Watermark, Typography } from '@nild/components';

const { Paragraph } = Typography;

const Demo = () => {
  return <Watermark
    className="overflow-hidden rounded-lg border border-muted p-6 text-md"
    text="Draft"
    pattern={{
      gap: [56, 40],
      offset: [8, 16],
      rotate: 22
    }}
  >
    <Paragraph>水印以单个 Canvas 图案作为背景重复铺开。</Paragraph>
    <Paragraph className="mb-0">通过间距和偏移控制图案密度与起始位置。</Paragraph>
  </Watermark>;
}

render(<Demo />);
```
:::

## 节点恢复

::: react-live
```tsx
import { useState } from 'react';
import { Watermark, Typography } from '@nild/components';

const { Paragraph } = Typography;

const Demo = () => {
  const [lastTamper, setLastTamper] = useState('暂无');

  return <Watermark
    className="overflow-hidden rounded-lg border border-muted p-6 text-md"
    text="Internal"
    preserve
    onTamper={(event) => {
      setLastTamper(event.attributeName ? `${event.type}: ${event.attributeName}` : event.type);
    }}
  >
    <Paragraph>默认会恢复被移除、挪走或修改关键属性的水印层。</Paragraph>
    <Paragraph>检测到水印层异常时，可以通过回调记录最近一次恢复原因。</Paragraph>
    <Paragraph className="mb-0">最近一次恢复：{lastTamper}。</Paragraph>
  </Watermark>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/watermark/API.zh-CN.md-->
