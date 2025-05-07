# Button 按钮

按钮用于开始一个即时操作。

## 基础用法

基础的按钮用法。

## Demo 演示

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

### 属性

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| children | 按钮内容 | ReactNode | - | 