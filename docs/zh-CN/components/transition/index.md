---
title: Transition 过渡
order: 1
cat: 其它
catOrder: 5
---

# Transition 过渡

为内容的显示与隐藏（或创建与销毁）施加过渡效果。

> [!NOTE]
> 仅支持包含单个组件/元素

## 显示与隐藏

::: react-live
```tsx
import { useState } from 'react';
import { Switch, Transition } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
  const [checked, setChecked] = useState(true);

  return <div className="flex flex-col items-start gap-4">
    <Switch
      checked={checked}
      onChange={setChecked}
      checkedContent={'visible'}
      uncheckedContent={'invisible'}
    />
    <Transition className="duration-600" visible={checked}>
        <DynamicIcon name="ghost" className="text-3xl" />
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
    <Switch
      checked={checked}
      onChange={setChecked}
      checkedContent={'create'}
      uncheckedContent={'destroy'}
    />
    <Transition className="duration-600">
        {checked && <DynamicIcon name="skull" className="text-3xl" />}
    </Transition>
  </div>;
}

render(<Demo />);
```
:::

## API

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | - | `string` | - |
| children | - | `React.ReactNode` | - |
| visible | - | `boolean` | `true` |
