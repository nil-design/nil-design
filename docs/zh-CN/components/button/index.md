---
title: Button 按钮
category: 通用
order: 1
---

# Button 按钮

按钮用于开始一个即时操作。

## 基础用法

::: react-live

```tsx
const Demo = (abc = "asd") => {
  let str = `aa${abc}`;
  let b: boolean = false;
  return (
    <Button className="hhh">默认\$/'""'按钮{str}</Button>
  );
}

render(<Demo />);
```

:::

## API

<!--@include: ./api.md-->