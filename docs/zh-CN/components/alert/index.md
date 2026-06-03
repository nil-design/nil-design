---
title: Alert 警告提示
cat: 反馈
catOrder: 6
---

# {{ $frontmatter.title }}

用于展示页面级反馈、状态变化或需要用户注意的信息。

## 类型

::: react-live

```tsx
import { Alert } from '@nild/components';

const Demo = () => {
    return (
        <div className="grid max-w-xl gap-3">
            <Alert>
                <Alert.Title>提示信息</Alert.Title>
                当前配置会在保存后立即生效。
            </Alert>
            <Alert type="success">
                <Alert.Title>发布成功</Alert.Title>
                新版本已经同步到生产环境。
            </Alert>
            <Alert type="warning">
                <Alert.Title>容量接近上限</Alert.Title>
                建议清理历史构建产物或扩容存储。
            </Alert>
            <Alert type="error">
                <Alert.Title>同步失败</Alert.Title>
                请检查访问令牌是否仍然有效。
            </Alert>
        </div>
    );
};

render(<Demo />);
```

:::

## 标题与说明

::: react-live

```tsx
import { Alert } from '@nild/components';

const Demo = () => {
    return (
        <div className="grid max-w-xl gap-3">
            <Alert>只有说明内容时，Alert 会保持紧凑的信息条样式。</Alert>
            <Alert>
                <Alert.Title>存在未提交改动</Alert.Title>
                离开当前页面前请确认是否需要保存草稿。
            </Alert>
        </div>
    );
};

render(<Demo />);
```

:::

## 可关闭

::: react-live

```tsx
import { useState } from 'react';
import { Alert, Button } from '@nild/components';

const Demo = () => {
    const [visible, setVisible] = useState(true);

    return (
        <div className="grid max-w-xl gap-3">
            {visible ? (
                <Alert closable closeAriaLabel="关闭提示" onClose={() => setVisible(false)}>
                    <Alert.Title>已保存为草稿</Alert.Title>
                    你可以稍后继续编辑这份内容。
                </Alert>
            ) : (
                <Button variant="outlined" onClick={() => setVisible(true)}>
                    重新显示
                </Button>
            )}
        </div>
    );
};

render(<Demo />);
```

:::

## 自定义图标

::: react-live

```tsx
import { Alert } from '@nild/components';
import { DynamicIcon } from '@nild/icons';

const Demo = () => {
    return (
        <div className="grid max-w-xl gap-3">
            <Alert>
                <Alert.Icon>
                    <DynamicIcon name="announcement" variant="filled" />
                </Alert.Icon>
                <Alert.Title>自定义图标</Alert.Title>
                可以传入任意 ReactNode 作为图标区域内容。
            </Alert>
            <Alert>
                <Alert.Icon />
                <Alert.Title>隐藏图标</Alert.Title>
                当页面周围已经有足够语义提示时，可以隐藏默认图标。
            </Alert>
        </div>
    );
};

render(<Demo />);
```

:::

## API

<!--@include: ../../../../packages/components/src/alert/API.zh-CN.md-->
