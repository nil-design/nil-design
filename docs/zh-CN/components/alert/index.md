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
            <Alert title="提示信息">当前配置会在保存后立即生效。</Alert>
            <Alert type="success" title="发布成功">
                新版本已经同步到生产环境。
            </Alert>
            <Alert type="warning" title="容量接近上限">
                建议清理历史构建产物或扩容存储。
            </Alert>
            <Alert type="error" title="同步失败">
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
            <Alert title="存在未提交改动">离开当前页面前请确认是否需要保存草稿。</Alert>
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
                <Alert closable closeAriaLabel="关闭提示" title="已保存为草稿" onClose={() => setVisible(false)}>
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
            <Alert icon={<DynamicIcon name="announcement" variant="filled" />} title="自定义图标">
                可以传入任意 ReactNode 作为图标区域内容。
            </Alert>
            <Alert icon={false} title="隐藏图标">
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
