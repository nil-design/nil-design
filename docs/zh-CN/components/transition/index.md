---
title: Transition 过渡
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
      <Switch.Track type="checked">Visible</Switch.Track>
      <Switch.Track type="unchecked">Invisible</Switch.Track>
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
      <Switch.Track type="checked">Create</Switch.Track>
      <Switch.Track type="unchecked">Destroy</Switch.Track>
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
