---
title: Icon 图标
category: 通用
order: 2
---

# Icon 图标

## 基本用法

::: react-live
```tsx
const { Text } = Typography;
const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    {['Like', 'dislike', 'dislike-two'].map((name, index) => (
        <div class="flex flex-col items-center gap-1">
            <Icon key={index} name={name} />
            <Text>{name}</Text>
        </div>
    ))}
  </div>;
}

render(<Demo />);
```
:::
