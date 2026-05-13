---
title: useUnmount
cat: 副作用
catOrder: 2
order: 5
---

# {{ $frontmatter.title }}

在组件卸载时执行清理逻辑。

## 签名

```ts
function useUnmount(onUnmount?: () => void): void;
```

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { useUnmount } from '@nild/hooks';
import { Button, Input, Typography } from '@nild/components';

const { Text } = Typography;

const DraftPanel = ({ initialValue, onSave }) => {
  const [draft, setDraft] = useState(initialValue);

  useUnmount(() => {
    onSave(draft);
  });

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3 rounded-md border border-main px-4 py-3">
      <Text>关闭面板时会自动保存最后一次输入</Text>
      <Input value={draft} onChange={setDraft} placeholder="输入一点内容再关闭" />
    </div>
  );
};

const Demo = () => {
  const [visible, setVisible] = useState(true);
  const [savedDraft, setSavedDraft] = useState('还没有保存内容');

  return (
    <div className="flex flex-col items-start gap-4 text-md">
      <Button onClick={() => setVisible(value => !value)}>
        {visible ? '关闭便签' : '重新打开便签'}
      </Button>
      {visible && <DraftPanel initialValue={savedDraft} onSave={setSavedDraft} />}
      <Text>最近一次保存：{savedDraft}</Text>
    </div>
  );
};

render(<Demo />);
```
:::

## 注意事项

- 这个 hook 只会在卸载时执行一次，不会在普通重新渲染时触发。
- 卸载时调用的是最新版本的 callback，而不是首次挂载时捕获的旧版本。
