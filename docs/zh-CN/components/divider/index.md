---
title: Divider 分割线
order: 1
cat: 布局
catOrder: 2
---

# Divider 分割线

划分区域，分隔内容。

## 方向

> [!NOTE]
> 当 `direction` 等于 `"vertical"` 时为行内分割线

::: react-live
```tsx
import { Divider, Typography } from '@nild/components';

const { Paragraph, Text } = Typography;
const Demo = () => {
  return <div className="flex flex-col gap-4 text-md">
    <div>
      <Paragraph>学而不思则罔，思而不学则殆。 —— 孔子</Paragraph>
      <Divider />
      <Paragraph>不积跬步，无以至千里；不积小流，无以成江海。 —— 荀子</Paragraph>
    </div>
    <div>
      <Text>孔子</Text>
      <Divider direction="vertical" />
      <Text>荀子</Text>
    </div>
  </div>;
}

render(<Demo />);
```
:::

## 线段风格

::: react-live
```tsx
import { Divider, Typography } from '@nild/components';

const { Paragraph } = Typography;
const Demo = () => {
  return <div className="text-md">
    <Paragraph>学而不思则罔，思而不学则殆。 —— 孔子</Paragraph>
    <Divider className="border-[color:var(--vp-c-brand-1)]" />
    <Paragraph>不积跬步，无以至千里；不积小流，无以成江海。 —— 荀子</Paragraph>
    <Divider className="border-[color:var(--vp-c-brand-1)]" variant="dashed" />
    <Paragraph>富贵不能淫，贫贱不能移，威武不能屈。 —— 孟子</Paragraph>
    <Divider className="border-[color:var(--vp-c-brand-1)]" variant="dotted" />
    <Paragraph>道可道，非常道；名可名，非常名。 —— 老子</Paragraph>
  </div>;
}

render(<Demo />);
```
:::

## 自定义内容

> [!NOTE]
> 仅 `direction` 等于 `"horizontal"` 时支持

::: react-live
```tsx
import { Button, Divider, Typography } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const { Paragraph, Text, Link } = Typography;
const Demo = () => {
  return <div className="text-md">
    <Paragraph>学而不思则罔，思而不学则殆。 —— 孔子</Paragraph>
    <Divider>
      <Text className="px-2">Text</Text>
    </Divider>
    <Paragraph>不积跬步，无以至千里；不积小流，无以成江海。 —— 荀子</Paragraph>
    <Divider align="left">
      <DynamicIcon name="bookmark" className="px-2" />
    </Divider>
    <Paragraph>富贵不能淫，贫贱不能移，威武不能屈。 —— 孟子</Paragraph>
    <Divider align="right">
      <Button className="mx-2">Button</Button>
    </Divider>
    <Paragraph>道可道，非常道；名可名，非常名。 —— 老子</Paragraph>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/divider/API.zh-CN.md-->