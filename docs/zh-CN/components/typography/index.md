---
title: Typography 排版
category: 通用
order: 3
---

# Typography 排版

展示文本内容。

## 标题

::: react-live
```tsx
const Demo = () => {
  return <div>
    <Typography.Title>h1. Nil Design</Typography.Title>
    <Typography.Title level={2}>h2. Nil Design</Typography.Title>
    <Typography.Title level={3}>h3. Nil Design</Typography.Title>
    <Typography.Title level={4}>h4. Nil Design</Typography.Title>
    <Typography.Title level={5}>h5. Nil Design</Typography.Title>
    <Typography.Title level={6}>h6. Nil Design</Typography.Title>
  </div>;
}

render(<Demo />);
```
:::

## 文本

::: react-live
```tsx
const Demo = () => {
  return <div className="flex flex-col items-start gap-4 text-[length:var(--nd-font-size-md)]">
    <Typography.Text>Nil Design</Typography.Text>
    <Typography.Text secondary>Nil Design</Typography.Text>
    <Typography.Text disabled>Nil Design</Typography.Text>
    <Typography.Text strong>Nil Design</Typography.Text>
    <Typography.Text del>Nil Design</Typography.Text>
    <Typography.Text u>Nil Design</Typography.Text>
    <Typography.Text i>Nil Design</Typography.Text>
    <Typography.Text mark>Nil Design</Typography.Text>
    <Typography.Text code>Nil Design</Typography.Text>
    <Typography.Text kbd>Nil Design</Typography.Text>
  </div>;
}

render(<Demo />);
```
:::
