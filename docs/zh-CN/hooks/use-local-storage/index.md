---
title: useLocalStorage
cat: 状态
catOrder: 1
order: 2
---

# {{ $frontmatter.title }}

像 `useState` 一样读写 `localStorage`。

## 签名

```ts
function useLocalStorage<T>(
  key: string,
  defaultValue: T | (() => T),
  options?: {
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
    onError?: (error: unknown) => void;
  },
): [T, Dispatch<SetStateAction<T>>];
```

## 基本用法

::: react-live
```tsx
import { useLocalStorage } from '@nild/hooks';
import { Input, Typography } from '@nild/components';

const { Text } = Typography;

const Demo = () => {
  const [draft, setDraft] = useLocalStorage('nild-hooks-draft', 'Hello Nil Design');

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-4">
      <Input value={draft} onChange={value => setDraft(value)} />
      <Text>刷新页面后仍会保留：{draft || '[empty]'}</Text>
    </div>
  );
};

render(<Demo />);
```
:::

## 关键行为

- 初始化时会优先读取 `localStorage` 中的已有值，读不到时再使用 `defaultValue`。
- 调用 setter 时会同时更新 React 状态和 `localStorage`。
- 当 `key` 变化时，会重新读取新 key 对应的存储值。
- 监听同源标签页触发的 `storage` 事件，因此能同步外部对相同 key 的变更。

## 注意事项

- 默认序列化与反序列化分别使用 `JSON.stringify` 和 `JSON.parse`。
- 如果你的值不是标准 JSON 结构，可以通过 `serializer` 和 `deserializer` 自定义读写逻辑。
- 读取、解析或写入失败时会调用 `onError`，默认会把错误输出到控制台。
