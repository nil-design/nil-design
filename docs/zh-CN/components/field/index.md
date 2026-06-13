---
title: Field 字段
cat: 输入
---

# {{ $frontmatter.title }}

用于组织单个表单控件的标签、说明、状态与运行时绑定。

## 结构

::: react-live
```tsx
import { Field, Input } from '@nild/components';

const Demo = () => {
  return <div className="w-80">
    <Field required>
      <Field.Label>工作区代号</Field.Label>
      <Input block placeholder="nil-design" />
      <Field.Helper>
        仅支持小写字母、数字和连字符。
      </Field.Helper>
    </Field>
  </div>;
}

render(<Demo />);
```
:::

## 状态提示

::: react-live
```tsx
import { Field, Input } from '@nild/components';

const fields = [
  {
    label: '发布名称',
    value: 'Nil Design',
    type: 'success',
    message: '名称可用。',
  },
  {
    label: '访问路径',
    value: '/admin',
    type: 'warning',
    message: '该路径容易和管理入口混淆。',
  },
  {
    label: '联系邮箱',
    value: 'support',
    type: 'error',
    message: '请输入完整邮箱地址。',
  },
];

const Demo = () => {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {fields.map(({ label, value, type, message }) => (
      <Field key={label} className="w-full">
        <Field.Label>{label}</Field.Label>
        <Input block defaultValue={value} />
        <Field.Status type={type}>{message}</Field.Status>
      </Field>
    ))}
  </div>;
}

render(<Demo />);
```
:::

## 自定义结构

`Field.Helper` 与 `Field.Status` 可以承载自定义结构。

::: react-live
```tsx
import { Field, Input } from '@nild/components';

const Demo = () => {
  return <div className="w-96">
    <Field>
      <Field.Label>访问密钥</Field.Label>
      <Input.Password block placeholder="输入密钥" />
      <Field.Helper>
        <div className="grid gap-1 text-sm">
          <span>建议至少 12 位字符。</span>
          <span className="text-subtle">密钥仅保存在当前工作区。</span>
        </div>
      </Field.Helper>
      <Field.Status type="warning">
        <div className="inline-flex items-center gap-2 rounded-sm bg-warning-subtle px-2 py-1 leading-5">
          <span className="font-medium">当前强度一般</span>
          <span>建议补充符号</span>
        </div>
      </Field.Status>
    </Field>
  </div>;
}

render(<Demo />);
```
:::

## 控件宽度

字段不会强制控件占满宽度。需要满宽时由控件显式声明。

::: react-live
```tsx
import { Checkbox, Field, Input, Switch } from '@nild/components';

const Demo = () => {
  return <div className="flex w-80 flex-col gap-4">
    <Field>
      <Field.Label>团队名称</Field.Label>
      <Input block placeholder="Design Platform" />
    </Field>
    <Field>
      <Field.Label>自动归档</Field.Label>
      <Switch />
      <Field.Helper>Switch 保持自身宽度。</Field.Helper>
    </Field>
    <Field>
      <Checkbox>允许成员自行加入</Checkbox>
    </Field>
  </div>;
}

render(<Demo />);
```
:::

## API

<!--@include: ../../../../packages/components/src/field/API.zh-CN.md-->
