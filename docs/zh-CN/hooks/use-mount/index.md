---
title: useMount
cat: 副作用
catOrder: 2
order: 4
---

# {{ $frontmatter.title }}

在组件首次挂载后执行一次逻辑。

## 签名

```ts
function useMount(onMount?: () => void): void;
```

## 基本用法

::: react-live
```tsx
import { useState } from 'react';
import { useMount } from '@nild/hooks';
import { Button, Typography } from '@nild/components';

const { Text } = Typography;
const tips = [
  '先做最小可运行版本',
  '先修用户能感知的问题',
  '先把示例写短，再补说明',
];

const WelcomeCard = ({ session }) => {
  const [tip, setTip] = useState('');
  const [count, setCount] = useState(0);

  useMount(() => {
    setTip(tips[(session - 1) % tips.length]);
  });

  return (
    <div className="flex flex-col items-start gap-3 rounded-md border border-main px-4 py-3">
      <Text>第 {session} 次进入卡片</Text>
      <Text>自动抽到的提示：{tip}</Text>
      <Button variant="outlined" onClick={() => setCount(value => value + 1)}>
        普通重渲染：{count}
      </Button>
    </div>
  );
};

const Demo = () => {
  const [visible, setVisible] = useState(false);
  const [session, setSession] = useState(0);

  const handleOpen = () => {
    setSession(value => value + 1);
    setVisible(true);
  };

  return (
    <div className="flex flex-col items-start gap-4 text-md">
      {visible ? (
        <Button onClick={() => setVisible(false)}>离开卡片</Button>
      ) : (
        <Button onClick={handleOpen}>进入卡片</Button>
      )}
      {visible && <WelcomeCard session={session} />}
    </div>
  );
};

render(<Demo />);
```
:::

## 注意事项

- 这个 hook 只在首次挂载后执行一次，后续重新渲染不会再次调用。
- 即使后续传入了新的 callback，也不会重新执行新的版本。
