---
title: Icon 图标
order: 2
cat: 通用
---

# Icon 图标

语义化的矢量图形。

> [!NOTE]
> 引自 [IconPark 官方图标库](https://iconpark.oceanengine.com/official)

## 图标风格

::: react-live
```tsx
const { Text } = Typography;
const Demo = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {['bat', 'bear', 'bee', 'bird'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['butterfly', 'cat', 'deer', 'dog'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" variant="filled" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['dolphin', 'duck', 'eagle', 'frog'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" variant="two-tone" fill={['var(--nd-color-primary)', 'var(--vp-c-brand-1)']}/>
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
const { Text } = Typography;
const Demo = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {['compression', 'copy-one', 'doc-search', 'doc-fail'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['compression', 'copy-one', 'doc-search', 'doc-fail'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" strokeLinecap="butt" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['compression', 'copy-one', 'doc-search', 'doc-fail'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" strokeLinecap="square" />
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
const { Text } = Typography;
const Demo = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {['tips', 'config', 'lightning', 'sleep'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['tips', 'config', 'lightning', 'sleep'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" strokeLinejoin="miter" />
          <Text>{name}</Text>
        </Button>
      ))}
      {['tips', 'config', 'lightning', 'sleep'].map((name, index) => (
        <Button key={index} className="flex flex-col items-center gap-1" variant="text">
          <Icon name={name} className="text-2xl" strokeLinejoin="bevel" />
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

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | - | `string` | - |
| name | - | `string` | - |
| variant | - | `"outlined" \| "filled" \| "two-tone" \| "multi-color"` | `"outlined"` |
| strokeWidth | - | `number` | - |
| strokeLinecap | - | `"butt" \| "round" \| "square"` | `"round"` |
| strokeLinejoin | - | `"miter" \| "round" \| "bevel"` | `"round"` |
| fill | - | `string \| string[]` | - |
