---
title: Transition 过渡
order: 1
cat: 其它
catOrder: 5
---

# {{ $frontmatter.title }}

为内容的显示与隐藏（或创建与销毁）施加过渡效果。

> [!NOTE]
> 最多支持包裹单个组件/元素

## 显示与隐藏

::: react-live
```tsx
import { useState } from 'react';
import { Switch, Transition } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  const [checked, setChecked] = useState(true);

  return <div className="flex flex-col items-start gap-4">
    <Switch checked={checked} onChange={setChecked}>
      <Switch.Checked>Visible</Switch.Checked>
      <Switch.Unchecked>Invisible</Switch.Unchecked>
    </Switch>
    <Transition className="duration-600" visible={checked}>
        <DynamicIcon name="ghost" className="text-2xl" />
    </Transition>
  </div>;
}

render(<Demo />);
```
:::

## 创建与销毁

::: react-live
```tsx
import { useState } from 'react';
import { Switch, Transition } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  const [checked, setChecked] = useState(true);

  return <div className="flex flex-col items-start gap-4">
    <Switch checked={checked} onChange={setChecked}>
      <Switch.Checked>Create</Switch.Checked>
      <Switch.Unchecked>Destroy</Switch.Unchecked>
    </Switch>
    <Transition className="duration-600">
        {checked && <DynamicIcon name="skull" className="text-2xl" />}
    </Transition>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/transition/API.zh-CN.md-->
