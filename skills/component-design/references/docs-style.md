# 文档写作模板

用于生成或重写 `docs/zh-CN/components/<component>/index.md`。公开组件才默认需要文档页；API 表格只通过 `pnpm components:api` 生成。

## 页面骨架

````md
---
title: ComponentName 中文名
cat: 通用
---

# {{ $frontmatter.title }}

用于一句话说明组件用途。

## 基础用法

::: react-live
```tsx
import { ComponentName } from '@nild/components';

const Demo = () => {
    return (
        <div className="flex flex-wrap gap-4">
            <ComponentName />
        </div>
    );
};

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/<component>/API.zh-CN.md-->
````

## Frontmatter

- `title`：英文组件名 + 中文名。
- `cat`：只从 `通用`、`输入`、`展示`、`布局`、`其它` 中选择。
- `catOrder`：只有需要分类排序时再补。

组件文档 sidebar 由 `docs/.vitepress/getThemeConfig.js` 基于 frontmatter 自动收录，不手改导航。

## 写作风格

- 第一段只写一句简短中文说明组件用途。
- 章节按用户可感知场景组织，不按源码文件拆节。
- 常见章节：变体、尺寸、状态、组合、特殊能力、自定义内容。
- `变体` 与 `尺寸` 默认拆成独立章节，不为压缩篇幅混成一个首节。
- 示例短小、直接可运行，类名、布局方式和命名风格贴近现有页面。
- 示例布局优先使用 Tailwind 预设刻度，例如 `w-56`、`gap-4`、`px-3`；只有现有刻度无法表达意图时才使用任意值类或内联样式。

## react-live scope

当前示例可直接导入：

- `react`
- `@nild/components`
- `@nild/hooks`
- `@nild/shared`
- `@nild/icons`
- `@nild/icons/Layers`

不要把示例误限制成只能导入 `@nild/components`。

## 状态示例

````md
::: react-live
```tsx
import { useState } from 'react';
import { Button, Modal } from '@nild/components';

const Demo = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open</Button>
            <Modal open={open} onClose={() => setOpen(false)} aria-label="Example modal">
                <Modal.Portal className="vp-raw">
                    <Modal.Body>Portal content</Modal.Body>
                </Modal.Portal>
            </Modal>
        </>
    );
};

render(<Demo />);
```
:::
````

portal 或浮层内容优先参考 `modal` 文档，在 portal 根节点或表面节点上使用 `className="vp-raw"`，避免 VitePress 文档样式污染内容。

## 插槽扩展示例

组件支持内部节点扩展时，只展示插槽式写法：

````md
## 自定义内容

::: react-live
```tsx
import { ComponentName } from '@nild/components';

const Demo = () => {
    return (
        <ComponentName>
            <ComponentName.Label>Custom Label</ComponentName.Label>
            <ComponentName.Indicator />
        </ComponentName>
    );
};

render(<Demo />);
```
:::
````

不要展示 `icon`、`prefixNode`、`suffixNode`、`renderXxx` 等节点注入写法，除非组件已有明确成熟先例。
