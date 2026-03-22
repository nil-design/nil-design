# 文档写作模板

这个文件用于快速生成 `docs/zh-CN/components/<component>/index.md` 的页面骨架，并保持与现有文档页一致的写法。

## frontmatter 模板

```md
---
title: ComponentName 中文名
cat: 通用
---
```

需要排序时再补 `catOrder`。

`cat` 只从下面这些现有分类中选择：

- `通用`
- `输入`
- `展示`
- `布局`
- `其它`

## 页面骨架模板

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
  return <ComponentName />;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/<component>/API.zh-CN.md-->
````

## 写作风格

- 第一段只写一句简短中文说明组件用途。
- 后续章节按用户可感知场景组织，不按源码文件拆节。
- 常见章节包括：变体、尺寸、状态、组合、特殊能力、自定义内容。
- 示例保持短小、直接可运行，避免为了展示源码结构而写大量无关样板。
- 示例中的类名、布局方式、命名风格尽量贴近现有文档页面。

## `react-live` 示例模板

````md
::: react-live
```tsx
import { ComponentName } from '@nild/components';

const Demo = () => {
  return <div className="flex flex-wrap gap-4">
    <ComponentName />
  </div>;
}

render(<Demo />);
```
:::
````

## 插槽扩展示例模板

如果组件支持内部节点扩展，只展示插槽式写法：

````md
## 自定义内容

::: react-live
```tsx
import { ComponentName } from '@nild/components';

const Demo = () => {
  return <ComponentName>
    <ComponentName.Label>Custom Label</ComponentName.Label>
    <ComponentName.Indicator />
  </ComponentName>;
}

render(<Demo />);
```
:::
````

不要展示下面这类写法：

- 通过 `icon` prop 注入节点
- 通过 `prefixNode` / `suffixNode` prop 注入节点
- 通过 `renderXxx` prop 返回 JSX

## API 引用模板

页面末尾固定追加：

````md
## API

<!--@include: ../../../../packages/components/src/<component>/API.zh-CN.md-->
````

不要把 API 表格手写进页面正文；统一执行 `pnpm components:api` 生成。
